import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import type { Page, Memory, ChatEntry, Person, Place, Birthday } from "../types";

interface ListViewProps {
  page: Page;
  isLoading: boolean;
  memories: Memory[];
  chatHistory: ChatEntry[];
  people: Person[];
  places: Place[];
  birthdays: Birthday[];
}

export function ListView({
  page,
  isLoading,
  memories,
  chatHistory,
  people,
  places,
  birthdays,
}: ListViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {page === "memories" && memories.length > 0 && (
        <>
          {memories.map((m) => (
            <div
              key={m.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="font-medium text-gray-800 mb-1">{m.title}</div>
              <div className="text-sm text-gray-600 mb-2">{m.content}</div>
              <div className="text-xs text-gray-400">Created: {m.created_at}</div>
            </div>
          ))}
        </>
      )}

      {page === "history" && chatHistory.length > 0 && (
        <>
          {chatHistory.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="font-medium text-gray-800 mb-1">{c.title}</div>
              <div className="text-sm text-gray-600 mb-2">
                {c.message_count} messages
              </div>
              <div className="text-xs text-gray-400">Date: {c.date}</div>
            </div>
          ))}
        </>
      )}

      {page === "people" && people.length > 0 && (
        <>
          {people.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="font-medium text-gray-800 mb-1">{p.name}</div>
              <div className="text-sm text-gray-600 mb-2">
                Relationship: {p.relationship}
              </div>
              <div className="text-xs text-gray-400">Birthday: {p.birthday}</div>
            </div>
          ))}
        </>
      )}

      {page === "places" && places.length > 0 && (
        <>
          {places.map((p) => (
            <div
              key={p.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="font-medium text-gray-800 mb-1">{p.name}</div>
              <div className="text-sm text-gray-600 mb-2">
                {p.description}
              </div>
              <div className="text-xs text-gray-400">Visits: {p.visits}</div>
            </div>
          ))}
        </>
      )}

      {page === "birthdays" && birthdays.length > 0 && (
        <>
          {birthdays.map((b) => (
            <div
              key={b.id}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
            >
              <div className="font-medium text-gray-800 mb-1">{b.name}</div>
              <div className="text-sm text-gray-600 mb-2">{b.date}</div>
              <div
                className={`text-xs ${
                  b.days_until <= 7
                    ? "text-orange-500 font-medium"
                    : "text-gray-400"
                }`}
              >
                {b.days_until} days away
              </div>
            </div>
          ))}
        </>
      )}

      {page === "settings" && (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <Cog6ToothIcon className="w-12 h-12 text-gray-400" />
          <p className="text-center text-gray-400 text-sm">
            Settings coming soon...
          </p>
        </div>
      )}

      {page === "help" && (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <QuestionMarkCircleIcon className="w-12 h-12 text-gray-400" />
          <p className="text-center text-gray-400 text-sm">
            Help & FAQ coming soon...
          </p>
        </div>
      )}

      {page !== "settings" &&
        page !== "help" &&
        ((page === "memories" && memories.length === 0) ||
          (page === "history" && chatHistory.length === 0) ||
          (page === "people" && people.length === 0) ||
          (page === "places" && places.length === 0) ||
          (page === "birthdays" && birthdays.length === 0)) && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-center text-gray-400 text-sm">
              No items to display
            </p>
          </div>
        )}
    </div>
  );
}
