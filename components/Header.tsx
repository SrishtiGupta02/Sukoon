"use client";

import React from "react";
import { useSukoon } from "@/lib/context";
import { t } from "@/data/translations";
import {
  SukoonLogoIcon,
  PlayIcon,
  ShieldIcon,
} from "@/components/Icons";
import { ActiveTab } from "@/lib/types";

export default function Header() {
  const {
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    isDemoMode,
    startDemoMode,
    stopDemoMode,
  } = useSukoon();

  const copy = t(language);

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: "map", label: copy.navMap },
    { id: "partner", label: copy.navPartner },
    { id: "city", label: copy.navCity },
  ];

  return (
    <header className="sticky top-0 z-30 bg-cream-50/95 backdrop-blur-md border-b border-cream-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
        {/* Brand Identity */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab("map")}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <SukoonLogoIcon className="w-8 h-8 shrink-0 transition-transform group-hover:scale-105" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-sukoon-950">
                  Sukoon
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sukoon-50 text-sukoon-800 border border-sukoon-200">
                  <ShieldIcon className="w-3 h-3 text-sukoon-700" />
                  {copy.anonymousBadge}
                </span>
              </div>
              <p className="text-[11px] text-sand-700 leading-tight">
                {copy.brandSubtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Switcher (Desktop & Mobile) */}
        <nav
          aria-label="Main Views"
          className="order-3 sm:order-2 w-full sm:w-auto flex items-center justify-center bg-cream-200/90 p-1 rounded-xl border border-cream-300"
        >
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  active
                    ? "bg-sukoon-800 text-cream-50 shadow-sm"
                    : "text-sand-800 hover:text-sukoon-900 hover:bg-cream-100/60"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions: Language Toggle + Demo Mode */}
        <div className="order-2 sm:order-3 flex items-center gap-2">
          {/* EN / HI Language Toggle */}
          <div
            role="group"
            aria-label="Language"
            className="inline-flex rounded-xl bg-cream-200 p-0.5 border border-cream-300"
          >
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                language === "en"
                  ? "bg-white text-sukoon-900 shadow-sm"
                  : "text-sand-700 hover:text-sand-900"
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                language === "hi"
                  ? "bg-white text-sukoon-900 shadow-sm"
                  : "text-sand-700 hover:text-sand-900"
              }`}
            >
              हिं
            </button>
          </div>

          {/* Pitch / Demo Mode Toggle */}
          <button
            type="button"
            onClick={isDemoMode ? stopDemoMode : startDemoMode}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition shadow-sm ${
              isDemoMode
                ? "bg-amber-600 hover:bg-amber-700 text-white ring-2 ring-amber-200"
                : "bg-sukoon-700 hover:bg-sukoon-800 text-cream-50"
            }`}
          >
            <PlayIcon className="w-3.5 h-3.5" />
            <span>{isDemoMode ? copy.stopDemo : copy.demoMode}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
