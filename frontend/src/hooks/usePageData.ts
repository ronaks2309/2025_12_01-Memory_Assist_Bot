import { useState, useCallback } from "react";
import type {
  Page,
  Memory,
  Person,
  Place,
  Birthday,
  JournalEntry,
} from "../types";
import { BACKEND_URL, FEED_PAGES } from "../utils/constants";

const PERSON_PROFILES: Record<string, Partial<Person>> = {
  "Sarah Johnson": {
    headline: "Sunrise runner • Family first",
    bio: "Organizes the Sunday walks and keeps the family calendar sane. Planning a trip to Lisbon next spring.",
    age: 35,
    classification: "BFFs",
    avatarColor: "from-rose-500 via-amber-500 to-orange-500",
    preferredContact: { method: "Text", value: "(415) 555-1289", note: "Replies fastest on iMessage" },
    family: ["Ethan (8)", "Lily (4)", "Golden retriever: Milo"],
    likes: ["Beach days", "Matcha lattes", "Morning runs"],
    dislikes: ["Last-minute plans", "Cold calls"],
    recentConversations: [
      { snippet: "Booked the cabin for the long weekend!", time: "2h ago", channel: "SMS" },
      { snippet: "Sent you the kiddo photos 📸", time: "Yesterday", channel: "WhatsApp" },
    ],
    socialLinks: [
      { platform: "Instagram", handle: "@sarah.j", url: "#" },
      { platform: "LinkedIn", handle: "sarah-johnson", url: "#" },
    ],
    feed: [
      { source: "Instagram", title: "Shared a reel: \"Morning surf check\"", time: "1h ago" },
      { source: "Email", title: "Travel booking: Lisbon shortlist", time: "Today" },
    ],
    reel: [
      { title: "Sunset run on the Embarcadero", date: "Aug 2025", mood: "glow", image: "bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500" },
      { title: "Birthday brunch surprise", date: "May 2025", mood: "sweet", image: "bg-gradient-to-br from-amber-400 via-yellow-400 to-lime-400" },
      { title: "Camping under the redwoods", date: "Oct 2024", mood: "calm", image: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500" },
    ],
  },
  "Michael Chen": {
    headline: "Maker of things • Espresso snob",
    bio: "Your build-weekend partner. Loves hackathons, bike rides, and DJing Friday nights.",
    age: 37,
    classification: "Close Friend",
    avatarColor: "from-blue-500 via-indigo-500 to-purple-500",
    preferredContact: { method: "Signal", value: "@mchen", note: "Prefers encrypted chat" },
    family: ["Parents in Seattle", "Little sister: Abby"],
    likes: ["Third-wave coffee", "Synth music", "Night rides"],
    dislikes: ["Long meetings", "Decaf"],
    recentConversations: [
      { snippet: "Prototype shipped! 🎉", time: "30m ago", channel: "Signal" },
      { snippet: "Bike route for Sunday?", time: "Yesterday", channel: "SMS" },
    ],
    socialLinks: [
      { platform: "GitHub", handle: "michaelchen", url: "#" },
      { platform: "Instagram", handle: "@michelangelo", url: "#" },
    ],
    feed: [
      { source: "Github", title: "Starred a new AI repo", time: "Just now" },
      { source: "WhatsApp", title: "Dropped a playlist \"Night Drive 4\"", time: "Today" },
    ],
    reel: [
      { title: "Night cycle across the bridge", date: "Sep 2025", mood: "electric", image: "bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400" },
      { title: "Hackathon finals win", date: "Jun 2025", mood: "hype", image: "bg-gradient-to-br from-slate-800 via-purple-700 to-pink-600" },
      { title: "Flat white throwdown", date: "Nov 2024", mood: "cozy", image: "bg-gradient-to-br from-amber-500 via-orange-400 to-rose-400" },
    ],
  },
  "Emma Wilson": {
    headline: "Thoughtful collaborator • Story collector",
    bio: "Keeps the team organized, remembers everyone's wins, and loves thoughtful gifts.",
    age: 30,
    classification: "Fun Friends",
    avatarColor: "from-teal-400 via-emerald-400 to-lime-400",
    preferredContact: { method: "Email", value: "emma.wilson@work.co", note: "Weekdays, 9-5" },
    family: ["Partner: Nina", "Cat: Pesto"],
    likes: ["Polaroids", "Stationery", "House plants"],
    dislikes: ["Noisy cafes"],
    recentConversations: [
      { snippet: "Let’s sync on Q1 offsite ideas", time: "3h ago", channel: "Email" },
      { snippet: "Shared the photos from the art walk", time: "Monday", channel: "SMS" },
    ],
    socialLinks: [
      { platform: "Instagram", handle: "@emma.collects", url: "#" },
      { platform: "Pinterest", handle: "emma-ideas", url: "#" },
    ],
    feed: [
      { source: "Email", title: "Shared doc: \"Surprise gift inspo\"", time: "Today" },
      { source: "SMS", title: "Pinned: brunch this Saturday?", time: "Yesterday" },
    ],
    reel: [
      { title: "Gallery stroll + coffee", date: "Jul 2025", mood: "curious", image: "bg-gradient-to-br from-cyan-400 via-sky-400 to-indigo-400" },
      { title: "Team karaoke night", date: "Feb 2025", mood: "loud", image: "bg-gradient-to-br from-fuchsia-500 via-rose-500 to-orange-400" },
      { title: "Plant swap afternoon", date: "Apr 2024", mood: "lush", image: "bg-gradient-to-br from-green-500 via-emerald-400 to-teal-400" },
    ],
  },
};

const FALLBACK_AVATARS = [
  "from-blue-500 via-sky-400 to-cyan-400",
  "from-amber-500 via-orange-500 to-rose-500",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-indigo-500 via-purple-500 to-pink-500",
];

export function usePageData() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPageData = useCallback(async (page: Page) => {
    if (
      page === "overview" ||
      page === "chat" ||
      page === "settings" ||
      page === "help" ||
      page === "my-circle" ||
      FEED_PAGES.includes(page as (typeof FEED_PAGES)[number])
    ) {
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
          setPeople(
            (data.people ?? []).map((person: Person, idx: number) => {
              const extras = PERSON_PROFILES[person.name] ?? {};
              const avatarColor = extras.avatarColor ?? FALLBACK_AVATARS[idx % FALLBACK_AVATARS.length];
              return {
                ...person,
                ...extras,
                avatarColor,
              };
            })
          );
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
