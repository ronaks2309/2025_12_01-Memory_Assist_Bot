import { useEffect, useMemo, useState } from "react";
import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  LinkIcon,
  UserCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  CameraIcon,
  ClockIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import type {
  Page,
  Memory,
  Person,
  Place,
  Birthday,
  JournalEntry,
} from "../types";

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

function getClassificationClasses(label?: string) {
  if (!label) return "bg-gray-100 text-gray-700 border border-gray-200";
  const lower = label.toLowerCase();
  if (lower.includes("bff")) return "bg-rose-100 text-rose-700 border border-rose-200";
  if (lower.includes("close")) return "bg-blue-100 text-blue-700 border border-blue-200";
  if (lower.includes("fun")) return "bg-amber-100 text-amber-700 border border-amber-200";
  if (lower.includes("neigh")) return "bg-emerald-100 text-emerald-700 border border-emerald-200";
  if (lower.includes("black")) return "bg-gray-200 text-gray-800 border border-gray-300";
  return "bg-purple-100 text-purple-700 border border-purple-200";
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
  const [expandedPersonId, setExpandedPersonId] = useState<number | null>(null);
  const [editingPersonId, setEditingPersonId] = useState<number | null>(null);
  const [editDrafts, setEditDrafts] = useState<Record<number, { bio: string; contact: string }>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [relationshipFilter, setRelationshipFilter] = useState("all");
  const [contactFilter, setContactFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isPeoplePage = page === "people";

  useEffect(() => {
    if (!isPeoplePage) {
      setExpandedPersonId(null);
      setEditingPersonId(null);
      return;
    }

    if (expandedPersonId && !people.some((person) => person.id === expandedPersonId)) {
      setExpandedPersonId(null);
      setEditingPersonId(null);
    }
  }, [isPeoplePage, people, expandedPersonId]);

  const classificationOptions = useMemo(() => {
    const set = new Set<string>();
    people.forEach((p) => {
      if (p.classification) set.add(p.classification);
    });
    return Array.from(set);
  }, [people]);

  const relationshipOptions = useMemo(() => {
    const set = new Set<string>();
    people.forEach((p) => {
      if (p.relationship) set.add(p.relationship);
    });
    return Array.from(set);
  }, [people]);

  const contactOptions = useMemo(() => {
    const set = new Set<string>();
    people.forEach((p) => {
      const method = p.preferredContact?.method;
      if (method) set.add(method);
    });
    return Array.from(set);
  }, [people]);

  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.headline ?? p.bio ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesClassification =
        classificationFilter === "all" ||
        (p.classification ?? "").toLowerCase() === classificationFilter.toLowerCase();
      const matchesRelationship =
        relationshipFilter === "all" ||
        (p.relationship ?? "").toLowerCase() === relationshipFilter.toLowerCase();
      const matchesContact =
        contactFilter === "all" ||
        (p.preferredContact?.method ?? "").toLowerCase() === contactFilter.toLowerCase();
      return matchesSearch && matchesClassification && matchesRelationship && matchesContact;
    });
  }, [people, searchTerm, classificationFilter, relationshipFilter, contactFilter]);

  useEffect(() => {
    if (!filteredPeople.some((p) => p.id === expandedPersonId)) {
      setExpandedPersonId(null);
      setEditingPersonId(null);
    }
  }, [filteredPeople, expandedPersonId]);

  function startEditing(person: Person) {
    setEditingPersonId(person.id);
    setEditDrafts((prev) => {
      if (prev[person.id]) return prev;
      return {
        ...prev,
        [person.id]: {
          bio: person.bio ?? "",
          contact: person.preferredContact?.value ?? "",
        },
      };
    });
  }

  function updateDraft(personId: number, field: "bio" | "contact", value: string) {
    setEditDrafts((prev) => {
      const current = prev[personId] ?? { bio: "", contact: "" };
      return {
        ...prev,
        [personId]: { ...current, [field]: value },
      };
    });
  }

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    classificationFilter !== "all" ||
    relationshipFilter !== "all" ||
    contactFilter !== "all";

  const appliedFilterCount =
    (classificationFilter !== "all" ? 1 : 0) +
    (relationshipFilter !== "all" ? 1 : 0) +
    (contactFilter !== "all" ? 1 : 0);

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

      {isPeoplePage && people.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or bio"
                  className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-28 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => setFiltersOpen((v) => !v)}
                className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  filtersOpen ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
                aria-expanded={filtersOpen}
              >
                <FunnelIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
                {appliedFilterCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {appliedFilterCount}
                  </span>
                )}
              </button>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2">
                {classificationFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setClassificationFilter("all")}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-semibold"
                  >
                    Circle: {classificationFilter}
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
                {relationshipFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setRelationshipFilter("all")}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold"
                  >
                    Relationship: {relationshipFilter}
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
                {contactFilter !== "all" && (
                  <button
                    type="button"
                    onClick={() => setContactFilter("all")}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold"
                  >
                    Contact: {contactFilter}
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            <div
              className={`grid grid-cols-1 sm:grid-cols-3 gap-2 transition-all duration-300 ease-out ${
                filtersOpen ? "max-h-[260px] opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1 overflow-hidden"
              }`}
              aria-hidden={!filtersOpen}
            >
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600 flex items-center gap-1">
                  <FunnelIcon className="w-4 h-4 text-gray-500" />
                  Circle
                </label>
                <select
                  className="rounded-xl border border-gray-200 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                  value={classificationFilter}
                  onChange={(e) => setClassificationFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  {classificationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600">Relationship</label>
                <select
                  className="rounded-xl border border-gray-200 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                  value={relationshipFilter}
                  onChange={(e) => setRelationshipFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  {relationshipOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-gray-600">Preferred contact</label>
                <select
                  className="rounded-xl border border-gray-200 bg-white px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm"
                  value={contactFilter}
                  onChange={(e) => setContactFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  {contactOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {filteredPeople.map((p) => {
            const expanded = expandedPersonId === p.id;
            const editing = editingPersonId === p.id;
            const initials = p.name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((n) => n[0]?.toUpperCase())
              .join("");
            const draft = editDrafts[p.id] ?? {
              bio: p.bio ?? "",
              contact: p.preferredContact?.value ?? "",
            };

            return (
              <div
                key={p.id}
                className={`p-4 rounded-2xl border transition-all bg-white ${
                  expanded ? "border-blue-200 shadow-lg ring-1 ring-blue-100" : "border-gray-200 hover:border-blue-200 hover:shadow-md"
                }`}
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.avatarColor ?? "from-blue-500 to-indigo-500"} text-white font-semibold flex items-center justify-center shadow-inner`}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-lg font-semibold text-gray-900">{p.name}</div>
                        {p.classification && (
                          <span className={`px-2 py-1 rounded-full text-[11px] font-semibold ${getClassificationClasses(p.classification)}`}>
                            {p.classification}
                          </span>
                        )}
                        <span className="text-xs text-gray-500 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                          {p.relationship}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed mt-1">
                        {p.headline || p.bio || "No bio added yet."}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          <CalendarDaysIcon className="w-4 h-4" />
                          <span>{p.birthday}</span>
                          {p.age && <span>· {p.age} yrs</span>}
                        </div>
                        {p.preferredContact && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <ChatBubbleLeftEllipsisIcon className="w-4 h-4" />
                            <span>Prefers {p.preferredContact.method}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => (editing ? setEditingPersonId(null) : startEditing(p))}
                        className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                          editing
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                        }`}
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                        {editing ? "Save draft" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedPersonId((curr) => (curr === p.id ? null : p.id))}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                      >
                        {expanded ? (
                          <>
                            Hide details
                            <ChevronUpIcon className="w-4 h-4" />
                          </>
                        ) : (
                          <>
                            View more
                            <ChevronDownIcon className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div
                    className={`pt-3 border-t border-gray-100 flex flex-col gap-3 transition-all duration-500 ease-out ${
                      expanded
                        ? "opacity-100 translate-y-0 max-h-[2400px]"
                        : "opacity-0 -translate-y-2 max-h-0 overflow-hidden pointer-events-none"
                    }`}
                    aria-hidden={!expanded}
                  >
                    {expanded && (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <div className="lg:col-span-2 flex flex-col gap-3">
                          <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-3 shadow-inner">
                            <div className="flex items-start justify-between">
                              <div className="text-sm font-semibold text-gray-800">Bio & contact</div>
                              {p.preferredContact?.note && (
                                <span className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full">
                                  {p.preferredContact.note}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed mt-2">
                              {draft.bio || p.bio || "Add a quick note about who they are to you."}
                            </p>
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-200">
                                {p.preferredContact?.method?.toLowerCase().includes("mail") ? (
                                  <EnvelopeIcon className="w-5 h-5 text-emerald-600" />
                                ) : (
                                  <PhoneIcon className="w-5 h-5 text-emerald-600" />
                                )}
                                <div>
                                  <div className="text-xs text-gray-500">Preferred</div>
                                  <div className="text-sm font-semibold text-gray-900">
                                    {p.preferredContact?.method || "Contact"}
                                  </div>
                                  <div className="text-xs text-gray-600">{draft.contact || p.preferredContact?.value}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-gray-200">
                                <UserCircleIcon className="w-5 h-5 text-indigo-600" />
                                <div>
                                  <div className="text-xs text-gray-500">Birthday</div>
                                  <div className="text-sm font-semibold text-gray-900">{p.birthday}</div>
                                  {p.age && <div className="text-xs text-gray-600">{p.age} years</div>}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                              <div className="text-sm font-semibold text-gray-800 mb-2">Family & circle</div>
                              <div className="flex flex-wrap gap-2">
                                {p.family && p.family.length > 0 ? (
                                  p.family.map((fam) => (
                                    <span key={fam} className="px-2 py-1 rounded-full text-xs bg-white border border-gray-200 shadow-sm">
                                      {fam}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-500">Add family details</span>
                                )}
                              </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                              <div className="text-sm font-semibold text-gray-800 mb-2">Likes & dislikes</div>
                              <div className="flex flex-wrap gap-2">
                                {(p.likes && p.likes.length > 0) || (p.dislikes && p.dislikes.length > 0) ? (
                                  <>
                                    {p.likes?.map((item) => (
                                      <span key={item} className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-100">
                                        <HeartIcon className="w-3 h-3 inline mr-1" />
                                        {item}
                                      </span>
                                    ))}
                                    {p.dislikes?.map((item) => (
                                      <span key={item} className="px-2 py-1 rounded-full text-xs bg-rose-50 text-rose-700 border border-rose-100">
                                        {item}
                                      </span>
                                    ))}
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-500">Capture what they love and avoid.</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="rounded-xl border border-gray-200 p-3 bg-white">
                              <div className="flex items-center justify-between mb-2">
                                <div className="text-sm font-semibold text-gray-800">Recent conversations</div>
                                <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                                  Memory-aware
                                </span>
                              </div>
                              <div className="flex flex-col gap-2">
                                {p.recentConversations && p.recentConversations.length > 0 ? (
                                  p.recentConversations.map((c, idx) => (
                                    <div
                                      key={`${c.time}-${idx}`}
                                      className="p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-start gap-2"
                                    >
                                      <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-blue-600 mt-0.5" />
                                      <div className="flex-1">
                                        <div className="text-sm text-gray-800">{c.snippet}</div>
                                        <div className="text-xs text-gray-500">
                                          {c.channel} · {c.time}
                                        </div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-xs text-gray-500">No conversations logged yet.</div>
                                )}
                              </div>
                            </div>

                            <div className="rounded-xl border border-gray-200 p-3 bg-white flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <div className="text-sm font-semibold text-gray-800">Social & feed</div>
                                <LinkIcon className="w-4 h-4 text-gray-500" />
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {p.socialLinks && p.socialLinks.length > 0 ? (
                                  p.socialLinks.map((s) => (
                                    <a
                                      key={s.handle}
                                      href={s.url || "#"}
                                      className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border border-gray-200 hover:border-blue-200"
                                    >
                                      {s.platform}: {s.handle}
                                    </a>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-500">Add socials to stay in sync.</span>
                                )}
                              </div>
                              <div className="mt-1 flex flex-col gap-1">
                                {p.feed && p.feed.length > 0 ? (
                                  p.feed.map((item, idx) => (
                                    <div key={`${item.title}-${idx}`} className="flex items-center gap-2 text-xs text-gray-700">
                                      <ClockIcon className="w-4 h-4 text-gray-500" />
                                      <span className="font-semibold text-gray-800">{item.source}</span>
                                      <span className="text-gray-500">•</span>
                                      <span className="truncate">{item.title}</span>
                                      <span className="text-gray-400 ml-auto">{item.time}</span>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-xs text-gray-500">No live feed pulled yet.</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          <div className="rounded-xl border border-gray-200 p-3 bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CameraIcon className="w-4 h-4 text-pink-500" />
                                <div className="text-sm font-semibold text-gray-800">Flashback reel</div>
                              </div>
                              <span className="text-[11px] text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full">
                                Their moments
                              </span>
                            </div>
                            <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                              <div className="flex gap-3 min-w-full pb-2">
                                {p.reel && p.reel.length > 0 ? (
                                  p.reel.map((shot, idx) => (
                                    <div
                                      key={`${shot.title}-${idx}`}
                                      className="min-w-[180px] rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-white"
                                    >
                                      <div className={`h-24 ${shot.image}`} />
                                      <div className="p-2">
                                        <div className="text-xs uppercase tracking-wide text-gray-500">
                                          {shot.date}
                                        </div>
                                        <div className="text-sm font-semibold text-gray-800">
                                          {shot.title}
                                        </div>
                                        <div className="text-xs text-pink-600">{shot.mood}</div>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="text-xs text-gray-500">No memories captured yet.</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {editing && (
                            <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-3 shadow-inner">
                              <div className="text-sm font-semibold text-blue-800 mb-2">Quick edit</div>
                              <label className="flex flex-col gap-1 text-xs text-gray-700 mb-2">
                                Bio / notes
                                <textarea
                                  className="w-full rounded-lg border border-blue-200 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  rows={3}
                                  value={draft.bio}
                                  onChange={(e) => updateDraft(p.id, "bio", e.target.value)}
                                />
                              </label>
                              <label className="flex flex-col gap-1 text-xs text-gray-700 mb-3">
                                Preferred contact
                                <input
                                  className="w-full rounded-lg border border-blue-200 bg-white p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                  value={draft.contact}
                                  onChange={(e) => updateDraft(p.id, "contact", e.target.value)}
                                />
                              </label>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingPersonId(null)}
                                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                  Save draft
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPersonId(null)}
                                  className="px-3 py-2 rounded-lg text-sm font-semibold bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                              <div className="text-[11px] text-blue-700 mt-2">
                                Edits stay local for now — wire up the backend to persist.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
