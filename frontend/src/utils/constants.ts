import type { Page } from "../types";

export const PAGE_TITLES: Record<Page, string> = {
  chat: "Memory Assistant",
  memories: "Memories",
  history: "Chat History",
  people: "People",
  places: "Places",
  birthdays: "Birthdays",
  settings: "Settings",
  help: "Help & FAQ",
};

export const PAGE_DESCRIPTIONS: Record<Page, string> = {
  chat: "Your AI-powered memory companion",
  memories: "All your saved memories",
  history: "Your past conversations",
  people: "Important people in your life",
  places: "Locations you've visited",
  birthdays: "Important dates to remember",
  settings: "Customize your experience",
  help: "Get help and support",
};

export const BACKEND_URL = "http://127.0.0.1:8001";
