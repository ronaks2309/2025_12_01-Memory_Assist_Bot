import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import type { Page, Memory, Person, Place, Birthday, JournalEntry } from "../types";

interface ListViewProps {
  page: Page;
  isLoading: boolean;
  memories: Memory[];
  people: Person[];
  places: Place[];
  birthdays: Birthday[];
  journals: JournalEntry[];
  onAddJournal: () => void;
}

export function ListView({
  page,
  isLoading,
  memories,
  people,
  places,
  birthdays,
  journals,
  onAddJournal,
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

      {/* Chat History removed; Chat is continuous in the ChatView */}

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

      {page === "journals" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-blue-600" />
              <div className="text-sm font-semibold text-gray-800">Diary</div>
            </div>
            <button
              onClick={onAddJournal}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Add note
            </button>
          </div>

          {journals.length === 0 ? (
            <div className="p-4 bg-white rounded-lg border border-dashed border-gray-300 text-center text-sm text-gray-500">
              No notes yet. Click "Add note" to start your journal.
            </div>
          ) : (
            journals.map((j) => (
              <div
                key={j.id}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-medium text-gray-800">{j.title}</div>
                  {j.mood && (
                    <span className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-2 py-0.5">
                      {j.mood}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 mb-2">{j.created_at}</div>
                <div className="text-sm text-gray-700 leading-relaxed">
                  {j.content}
                </div>
              </div>
            ))
          )}
        </div>
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
          false ||
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
