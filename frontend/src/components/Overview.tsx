import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChartBarIcon,
  ClockIcon,
  SparklesIcon,
  CameraIcon,
  ArrowTrendingUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CakeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

function formatDateTime(date: Date) {
  const day = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { day, time };
}

const sparkLines = [
  [12, 18, 24, 15, 30, 28, 36],
  [8, 10, 14, 12, 16, 20, 18],
  [20, 22, 25, 19, 24, 30, 35],
];

const throwbackMemories = [
  {
    title: "This day last year",
    caption: "Walk by the riverside at sunset",
    image: "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500",
  },
  {
    title: "Same week last year",
    caption: "Coffee catch-up with Sam",
    image: "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500",
  },
  {
    title: "Same month last year",
    caption: "Weekend hike above the clouds",
    image: "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500",
  },
];

const upcomingMoments = [
  { title: "Emma's birthday", date: "Dec 21", type: "Birthday", accent: "bg-rose-500" },
  { title: "Team offsite", date: "Jan 05", type: "Event", accent: "bg-blue-500" },
  { title: "New Year", date: "Jan 01", type: "Holiday", accent: "bg-emerald-500" },
  { title: "Dad's birthday", date: "Jan 10", type: "Birthday", accent: "bg-amber-500" },
];

function getUpcomingIcon(type: string) {
  const lower = type.toLowerCase();
  if (lower.includes("birthday")) {
    return { Icon: CakeIcon, cls: "text-pink-600 bg-pink-50" };
  }
  if (lower.includes("event") || lower.includes("offsite") || lower.includes("meeting")) {
    return { Icon: UserGroupIcon, cls: "text-blue-600 bg-blue-50" };
  }
  return { Icon: SparklesIcon, cls: "text-amber-600 bg-amber-50" };
}

export function Overview() {
  const [now, setNow] = useState(() => new Date());
  const reelRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  const { day, time } = useMemo(() => formatDateTime(now), [now]);

  function scrollReel(direction: "left" | "right") {
    const el = reelRef.current;
    if (!el) return;
    const delta = direction === "left" ? -300 : 300;
    el.scrollBy({ left: delta, behavior: "smooth" });
    window.setTimeout(updateReelScrollState, 300);
  }

  function updateReelScrollState() {
    const el = reelRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }

  useEffect(() => {
    updateReelScrollState();
    const el = reelRef.current;
    if (!el) return;
    const handle = () => updateReelScrollState();
    el.addEventListener("scroll", handle);
    window.addEventListener("resize", handle);
    return () => {
      el.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full w-fit">
            <SparklesIcon className="w-4 h-4" />
            Welcome back
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Hello there 👋</h1>
          <p className="text-sm text-gray-500">
            Here&apos;s a quick pulse on your day.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm">
          <ClockIcon className="w-5 h-5 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">{day}</span>
            <span className="text-xs text-gray-500">{time}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { label: "Messages today", value: "42", delta: "+8%", color: "from-blue-500 to-blue-600" },
          { label: "Memories saved", value: "128", delta: "+3 new", color: "from-emerald-500 to-teal-500" },
          { label: "Active streak", value: "5 days", delta: "Keep going", color: "from-amber-500 to-orange-500" },
          { label: "Conversations", value: "9", delta: "2 active", color: "from-indigo-500 to-purple-500" },
        ].map((card) => (
          <div
            key={card.label}
            className={`relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm`}
          >
            <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${card.color}`} />
            <div className="p-4 flex flex-col gap-1 relative z-10">
              <span className="text-xs uppercase tracking-wide text-gray-500">{card.label}</span>
              <span className="text-xl font-bold text-gray-900">{card.value}</span>
              <span className="text-xs text-blue-600">{card.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-blue-600" />
              <div className="text-sm font-semibold text-gray-800">This week&apos;s flow</div>
            </div>
            <span className="text-xs text-gray-500">7 day glance</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {sparkLines.map((line, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-gray-100 bg-blue-50/50">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>{idx === 0 ? "Chats" : idx === 1 ? "Memories" : "Notes"}</span>
                  <ArrowTrendingUpIcon className="w-4 h-4 text-blue-500" />
                </div>
                <div className="h-20 flex items-end gap-1">
                  {line.map((v, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-full bg-gradient-to-t from-blue-200 to-blue-500"
                      style={{ height: `${20 + v}%` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-emerald-600" />
            <div className="text-sm font-semibold text-gray-800">Upcoming</div>
          </div>
          <div className="space-y-2">
            {upcomingMoments.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white ${item.accent}`}>
                    <div className="flex flex-col items-center leading-tight">
                      <span className="text-[10px] font-semibold uppercase tracking-tight">
                        {item.date.split(" ")[0]}
                      </span>
                      <span className="text-sm font-bold">
                        {item.date.split(" ")[1]}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 truncate">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.type}</div>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  {(() => {
                    const { Icon, cls } = getUpcomingIcon(item.type);
                    return (
                      <span className={`w-9 h-9 rounded-full ${cls} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </span>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CameraIcon className="w-5 h-5 text-pink-500" />
            <div className="text-sm font-semibold text-gray-800">Flashback reel</div>
          </div>
          <div className="text-xs text-gray-500">Swipe through last year&apos;s highlights</div>
        </div>
        <div className="relative">
          <div
            ref={reelRef}
            className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex gap-4 pb-2 min-w-full">
              {throwbackMemories.map((mem) => (
                <div
                  key={mem.title}
                  className="min-w-[240px] md:min-w-[280px] rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-white transition-all hover:-translate-y-1 hover:shadow-xl hover:border-blue-200"
                >
                  <div className={`h-28 ${mem.image}`} />
                  <div className="p-3">
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      {mem.title}
                    </div>
                    <div className="text-sm font-semibold text-gray-800">
                      {mem.caption}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollReel("left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border border-blue-200 shadow-sm text-blue-600 hover:bg-blue-50 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              aria-label="Previous flashback"
            >
              <ChevronLeftIcon className="w-5 h-5 mx-auto" />
            </button>
          )}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollReel("right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-9 h-9 rounded-full bg-white border border-blue-200 shadow-sm text-blue-600 hover:bg-blue-50 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              aria-label="Next flashback"
            >
              <ChevronRightIcon className="w-5 h-5 mx-auto" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
