import { discoverJobs } from "./jobDiscoveryService.js";

// =========================================================
// HELPERS
// =========================================================

const normalizeText = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim();
};

const normalizeArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeText(item))
    .filter(Boolean);
};

// =========================================================
// CHECK TERM MATCH
// =========================================================

const containsTerm = (text, term) => {
  if (!text || !term) {
    return false;
  }

  return text.includes(term);
};

// =========================================================
// CHECK IF JOB IS RECENT (Drop old jobs from 2024, 2025 etc.)
// =========================================================

const isRecentJob = (postedAt) => {
  if (!postedAt) return true; // Agar date mention nahi hai toh safety ke liye rakh lein
  const jobDate = new Date(postedAt);
  if (Number.isNaN(jobDate.getTime())) return true;

  const now = new Date();
  const diffTime = Math.abs(now - jobDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Sirf pichle 45 din tak ki latest jobs allow karein (purani 2024/2025 wali drop ho jayengi)
  return diffDays <= 45;
};

// =========================================================
// CALCULATE JOB MATCH
// =========================================================

const calculateMatchScore = (job, profile) => {
  const title = normalizeText(job.title);
  const company = normalizeText(job.company);
  const description = normalizeText(job.description);
  const location = normalizeText(job.location);
  const jobType = normalizeText(job.contractType);

  const searchableText = `
    ${title}
    ${company}
    ${description}
  `.toLowerCase();

  const skills = normalizeArray(profile.skills);

  const roles = normalizeArray(
    profile.preferred_roles
  );

  const technologies = normalizeArray(
    profile.preferred_technologies
  );

  const preferredLocation = normalizeText(
    profile.preferred_location
  );

  const preferredJobType = normalizeText(
    profile.preferred_job_type
  );

  const preferredWorkMode = normalizeText(
    profile.preferred_work_mode
  );

  let score = 0;

  const matchedSkills = [];
  const matchedRoles = [];
  const matchedTechnologies = [];

  // =======================================================
  // SKILLS — 40 POINTS
  // =======================================================

  if (skills.length > 0) {
    const skillMatches = skills.filter((skill) =>
      containsTerm(searchableText, skill)
    );

    skillMatches.forEach((skill) => {
      matchedSkills.push(skill);
    });

    score += Math.min(
      40,
      (skillMatches.length / skills.length) * 40
    );
  }

  // =======================================================
  // PREFERRED ROLES — 25 POINTS
  // =======================================================

  if (roles.length > 0) {
    const roleMatches = roles.filter((role) =>
      containsTerm(title, role)
    );

    roleMatches.forEach((role) => {
      matchedRoles.push(role);
    });

    score += Math.min(
      25,
      (roleMatches.length / roles.length) * 25
    );
  }

  // =======================================================
  // TECHNOLOGIES — 15 POINTS
  // =======================================================

  if (technologies.length > 0) {
    const technologyMatches =
      technologies.filter((technology) =>
        containsTerm(
          searchableText,
          technology
        )
      );

    technologyMatches.forEach(
      (technology) => {
        matchedTechnologies.push(
          technology
        );
      }
    );

    score += Math.min(
      15,
      (technologyMatches.length /
        technologies.length) *
        15
    );
  }

  // =======================================================
  // LOCATION — 10 POINTS
  // =======================================================

  if (
    preferredLocation &&
    location &&
    containsTerm(
      location,
      preferredLocation
    )
  ) {
    score += 10;
  }

  // =======================================================
  // JOB TYPE — 5 POINTS
  // =======================================================

  if (
    preferredJobType &&
    jobType &&
    containsTerm(
      jobType,
      preferredJobType
    )
  ) {
    score += 5;
  }

  // =======================================================
  // WORK MODE — 5 POINTS
  // =======================================================

  if (
    preferredWorkMode &&
    containsTerm(
      searchableText,
      preferredWorkMode
    )
  ) {
    score += 5;
  }

  return {
    score: Math.min(
      100,
      Math.round(score)
    ),

    matchedSkills,

    matchedRoles,

    matchedTechnologies,
  };
};

// =========================================================
// BUILD PROFILE QUERIES
// =========================================================

const buildRecommendationQueries = (
  profile
) => {
  const skills = normalizeArray(
    profile.skills
  );

  const roles = normalizeArray(
    profile.preferred_roles
  );

  const technologies = normalizeArray(
    profile.preferred_technologies
  );

  /*
   * Priority:
   *
   * 1. Preferred roles
   * 2. Skills
   * 3. Technologies
   *
   * We remove duplicates so that the same
   * search is never sent twice.
   */

  const queries = [
    ...roles,
    ...skills,
    ...technologies,
  ];

  return [...new Set(queries)]
    .filter(Boolean)
    .slice(0, 8);
};

// =========================================================
// GET RECOMMENDED JOBS
// =========================================================

export const getRecommendedJobs = async (
  profile
) => {
  const queries =
    buildRecommendationQueries(
      profile
    );

  // =======================================================
  // NO PROFILE SEARCH DATA
  // =======================================================

  if (queries.length === 0) {
    return {
      jobs: [],

      total: 0,

      queries: [],

      message:
        "Add skills or preferred roles to your profile to get recommendations.",
    };
  }

  const location =
    profile.preferred_location || "";

  // =======================================================
  // SEARCH ALL PROFILE QUERIES IN PARALLEL
  // =======================================================

  const results =
    await Promise.allSettled(
      queries.map((query) =>
        discoverJobs({
          query,

          location,

          page: 1,
        })
      )
    );

  // =======================================================
  // COMBINE DISCOVERED JOBS
  // =======================================================

  const allJobs =
    results.flatMap((result) => {
      if (
        result.status !==
        "fulfilled"
      ) {
        return [];
      }

      return result.value?.jobs || [];
    });

  // =======================================================
  // DEDUPLICATE & FILTER OUT OLD DATES (2024, 2025, etc.)
  // =======================================================

  const uniqueJobs =
    Array.from(
      new Map(
        allJobs.map((job) => [
          `${job.source}-${job.externalId}`,
          job,
        ])
      ).values()
    );

  const recentUniqueJobs = uniqueJobs.filter((job) =>
    isRecentJob(job.postedAt || job.posted_at)
  );

  // =======================================================
  // SCORE JOBS
  // =======================================================

  const scoredJobs =
    recentUniqueJobs.map((job) => {
      const match =
        calculateMatchScore(
          job,
          profile
        );

      return {
        ...job,

        matchScore:
          match.score,

        matchedSkills:
          match.matchedSkills,

        matchedRoles:
          match.matchedRoles,

        matchedTechnologies:
          match.matchedTechnologies,

        isRecommended: true,
      };
    });

  // =======================================================
  // SORT BY MATCH SCORE
  // =======================================================

  scoredJobs.sort(
    (a, b) =>
      b.matchScore -
      a.matchScore
  );

  // =======================================================
  // RETURN RECOMMENDATION POOL
  // =======================================================

  const recommendationJobs = scoredJobs.filter(
    (job) => job.matchScore >= 5
  );

  console.log(`[TOTAL STATS] Total unique recent jobs across queries: ${recentUniqueJobs.length}`);
  console.log(`[TOTAL STATS] Jobs passing >= 5 threshold: ${recommendationJobs.length}`);

  return {
    jobs: recommendationJobs,
    total: recommendationJobs.length,
    queries,
  };
};