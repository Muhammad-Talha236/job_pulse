import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Loader2, Sparkles } from "lucide-react";

function SuggestionDropdown({ suggestions, type, loading, onSelect }) {
  if (!loading && suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.3)]">
      {loading && (
        <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
          <Loader2 size={15} className="animate-spin" />
          Finding real {type} suggestions...
        </div>
      )}
      {!loading &&
        suggestions.map((suggestion) => (
          <button
            key={suggestion.value}
            type="button"
            onMouseDown={(event) => {
              event.preventDefault();
              onSelect(suggestion.value);
            }}
            className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-blue-50"
          >
            <div className="mt-0.5 text-blue-600">
              {type === "skill" ? (
                <Sparkles size={16} />
              ) : (
                <MapPin size={16} />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {suggestion.value}
              </p>
              {suggestion.meta && (
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {suggestion.meta}
                </p>
              )}
            </div>
          </button>
        ))}
    </div>
  );
}

export default function JobSearchBar({
  query,
  location,
  loading,
  onQueryChange,
  onLocationChange,
  onSearch,
  skillSuggestions,
  locationSuggestions,
  loadingSkills,
  loadingLocations,
}) {
  const [activeField, setActiveField] = useState(null);
  const containerRef = useRef(null);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <form
      onSubmit={(e) => {
        setActiveField(null);
        onSearch(e);
      }}
      ref={containerRef}
      className="relative z-30 mt-9 w-full max-w-full overflow-visible rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_15px_50px_-20px_rgba(15,23,42,0.25)]"
    >
      <div className="grid min-w-0 gap-2 md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_auto]">
        {/* Query */}
        <div className="relative min-w-0">
          <Search
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onFocus={() => setActiveField("query")}
            onChange={(event) => {
              onQueryChange(event.target.value);
              setActiveField("query");
            }}
            placeholder="Job title, skills, or keywords"
            autoComplete="off"
            className="h-14 w-full min-w-0 rounded-xl border-0 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
          {activeField === "query" && (
            <SuggestionDropdown
              suggestions={skillSuggestions}
              type="skill"
              loading={loadingSkills}
              onSelect={(value) => {
                onQueryChange(value);
                setActiveField(null);
              }}
            />
          )}
        </div>

        {/* Location */}
        <div className="relative min-w-0">
          <MapPin
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={location}
            onFocus={() => setActiveField("location")}
            onChange={(event) => {
              onLocationChange(event.target.value);
              setActiveField("location");
            }}
            placeholder="Location or remote"
            autoComplete="off"
            className="h-14 w-full min-w-0 rounded-xl border-0 bg-slate-50 pl-12 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
          />
          {activeField === "location" && (
            <SuggestionDropdown
              suggestions={locationSuggestions}
              type="location"
              loading={loadingLocations}
              onSelect={(value) => {
                onLocationChange(value);
                setActiveField(null);
              }}
            />
          )}
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-14 items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 size={19} className="animate-spin" />
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
  );
}