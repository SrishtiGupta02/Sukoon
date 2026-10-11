"use client";

import React from "react";
import Header from "@/components/Header";
import FilterBar from "@/components/FilterBar";
import MapView from "@/components/MapView";
import WashroomSheet from "@/components/WashroomSheet";
import WashroomDetailModal from "@/components/WashroomDetailModal";
import CheckInModal from "@/components/CheckInModal";
import PartnerDashboard from "@/components/PartnerDashboard";
import CityDashboard from "@/components/CityDashboard";
import DemoController from "@/components/DemoController";
import { useSukoon } from "@/lib/context";
import { t } from "@/data/translations";
import { CheckCircleIcon, CloseIcon, ShieldIcon } from "@/components/Icons";

export default function SukoonHomePage() {
  const {
    activeTab,
    filteredWashrooms,
    selectedWashroom,
    selectWashroom,
    language,
    toastMessage,
    dismissToast,
  } = useSukoon();

  const copy = t(language);

  return (
    <div className="min-h-screen flex flex-col bg-cream-100">
      {/* Top Navigation & Controls */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === "map" && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 space-y-3">
            {/* Filter Chips Strip */}
            <FilterBar />

            {/* Mobile-First Map + Bottom Sheet / Desktop Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[calc(100vh-195px)] lg:min-h-[580px]">
              {/* Map Area */}
              <div className="lg:col-span-7 xl:col-span-8 h-[350px] sm:h-[420px] lg:h-full">
                <MapView
                  washrooms={filteredWashrooms}
                  selectedWashroom={selectedWashroom}
                  onSelectWashroom={(w) => selectWashroom(w, true)}
                  language={language}
                  mode="pins"
                />
              </div>

              {/* Bottom Sheet (Mobile) / Side Panel (Desktop) */}
              <div className="lg:col-span-5 xl:col-span-4 lg:h-full overflow-hidden">
                <WashroomSheet />
              </div>
            </div>
          </div>
        )}

        {activeTab === "partner" && <PartnerDashboard />}

        {activeTab === "city" && <CityDashboard />}
      </main>

      {/* Washroom Detail Modal (Screen 2) */}
      <WashroomDetailModal />

      {/* QR Check-In & 10-Second Rating Modal (Screen 3) */}
      <CheckInModal />

      {/* 90-Second Pitch Mode HUD & Controller (Screen 6) */}
      <DemoController />

      {/* Live Rating Confirmation Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-6 sm:translate-x-0 z-[70] bg-sukoon-900 text-cream-50 px-4 py-3 rounded-2xl shadow-elevated border border-sukoon-700 flex items-center gap-2.5 animate-fadeIn max-w-sm w-[92%] sm:w-auto"
        >
          <CheckCircleIcon className="w-5 h-5 text-sukoon-300 shrink-0" />
          <span className="text-xs sm:text-sm font-bold flex-1">
            {toastMessage}
          </span>
          <button
            type="button"
            onClick={dismissToast}
            aria-label="Dismiss notification"
            className="p-1 rounded-lg hover:bg-white/10 text-cream-200"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Footer with Privacy & Safety Copy and Demo Data Notice */}
      <footer className="bg-cream-50 border-t border-cream-300 py-3 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-sand-700">
          <div className="flex items-center gap-1.5 font-medium text-sand-800">
            <ShieldIcon className="w-4 h-4 text-sukoon-700 shrink-0" />
            <span>{copy.privacySafetyNotice}</span>
          </div>
          <div className="text-[11px] font-semibold text-sand-700">
            {copy.demoDataFooter}
          </div>
        </div>
      </footer>
    </div>
  );
}
