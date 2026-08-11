import { useState } from "react";
import {
  Search,
  MapPin,
  Building2,
  BriefcaseBusiness,
  ExternalLink,
  Clock,
  DollarSign,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { searchJobs } from "../api/jobDiscoveryApi";

function JobsPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [hasResults, setHasResults] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a job title or skill.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Start a new search from page 1
      const currentPage = 1;

      const data = await searchJobs(
        query.trim(),
        location.trim(),
        currentPage
      );

      setJobs(data.jobs || []);
      setPage(currentPage);
      setHasResults(data.hasResults ?? false);
    } catch (error) {
      console.error("Job search failed:", error);

      setJobs([]);
      setHasResults(false);

      setError(
        error.response?.data?.message ||
          "Unable to fetch jobs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = async () => {
    if (!query.trim() || loading) {
      return;
    }

    const nextPage = page + 1;

    try {
      setLoading(true);
      setError("");

      const data = await searchJobs(
        query.trim(),
        location.trim(),
        nextPage
      );

      const newJobs = data.jobs || [];

      if (newJobs.length === 0) {
        setHasResults(false);
        return;
      }

      setJobs(newJobs);
      setPage(nextPage);
      setHasResults(data.hasResults ?? true);
    } catch (error) {
      console.error("Next page search failed:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load more jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = async () => {
    if (page <= 1 || loading) {
      return;
    }

    const previousPage = page - 1;

    try {
      setLoading(true);
      setError("");

      const data = await searchJobs(
        query.trim(),
        location.trim(),
        previousPage
      );

      setJobs(data.jobs || []);
      setPage(previousPage);
      setHasResults(data.hasResults ?? false);
    } catch (error) {
      console.error(
        "Previous page search failed:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load previous jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Find your next opportunity
            </h1>

            <p className="mt-2 text-slate-600">
              Search real jobs from multiple job sources.
            </p>
          </div>

          {/* =================================================
              SEARCH FORM
          ================================================== */}
          <form
            onSubmit={handleSearch}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm"
          >
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              {/* Job Search */}
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Job title, skills, or keywords"
                  value={query}
                  onChange={(e) =>
                    setQuery(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Location */}
              <div className="relative">
                <MapPin
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Search Jobs
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================
            ERROR
        ================================================== */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Search failed
              </p>

              <p className="mt-1 text-sm">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            LOADING
        ================================================== */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <Loader2
                size={32}
                className="animate-spin text-blue-600"
              />

              <p className="text-sm">
                Searching real job opportunities...
              </p>
            </div>
          </div>
        )}

        {/* =================================================
            EMPTY STATE
        ================================================== */}
        {!loading &&
          jobs.length === 0 &&
          !error && (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BriefcaseBusiness size={26} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                Discover your next opportunity
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Search for a job title, technology, or skill
                to find real job opportunities.
              </p>
            </div>
          )}

        {/* =================================================
            RESULTS
        ================================================== */}
        {!loading && jobs.length > 0 && (
          <>
            {/* Results Header */}
            <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Job opportunities
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Found {jobs.length} opportunities
                  {query && ` for "${query}"`}
                </p>
              </div>

              {/* Current Page */}
              <div className="text-sm font-medium text-slate-500">
                Page {page}
              </div>
            </div>

            {/* =================================================
                JOB CARDS
            ================================================== */}
            <div className="grid gap-5">
              {jobs.map((job) => (
                <article
                  key={`${job.source}-${job.externalId}`}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-col gap-5">
                    {/* TOP SECTION */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                      <div className="flex gap-4">
                        {/* Company Icon */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Building2 size={22} />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-900 transition group-hover:text-blue-600">
                            {job.title}
                          </h3>

                          <p className="mt-1 text-sm font-medium text-slate-600">
                            {job.company ||
                              "Company not specified"}
                          </p>
                        </div>
                      </div>

                      {/* Source */}
                      {job.source && (
                        <span className="h-fit w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
                          {job.source}
                        </span>
                      )}
                    </div>

                    {/* JOB META */}
                    <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
                      {/* Location */}
                      {job.location && (
                        <div className="flex items-center gap-1.5">
                          <MapPin size={16} />

                          <span>
                            {job.location}
                          </span>
                        </div>
                      )}

                      {/* Contract Type */}
                      {job.contractType && (
                        <div className="flex items-center gap-1.5">
                          <BriefcaseBusiness size={16} />

                          <span>
                            {job.contractType}
                          </span>
                        </div>
                      )}

                      {/* Salary */}
                      {job.salaryMin != null &&
                        job.salaryMax != null && (
                          <div className="flex items-center gap-1.5">
                            <DollarSign size={16} />

                            <span>
                              {Number(
                                job.salaryMin
                              ).toLocaleString()}{" "}
                              -{" "}
                              {Number(
                                job.salaryMax
                              ).toLocaleString()}
                            </span>
                          </div>
                        )}

                      {/* Posted Date */}
                      {job.postedAt && (
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />

                          <span>
                            {new Date(
                              job.postedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    {job.description && (
                      <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                        {job.description}
                      </p>
                    )}

                    {/* BOTTOM */}
                    <div className="flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
                      <p className="text-xs text-slate-400">
                        Real job opportunity
                      </p>

                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          View Job

                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* =================================================
                PAGINATION
            ================================================== */}
            <div className="mt-8 flex items-center justify-center gap-3">
              {/* Previous */}
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={page === 1 || loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />

                Previous
              </button>

              {/* Page Number */}
              <div className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-blue-600 px-3 text-sm font-bold text-white">
                {page}
              </div>

              {/* Next */}
              <button
                type="button"
                onClick={handleNextPage}
                disabled={!hasResults || loading}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next

                <ChevronRight size={17} />
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default JobsPage;