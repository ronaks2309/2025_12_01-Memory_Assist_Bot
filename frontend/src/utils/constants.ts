import type { FeedPage, Page } from "../types";

export const PAGE_TITLES: Record<Page, string> = {
  overview: "Overview",
  chat: "Memory Assistant",
  memories: "Memories",
  people: "People",
  places: "Places",
  birthdays: "Birthdays",
  journals: "Diary",
  settings: "Settings",
  help: "Help & FAQ",
  "feeds-email": "Email feeds",
  "feeds-messages": "Messages feeds",
  "feeds-social": "Social feeds",
  "feeds-live": "Live capture",
};

export const PAGE_DESCRIPTIONS: Record<Page, string> = {
  overview: "A quick look at your day and trends",
  chat: "Your AI-powered memory companion",
  memories: "All your saved memories",
  people: "Important people in your life",
  places: "Locations you've visited",
  birthdays: "Important dates to remember",
  journals: "Capture daily notes, thoughts, and reflections",
  settings: "Customize your experience",
  help: "Get help and support",
  "feeds-email": "Capture inbox threads and attachments as memory-ready content",
  "feeds-messages": "Keep SMS and WhatsApp conversations searchable",
  "feeds-social": "Bring Facebook and Instagram posts into your vault",
  "feeds-live": "Log live audio or video recordings for later parsing",
};

export const BACKEND_URL = "http://127.0.0.1:8001";

export const FEED_PAGES: FeedPage[] = [
  "feeds-email",
  "feeds-messages",
  "feeds-social",
  "feeds-live",
];
