import { useState, useCallback } from "react";
import type { Page, Memory, Person, Place, Birthday, JournalEntry } from "../types";
import { BACKEND_URL } from "../utils/constants";

export function usePageData() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPageData = useCallback(async (page: Page) => {
    if (page === "chat" || page === "settings" || page === "help") {
      return; // No data to fetch for these pages
    }

    if (page === "journals") {
      // Populate with local dummy data for now
      setJournals([
        {
          id: 1,
          title: "Morning clarity",
          mood: "Reflective",
          content: "Woke up early, took a long walk, and finally sketched the trip idea.",
          created_at: "2025-12-01 07:45",
        },
        {
          id: 2,
          title: "Small win",
          mood: "Upbeat",
          content: "Wrapped the feature refactor without breaking tests. Celebrated with coffee.",
          created_at: "2025-11-30 18:10",
        },
        {
          id: 3,
          title: "Quiet evening",
          mood: "Calm",
          content: "Read two chapters of the new book and noted quotes to revisit tomorrow.",
          created_at: "2025-11-29 21:05",
        },
      ]);
      return;
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

  const addJournalEntry = useCallback(() => {
    setJournals((prev) => {
      const nextId = (prev[prev.length - 1]?.id ?? 0) + 1;
      const now = new Date();
      const created_at = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
        now.getDate()
      ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      return [
        {
          id: nextId,
          title: "New note",
          mood: "Draft",
          content: "Jot something meaningful here...",
          created_at,
        },
        ...prev,
      ];
    });
  }, []);

  return {
    memories,
    people,
    places,
    birthdays,
    journals,
    isLoading,
    fetchPageData,
    addJournalEntry,
  };
}
