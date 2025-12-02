import {
  ArrowPathIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MicrophoneIcon,
  SparklesIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import type { FeedPage } from "../types";

type SourceStatus = "connected" | "syncing" | "planned";
type EventStatus = "captured" | "queued" | "pending";

type FeedSource = {
  name: string;
  description: string;
  status: SourceStatus;
  lastSynced: string;
  highlights: string[];
  icon: React.ComponentType<{ className: string }>;
  action?: string;
};

type FeedEvent = {
  source: string;
  title: string;
  detail: string;
  time: string;
  status: EventStatus;
};

type FeedConfig = {
  headline: string;
  blurb: string;
  sources: FeedSource[];
  stream: FeedEvent[];
};

const SOURCE_STATUS_STYLES: Record<SourceStatus, string> = {
  connected: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  syncing: "bg-amber-50 text-amber-700 border border-amber-100",
  planned: "bg-gray-100 text-gray-700 border border-gray-200",
};

const EVENT_STATUS_STYLES: Record<EventStatus, string> = {
  captured: "text-emerald-700 bg-emerald-50 border border-emerald-100",
  queued: "text-blue-700 bg-blue-50 border border-blue-100",
  pending: "text-gray-700 bg-gray-100 border border-gray-200",
};

const FEED_CONFIG: Record<FeedPage, FeedConfig> = {
  "feeds-email": {
    headline: "Email capture",
    blurb: "Ingest receipts, invites, and attachments from your inbox so they are ready to turn into memories.",
    sources: [
      {
        name: "Gmail",
        description: "Personal inbox with attachments and travel receipts.",
        status: "connected",
        lastSynced: "5m ago",
        highlights: ["Attachments saved", "Trips auto-tagged"],
        icon: EnvelopeIcon,
      },
      {
        name: "Outlook / Work",
        description: "Meeting threads, calendar invites, and shared docs.",
        status: "connected",
        lastSynced: "26m ago",
        highlights: ["Meetings queued", "Docs linked"],
        icon: EnvelopeIcon,
      },
      {
        name: "Forwarding alias",
        description: "Forward any email to ingest it, even from other providers.",
        status: "planned",
        lastSynced: "Ready to set up",
        highlights: ["Great for scanners", "Works from any account"],
        icon: EnvelopeIcon,
        action: "Copy ingest address",
      },
    ],
    stream: [
      {
        source: "Gmail",
        title: "Flight confirmation tagged under travel",
        detail: "Subject: SFO > BOS with attachment stored.",
        time: "Just now",
        status: "captured",
      },
      {
        source: "Outlook",
        title: "Team sync invite parsed for agenda",
        detail: "Calendar hold with 3 linked docs.",
        time: "8m ago",
        status: "queued",
      },
      {
        source: "Gmail",
        title: "Receipt categorized as finance",
        detail: "Bookstore total $48.20, ready for memory extraction.",
        time: "23m ago",
        status: "captured",
      },
    ],
  },
  "feeds-messages": {
    headline: "Messages capture",
    blurb: "Pull SMS and WhatsApp conversations so plans, links, and photos stay searchable.",
    sources: [
      {
        name: "SMS",
        description: "Sync messages for quick context and reminders.",
        status: "connected",
        lastSynced: "2m ago",
        highlights: ["Pinned snippets", "Links extracted"],
        icon: ChatBubbleLeftRightIcon,
      },
      {
        name: "WhatsApp",
        description: "Capture chats, photos, and voice notes with timestamps.",
        status: "syncing",
        lastSynced: "Syncing now",
        highlights: ["Voice notes queued", "Group chats labeled"],
        icon: ChatBubbleLeftRightIcon,
        action: "Review permissions",
      },
      {
        name: "iMessage / RCS",
        description: "Optional capture for high-signal threads.",
        status: "planned",
        lastSynced: "Waiting for connect",
        highlights: ["Pull starred texts", "Respect focus hours"],
        icon: ChatBubbleLeftRightIcon,
      },
    ],
    stream: [
      {
        source: "SMS",
        title: "Reminder pulled: Dinner at 7pm Friday",
        detail: "From Sarah - pinned to calendar candidates.",
        time: "Just now",
        status: "captured",
      },
      {
        source: "WhatsApp",
        title: "Shared album saved for memory parsing",
        detail: "Family trip photos (13 items).",
        time: "12m ago",
        status: "queued",
      },
      {
        source: "SMS",
        title: "Delivery code detected and stored",
        detail: "Parcel ETA noted for follow-up.",
        time: "28m ago",
        status: "captured",
      },
    ],
  },
  "feeds-social": {
    headline: "Social capture",
    blurb: "Bring Facebook and Instagram posts, messages, and saves into one place.",
    sources: [
      {
        name: "Facebook",
        description: "Posts, saves, and events to remember later.",
        status: "connected",
        lastSynced: "9m ago",
        highlights: ["Event RSVPs tagged", "Saved posts indexed"],
        icon: GlobeAltIcon,
      },
      {
        name: "Instagram",
        description: "Stories, reels, and saved posts for people memories.",
        status: "connected",
        lastSynced: "18m ago",
        highlights: ["Captions captured", "Mentions tracked"],
        icon: GlobeAltIcon,
      },
      {
        name: "Messenger",
        description: "Optional capture for key threads only.",
        status: "planned",
        lastSynced: "Off by default",
        highlights: ["One-on-one only", "Respect privacy rules"],
        icon: GlobeAltIcon,
        action: "Choose threads",
      },
    ],
    stream: [
      {
        source: "Instagram",
        title: "Saved reel linked to People",
        detail: "Tagged Emma in \"Gallery stroll\" reel.",
        time: "4m ago",
        status: "captured",
      },
      {
        source: "Facebook",
        title: "Event invite synced",
        detail: "Board game night on Dec 12 added to calendar ideas.",
        time: "16m ago",
        status: "queued",
      },
      {
        source: "Instagram",
        title: "Story mention stored for memory threading",
        detail: "You were tagged by Michael.",
        time: "35m ago",
        status: "captured",
      },
    ],
  },
  "feeds-live": {
    headline: "Live recordings",
    blurb: "Log audio or video sessions so transcripts can power future insights.",
    sources: [
      {
        name: "Voice recorder",
        description: "One-tap capture for quick notes or interviews.",
        status: "connected",
        lastSynced: "Active now",
        highlights: ["Auto-transcribe", "Speaker labels"],
        icon: MicrophoneIcon,
      },
      {
        name: "Video / screen",
        description: "Record calls or screen shares for work sessions.",
        status: "syncing",
        lastSynced: "Processing recent upload",
        highlights: ["Chapters added", "Action items flagged"],
        icon: VideoCameraIcon,
        action: "View uploads",
      },
      {
        name: "Live streams",
        description: "High-signal sessions streamed directly into the vault.",
        status: "planned",
        lastSynced: "Enable to start streaming",
        highlights: ["Real-time notes", "Redact sensitive words"],
        icon: MicrophoneIcon,
        action: "Set guardrails",
      },
    ],
    stream: [
      {
        source: "Voice recorder",
        title: "New clip transcribed (2:14)",
        detail: "Morning reflection, 3 highlights ready.",
        time: "Live",
        status: "captured",
      },
      {
        source: "Video",
        title: "Project review queued for summarization",
        detail: "Screenshare with Nina, 18 min.",
        time: "6m ago",
        status: "queued",
      },
      {
        source: "Voice recorder",
        title: "Waiting for microphone permission",
        detail: "Grant access to keep capturing.",
        time: "Now",
        status: "pending",
      },
    ],
  },
};

export function FeedsView({ page }: { page: FeedPage }) {
  const config = FEED_CONFIG[page];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-white via-blue-50 to-white p-4 shadow-sm flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-xl">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
            Feed intake
          </div>
          <div className="text-lg font-semibold text-gray-900 mt-1">
            {config.headline}
          </div>
          <p className="text-sm text-gray-700 mt-1">
            {config.blurb}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white border border-blue-100 px-3 py-2 shadow-sm text-sm text-blue-800">
          <SparklesIcon className="w-5 h-5 text-blue-600" />
          Feeds will be parsed into memories and insights soon.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {config.sources.map((source) => (
              <div
                key={source.name}
                className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <source.icon className="w-5 h-5 text-blue-600" />
                    <div className="text-sm font-semibold text-gray-900">
                      {source.name}
                    </div>
                  </div>
                  <span className={`text-[11px] px-2 py-1 rounded-full ${SOURCE_STATUS_STYLES[source.status]}`}>
                    {source.status === "connected" && "Connected"}
                    {source.status === "syncing" && "Syncing"}
                    {source.status === "planned" && "Planned"}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">
                  {source.description}
                </p>
                <div className="text-[11px] text-gray-500 mt-2">
                  Last activity: {source.lastSynced}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {source.highlights.map((note) => (
                    <span
                      key={note}
                      className="text-[11px] px-2 py-1 rounded-full bg-gray-100 text-gray-700 border border-gray-200"
                    >
                      {note}
                    </span>
                  ))}
                </div>
                {source.action && (
                  <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    {source.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-800">
              Live feed
            </div>
            <ArrowPathIcon className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex flex-col gap-2">
            {config.stream.map((event) => (
              <div
                key={`${event.source}-${event.time}-${event.title}`}
                className="rounded-lg border border-gray-200 bg-gray-50 p-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-800">
                    {event.source}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded-full ${EVENT_STATUS_STYLES[event.status]}`}>
                    {event.status === "captured" && "Captured"}
                    {event.status === "queued" && "Queued"}
                    {event.status === "pending" && "Pending"}
                  </span>
                  <span className="text-[11px] text-gray-500 ml-auto">
                    {event.time}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-800">
                  {event.title}
                </div>
                <div className="text-xs text-gray-600">
                  {event.detail}
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 text-blue-800 text-xs p-2 flex items-center gap-2">
            <SparklesIcon className="w-4 h-4" />
            These feeds stage data so future memories and insights stay complete.
          </div>
        </div>
      </div>
    </div>
  );
}
