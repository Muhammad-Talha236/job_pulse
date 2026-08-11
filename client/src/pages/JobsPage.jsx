import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  Building2,
  BriefcaseBusiness,
  ExternalLink,
  Clock3,
  DollarSign,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Globe2,
  Bookmark,
  BookmarkCheck,
  Database,
  Target,
} from "lucide-react";

import {
  saveJob,
  unsaveJob,
  getSavedJobs,
} from "../api/jobsApi";

import { searchJobs } from "../api/jobDiscoveryApi";
import { getProfile } from "../api/profileApi";

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

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingSavedJobs, setLoadingSavedJobs] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // PAGINATION
  // =========================================================

  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // =========================================================
  // SAVED JOBS
  // =========================================================

  const [savedJobs, setSavedJobs] = useState([]);
  const [savingJob, setSavingJob] = useState(null);

  // =========================================================
  // PROFILE / RECOMMENDATION
  // =========================================================

  const [profile, setProfile] = useState(null);

  const [isRecommendationMode, setIsRecommendationMode] =
    useState(false);

  const [recommendedSkills, setRecommendedSkills] =
    useState([]);

  // =========================================================
  // RESTORE SEARCH
  // =========================================================

  const [hasRestoredSearch, setHasRestoredSearch] =
    useState(false);

  // =========================================================
  // LOAD SAVED JOBS
  // =========================================================

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        setLoadingSavedJobs(true);

        const data = await getSavedJobs();

        const restoredJobs =
          data?.jobs ||
          data?.savedJobs ||
          [];

        setSavedJobs(restoredJobs);
      } catch (error) {
        console.error(
          "Failed to load saved jobs:",
          error
        );

        // Do not block the job page if saved jobs fail.
        setSavedJobs([]);
      } finally {
        setLoadingSavedJobs(false);
      }
    };

    loadSavedJobs();
  }, []);

  // =========================================================
  // LOAD PROFILE + AUTO RECOMMENDATIONS
  // =========================================================

  useEffect(() => {
    const initializeJobsPage = async () => {
      try {
        setLoadingProfile(true);
        setError("");

        // -----------------------------------------------------
        // Restore previous manual search
        // -----------------------------------------------------

        const savedQuery =
          localStorage.getItem(
            "jobPulse_search_query"
          );

        const savedLocation =
          localStorage.getItem(
            "jobPulse_search_location"
          );

        // -----------------------------------------------------
        // Get profile
        // -----------------------------------------------------

        const profileData = await getProfile();

        const userProfile =
          profileData?.profile || null;

        setProfile(userProfile);

        const profileSkills = Array.isArray(
          userProfile?.skills
        )
          ? userProfile.skills
              .map((skill) =>
                String(skill).trim()
              )
              .filter(Boolean)
          : [];

        setRecommendedSkills(profileSkills);

        // -----------------------------------------------------
        // If user already had a manual search,
        // restore that search.
        // -----------------------------------------------------

        if (savedQuery?.trim()) {
          setQuery(savedQuery);
          setLocation(savedLocation || "");
          setHasRestoredSearch(true);

          await fetchJobs(
            savedQuery.trim(),
            savedLocation?.trim() || "",
            1,
            false
          );

          return;
        }

        // -----------------------------------------------------
        // No previous manual search.
        // Use profile skills automatically.
        // -----------------------------------------------------

        if (profileSkills.length > 0) {
          const recommendationQuery =
            profileSkills.join(" ");

          setIsRecommendationMode(true);

          await fetchJobs(
            recommendationQuery,
            userProfile?.preferred_location?.trim() ||
              "",
            1,
            true
          );

          return;
        }

        // -----------------------------------------------------
        // No skills in profile
        // -----------------------------------------------------

        setIsRecommendationMode(false);
        setJobs([]);
      } catch (error) {
        console.error(
          "Failed to initialize jobs page:",
          error
        );

        // Profile may not exist yet.
        // Do not show a hard error just because
        // recommendation profile is unavailable.

        setProfile(null);
        setRecommendedSkills([]);

        setIsRecommendationMode(false);

        // If there is a saved search, try it anyway.
        const savedQuery =
          localStorage.getItem(
            "jobPulse_search_query"
          );

        const savedLocation =
          localStorage.getItem(
            "jobPulse_search_location"
          );

        if (savedQuery?.trim()) {
          setQuery(savedQuery);
          setLocation(savedLocation || "");

          await fetchJobs(
            savedQuery.trim(),
            savedLocation?.trim() || "",
            1,
            false
          );
        } else {
          setJobs([]);
        }
      } finally {
        setLoadingProfile(false);
      }
    };

    initializeJobsPage();
  }, []);

  // =========================================================
  // CLEAN HTML DESCRIPTION
  // =========================================================

  const cleanDescription = (description) => {
    if (!description) return "";

    if (
      !String(description).includes("<") &&
      !String(description).includes(">")
    ) {
      return String(description);
    }

    try {
      const parser = new DOMParser();

      const document =
        parser.parseFromString(
          String(description),
          "text/html"
        );

      return (
        document.body.textContent
          ?.replace(/\s+/g, " ")
          .trim() || ""
      );
    } catch (error) {
      console.error(
        "Failed to clean job description:",
        error
      );

      return String(description)
        .replace(/<[^>]*>/g, "")
        .trim();
    }
  };

  // =========================================================
  // NORMALIZE JOB
  // =========================================================

  const normalizeJob = (job) => {
    if (!job) return job;

    let salaryMin = job.salaryMin;
    let salaryMax = job.salaryMax;

    // -------------------------------------------------------
    // Saved DB jobs may store salary as:
    // "1000 - 2000"
    // -------------------------------------------------------

    if (
      salaryMin == null &&
      salaryMax == null &&
      job.salary
    ) {
      const salaryParts = String(job.salary)
        .split("-")
        .map((value) => value.trim());

      if (salaryParts.length === 2) {
        const parsedMin = Number(
          salaryParts[0].replace(/,/g, "")
        );

        const parsedMax = Number(
          salaryParts[1].replace(/,/g, "")
        );

        salaryMin = Number.isNaN(parsedMin)
          ? null
          : parsedMin;

        salaryMax = Number.isNaN(parsedMax)
          ? null
          : parsedMax;
      }
    }

    return {
      ...job,

      description: cleanDescription(
        job.description
      ),

      contractType:
        job.contractType ||
        job.job_type ||
        null,

      salaryMin:
        salaryMin == null ||
        Number.isNaN(Number(salaryMin))
          ? null
          : Number(salaryMin),

      salaryMax:
        salaryMax == null ||
        Number.isNaN(Number(salaryMax))
          ? null
          : Number(salaryMax),

      postedAt:
        job.postedAt ||
        job.created_at ||
        null,
    };
  };

  // =========================================================
  // FETCH JOBS
  // =========================================================

  const fetchJobs = async (
    searchQuery,
    searchLocation = "",
    requestedPage = 1,
    recommendation = false
  ) => {
    if (!searchQuery?.trim()) {
      setJobs([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchJobs(
        searchQuery.trim(),
        searchLocation?.trim() || "",
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

      setIsRecommendationMode(
        recommendation
      );
    } catch (error) {
      console.error(
        "Job fetch failed:",
        error
      );

      setJobs([]);

      setPage(1);

      setHasNextPage(false);
      setHasPreviousPage(false);

      setError(
        error?.response?.data?.message ||
          "Unable to fetch jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // MANUAL SEARCH
  // =========================================================

  const handleSearch = async (e) => {
    e.preventDefault();

    const trimmedQuery =
      query.trim();

    const trimmedLocation =
      location.trim();

    if (!trimmedQuery) {
      setError(
        "Please enter a job title, skill, or keyword."
      );

      return;
    }

    try {
      setError("");

      // Manual search always overrides
      // automatic recommendation mode.

      setIsRecommendationMode(false);

      setHasRestoredSearch(false);

      // Save search locally.

      localStorage.setItem(
        "jobPulse_search_query",
        trimmedQuery
      );

      localStorage.setItem(
        "jobPulse_search_location",
        trimmedLocation
      );

      await fetchJobs(
        trimmedQuery,
        trimmedLocation,
        1,
        false
      );
    } catch (error) {
      console.error(
        "Manual job search failed:",
        error
      );
    }
  };

  // =========================================================
  // CLEAR MANUAL SEARCH / BACK TO RECOMMENDATIONS
  // =========================================================

  const handleBackToRecommendations =
    async () => {
      if (
        recommendedSkills.length === 0
      ) {
        setQuery("");
        setLocation("");

        setJobs([]);

        setIsRecommendationMode(false);

        return;
      }

      try {
        setError("");

        const recommendationQuery =
          recommendedSkills.join(" ");

        const recommendationLocation =
          profile?.preferred_location?.trim() ||
          "";

        // Clear previous manual search.

        localStorage.removeItem(
          "jobPulse_search_query"
        );

        localStorage.removeItem(
          "jobPulse_search_location"
        );

        setQuery("");
        setLocation("");

        setHasRestoredSearch(false);

        setIsRecommendationMode(true);

        await fetchJobs(
          recommendationQuery,
          recommendationLocation,
          1,
          true
        );
      } catch (error) {
        console.error(
          "Failed to restore recommendations:",
          error
        );
      }
    };

  // =========================================================
  // CHECK IF JOB IS SAVED
  // =========================================================

  const isJobSaved = (job) => {
    return savedJobs.some(
      (savedJob) => {
        const sameUrl =
          savedJob?.url &&
          job?.url &&
          savedJob.url === job.url;

        const sameExternalId =
          savedJob?.externalId &&
          job?.externalId &&
          savedJob.externalId ===
            job.externalId &&
          savedJob.source === job.source;

        const sameTitleCompany =
          savedJob?.title === job?.title &&
          savedJob?.company ===
            job?.company;

        return (
          sameUrl ||
          sameExternalId ||
          sameTitleCompany
        );
      }
    );
  };

  // =========================================================
  // JOB MATCH HELPER
  // =========================================================

  const isSameJob = (
    firstJob,
    secondJob
  ) => {
    if (!firstJob || !secondJob) {
      return false;
    }

    const sameUrl =
      firstJob.url &&
      secondJob.url &&
      firstJob.url === secondJob.url;

    const sameExternalId =
      firstJob.externalId &&
      secondJob.externalId &&
      firstJob.externalId ===
        secondJob.externalId &&
      firstJob.source === secondJob.source;

    const sameTitleCompany =
      firstJob.title ===
        secondJob.title &&
      firstJob.company ===
        secondJob.company;

    return (
      sameUrl ||
      sameExternalId ||
      sameTitleCompany
    );
  };

  // =========================================================
  // SAVE / UNSAVE
  // =========================================================

  const handleSaveToggle = async (
    rawJob
  ) => {
    const job = normalizeJob(
      rawJob
    );

    const jobKey =
      job.id ||
      `${job.source}-${job.externalId}-${job.title}`;

    if (savingJob === jobKey) {
      return;
    }

    try {
      setSavingJob(jobKey);
      setError("");

      const currentlySaved =
        isJobSaved(job);

      // -----------------------------------------------------
      // UNSAVE
      // -----------------------------------------------------

      if (currentlySaved) {
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
          const alreadyExists =
            previous.some(
              (existingJob) =>
                isSameJob(
                  existingJob,
                  savedJob
                )
            );

          if (alreadyExists) {
            return previous;
          }

          return [
            ...previous,
            savedJob,
          ];
        }
      );
    } catch (error) {
      console.error(
        "Save job action failed:",
        error
      );

      setError(
        error?.response?.data?.message ||
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
      loading ||
      requestedPage < 1 ||
      !query.trim()
    ) {
      return;
    }

    await fetchJobs(
      query.trim(),
      location.trim(),
      requestedPage,
      isRecommendationMode
    );
  };

  const handleNextPage = () => {
    if (
      !hasNextPage ||
      loading
    ) {
      return;
    }

    loadPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (
      !hasPreviousPage ||
      loading
    ) {
      return;
    }

    loadPage(page - 1);
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return null;
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return null;
    }

    return parsedDate.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // SOURCE LABEL
  // =========================================================

  const getSourceLabel = (
    source
  ) => {
    if (!source) {
      return "Job Source";
    }

    if (source === "adzuna") {
      return "Adzuna";
    }

    if (source === "muse") {
      return "The Muse";
    }

    return source;
  };

  // =========================================================
  // DISPLAY SKILLS
  // =========================================================

  const visibleSkills =
    useMemo(() => {
      return recommendedSkills.slice(
        0,
        8
      );
    }, [recommendedSkills]);

  // =========================================================
  // INITIAL LOADING
  // =========================================================

  if (
    loadingProfile ||
    loadingSavedJobs
  ) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] text-slate-900">

        {/* Hero skeleton */}

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

            <div className="animate-pulse">

              <div className="h-6 w-40 rounded-full bg-slate-200" />

              <div className="mt-6 h-12 max-w-2xl rounded-xl bg-slate-200" />

              <div className="mt-4 h-5 max-w-xl rounded bg-slate-200" />

              <div className="mt-8 h-16 rounded-2xl bg-slate-200" />

            </div>

          </div>
        </section>

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex items-center justify-center py-20">

            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">

              <Loader2
                size={20}
                className="animate-spin text-blue-600"
              />

              Preparing your job recommendations...

            </div>

          </div>

        </main>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-14 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">

          {/* Badge */}

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">

            <Sparkles size={14} />

            {isRecommendationMode
              ? "Personalized job recommendations"
              : "Smart job discovery"}

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

              {isRecommendationMode
                ? "We found opportunities based on the skills in your profile."
                : "Discover real opportunities from multiple job sources, all in one place."}

            </p>

          </div>

          {/* =================================================
              RECOMMENDED SKILLS
          ================================================== */}

          {isRecommendationMode &&
            visibleSkills.length > 0 && (
              <div className="mt-6">

                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">

                  <Target
                    size={14}
                    className="text-blue-600"
                  />

                  Based on your skills

                </div>

                <div className="flex flex-wrap gap-2">

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

          <form
            onSubmit={handleSearch}
            className="mt-9 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_15px_50px_-20px_rgba(15,23,42,0.25)]"
          >

            <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_auto]">

              {/* Query */}

              <div className="relative">

                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(
                      e.target.value
                    );

                    // Typing manually means
                    // user is preparing a new search.

                    if (
                      e.target.value.trim()
                    ) {
                      setIsRecommendationMode(
                        false
                      );
                    }
                  }}
                  placeholder="Job title, skills, or keywords"
                  className="h-14 w-full rounded-xl border-0 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Location */}

              <div className="relative">

                <MapPin
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                  placeholder="Location or remote"
                  className="h-14 w-full rounded-xl border-0 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />

              </div>

              {/* Button */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />

                    Searching
                  </>
                ) : (
                  <>
                    <Search size={19} />

                    Search Jobs
                  </>
                )}

              </button>

            </div>

          </form>

          {/* =================================================
              BACK TO RECOMMENDATIONS
          ================================================== */}

          {!isRecommendationMode &&
            recommendedSkills.length >
              0 && (
              <button
                type="button"
                onClick={
                  handleBackToRecommendations
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
              >

                <Sparkles size={14} />

                Back to recommendations

              </button>
            )}

          {/* =================================================
              SOURCE INDICATORS
          ================================================== */}

          <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500">

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
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">

            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>

              <p className="font-bold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm text-red-600">
                {error}
              </p>

            </div>

          </div>
        )}

        {/* ===================================================
            LOADING
        ==================================================== */}

        {loading && (
          <div className="space-y-4">

            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                >

                  <div className="flex gap-4">

                    <div className="h-12 w-12 rounded-xl bg-slate-200" />

                    <div className="flex-1">

                      <div className="h-5 w-2/3 rounded bg-slate-200" />

                      <div className="mt-3 h-4 w-1/3 rounded bg-slate-200" />

                    </div>

                  </div>

                  <div className="mt-6 h-4 w-full rounded bg-slate-200" />

                  <div className="mt-3 h-4 w-4/5 rounded bg-slate-200" />

                </div>
              )
            )}

          </div>
        )}

        {/* ===================================================
            EMPTY
        ==================================================== */}

        {!loading &&
          jobs.length === 0 &&
          !error && (
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

              <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

              <div className="relative">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                  <BriefcaseBusiness size={30} />

                </div>

                <h2 className="mt-6 text-2xl font-bold text-slate-900">

                  {recommendedSkills.length >
                  0
                    ? "No matching jobs found"
                    : "Complete your profile to get recommendations"}

                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">

                  {recommendedSkills.length >
                  0
                    ? "We couldn't find opportunities matching your profile skills right now. Try another search."
                    : "Add your skills to your profile and we'll automatically find relevant opportunities for you."}

                </p>

              </div>

            </div>
          )}

        {/* ===================================================
            RESULTS
        ==================================================== */}

        {!loading &&
          jobs.length > 0 && (
            <>

              {/* Results header */}

              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-emerald-500" />

                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">

                      {isRecommendationMode
                        ? "Recommended for you"
                        : "Live opportunities"}

                    </span>

                  </div>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">

                    {isRecommendationMode
                      ? "Jobs matched to your skills"
                      : "Job opportunities"}

                  </h2>

                  <p className="mt-1 text-sm text-slate-500">

                    Showing{" "}
                    {jobs.length}{" "}
                    opportunities

                    {!isRecommendationMode &&
                      query &&
                      ` for "${query}"`}

                  </p>

                </div>

                <div className="flex items-center gap-2">

                  {isRecommendationMode && (
                    <div className="hidden items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-2.5 text-xs font-semibold text-blue-700 sm:flex">

                      <Sparkles size={14} />

                      Personalized for you

                    </div>
                  )}

                  {!isRecommendationMode && (
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm">

                      Page {page}

                    </div>
                  )}

                </div>

              </div>

              {/* =================================================
                  JOB CARDS
              ================================================== */}

              <div className="space-y-4">

                {jobs.map(
                  (rawJob) => {
                    const job =
                      normalizeJob(
                        rawJob
                      );

                    const postedDate =
                      formatDate(
                        job.postedAt
                      );

                    const jobKey =
                      job.id ||
                      `${job.source}-${job.externalId}-${job.title}`;

                    const saved =
                      isJobSaved(job);

                    const isSaving =
                      savingJob ===
                      jobKey;

                    return (
                      <article
                        key={jobKey}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_15px_40px_-20px_rgba(37,99,235,0.35)] sm:p-6"
                      >

                        <div className="flex flex-col gap-5">

                          {/* Top */}

                          <div className="flex flex-col justify-between gap-4 sm:flex-row">

                            <div className="flex min-w-0 gap-4">

                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100">

                                <Building2 size={22} />

                              </div>

                              <div className="min-w-0">

                                <h3 className="line-clamp-2 text-lg font-bold leading-6 text-slate-900 transition group-hover:text-blue-600">

                                  {job.title ||
                                    "Untitled Job"}

                                </h3>

                                <p className="mt-1.5 text-sm font-semibold text-slate-600">

                                  {job.company ||
                                    "Company not specified"}

                                </p>

                              </div>

                            </div>

                            {/* Source + Save */}

                            <div className="flex shrink-0 items-center gap-2 self-start">

                              {job.source && (
                                <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold capitalize text-blue-700">

                                  {getSourceLabel(
                                    job.source
                                  )}

                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveToggle(
                                    job
                                  )
                                }
                                disabled={
                                  isSaving
                                }
                                aria-label={
                                  saved
                                    ? "Remove saved job"
                                    : "Save job"
                                }
                                className={`inline-flex h-9 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition ${
                                  saved
                                    ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                              >

                                {isSaving ? (
                                  <Loader2
                                    size={
                                      15
                                    }
                                    className="animate-spin"
                                  />
                                ) : saved ? (
                                  <BookmarkCheck
                                    size={
                                      15
                                    }
                                  />
                                ) : (
                                  <Bookmark
                                    size={
                                      15
                                    }
                                  />
                                )}

                                {saved
                                  ? "Saved"
                                  : "Save"}

                              </button>

                            </div>

                          </div>

                          {/* Meta */}

                          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">

                            {job.location && (
                              <div className="flex items-center gap-1.5">

                                <MapPin
                                  size={16}
                                  className="text-slate-400"
                                />

                                <span>
                                  {
                                    job.location
                                  }
                                </span>

                              </div>
                            )}

                            {job.contractType && (
                              <div className="flex items-center gap-1.5">

                                <BriefcaseBusiness
                                  size={
                                    16
                                  }
                                  className="text-slate-400"
                                />

                                <span className="capitalize">

                                  {
                                    job.contractType
                                  }

                                </span>

                              </div>
                            )}

                            {job.salaryMin !=
                              null &&
                              job.salaryMax !=
                                null && (
                                <div className="flex items-center gap-1.5">

                                  <DollarSign
                                    size={
                                      16
                                    }
                                    className="text-slate-400"
                                  />

                                  <span>

                                    {Number(
                                      job.salaryMin
                                    ).toLocaleString()}

                                    {" - "}

                                    {Number(
                                      job.salaryMax
                                    ).toLocaleString()}

                                  </span>

                                </div>
                              )}

                            {postedDate && (
                              <div className="flex items-center gap-1.5">

                                <Clock3
                                  size={
                                    16
                                  }
                                  className="text-slate-400"
                                />

                                <span>
                                  {
                                    postedDate
                                  }
                                </span>

                              </div>
                            )}

                          </div>

                          {/* Description */}

                          {job.description && (
                            <p className="line-clamp-3 max-w-5xl text-sm leading-6 text-slate-600">

                              {
                                job.description
                              }

                            </p>
                          )}

                          {/* Bottom */}

                          <div className="flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">

                            <div className="flex items-center gap-2 text-xs text-slate-400">

                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                              {isRecommendationMode
                                ? "Matched with your profile"
                                : "Real job opportunity"}

                            </div>

                            {job.url && (
                              <a
                                href={
                                  job.url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
                              >

                                View Job

                                <ExternalLink
                                  size={
                                    16
                                  }
                                />

                              </a>
                            )}

                          </div>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>

              {/* =================================================
                  PAGINATION
              ================================================== */}

              {!isRecommendationMode && (
                <div className="mt-8 flex items-center justify-center gap-3">

                  <button
                    type="button"
                    onClick={
                      handlePreviousPage
                    }
                    disabled={
                      !hasPreviousPage ||
                      loading
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    <ChevronLeft
                      size={17}
                    />

                    Previous

                  </button>

                  <div className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-black text-white shadow-sm">

                    {page}

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleNextPage
                    }
                    disabled={
                      !hasNextPage ||
                      loading
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >

                    Next

                    <ChevronRight
                      size={17}
                    />

                  </button>

                </div>
              )}

            </>
          )}

      </main>
    </div>
  );
}

export default JobsPage;