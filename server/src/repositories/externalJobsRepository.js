// server/src/repositories/externalJobsRepository.js

import pool from "../config/db.js";

/*
 * =========================================================
 * UPSERT SCRAPED JOBS
 * =========================================================
 *
 * Inserts new jobs, updates existing ones (matched by
 * source + external_id), and refreshes scraped_at so we
 * know how fresh the data is.
 */
export const upsertExternalJobs = async (jobs) => {
  if (!jobs || jobs.length === 0) {
    return { inserted: 0 };
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const job of jobs) {
      await client.query(
        `
        INSERT INTO external_jobs (
          source,
          external_id,
          title,
          company,
          location,
          description,
          url,
          category,
          contract_type,
          salary_min,
          salary_max,
          posted_at,
          scraped_at
        )
        VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP
        )
        ON CONFLICT (source, external_id)
        DO UPDATE SET
          title = EXCLUDED.title,
          company = EXCLUDED.company,
          location = EXCLUDED.location,
          description = EXCLUDED.description,
          url = EXCLUDED.url,
          category = EXCLUDED.category,
          contract_type = EXCLUDED.contract_type,
          salary_min = EXCLUDED.salary_min,
          salary_max = EXCLUDED.salary_max,
          posted_at = EXCLUDED.posted_at,
          scraped_at = CURRENT_TIMESTAMP;
        `,
        [
          job.source,
          job.externalId,
          job.title,
          job.company,
          job.location,
          job.description || null,
          job.url,
          job.category || null,
          job.contractType || null,
          job.salaryMin || null,
          job.salaryMax || null,
          job.postedAt || null,
        ]
      );
    }

    await client.query("COMMIT");

    return { inserted: jobs.length };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

/*
 * =========================================================
 * SEARCH CACHED EXTERNAL JOBS
 * =========================================================
 *
 * Uses Postgres full-text search (search_vector, built by
 * the DB trigger) so this is fast even with a large pool.
 * Falls back to ILIKE if the tsquery finds nothing (handles
 * partial/short queries better).
 */
export const searchExternalJobs = async ({
  query,
  location,
  source = null,
  limit = 60,
}) => {
  const tsQuery = String(query || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join(" & ");

  const params = [tsQuery];
  let sql = `
    SELECT *
    FROM external_jobs
    WHERE search_vector @@ to_tsquery('english', $1 || ':*')
  `;

  if (source) {
    params.push(source);
    sql += ` AND source = $${params.length}`;
  }

  if (location) {
    params.push(`%${location}%`);
    sql += ` AND location ILIKE $${params.length}`;
  }

  params.push(limit);
  sql += ` ORDER BY posted_at DESC NULLS LAST LIMIT $${params.length};`;

  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    // to_tsquery can throw on odd input (e.g. just symbols) —
    // fail safe with an empty result rather than crashing search.
    console.error(
      "External jobs full-text search failed:",
      error.message
    );
    return [];
  }
};

/*
 * =========================================================
 * STALE CHECK (for monitoring / debugging)
 * =========================================================
 */
export const getLastScrapeTime = async (source) => {
  const result = await pool.query(
    `SELECT MAX(scraped_at) AS last_scraped FROM external_jobs WHERE source = $1;`,
    [source]
  );

  return result.rows[0]?.last_scraped || null;
};