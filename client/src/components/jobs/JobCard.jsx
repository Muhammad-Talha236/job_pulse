import {
  MapPin,
  Building2,
  BriefcaseBusiness,
  ExternalLink,
  Clock3,
  DollarSign,
  Loader2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

import {
  formatJobDate,
  getJobKey,
  getSourceLabel,
} from "../../utils/jobUtils";

export default function JobCard({
  job,
  saved,
  saving,
  recommendation,
  onSaveToggle,
}) {
  const postedDate =
    formatJobDate(job.postedAt);

  const jobKey = getJobKey(job);

  return (
    <article className="group w-full min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_15px_40px_-20px_rgba(37,99,235,0.35)] sm:p-6">
      <div className="flex min-w-0 flex-col gap-5">
        {/* TOP */}

        <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row">
          <div className="flex min-w-0 gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 ring-1 ring-blue-100">
              <Building2 size={22} />
            </div>

            <div className="min-w-0">
              <h3 className="line-clamp-2 break-words text-lg font-bold leading-6 text-slate-900 transition group-hover:text-blue-600">
                {job.title ||
                  "Untitled Job"}
              </h3>

              <p className="mt-1.5 truncate text-sm font-semibold text-slate-600">
                {job.company ||
                  "Company not specified"}
              </p>
            </div>
          </div>

          {/* SOURCE + SAVE */}

          <div className="flex shrink-0 flex-wrap items-center gap-2 self-start">
            {job.source && (
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                {getSourceLabel(
                  job.source
                )}
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                onSaveToggle(job)
              }
              disabled={saving}
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
              {saving ? (
                <Loader2
                  size={15}
                  className="animate-spin"
                />
              ) : saved ? (
                <BookmarkCheck
                  size={15}
                />
              ) : (
                <Bookmark size={15} />
              )}

              {saved
                ? "Saved"
                : "Save"}
            </button>
          </div>
        </div>

        {/* META */}

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
          {job.location && (
            <div className="flex min-w-0 items-center gap-1.5">
              <MapPin
                size={16}
                className="shrink-0 text-slate-400"
              />

              <span className="break-words">
                {job.location}
              </span>
            </div>
          )}

          {job.contractType && (
            <div className="flex items-center gap-1.5">
              <BriefcaseBusiness
                size={16}
                className="shrink-0 text-slate-400"
              />

              <span className="capitalize">
                {job.contractType}
              </span>
            </div>
          )}

          {job.salaryMin != null &&
            job.salaryMax != null && (
              <div className="flex items-center gap-1.5">
                <DollarSign
                  size={16}
                  className="shrink-0 text-slate-400"
                />

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

          {postedDate && (
            <div className="flex items-center gap-1.5">
              <Clock3
                size={16}
                className="shrink-0 text-slate-400"
              />

              <span>
                {postedDate}
              </span>
            </div>
          )}
        </div>

        {/* DESCRIPTION */}

        {job.description && (
          <p className="line-clamp-3 max-w-5xl break-words text-sm leading-6 text-slate-600">
            {job.description}
          </p>
        )}

        {/* BOTTOM */}

        <div className="flex min-w-0 flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />

            {recommendation
              ? "Matched with your profile"
              : "Real job opportunity"}
          </div>

          {job.url && (
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              View Job

              <ExternalLink
                size={16}
              />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}