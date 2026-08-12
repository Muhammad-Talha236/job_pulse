import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getProfile } from "../api/profileApi";
import { getRecommendedJobs } from "../api/jobDiscoveryApi";
import { useAuth } from "./AuthContext";

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth();

  const [recommendedJobs, setRecommendedJobs] =
    useState([]);

  const [recommendationLoading, setRecommendationLoading] =
    useState(false);

  const [recommendationError, setRecommendationError] =
    useState("");

  const [recommendationsLoaded, setRecommendationsLoaded] =
    useState(false);

  /*
   * =========================================================
   * REQUEST GUARD
   * =========================================================
   *
   * Prevents two recommendation requests from running
   * at the same time.
   *
   * Example:
   *
   * Login
   *   ↓
   * JobProvider starts request
   *   ↓
   * JobsPage opens
   *   ↓
   * DOES NOT start another request
   */

  const recommendationRequestRef =
    useRef(false);

  /*
   * =========================================================
   * CURRENT USER REF
   * =========================================================
   *
   * Keeps track of which user's recommendations are
   * currently loaded.
   */

  const loadedUserRef = useRef(null);

  /*
   * =========================================================
   * LOAD RECOMMENDED JOBS
   * =========================================================
   */

  const loadRecommendedJobs = useCallback(
    async ({ force = false } = {}) => {
      /*
       * No authenticated user.
       */

      if (!user) {
        setRecommendedJobs([]);

        setRecommendationsLoaded(false);

        setRecommendationError("");

        loadedUserRef.current = null;

        return;
      }

      /*
       * -----------------------------------------------------
       * PREVENT DUPLICATE REQUEST
       * -----------------------------------------------------
       */

      if (
        recommendationRequestRef.current &&
        !force
      ) {
        return;
      }

      /*
       * -----------------------------------------------------
       * USE EXISTING CACHE
       * -----------------------------------------------------
       *
       * If this user's recommendations have already been
       * loaded, don't search again.
       */

      if (
        loadedUserRef.current === user.id &&
        recommendationsLoaded &&
        !force
      ) {
        return;
      }

      try {
        recommendationRequestRef.current = true;

        setRecommendationLoading(true);

        setRecommendationError("");

        /*
         * ===================================================
         * STEP 1 — FETCH PROFILE
         * ===================================================
         *
         * Profile contains:
         *
         * skills
         * preferred_roles
         * preferred_technologies
         * preferred_location
         *
         * Backend recommendation service uses these values.
         */

        const profileResponse =
          await getProfile();

        const profile =
          profileResponse?.profile;

        /*
         * No profile.
         */

        if (!profile) {
          setRecommendedJobs([]);

          setRecommendationsLoaded(true);

          loadedUserRef.current =
            user.id;

          return;
        }

        /*
         * ===================================================
         * STEP 2 — CHECK PROFILE DATA
         * ===================================================
         *
         * Recommendations can be generated from skills,
         * roles or technologies.
         */

        const skills =
          Array.isArray(profile.skills)
            ? profile.skills.filter(
                (skill) =>
                  typeof skill ===
                    "string" &&
                  skill.trim()
              )
            : [];

        const roles =
          Array.isArray(
            profile.preferred_roles
          )
            ? profile.preferred_roles.filter(
                (role) =>
                  typeof role ===
                    "string" &&
                  role.trim()
              )
            : [];

        const technologies =
          Array.isArray(
            profile.preferred_technologies
          )
            ? profile.preferred_technologies.filter(
                (technology) =>
                  typeof technology ===
                    "string" &&
                  technology.trim()
              )
            : [];

        /*
         * No recommendation data at all.
         */

        if (
          skills.length === 0 &&
          roles.length === 0 &&
          technologies.length === 0
        ) {
          setRecommendedJobs([]);

          setRecommendationsLoaded(true);

          loadedUserRef.current =
            user.id;

          return;
        }

        /*
         * ===================================================
         * STEP 3 — FETCH RECOMMENDATIONS
         * ===================================================
         *
         * Backend handles:
         *
         * user
         *   ↓
         * profile
         *   ↓
         * recommendation queries
         *   ↓
         * Adzuna + Muse in parallel
         *   ↓
         * scoring
         */

        const response =
          await getRecommendedJobs();

        const jobs =
          response?.jobs ||
          response?.recommendedJobs ||
          [];

        /*
         * ===================================================
         * STEP 4 — CACHE JOBS
         * ===================================================
         */

        setRecommendedJobs(
          Array.isArray(jobs)
            ? jobs
            : []
        );

        setRecommendationsLoaded(
          true
        );

        loadedUserRef.current =
          user.id;
      } catch (error) {
        console.error(
          "Failed to load recommended jobs:",
          error
        );

        setRecommendationError(
          error.response?.data
            ?.message ||
            "Unable to load job recommendations."
        );

        /*
         * Keep already-loaded jobs if we have them.
         *
         * This prevents a failed refresh from
         * destroying the existing job list.
         */

        if (
          !recommendationsLoaded
        ) {
          setRecommendedJobs([]);
        }

        setRecommendationsLoaded(
          true
        );
      } finally {
        recommendationRequestRef.current =
          false;

        setRecommendationLoading(
          false
        );
      }
    },
    [
      user,
      recommendationsLoaded,
    ]
  );

  /*
   * =========================================================
   * AUTOMATIC RECOMMENDATION PREFETCH
   * =========================================================
   *
   * Important:
   *
   * User logs in
   *      ↓
   * AuthContext sets user
   *      ↓
   * JobContext detects user
   *      ↓
   * Profile is fetched
   *      ↓
   * Recommendation search starts
   *
   * Therefore JobsPage does NOT need to initiate
   * the first recommendation search.
   */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    /*
     * User logged out.
     */

    if (!user) {
      recommendationRequestRef.current =
        false;

      loadedUserRef.current = null;

      setRecommendedJobs([]);

      setRecommendationsLoaded(false);

      setRecommendationError("");

      setRecommendationLoading(false);

      return;
    }

    /*
     * New authenticated user.
     *
     * Start recommendation prefetch.
     */

    if (
      loadedUserRef.current !==
      user.id
    ) {
      loadRecommendedJobs();
    }
  }, [
    user,
    authLoading,
    loadRecommendedJobs,
  ]);

  /*
   * =========================================================
   * REFRESH RECOMMENDATIONS
   * =========================================================
   *
   * Call this after the user changes profile skills,
   * preferred roles, location, etc.
   *
   * Example:
   *
   * ProfilePage
   *    ↓
   * Save profile
   *    ↓
   * refreshRecommendations()
   *    ↓
   * New recommendation search
   */

  const refreshRecommendations =
    useCallback(() => {
      /*
       * Force a new recommendation search.
       */

      loadedUserRef.current = null;

      return loadRecommendedJobs({
        force: true,
      });
    }, [
      loadRecommendedJobs,
    ]);

  /*
   * =========================================================
   * CONTEXT VALUE
   * =========================================================
   */

  const value = useMemo(
    () => ({
      recommendedJobs,

      recommendationLoading,

      recommendationError,

      recommendationsLoaded,

      refreshRecommendations,

      /*
       * Useful for JobsPage.
       *
       * It can know whether jobs are already available
       * before deciding to show a loading state.
       */

      hasRecommendedJobs:
        recommendedJobs.length > 0,
    }),
    [
      recommendedJobs,
      recommendationLoading,
      recommendationError,
      recommendationsLoaded,
      refreshRecommendations,
    ]
  );

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

/*
 * =========================================================
 * USE JOBS
 * =========================================================
 */

export const useJobs = () => {
  const context = useContext(
    JobContext
  );

  if (!context) {
    throw new Error(
      "useJobs must be used inside JobProvider"
    );
  }

  return context;
};

export default JobContext;