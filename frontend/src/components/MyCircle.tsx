import { useMemo, useState } from "react";

type Ring = {
  id: string;
  label: string;
  size: number; // percentage of the container
  gradient: string;
  border: string;
  text: string;
};

type Person = {
  id: string;
  name: string;
  initials: string;
  tierId: string;
  x: number; // percentage position
  y: number; // percentage position
  color: string;
  note: string;
};

const RINGS: Ring[] = [
  {
    id: "bffs",
    label: "1",
    size: 34,
    gradient: "from-emerald-200/85 via-lime-100/90 to-emerald-50/85",
    border: "border-emerald-500/30",
    text: "BFFs",
  },
  {
    id: "close-friends",
    label: "2",
    size: 50,
    gradient: "from-emerald-100/65 via-lime-50/70 to-amber-50/70",
    border: "border-emerald-400/25",
    text: "Close Friends",
  },
  {
    id: "fun-friends",
    label: "3",
    size: 66,
    gradient: "from-amber-100/70 via-yellow-50/70 to-amber-50/60",
    border: "border-amber-400/25",
    text: "Fun Friends",
  },
  {
    id: "neighbors",
    label: "4",
    size: 80,
    gradient: "from-lime-50/65 via-amber-50/60 to-lime-100/60",
    border: "border-lime-400/25",
    text: "Neighbors",
  },
  {
    id: "acquaintances",
    label: "5",
    size: 94,
    gradient: "from-amber-50/50 via-lime-50/55 to-amber-50/45",
    border: "border-amber-300/20",
    text: "Acquaintances",
  },
];

const PEOPLE: Person[] = [
  {
    id: "alexis",
    name: "Alexis Lane",
    initials: "AL",
    tierId: "bffs",
    x: 50,
    y: 52,
    color: "from-emerald-500 to-green-500",
    note: "Morning running buddy and accountability partner.",
  },
  {
    id: "leah",
    name: "Leah Emerson",
    initials: "LE",
    tierId: "bffs",
    x: 44,
    y: 46,
    color: "from-emerald-600 to-emerald-500",
    note: "Co-founder energy — honest feedback, zero filter.",
  },
  {
    id: "jordan",
    name: "Jordan Kim",
    initials: "JK",
    tierId: "close-friends",
    x: 61,
    y: 36,
    color: "from-blue-600 to-indigo-500",
    note: "Design lead who helps pressure-test big ideas.",
  },
  {
    id: "priya",
    name: "Priya Nair",
    initials: "PN",
    tierId: "close-friends",
    x: 40,
    y: 60,
    color: "from-sky-600 to-blue-500",
    note: "Tech whisperer; first call for hard launches.",
  },
  {
    id: "noah",
    name: "Noah James",
    initials: "NJ",
    tierId: "close-friends",
    x: 68,
    y: 58,
    color: "from-blue-500 to-indigo-500",
    note: "Steady encourager; brings calm to chaos.",
  },
  {
    id: "jamie",
    name: "Jamie Miller",
    initials: "JM",
    tierId: "fun-friends",
    x: 64,
    y: 72,
    color: "from-blue-500 to-sky-500",
    note: "Makes everything an adventure; perfect host.",
  },
  {
    id: "chloe",
    name: "Chloe Irwin",
    initials: "CI",
    tierId: "neighbors",
    x: 62,
    y: 25,
    color: "from-orange-400 to-amber-400",
    note: "Neighbor who always has a spare key and a smile.",
  },
  {
    id: "brooke",
    name: "Brooke King",
    initials: "BK",
    tierId: "neighbors",
    x: 30,
    y: 32,
    color: "from-orange-500 to-amber-500",
    note: "Garden chats and weekend check-ins.",
  },
  {
    id: "kelly",
    name: "Kelly Lang",
    initials: "KL",
    tierId: "fun-friends",
    x: 72,
    y: 70,
    color: "from-amber-400 to-orange-400",
    note: "Spontaneous plans and great playlists.",
  },
  {
    id: "willow",
    name: "Willow Evans",
    initials: "WE",
    tierId: "acquaintances",
    x: 20,
    y: 28,
    color: "from-violet-600 to-purple-600",
    note: "Creative collaborator at local maker nights.",
  },
  {
    id: "isla",
    name: "Isla Ortiz",
    initials: "IO",
    tierId: "acquaintances",
    x: 26,
    y: 54,
    color: "from-violet-500 to-purple-500",
    note: "Met through the book club — sharp insights.",
  },
  {
    id: "lila",
    name: "Lila Adams",
    initials: "LA",
    tierId: "acquaintances",
    x: 18,
    y: 72,
    color: "from-purple-500 to-fuchsia-500",
    note: "Fitness studio acquaintance; positive energy.",
  },
  {
    id: "ella",
    name: "Ella Lopez",
    initials: "EL",
    tierId: "acquaintances",
    x: 82,
    y: 92,
    color: "from-amber-700 to-yellow-700",
    note: "Friendly face from the co-working space.",
  },
  {
    id: "blacklist",
    name: "Marcus Cole",
    initials: "MC",
    tierId: "blacklist",
    x: 12,
    y: 88,
    color: "from-rose-600 to-red-600",
    note: "On pause for now — boundaries set.",
  },
];

