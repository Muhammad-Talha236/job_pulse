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
  `;

  const skills = normalizeArray(profile.skills);
  const roles = normalizeArray(profile.preferred_roles);
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
    const technologyMatches = technologies.filter(
      (technology) =>
        containsTerm(searchableText, technology)
    );

    technologyMatches.forEach((technology) => {
      matchedTechnologies.push(technology);
    });

    score += Math.min(
      15,
      (technologyMatches.length / technologies.length) * 15
    );
  }

  // =======================================================
  // LOCATION — 10 POINTS
  // =======================================================

  if (
    preferredLocation &&
    location &&
    containsTerm(location, preferredLocation)
  ) {
    score += 10;
  }

  // =======================================================
  // JOB TYPE — 5 POINTS
  // =======================================================

  if (
    preferredJobType &&
    jobType &&
    containsTerm(jobType, preferredJobType)
  ) {
    score += 5;
  }

  // =======================================================
  // WORK MODE — 5 POINTS
  // =======================================================

  if (
    preferredWorkMode &&
    containsTerm(searchableText, preferredWorkMode)
  ) {
    score += 5;
  }

  return {
    score: Math.min(100, Math.round(score)),
    matchedSkills,
    matchedRoles,
    matchedTechnologies,
  };
};

// =========================================================
// GET PROFILE QUERIES
// =========================================================

const buildRecommendationQueries = (profile) => {
  const skills = normalizeArray(profile.skills);
  const roles = normalizeArray(profile.preferred_roles);
  const technologies = normalizeArray(
    profile.preferred_technologies
  );

  /*
   * Roles and skills are stronger search queries.
   *
   * Technologies are used mainly for matching because
   * searching every technology separately can create
   * too many duplicate jobs.
   */

  const queries = [
    ...roles,
    ...skills,
  ];

  return [...new Set(queries)].slice(0, 5);
};

// =========================================================
// GET RECOMMENDED JOBS
// =========================================================

export const getRecommendedJobs = async (profile) => {
  const queries = buildRecommendationQueries(profile);

  if (queries.length === 0) {
    return {
      jobs: [],
      message:
        "Add skills or preferred roles to your profile to get recommendations.",
    };
  }

  const location = profile.preferred_location || "";

  const results = await Promise.allSettled(
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

  const allJobs = results.flatMap((result) => {
    if (result.status !== "fulfilled") {
      return [];
    }

    return result.value.jobs || [];
  });

  // =======================================================
  // DEDUPLICATE
  // =======================================================

  const uniqueJobs = Array.from(
    new Map(
      allJobs.map((job) => [
        `${job.source}-${job.externalId}`,
        job,
      ])
    ).values()
  );

  // =======================================================
  // SCORE JOBS
  // =======================================================

  const scoredJobs = uniqueJobs.map((job) => {
    const match = calculateMatchScore(
      job,
      profile
    );

    return {
      ...job,

      matchScore: match.score,

      matchedSkills: match.matchedSkills,

      matchedRoles: match.matchedRoles,

      matchedTechnologies:
        match.matchedTechnologies,

      isRecommended: true,
    };
  });

  // =======================================================
  // SORT
  // =======================================================

  scoredJobs.sort(
    (a, b) => b.matchScore - a.matchScore
  );

  // =======================================================
  // TOP 10
  // =======================================================

  return {
    jobs: scoredJobs.slice(0, 10),

    total: scoredJobs.length,

    queries,
  };
};