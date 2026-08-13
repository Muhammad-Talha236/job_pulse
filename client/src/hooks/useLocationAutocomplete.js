import { useEffect, useState } from "react";
import { getJobSuggestions } from "../api/jobDiscoveryApi";

const DEBOUNCE_MS = 350;
const MIN_QUERY_LENGTH = 2;

export function useLocationAutocomplete(query) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query || query.trim().length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setError("");
      return;
    }

    let active = true;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getJobSuggestions("location", query);
        if (!active) return;
        setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
      } catch (requestError) {
        if (!active) return;
        console.error("Location autocomplete failed:", requestError);
        setError("Couldn't load location suggestions.");
        setSuggestions([]);
      } finally {
        if (active) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  return { suggestions, loading, error };
}