import { discoverJobs } from "./jobDiscoveryService.js";

// =========================================================
// SEARCH SUGGESTIONS
// =========================================================

export const getSuggestions = ({
  query = "",
  skills = [],
  locations = [],
} = {}) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return {
      skills: [],
      locations: [],
    };
  }

  const uniqueSkills = [...new Set(skills)]
    .filter(Boolean)
    .filter((skill) =>
      skill.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 8);

  const uniqueLocations = [...new Set(locations)]
    .filter(Boolean)
    .filter((location) =>
      location.toLowerCase().includes(normalizedQuery)
    )
    .slice(0, 8);

  return {
    skills: uniqueSkills,
    locations: uniqueLocations,
  };
};

// =========================================================
// SEARCH VALIDATION
// =========================================================

export const isValidSearchQuery = (query) => {
  if (!query || typeof query !== "string") {
    return false;
  }

  const value = query.trim();

  if (value.length < 2) {
    return false;
  }

  if (value.length > 100) {
    return false;
  }

  if (!/[a-zA-Z0-9]/.test(value)) {
    return false;
  }

  return true;
};

// =========================================================
// PROFILE BASED JOB SUGGESTIONS
// =========================================================

export const generateJobSuggestions = async (profile) => {
  if (!profile) {
    return {
      jobs: [],
      message:
        "Complete your profile to get personalized job recommendations.",
    };
  }

  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : [];

  const preferredRoles = Array.isArray(
    profile.preferred_roles
  )
    ? profile.preferred_roles
    : [];

  const preferredTechnologies = Array.isArray(
    profile.preferred_technologies
  )
    ? profile.preferred_technologies
    : [];

  const location =
    profile.preferred_location || "";

  /*
   * Combine profile information.
   * Skills are given priority because they are
   * the main recommendation signal.
   */

  const searchTerms = [
    ...skills,
    ...preferredRoles,
    ...preferredTechnologies,
  ]
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter(Boolean);

  const uniqueTerms = [
    ...new Set(
      searchTerms.map((item) =>
        item.toLowerCase()
      )
    ),
  ];

  if (uniqueTerms.length === 0) {
    return {
      jobs: [],
      message:
        "Add skills or preferred roles to your profile to get recommendations.",
    };
  }

  /*
   * Search using profile terms.
   *
   * We don't send all skills as one giant query because
   * that can make external job APIs return poor results.
   */

  const recommendationMap = new Map();

  for (const term of uniqueTerms.slice(0, 5)) {
    try {
      const result = await discoverJobs({
        query: term,
        location,
        page: 1,
      });

      for (const job of result.jobs || []) {
        const key =
          `${job.source}-${job.externalId}`.toLowerCase();

        if (!recommendationMap.has(key)) {
          recommendationMap.set(key, {
            ...job,
            matchedProfileTerm: term,
          });
        }
      }
    } catch (error) {
      console.error(
        `Recommendation search failed for "${term}":`,
        error.message
      );
    }
  }

  const jobs = Array.from(
    recommendationMap.values()
  );

  return {
    count: jobs.length,
    jobs: jobs.slice(0, 20),
    basedOn: {
      skills,
      preferredRoles,
      preferredTechnologies,
      location,
    },
  };
};