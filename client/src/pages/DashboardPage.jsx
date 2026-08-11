import {
  BriefcaseBusiness,
  Bookmark,
  Search,
  TrendingUp,
  ArrowUpRight,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";

function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-10 text-white shadow-xl sm:px-10">
        {/* Decorative Background */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Job Pulse is ready
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find your next
            <span className="text-blue-400"> opportunity.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Discover real opportunities from multiple job sources, save the
            ones you love, and keep your job search organized in one place.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <Search size={17} />
              Find Jobs
              <ArrowUpRight size={16} />
            </a>

            <a
              href="/saved-jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <Bookmark size={17} />
              Saved Jobs
            </a>
          </div>
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={BriefcaseBusiness}
          label="Jobs Discovered"
          value="0"
          description="Across job sources"
        />

        <StatCard
          icon={Bookmark}
          label="Saved Jobs"
          value="0"
          description="Jobs you want to track"
        />

        <StatCard
          icon={Search}
          label="Searches"
          value="0"
          description="Job searches performed"
        />

        <StatCard
          icon={TrendingUp}
          label="Applications"
          value="0"
          description="Applications tracked"
        />
      </section>

      {/* =====================================================
          MAIN GRID
      ====================================================== */}
      <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Recent Searches */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Searches
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest job discovery activity
              </p>
            </div>

            <a
              href="/jobs"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Search
              <ChevronRight size={16} />
            </a>
          </div>

          <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
              <Search size={21} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              No searches yet
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Start searching for jobs and your recent searches will appear
              here.
            </p>

            <a
              href="/jobs"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <Search size={14} />
              Start Searching
            </a>
          </div>
        </div>

        {/* Saved Jobs */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Saved Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Opportunities you've bookmarked
              </p>
            </div>

            <a
              href="/saved-jobs"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </a>
          </div>

          <div className="mt-6 flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
              <Bookmark size={21} />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-800">
              No saved jobs
            </h3>

            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              Save interesting jobs while searching so you can come back to
              them later.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK SEARCH
      ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-slate-900">
            Quick Job Search
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Jump directly into your next search.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <QuickSearch
            title="Frontend Developer"
            icon={BriefcaseBusiness}
          />

          <QuickSearch
            title="React Developer"
            icon={TrendingUp}
          />

          <QuickSearch
            title="MERN Developer"
            icon={Search}
          />

          <QuickSearch
            title="Remote Developer"
            icon={MapPin}
          />
        </div>
      </section>

      {/* =====================================================
          ACTIVITY
      ====================================================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Clock size={19} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Your Activity
            </h2>

            <p className="text-sm text-slate-500">
              Your Job Pulse activity will appear here.
            </p>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <p className="text-sm text-slate-400">
            No activity yet. Start exploring jobs to build your activity
            history.
          </p>
        </div>
      </section>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
          <Icon size={20} />
        </div>

        <ArrowUpRight
          size={17}
          className="text-slate-300 transition group-hover:text-blue-500"
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          {value}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   QUICK SEARCH CARD
========================================================= */

function QuickSearch({ title, icon: Icon }) {
  return (
    <a
      href={`/jobs?query=${encodeURIComponent(title)}`}
      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-200 hover:bg-blue-50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm transition group-hover:text-blue-600">
          <Icon size={17} />
        </div>

        <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">
          {title}
        </span>
      </div>

      <ChevronRight
        size={16}
        className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500"
      />
    </a>
  );
}

export default DashboardPage;