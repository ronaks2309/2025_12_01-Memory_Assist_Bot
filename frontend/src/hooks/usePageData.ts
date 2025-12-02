import { useState, useCallback } from "react";
import type { Page, Memory, Person, Place, Birthday } from "../types";
import { BACKEND_URL } from "../utils/constants";

export function usePageData() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPageData = useCallback(async (page: Page) => {
    if (page === "chat" || page === "settings" || page === "help") {
      return; // No data to fetch for these pages
    }

    setIsLoading(true);
    try {
      let endpoint = "";
      switch (page) {
        case "memories":
          endpoint = "/memories";
          break;
        // history removed
        case "people":
          endpoint = "/people";
          break;
        case "places":
          endpoint = "/places";
          break;
        case "birthdays":
          endpoint = "/birthdays";
          break;
      }

      if (!endpoint) return;

      const res = await fetch(`${BACKEND_URL}${endpoint}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      switch (page) {
        case "memories":
          setMemories(data.memories);
          break;
        // history removed
        case "people":
          setPeople(data.people);
          break;
        case "places":
          setPlaces(data.places);
          break;
        case "birthdays":
          setBirthdays(data.birthdays);
          break;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error fetching page data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    memories,
    people,
    places,
    birthdays,
    isLoading,
    fetchPageData,
  };
}
