export type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type FeedPage =
  | "feeds-email"
  | "feeds-messages"
  | "feeds-social"
  | "feeds-live";

export type Page =
  | "overview"
  | "chat"
  | "memories"
  | "people"
  | "places"
  | "birthdays"
  | "my-circle"
  | "journals"
  | "settings"
  | "help"
  | FeedPage;

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

// Chat history removed - Chat is continuous within the chat view

export type PersonContact = {
  method: string;
  value: string;
  note?: string;
};

export type PersonSocial = {
  platform: string;
  handle: string;
  url?: string;
};

export type PersonStory = {
  title: string;
  date: string;
  mood: string;
  image: string;
};

export type PersonFeedItem = {
  source: string;
  title: string;
  time: string;
};

export type PersonConversation = {
  snippet: string;
  time: string;
  channel: string;
};

export type Person = {
  id: number;
  name: string;
  relationship: string;
  birthday: string;
  age?: number;
  classification?:
    | "BFFs"
    | "Close Friend"
    | "Fun Friends"
    | "Neighbours"
    | "Acquantances"
    | "Blacklisted"
    | string;
  bio?: string;
  headline?: string;
  avatarColor?: string;
  preferredContact?: PersonContact;
  family?: string[];
  likes?: string[];
  dislikes?: string[];
  recentConversations?: PersonConversation[];
  socialLinks?: PersonSocial[];
  feed?: PersonFeedItem[];
  reel?: PersonStory[];
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

export type JournalEntry = {
  id: number;
  title: string;
  mood?: string;
  content: string;
  created_at: string;
};
