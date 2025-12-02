export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export type Page = "chat" | "memories" | "history" | "people" | "places" | "birthdays" | "settings" | "help";

export type Tooltip = {
  text: string;
  x: number;
  y: number;
  visible: boolean;
};

export type Memory = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};

export type ChatEntry = {
  id: number;
  title: string;
  date: string;
  message_count: number;
};

export type Person = {
  id: number;
  name: string;
  relationship: string;
  birthday: string;
};

export type Place = {
  id: number;
  name: string;
  description: string;
  visits: number;
};

export type Birthday = {
  id: number;
  name: string;
  date: string;
  days_until: number;
};
