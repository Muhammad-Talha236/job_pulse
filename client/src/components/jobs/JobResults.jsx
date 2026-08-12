import {
  AlertCircle,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Database,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import JobCard from "./JobCard";

export default function JobResults({
  jobs,
  loading,
  error,
  isRecommendationMode,
  query,
  page,
  hasNextPage,
  hasPreviousPage,
  savedJobs,
  savingJob,
  onSaveToggle,
  onNextPage,
  onPreviousPage,
  hasProfileSkills,
  onRetry,
}) {
  const isSaved = (job) =>
    savedJobs.some((savedJob) => {
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
        savedJob?.title ===
          job?.title &&
        savedJob?.company ===
          job?.company;

      return (
        sameUrl ||
        sameExternalId ||
        sameTitleCompany
      );
    });

  // =========================================================
  // ERROR
  // =========================================================
  //
  // Includes a "Try again" button so a network hiccup or a
  // dead backend doesn't force the user to retype their
  // search or refresh the whole page.

  if (error) {
    return (
      <div
        role="alert"
        className="mb-6 flex flex-col items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-3">
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

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100"
          >
            <RotateCcw size={15} />
            Try again
          </button>
        )}
      </div>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================
  //
  // Six skeleton cards instead of three — closer to what a
  // real page of results actually looks like, so the loading
  // state doesn't read as a stripped-down placeholder.

  if (loading) {
    return (
      <div
        className="space-y-4"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">
          Loading jobs…
        </span>

        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex gap-4">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-slate-200" />

                <div className="min-w-0 flex-1">
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
    );
  }

  // =========================================================
  // EMPTY
  // =========================================================

  if (jobs.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
        <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 max-w-full -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <BriefcaseBusiness
              size={30}
            />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900">
            {isRecommendationMode
              ? "No matching jobs found"
              : query
                ? `No jobs found for "${query}"`
                : hasProfileSkills
                  ? "Your recommended jobs will appear here"
                  : "Complete your profile to get recommendations"}
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            {isRecommendationMode
              ? "We couldn't find relevant opportunities for your profile right now."
              : query
                ? "Try a real job title, skill, technology, or role and we'll only show relevant opportunities."
                : "Add your skills to your profile and we'll automatically look for matching opportunities."}
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // RESULTS
  // =========================================================

  return (
    <>
      <div className="mb-6 flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
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
            Showing {jobs.length} opportunities

            {!isRecommendationMode &&
            query
              ? ` for "${query}"`
              : ""}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isRecommendationMode ? (
            <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-2.5 text-xs font-semibold text-blue-700">
              <Sparkles size={14} />

              Personalized for you
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm">
              <Database size={14} />

              Page {page}
            </div>
          )}
        </div>
      </div>

      {/* JOB CARDS */}

      <div className="w-full min-w-0 space-y-4">
        {jobs.map((job) => {
          const jobKey =
            job.id ||
            `${job.source}-${job.externalId}-${job.title}`;

          return (
            <JobCard
              key={jobKey}
              job={job}
              saved={isSaved(job)}
              saving={
                savingJob === jobKey
              }
              recommendation={
                isRecommendationMode
              }
              onSaveToggle={
                onSaveToggle
              }
            />
          );
        })}
      </div>

      {/* PAGINATION */}

      {!isRecommendationMode && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={
              onPreviousPage
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
            onClick={onNextPage}
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
  );
}