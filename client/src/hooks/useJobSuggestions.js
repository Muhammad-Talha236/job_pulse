import { useEffect, useState } from "react";

import {
  getJobSuggestions,
} from "../api/jobDiscoveryApi";

const DEBOUNCE_MS = 350;

export function useJobSuggestions({
  query,
  location,
  enabled = true,
}) {
  const [
    skillSuggestions,
    setSkillSuggestions,
  ] = useState([]);

  const [
    locationSuggestions,
    setLocationSuggestions,
  ] = useState([]);

  const [
    loadingSkills,
    setLoadingSkills,
  ] = useState(false);

  const [
    loadingLocations,
    setLoadingLocations,
  ] = useState(false);

  // =========================================================
  // SKILL / JOB TITLE SUGGESTIONS
  // =========================================================

  useEffect(() => {
    if (
      !enabled ||
      query.trim().length < 2
    ) {
      setSkillSuggestions([]);
      return;
    }

    let active = true;

    const timer = setTimeout(
      async () => {
        try {
          setLoadingSkills(true);

          const data =
            await getJobSuggestions(
              "skill",
              query
            );

          if (!active) return;

          setSkillSuggestions(
            Array.isArray(
              data?.suggestions
            )
              ? data.suggestions
              : []
          );
        } catch (error) {
          console.error(
            "Skill suggestions failed:",
            error
          );

          if (active) {
            setSkillSuggestions([]);
          }
        } finally {
          if (active) {
            setLoadingSkills(false);
          }
        }
      },
      DEBOUNCE_MS
    );

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, enabled]);

  // =========================================================
  // LOCATION SUGGESTIONS
  // =========================================================

  useEffect(() => {
    if (
      !enabled ||
      location.trim().length < 2
    ) {
      setLocationSuggestions([]);
      return;
    }

    let active = true;

    const timer = setTimeout(
      async () => {
        try {
          setLoadingLocations(true);

          const data =
            await getJobSuggestions(
              "location",
              location
            );

          if (!active) return;

          setLocationSuggestions(
            Array.isArray(
              data?.suggestions
            )
              ? data.suggestions
              : []
          );
        } catch (error) {
          console.error(
            "Location suggestions failed:",
            error
          );

          if (active) {
            setLocationSuggestions(
              []
            );
          }
        } finally {
          if (active) {
            setLoadingLocations(
              false
            );
          }
        }
      },
      DEBOUNCE_MS
    );

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [location, enabled]);

  return {
    skillSuggestions,
    locationSuggestions,
    loadingSkills,
    loadingLocations,
  };
}