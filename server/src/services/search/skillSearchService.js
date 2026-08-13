import pool from "../../config/db.js";

const MAX_RESULTS = 8;
const SIMILARITY_THRESHOLD = 0.2;

export const searchSkills = async (query) => {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];

  try {
    const result = await pool.query(
      `
      SELECT
        name,
        category,
        similarity(name, $1) AS score,
        CASE
          WHEN name ILIKE $2 THEN 3
          WHEN name ILIKE $3 THEN 2
          ELSE 1
        END AS rank_tier
      FROM skills
      WHERE name ILIKE $3 OR name % $1
      ORDER BY rank_tier DESC, score DESC, LENGTH(name) ASC
      LIMIT $4;
      `,
      [normalizedQuery, `${normalizedQuery}%`, `%${normalizedQuery}%`, MAX_RESULTS]
    );

    return result.rows
      .filter((row) => row.rank_tier > 1 || row.score >= SIMILARITY_THRESHOLD)
      .map((row) => ({ value: row.name, meta: row.category || "Skill" }));
  } catch (error) {
    console.error("Skill search failed:", error.message);
    return [];
  }
};