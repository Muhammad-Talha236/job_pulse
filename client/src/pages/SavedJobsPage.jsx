import { useEffect, useState } from "react";
import {
  BookmarkCheck,
  Building2,
  MapPin,
  BriefcaseBusiness,
  ExternalLink,
  Clock3,
  Loader2,
  AlertCircle,
  Trash2,
  ArrowLeft,
  Search,
} from "lucide-react";

import { getSavedJobs, unsaveJob } from "../api/jobsApi";

function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingJob, setRemovingJob] = useState(null);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD SAVED JOBS
  // =========================================================

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSavedJobs();

        setSavedJobs(data.jobs || data.savedJobs || []);
      } catch (error) {
        console.error("Failed to load saved jobs:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your saved jobs. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();
  }, []);

  // =========================================================
  // REMOVE SAVED JOB
  // =========================================================

  const handleRemoveJob = async (job) => {
    const jobKey = `${job.id || ""}-${job.url || job.title}`;

    if (removingJob === jobKey) return;

    try {
      setRemovingJob(jobKey);
      setError("");

      await unsaveJob(job);

      setSavedJobs((previousJobs) =>
        previousJobs.filter(
          (savedJob) =>
            !(
              savedJob.title === job.title &&
              savedJob.company === job.company &&
              (savedJob.url || "") === (job.url || "")
            )
        )
      );
    } catch (error) {
      console.error("Failed to remove saved job:", error);

      setError(
        error.response?.data?.message ||
          "Unable to remove this saved job."
      );
    } finally {
      setRemovingJob(null);
    }
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // =========================================================
  // SOURCE LABEL
  // =========================================================

  const getSourceLabel = (source) => {
    if (!source) return "Job Source";

    return source === "adzuna"
      ? "Adzuna"
      : source === "muse"
        ? "The Muse"
        : source;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-56 rounded-lg bg-slate-200" />
            <div className="mt-3 h-5 w-80 rounded bg-slate-200" />
          </div>

          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="flex gap-4">
                  <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

                  <div className="flex-1">
                    <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>

                <div className="mt-6 h-4 w-full animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">

        {/* Background decorations */}

        <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-indigo-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">

          {/* Back */}

          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />

            Back
          </button>

          {/* Heading */}

          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">

            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700">
                <BookmarkCheck size={14} />

                Your collection
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                Saved Jobs
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                Keep track of the opportunities you want to
                explore later.
              </p>
            </div>

            {/* Count */}

            <div className="flex h-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookmarkCheck size={18} />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Saved opportunities
                </p>

                <p className="text-lg font-black text-slate-900">
                  {savedJobs.length}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* Error */}

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

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {!error && savedJobs.length === 0 && (
          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

            <div className="relative">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BookmarkCheck size={30} />
              </div>

              <h2 className="mt-6 text-2xl font-bold text-slate-900">
                No saved jobs yet
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                When you find an opportunity you like,
                save it and it will appear here.
              </p>

              <button
                type="button"
                onClick={() => window.history.back()}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
              >
                <Search size={17} />

                Find Jobs
              </button>

            </div>
          </div>
        )}

        {/* =================================================
            SAVED JOBS
        ================================================== */}

        {savedJobs.length > 0 && (
          <>

            {/* Results header */}

            <div className="mb-6 flex items-center justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                    Saved opportunities
                  </span>
                </div>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Your saved jobs
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {savedJobs.length}{" "}
                  {savedJobs.length === 1
                    ? "opportunity"
                    : "opportunities"}{" "}
                  saved
                </p>
              </div>

            </div>

            {/* Job cards */}

            <div className="space-y-4">

              {savedJobs.map((job) => {

                const postedDate =
                  formatDate(
                    job.postedAt ||
                      job.posted_at ||
                      job.created_at
                  );

                const jobKey =
                  `${job.id || ""}-${job.url || job.title}`;

                const isRemoving =
                  removingJob === jobKey;

                return (
                  <article
                    key={
                      job.id ||
                      `${job.title}-${job.company}-${job.url}`
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_15px_40px_-20px_rgba(37,99,235,0.35)] sm:p-6"
                  >

                    <div className="flex flex-col gap-5">

                      {/* Top */}

                      <div className="flex flex-col justify-between gap-4 sm:flex-row">

                        <div className="flex min-w-0 gap-4">

                          {/* Company icon */}

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100">
                            <Building2 size={22} />
                          </div>

                          <div className="min-w-0">

                            <h3 className="line-clamp-2 text-lg font-bold leading-6 text-slate-900 transition group-hover:text-blue-600">
                              {job.title || "Untitled Job"}
                            </h3>

                            <p className="mt-1.5 text-sm font-semibold text-slate-600">
                              {job.company || "Company not specified"}
                            </p>

                          </div>

                        </div>

                        {/* Source + Remove */}

                        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start">

                          {job.source && (
                            <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold capitalize text-blue-700">
                              {getSourceLabel(job.source)}
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveJob(job)
                            }
                            disabled={isRemoving}
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-red-100 bg-white px-3 text-xs font-bold text-red-600 transition hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >

                            {isRemoving ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={15} />
                            )}

                            Remove

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
                              {job.location}
                            </span>
                          </div>
                        )}

                        {(job.job_type ||
                          job.contractType) && (
                          <div className="flex items-center gap-1.5">
                            <BriefcaseBusiness
                              size={16}
                              className="text-slate-400"
                            />

                            <span className="capitalize">
                              {job.job_type ||
                                job.contractType}
                            </span>
                          </div>
                        )}

                        {postedDate && (
                          <div className="flex items-center gap-1.5">
                            <Clock3
                              size={16}
                              className="text-slate-400"
                            />

                            <span>
                              {postedDate}
                            </span>
                          </div>
                        )}

                      </div>

                      {/* Description */}

                      {job.description && (
                        <p className="line-clamp-3 max-w-5xl text-sm leading-6 text-slate-600">
                          {job.description}
                        </p>
                      )}

                      {/* Bottom */}

                      <div className="flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">

                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                          <BookmarkCheck size={15} />

                          Saved to your jobs
                        </div>

                        {job.url && (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
                          >
                            View Job

                            <ExternalLink size={16} />
                          </a>
                        )}

                      </div>

                    </div>
                  </article>
                );
              })}

            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default SavedJobsPage;