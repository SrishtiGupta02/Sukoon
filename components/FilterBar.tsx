"use client";

import React from "react";
import { useSukoon } from "@/lib/context";
import { t } from "@/data/translations";
import { FilterState } from "@/lib/types";
import {
  ClockIcon,
  ShieldIcon,
  WaterDropIcon,
  LockIcon,
  BabyChangeIcon,
} from "@/components/Icons";

export default function FilterBar() {
  const {
    filters,
    toggleFilter,
    resetFilters,
    filteredWashrooms,
    washrooms,
    language,
  } = useSukoon();

  const copy = t(language);

  const chipItems: {
    key: keyof FilterState;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "openNow",
      label: copy.filters.openNow,
      icon: <ClockIcon className="w-3.5 h-3.5" />,
    },
    {
      key: "womenSafe",
      label: copy.filters.womenSafe,
      icon: <ShieldIcon className="w-3.5 h-3.5" />,
    },
    {
      key: "hasWater",
      label: copy.filters.hasWater,
      icon: <WaterDropIcon className="w-3.5 h-3.5" />,
    },
    {
      key: "innerLock",
      label: copy.filters.innerLock,
      icon: <LockIcon className="w-3.5 h-3.5" />,
    },
    {
      key: "babyChange",
      label: copy.filters.babyChange,
      icon: <BabyChangeIcon className="w-3.5 h-3.5" />,
    },
  ];

  const anyActive = Object.values(filters).some(Boolean);

  return (
    <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-2 shrink-0">
        {chipItems.map((chip) => {
          const active = filters[chip.key];
          return (
            <button
              key={chip.key}
              type="button"
              onClick={() => toggleFilter(chip.key)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all select-none shrink-0 border ${
                active
                  ? "bg-sukoon-800 text-cream-50 border-sukoon-800 shadow-sm"
                  : "bg-cream-50 text-sand-800 border-cream-300 hover:border-sukoon-600 hover:bg-sukoon-50/50"
              }`}
            >
              {chip.icon}
              <span>{chip.label}</span>
            </button>
          );
        })}

        {anyActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="px-3 py-2 rounded-full text-xs font-semibold text-sukoon-800 hover:bg-cream-200 transition shrink-0"
          >
            {copy.filters.reset}
          </button>
        )}
      </div>

      <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-sand-700 shrink-0 pl-2">
        <span className="font-bold text-sukoon-800">
          {filteredWashrooms.length}
        </span>
        <span>/ {washrooms.length}</span>
        <span>
          {language === "hi" ? "पार्टनर वॉशरूम" : "Partner washrooms"}
        </span>
      </div>
    </div>
  );
}
