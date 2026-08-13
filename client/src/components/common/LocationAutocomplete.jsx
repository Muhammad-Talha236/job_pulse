import { useState, useRef, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useLocationAutocomplete } from "../../hooks/useLocationAutocomplete";

export default function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "City, state, or country",
  id,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { suggestions, loading, error } = useLocationAutocomplete(value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (suggestion) => {
    onChange(suggestion.value);
    onSelect?.(suggestion.data || null);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <MapPin size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            onSelect?.(null);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 pl-10 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {open && value.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-64 overflow-auto rounded-2xl border border-slate-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.3)]">
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
              <Loader2 size={15} className="animate-spin" /> Searching locations...
            </div>
          )}
          {!loading && error && <div className="px-4 py-3 text-sm text-red-500">{error}</div>}
          {!loading && !error && suggestions.length === 0 && (
            <div className="px-4 py-3 text-sm text-slate-400">No matching locations found</div>
          )}
          {!loading &&
            suggestions.map((suggestion) => (
              <button
                key={suggestion.value}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault();
                  handleSelect(suggestion);
                }}
                className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-blue-50"
              >
                <MapPin size={16} className="mt-0.5 text-blue-600" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">{suggestion.value}</p>
                  {suggestion.meta && <p className="mt-0.5 truncate text-xs text-slate-400">{suggestion.meta}</p>}
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}