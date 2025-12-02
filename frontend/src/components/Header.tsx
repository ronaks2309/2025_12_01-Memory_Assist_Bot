import { Bars3Icon } from "@heroicons/react/24/outline";
import type { Page } from "../types";
import { PAGE_TITLES, PAGE_DESCRIPTIONS } from "../utils/constants";

interface HeaderProps {
  currentPage: Page;
  onMenuClick: () => void;
}

export function Header({ currentPage, onMenuClick }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-base font-semibold text-gray-800">
            {PAGE_TITLES[currentPage]}
          </h1>
          <p className="text-xs text-gray-500">
            {PAGE_DESCRIPTIONS[currentPage]}
          </p>
        </div>
      </div>
    </header>
  );
}
