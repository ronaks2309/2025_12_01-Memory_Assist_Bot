export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type Page = "chat" | "memories" | "people" | "places" | "birthdays" | "settings" | "help";

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

// Chat history removed — Chat is continuous within the chat view

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

export type Conversation = {
  id: number;
  title: string | null;
  created_at: string;
};