export function MyCircle() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedPerson = useMemo(
    () => PEOPLE.find((p) => p.id === selectedId),
    [selectedId]
  );

  const hoveredPerson = useMemo(
    () => PEOPLE.find((p) => p.id === hoveredId),
    [hoveredId]
  );

  const tiers = useMemo(
    () =>
      RINGS.map((ring) => ({
        ...ring,
        people: PEOPLE.filter((p) => p.tierId === ring.id),
      })),
    []
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
              My Circle
            </div>
            <div className="text-lg font-semibold text-slate-900">
              Concentric Circles of Connection
            </div>
            <p className="text-sm text-slate-700">
              Hover to reveal names, click to pop open a mini profile.
            </p>
          </div>
          <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 border border-emerald-100">
            Inspired by OliveMe Counseling
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr,1.2fr]">
        <div className="rounded-2xl border border-slate-200 bg-white/90 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Relationship tiers
              </div>
              <p className="text-sm text-slate-600">
                Each ring keeps names grouped by closeness. Drag your mouse over
                any dot to see who&apos;s where.
              </p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 border border-emerald-100">
              Live Map
            </span>
          </div>

          <div className="space-y-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-emerald-500/10 via-lime-400/15 to-amber-300/10 text-sm font-semibold text-slate-800 shadow-sm">
                    {tier.label}
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold text-slate-900">
                      {tier.text}
                    </div>
                    <div className="text-xs text-slate-600">
                      {tier.people.length} {tier.people.length === 1 ? "person" : "people"} here
                    </div>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {tier.people.slice(0, 3).map((p) => (
                    <span
                      key={p.id}
                      className={`relative flex h-7 w-7 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br ${p.color} text-[11px] font-semibold text-white shadow-sm`}
                    >
                      <span className="relative">{p.initials}</span>
                    </span>
                  ))}
                  {tier.people.length > 3 ? (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-[11px] font-semibold text-slate-600 shadow-sm">
                      +{tier.people.length - 3}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/80 px-3 py-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br from-rose-500 to-red-500 text-sm font-semibold text-white shadow-sm">
                6
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold text-rose-700">Blacklist / Boundaries</div>
                <div className="text-xs text-rose-600">
                  1 person parked here for now
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm">
            <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Quick tip
            </div>
            <p className="text-sm text-slate-700">
              Hover to see names. Click to open a mini profile with a “View more” action you
              could connect to deeper data later.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-lime-50 via-amber-50 to-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
            <div className="relative mx-auto aspect-square w-full max-w-[620px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-100/45 via-amber-50/60 to-lime-100/55 blur-3xl" />

              {RINGS.map((ring) => (
                <div
                  key={ring.id}
                  className="absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border"
                  style={{
                    width: `${ring.size}%`,
                    height: `${ring.size}%`,
                    marginLeft: `-${ring.size / 2}%`,
                    marginTop: `-${ring.size / 2}%`,
                  }}
                >
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${ring.gradient} ${ring.border}`}
                  />
                </div>
              ))}

              {PEOPLE.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onMouseEnter={() => setHoveredId(person.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(person.id)}
                  onBlur={() => setHoveredId(null)}
                  onClick={() => setSelectedId(person.id)}
                  className={`group absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-gradient-to-br ${person.color} text-sm font-semibold text-white shadow-lg transition duration-200 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500`}
                  style={{ left: `${person.x}%`, top: `${person.y}%` }}
                  aria-label={`${person.name} (${person.tierId})`}
                >
                  <span className="absolute inset-0 rounded-full bg-white/10 opacity-0 transition duration-200 group-hover:opacity-100" />
                  <span className="relative">{person.initials}</span>
                </button>
              ))}

              {hoveredPerson ? (
                <div
                  className="pointer-events-none absolute z-20 -translate-y-4 translate-x-3"
                  style={{ left: `${hoveredPerson.x}%`, top: `${hoveredPerson.y}%` }}
                >
                  <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                    {hoveredPerson.name}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white flex items-center justify-center font-semibold">
                {selectedPerson?.initials ?? "?"}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold text-slate-900">
                    {selectedPerson ? selectedPerson.name : "Click a circle to view details"}
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700">
                    View More
                  </span>
                </div>
                <div className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
                  {selectedPerson
                    ? RINGS.find((r) => r.id === selectedPerson.tierId)?.text ??
                      (selectedPerson.tierId === "blacklist" ? "Blacklist" : "")
                    : "Select someone from the map"}
                </div>
                <p className="text-sm text-slate-700">
                  {selectedPerson
                    ? selectedPerson.note
                    : "You can wire this into more detailed cards or profiles later."}
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                  >
                    View profile
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
                    onClick={() => setSelectedId(null)}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
