// src/pages/JobsPage.jsx

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Globe2,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";

import {
  saveJob,
  unsaveJob,
  getSavedJobs,
} from "../api/jobsApi";

import {
  searchJobs,
} from "../api/jobDiscoveryApi";

import { getProfile } from "../api/profileApi";

import JobSearchBar from "../components/jobs/JobSearchBar";
import JobResults from "../components/jobs/JobResults";

import { useJobSuggestions } from "../hooks/useJobSuggestions";

import {
  isSameJob,
  normalizeJob,
} from "../utils/jobUtils";

import { useJobs } from "../context/JobContext";

function JobsPage() {
  // =========================================================
  // SEARCH STATE
  // =========================================================

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  // =========================================================
  // JOB STATE
  // =========================================================

  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  // =========================================================
  // PROFILE STATE
  // =========================================================

  const [profile, setProfile] = useState(null);
  const [recommendedSkills, setRecommendedSkills] =
    useState([]);

  // =========================================================
  // LOADING / ERROR
  // =========================================================

  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] =
    useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // PAGINATION
  // =========================================================

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] =
    useState(false);

  const [hasPreviousPage, setHasPreviousPage] =
    useState(false);

  // =========================================================
  // SAVE STATE
  // =========================================================

  const [savingJob, setSavingJob] =
    useState(null);

  // =========================================================
  // GLOBAL JOB CONTEXT
  // =========================================================
  //
  // Recommendations are already being fetched by
  // JobContext after login.
  //
  // JobsPage only consumes them.
  // It does NOT call /recommended again.
  // =========================================================

  const {
    recommendedJobs,
    recommendationLoading,
    recommendationError,
    recommendationsLoaded,
    refreshRecommendations,
  } = useJobs();

  // =========================================================
  // RECOMMENDATION SKILLS
  // =========================================================

  const visibleSkills = useMemo(
    () =>
      recommendedSkills.slice(0, 8),
    [recommendedSkills]
  );

  // =========================================================
  // JOB SUGGESTIONS
  // =========================================================

  const {
    skillSuggestions,
    locationSuggestions,
    loadingSkills,
    loadingLocations,
  } = useJobSuggestions({
    query,
    location,
    enabled: !loading,
  });

  // =========================================================
  // FETCH MANUAL JOBS
  // =========================================================

  const fetchManualJobs = async (
    searchQuery,
    searchLocation = "",
    requestedPage = 1
  ) => {
    const trimmedQuery =
      searchQuery.trim();

    if (!trimmedQuery) {
      setJobs([]);
      return;
    }

    try {
      setLoadingSearch(true);
      setError("");

      const data = await searchJobs(
        trimmedQuery,
        searchLocation.trim(),
        requestedPage
      );

      const discoveredJobs = (
        data?.jobs || []
      ).map(normalizeJob);

      setJobs(discoveredJobs);

      setPage(
        data?.page || requestedPage
      );

      setHasNextPage(
        Boolean(data?.hasNextPage)
      );

      setHasPreviousPage(
        Boolean(data?.hasPreviousPage)
      );
    } catch (requestError) {
      console.error(
        "Manual job search failed:",
        requestError
      );

      setJobs([]);

      setPage(1);

      setHasNextPage(false);

      setHasPreviousPage(false);

      setError(
        requestError?.response?.data
          ?.message ||
          "Unable to fetch jobs. Please try again."
      );
    } finally {
      setLoadingSearch(false);
    }
  };

  // =========================================================
  // INITIAL PAGE LOAD
  // =========================================================
  //
  // IMPORTANT:
  //
  // No previous search is restored.
  //
  // Search inputs always start empty.
  //
  // Recommendations come from JobContext.
  // =========================================================

  useEffect(() => {
    let active = true;

    const initializePage = async () => {
      try {
        setLoading(true);
        setError("");

        // -----------------------------------------------------
        // FETCH PROFILE + SAVED JOBS
        // -----------------------------------------------------

        const [
          profileResult,
          savedResult,
        ] = await Promise.allSettled([
          getProfile(),
          getSavedJobs(),
        ]);

        if (!active) {
          return;
        }

        // -----------------------------------------------------
        // PROFILE
        // -----------------------------------------------------

        if (
          profileResult.status ===
          "fulfilled"
        ) {
          const userProfile =
            profileResult.value?.profile ||
            null;

          setProfile(userProfile);

          const skills = Array.isArray(
            userProfile?.skills
          )
            ? userProfile.skills
                .map((skill) =>
                  String(skill).trim()
                )
                .filter(Boolean)
            : [];

          setRecommendedSkills(skills);
        }

        // -----------------------------------------------------
        // SAVED JOBS
        // -----------------------------------------------------

        if (
          savedResult.status ===
          "fulfilled"
        ) {
          const restoredSavedJobs =
            savedResult.value?.jobs ||
            savedResult.value?.savedJobs ||
            [];

          setSavedJobs(
            restoredSavedJobs.map(
              normalizeJob
            )
          );
        }

        // -----------------------------------------------------
        // USE PREFETCHED RECOMMENDATIONS
        // -----------------------------------------------------

        const normalizedRecommendations =
          (
            recommendedJobs || []
          ).map(normalizeJob);

        setJobs(
          normalizedRecommendations
        );

        setPage(1);

        setHasNextPage(false);

        setHasPreviousPage(false);
      } catch (requestError) {
        console.error(
          "Failed to initialize jobs page:",
          requestError
        );

        if (!active) {
          return;
        }

        setError(
          requestError?.response?.data
            ?.message ||
            "Unable to prepare the jobs page."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initializePage();

    return () => {
      active = false;
    };
  }, [recommendedJobs]);

  // =========================================================
  // HANDLE RECOMMENDATION LOADING
  // =========================================================
  //
  // If JobContext is still fetching recommendations,
  // JobsPage waits for it instead of starting another request.
  // =========================================================

  useEffect(() => {
    if (
      recommendationLoading &&
      !recommendationsLoaded
    ) {
      setLoading(true);
    }

    if (
      recommendationsLoaded &&
      !loadingSearch
    ) {
      setLoading(false);
    }
  }, [
    recommendationLoading,
    recommendationsLoaded,
    loadingSearch,
  ]);

  // =========================================================
  // RECOMMENDATION ERROR
  // =========================================================

  useEffect(() => {
    if (
      recommendationError &&
      !query.trim()
    ) {
      setError(recommendationError);
    }
  }, [
    recommendationError,
    query,
  ]);

  // =========================================================
  // SEARCH HANDLER
  // =========================================================

  const handleSearch = async (event) => {
    event.preventDefault();

    const trimmedQuery =
      query.trim();

    const trimmedLocation =
      location.trim();

    // -------------------------------------------------------
    // BASIC VALIDATION
    // -------------------------------------------------------

    if (!trimmedQuery) {
      setError(
        "Please enter a job title, skill, technology, or keyword."
      );

      return;
    }

    /*
     * IMPORTANT:
     *
     * Do NOT save search query/location
     * into localStorage.
     *
     * Search should reset when page is refreshed.
     */

    await fetchManualJobs(
      trimmedQuery,
      trimmedLocation,
      1
    );
  };

  // =========================================================
  // BACK TO RECOMMENDATIONS
  // =========================================================

  const handleBackToRecommendations =
    async () => {
      setError("");

      setQuery("");

      setLocation("");

      setPage(1);

      setHasNextPage(false);

      setHasPreviousPage(false);

      /*
       * Refresh only when explicitly requested.
       *
       * Normally recommendations are already
       * available from JobContext.
       */

      if (
        !recommendedJobs ||
        recommendedJobs.length === 0
      ) {
        await refreshRecommendations();
      }
    };

  // =========================================================
  // SAVE / UNSAVE
  // =========================================================

  const handleSaveToggle = async (job) => {
    const jobKey =
      job?.id ||
      `${job?.source}-${job?.externalId}-${job?.title}`;

    if (savingJob === jobKey) {
      return;
    }

    try {
      setSavingJob(jobKey);

      setError("");

      const alreadySaved =
        savedJobs.some(
          (savedJob) =>
            isSameJob(
              savedJob,
              job
            )
        );

      // -----------------------------------------------------
      // UNSAVE
      // -----------------------------------------------------

      if (alreadySaved) {
        await unsaveJob(job);

        setSavedJobs(
          (previous) =>
            previous.filter(
              (savedJob) =>
                !isSameJob(
                  savedJob,
                  job
                )
            )
        );

        return;
      }

      // -----------------------------------------------------
      // SAVE
      // -----------------------------------------------------

      const data =
        await saveJob(job);

      const savedJob =
        normalizeJob(
          data?.job ||
            data?.savedJob ||
            job
        );

      setSavedJobs(
        (previous) => {
          const exists =
            previous.some(
              (existingJob) =>
                isSameJob(
                  existingJob,
                  savedJob
                )
            );

          if (exists) {
            return previous;
          }

          return [
            ...previous,
            savedJob,
          ];
        }
      );
    } catch (requestError) {
      console.error(
        "Save job action failed:",
        requestError
      );

      setError(
        requestError?.response?.data
          ?.message ||
          "Unable to update saved job. Please try again."
      );
    } finally {
      setSavingJob(null);
    }
  };

  // =========================================================
  // PAGINATION
  // =========================================================

  const loadPage = async (
    requestedPage
  ) => {
    if (
      loadingSearch ||
      requestedPage < 1 ||
      !query.trim()
    ) {
      return;
    }

    await fetchManualJobs(
      query,
      location,
      requestedPage
    );
  };

  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc] text-slate-900">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-6 w-40 rounded-full bg-slate-200" />

              <div className="mt-6 h-12 max-w-2xl rounded-xl bg-slate-200" />

              <div className="mt-4 h-5 max-w-xl rounded bg-slate-200" />

              <div className="mt-8 h-16 rounded-2xl bg-slate-200" />
            </div>
          </div>
        </section>

        <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Loader2
                size={20}
                className="animate-spin text-blue-600"
              />

              Finding jobs based on your skills...
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f9fc] text-slate-900">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">

          {/* Badge */}

          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">

            <Sparkles size={14} />

            {query.trim()
              ? "Smart job discovery"
              : "Personalized job recommendations"}

          </div>

          {/* Heading */}

          <div className="max-w-3xl">

            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">

              Find work that

              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                moves you forward.
              </span>

            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">

              {query.trim()
                ? "Search real opportunities from multiple job sources with relevant results."
                : "We found real opportunities based on the skills in your profile."}

            </p>

          </div>

          {/* =================================================
              PROFILE SKILLS
          ================================================== */}

          {!query.trim() &&
            visibleSkills.length > 0 && (
              <div className="mt-6">

                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">

                  <Target
                    size={14}
                    className="text-blue-600"
                  />

                  Based on your skills

                </div>

                <div className="flex max-w-full flex-wrap gap-2">

                  {visibleSkills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>
            )}

          {/* =================================================
              SEARCH
          ================================================== */}

          <JobSearchBar
            query={query}
            location={location}
            loading={loadingSearch}
            onQueryChange={(value) => {
              setQuery(value);

              if (
                value.trim()
              ) {
                setError("");
              }
            }}
            onLocationChange={
              (value) => {
                setLocation(value);

                if (
                  value.trim()
                ) {
                  setError("");
                }
              }
            }
            onSearch={handleSearch}
            skillSuggestions={
              skillSuggestions
            }
            locationSuggestions={
              locationSuggestions
            }
            loadingSkills={
              loadingSkills
            }
            loadingLocations={
              loadingLocations
            }
          />

          {/* =================================================
              BACK TO RECOMMENDATIONS
          ================================================== */}

          {query.trim() &&
            recommendedSkills.length > 0 && (
              <button
                type="button"
                onClick={
                  handleBackToRecommendations
                }
                disabled={
                  loadingSearch
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Sparkles size={14} />

                Back to recommendations

              </button>
            )}

          {/* =================================================
              SOURCES
          ================================================== */}

          <div className="mt-5 flex max-w-full flex-wrap items-center gap-3 text-xs text-slate-500">

            <span className="font-medium">
              Powered by
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600">
              Adzuna
            </span>

            <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600">
              The Muse
            </span>

            <span className="flex items-center gap-1.5 text-slate-400">

              <Globe2 size={14} />

              Real opportunities

            </span>

          </div>

        </div>

      </section>

      {/* =====================================================
          RESULTS
      ====================================================== */}

      <main className="mx-auto w-full max-w-7xl min-w-0 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        <JobResults
          jobs={jobs}
          loading={
            loadingSearch ||
            recommendationLoading
          }
          error={error}
          isRecommendationMode={
            !query.trim()
          }
          query={query}
          page={page}
          hasNextPage={
            hasNextPage
          }
          hasPreviousPage={
            hasPreviousPage
          }
          savedJobs={savedJobs}
          savingJob={savingJob}
          onSaveToggle={
            handleSaveToggle
          }
          onNextPage={() =>
            loadPage(page + 1)
          }
          onPreviousPage={() =>
            loadPage(page - 1)
          }
          hasProfileSkills={
            recommendedSkills.length > 0
          }
        />

      </main>

    </div>
  );
}

export default JobsPage;