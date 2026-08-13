// src/pages/JobsPage.jsx

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import axios from "axios";

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

// =========================================================
// PAGE SIZE
// =========================================================
//
// Backend now returns the FULL relevant job list for a
// manual search in one response. We slice that list into
// pages of 10 entirely on the frontend, so clicking
// Next / Previous never triggers another backend/API call.

const PAGE_SIZE = 10;

function JobsPage() {
  // =========================================================
  // SEARCH STATE
  // =========================================================
  //
  // IMPORTANT:
  // These always start empty. We never restore a previous
  // query/location from storage, so the search bar is
  // always blank on a fresh page load / login.

  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  // =========================================================
  // HAS THE USER MANUALLY SEARCHED?
  // =========================================================
  //
  // This flag is the key fix: once the user runs a manual
  // keyword search, recommendation data (which can refresh
  // in the background via JobContext) must NOT overwrite
  // the jobs currently on screen.

  const [hasSearched, setHasSearched] = useState(false);

  // =========================================================
  // JOB STATE
  // =========================================================

  // Full relevant result set from a manual search
  // (before local pagination is applied).
  const [searchResults, setSearchResults] = useState([]);

  // Jobs currently shown on screen (either the current
  // page slice of searchResults, or recommendations).
  const [jobs, setJobs] = useState([]);

  const [savedJobs, setSavedJobs] = useState([]);
 const {
    recommendedJobs,
    recommendationLoading,
    recommendationError,
    recommendationsLoaded,
    refreshRecommendations,
  } = useJobs();
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
  // RACE PROTECTION + RETRY
  // =========================================================
  //
  // abortControllerRef tracks the in-flight manual search
  // request. If the user searches again (or clicks a
  // suggestion and searches) before the previous request
  // finishes, we cancel the stale one so its response can
  // never overwrite newer results.
  //
  // lastSearch remembers the most recent query/location so
  // the error state's "Try again" button can re-run the
  // exact same search without the user retyping anything.

  const abortControllerRef = useRef(null);
  const [lastSearch, setLastSearch] = useState(null);

  // =========================================================
  // PAGINATION (client-side only)
  // =========================================================

  const [page, setPage] = useState(1);

  const currentTotalJobs = hasSearched 
    ? searchResults.length 
    : (recommendedJobs?.length || 0);

    const maxPages = Math.max(1, Math.ceil(currentTotalJobs / PAGE_SIZE));
 const hasNextPage = page < maxPages;
  const hasPreviousPage = page > 1;
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
  // JobContext right after login (based on the user's
  // profile skills/roles/technologies).
  //
  // JobsPage only consumes them — it does NOT call
  // /recommended again itself.
  // =========================================================

 

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
  //
  // Fetches the FULL relevant list for a query once.
  // Pagination afterwards is purely local (see the effect
  // below that slices searchResults by `page`).
  //
  // Race protection: any previous in-flight search request
  // is aborted before starting a new one, and the response
  // of an aborted request is ignored even if it resolves
  // after the abort() call (defensive double-check).

  const fetchManualJobs = async (
    searchQuery,
    searchLocation = ""
  ) => {
    const trimmedQuery =
      searchQuery.trim();

    if (!trimmedQuery) {
      setSearchResults([]);
      setJobs([]);
      return;
    }

    // Cancel any in-flight search before starting a new one.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoadingSearch(true);
      setError("");

      setLastSearch({
        query: trimmedQuery,
        location: searchLocation.trim(),
      });

      const data = await searchJobs(
        trimmedQuery,
        searchLocation.trim(),
        controller.signal
      );

      // This request was superseded by a newer one — ignore
      // its result even though the request itself resolved.
      if (abortControllerRef.current !== controller) {
        return;
      }

      const discoveredJobs = (
        data?.jobs || []
      ).map(normalizeJob);

      setSearchResults(discoveredJobs);
      setPage(1);
    } catch (requestError) {
      // Request was intentionally cancelled — not a real
      // error, so don't show anything to the user.
      const wasCancelled =
        requestError?.name === "CanceledError" ||
        requestError?.code === "ERR_CANCELED" ||
        axios.isCancel?.(requestError);

      if (wasCancelled) {
        return;
      }

      console.error(
        "Manual job search failed:",
        requestError
      );

      setSearchResults([]);
      setJobs([]);
      setPage(1);

      setError(
        requestError?.response?.data
          ?.message ||
          "Unable to fetch jobs. Please check your connection and try again."
      );
    } finally {
      if (abortControllerRef.current === controller) {
        setLoadingSearch(false);
      }
    }
  };

  // =========================================================
  // RETRY
  // =========================================================
  //
  // Used by the error state's "Try again" button. Re-runs
  // the last manual search if there was one, otherwise
  // refreshes recommendations.

  const handleRetry = () => {
    if (lastSearch?.query) {
      fetchManualJobs(
        lastSearch.query,
        lastSearch.location
      );

      return;
    }

    if (!hasSearched) {
      refreshRecommendations();
    }
  };

  // =========================================================
  // CLEANUP IN-FLIGHT REQUEST ON UNMOUNT
  // =========================================================

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // =========================================================
  // LOCAL PAGINATION
  // =========================================================
  //
  // Whenever the full search result set or the current
  // page changes, slice out the 10 jobs for that page.
  // No backend call happens here.

 useEffect(() => {
    const currentList = hasSearched 
      ? searchResults 
      : (recommendedJobs || []).map(normalizeJob);

    const start = (page - 1) * PAGE_SIZE;
    
    setJobs(
      currentList.slice(
        start,
        start + PAGE_SIZE
      )
    );
  }, [searchResults, recommendedJobs, page, hasSearched]);

  // =========================================================
  // INITIAL PAGE LOAD
  // =========================================================
  //
  // IMPORTANT:
  //
  // - Search inputs always start empty.
  // - Recommendations come from JobContext and are shown
  //   automatically ONLY while the user hasn't manually
  //   searched yet (hasSearched === false). This is what
  //   stops a background recommendation refresh from
  //   wiping out the user's manual search results.
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
        //
        // Only populate the job list from recommendations
        // if the user hasn't run a manual search. Otherwise
        // we'd stomp on their current search results every
        // time recommendedJobs changes reference.

        if (!hasSearched) {
          // const normalizedRecommendations =
          //   (
          //     recommendedJobs || []
          //   ).map(normalizeJob);

          // setJobs(
          //   normalizedRecommendations
          // );

          setPage(1);
        }
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
  }, [recommendedJobs, hasSearched]);

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

    // Mark that the user has manually searched so the
    // background recommendation refresh effect stops
    // overwriting these results.
    setHasSearched(true);

    await fetchManualJobs(
      trimmedQuery,
      trimmedLocation
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

      setSearchResults([]);

      setPage(1);

      setLastSearch(null);

      // Cancel any in-flight manual search — we're leaving
      // manual-search mode entirely.
      abortControllerRef.current?.abort();

      // Allow recommendations to populate the job list again.
      setHasSearched(false);

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
  // PAGINATION (client-side)
  // =========================================================
  //
  // No backend call happens here anymore — we just move
  // to a different slice of the already-fetched
  // searchResults array.

 const loadPage = (requestedPage) => {
    const currentTotalJobs = hasSearched 
      ? searchResults.length 
      : (recommendedJobs?.length || 0);

    const maxPage = Math.max(
      1,
      Math.ceil(currentTotalJobs / PAGE_SIZE)
    );

    if (
      requestedPage < 1 ||
      requestedPage > maxPage
    ) {
      return;
    }

    setPage(requestedPage);
  };
  useEffect(() => {
    const currentList = hasSearched ? searchResults : (recommendedJobs || []);
    const start = (page - 1) * PAGE_SIZE;
    setJobs(
      currentList.slice(
        start,
        start + PAGE_SIZE
      )
    );
  }, [searchResults, recommendedJobs, page, hasSearched]);
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

      <section className="relative overflow-visible border-b border-slate-200 bg-white">

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
          totalJobs={hasSearched ? searchResults.length : (recommendedJobs?.length || 0)} // <-- Yeh prop add karein
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
          onRetry={handleRetry}
        />

      </main>

    </div>
  );
}

export default JobsPage;