import {
  PlusIcon,
  ArchiveBoxIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  UsersIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import type { Page, Tooltip } from "../types";

interface SidebarProps {
  isOpen: boolean;
  currentPage: Page;
  tooltip: Tooltip;
  onToggleSidebar: () => void;
  onNewChat: () => void;
  onNavigation: (page: Page) => void;
  onShowTooltip: (text: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onHideTooltip: () => void;
}

const NAV_ITEMS: Array<{
  page: Page;
  icon: React.ComponentType<{ className: string }>;
  label: string;
  tooltip: string;
}> = [
  { page: "memories", icon: ArchiveBoxIcon, label: "Memories", tooltip: "Memories" },
  { page: "history", icon: ClockIcon, label: "Chat History", tooltip: "Chat History" },
  { page: "people", icon: UsersIcon, label: "People", tooltip: "People" },
  { page: "places", icon: MapPinIcon, label: "Places", tooltip: "Places" },
  { page: "birthdays", icon: CalendarDaysIcon, label: "Birthdays", tooltip: "Birthdays" },
];

const SECONDARY_ITEMS: Array<{
  page: Page;
  icon: React.ComponentType<{ className: string }>;
  label: string;
  tooltip: string;
}> = [
  { page: "settings", icon: Cog6ToothIcon, label: "Settings", tooltip: "Settings" },
  { page: "help", icon: QuestionMarkCircleIcon, label: "Help & FAQ", tooltip: "Help & FAQ" },
];

function NavButton({
  page,
  icon: Icon,
  label,
  tooltip,
  isOpen,
  isActive,
  onNavigate,
  onShowTooltip,
  onHideTooltip,
}: {
  page: Page;
  icon: React.ComponentType<{ className: string }>;
  label: string;
  tooltip: string;
  isOpen: boolean;
  isActive: boolean;
  onNavigate: (page: Page) => void;
  onShowTooltip: (text: string, e: React.MouseEvent<HTMLButtonElement>) => void;
  onHideTooltip: () => void;
}) {
  return (
    <button
      onClick={() => onNavigate(page)}
      onMouseEnter={(e) => onShowTooltip(tooltip, e)}
      onMouseLeave={onHideTooltip}
      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-3 ${
        isActive
          ? "bg-blue-100 text-blue-700"
          : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      <Icon className="w-5 h-5" />
      {isOpen && <span>{label}</span>}
    </button>
  );
}

export function Sidebar({
  isOpen,
  currentPage,
  tooltip,
  onToggleSidebar,
  onNewChat,
  onNavigation,
  onShowTooltip,
  onHideTooltip,
}: SidebarProps) {
  return (
    <>
      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="fixed bg-gray-800 text-white text-xs rounded px-2 py-1 z-50 pointer-events-none whitespace-nowrap"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translateY(-50%)",
          }}
        >
          {tooltip.text}
          <div
            className="absolute w-2 h-2 bg-gray-800 rotate-45"
            style={{
              left: "-4px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          ></div>
        </div>
      )}

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onToggleSidebar}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 p-3 flex flex-col gap-3 transition-all duration-200 overflow-hidden fixed inset-y-0 left-0 z-40 md:static md:translate-x-0
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-16'}`}
      >
        {/* Top controls */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
              className="p-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              {isOpen ? (
                <ChevronLeftIcon className="w-5 h-5 text-gray-700" />
              ) : (
                <ChevronRightIcon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            <div className="flex-1">
              {isOpen && (
                <div>
                  <div className="text-sm font-semibold text-gray-800">
                    Memory Assist
                  </div>
                  <div className="text-xs text-gray-500">
                    Personal memory helper
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            {isOpen && <span>New Chat</span>}
          </button>
        </div>

        {/* Primary nav items */}
        <nav className="flex flex-col gap-2 mt-2">
          {NAV_ITEMS.map((item) => (
            <NavButton
              key={item.page}
              page={item.page}
              icon={item.icon}
              label={item.label}
              tooltip={item.tooltip}
              isOpen={isOpen}
              isActive={currentPage === item.page}
              onNavigate={onNavigation}
              onShowTooltip={onShowTooltip}
              onHideTooltip={onHideTooltip}
            />
          ))}
        </nav>

        {/* Secondary nav items */}
        <div className="mt-auto flex flex-col gap-2">
          <div className="border-t border-gray-200 w-full"></div>
          {SECONDARY_ITEMS.map((item) => (
            <NavButton
              key={item.page}
              page={item.page}
              icon={item.icon}
              label={item.label}
              tooltip={item.tooltip}
              isOpen={isOpen}
              isActive={currentPage === item.page}
              onNavigate={onNavigation}
              onShowTooltip={onShowTooltip}
              onHideTooltip={onHideTooltip}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
