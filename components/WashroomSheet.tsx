"use client";

import React, { useState } from "react";
import { useSukoon } from "@/lib/context";
import { t } from "@/data/translations";
import {
  PartnerTypeIcon,
  VerifiedSealIcon,
  ShieldIcon,
  WaterDropIcon,
  LockIcon,
  BabyChangeIcon,
  QrCodeIcon,
  MapPinIcon,
} from "@/components/Icons";

function getScoreBadgeClasses(score: number) {
  if (score >= 4.6) {
    return "bg-sukoon-800 text-cream-50 border-sukoon-900";
  }
  if (score >= 4.0) {
    return "bg-sukoon-600 text-cream-50 border-sukoon-700";
  }
  return "bg-amber-600 text-white border-amber-700";
}

export default function WashroomSheet() {
  const {
    filteredWashrooms,
    selectedWashroom,
    selectWashroom,
    openCheckIn,
    language,
  } = useSukoon();

  const [mobileExpanded, setMobileExpanded] = useState(false);
  const copy = t(language);

  return (
    <div className="flex flex-col h-full bg-cream-100 rounded-2xl border border-cream-300 shadow-soft overflow-hidden">
      {/* Mobile Bottom-Sheet Handle */}
      <div className="lg:hidden flex flex-col items-center pt-2 pb-1 bg-cream-50 border-b border-cream-200">
        <button
          type="button"
          onClick={() => setMobileExpanded((prev) => !prev)}
          className="w-full flex flex-col items-center py-1 focus:outline-none"
        >
          <span className="w-10 h-1.5 rounded-full bg-cream-400 mb-1.5" />
          <span className="text-xs font-semibold text-sukoon-800">
            {mobileExpanded
              ? language === "hi"
                ? "मानचित्र बड़ा करें"
                : "Show More Map"
              : `${copy.sheetTitle} (${filteredWashrooms.length})`}
          </span>
        </button>
      </div>

      {/* Problem Context Card */}
      <div className="p-3.5 sm:p-4 bg-sukoon-900 text-cream-50 border-b border-sukoon-800">
        <p className="text-xs sm:text-sm font-bold text-sukoon-200 mb-1">
          {copy.problemHeadline}
        </p>
        <p className="text-[11px] sm:text-xs text-cream-100/90 leading-relaxed">
          {copy.problemCopy}
        </p>
      </div>

      {/* Sheet Header */}
      <div className="px-4 py-2.5 bg-cream-50 border-b border-cream-300 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-sand-900">{copy.sheetTitle}</h2>
          <p className="text-[11px] text-sand-700 flex items-center gap-1">
            <MapPinIcon className="w-3 h-3 text-sukoon-700" />
            <span>{copy.sortedByDistance}</span>
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sukoon-50 text-sukoon-800 border border-sukoon-200">
          {filteredWashrooms.length}
        </span>
      </div>

      {/* Scrollable Partner Washroom List */}
      <div
        className={`flex-1 overflow-y-auto divide-y divide-cream-200 px-3 py-2.5 space-y-2.5 ${
          mobileExpanded ? "max-h-[65vh]" : "max-h-[42vh] lg:max-h-none"
        }`}
      >
        {filteredWashrooms.length === 0 ? (
          <div className="py-10 px-4 text-center">
            <p className="text-sm font-semibold text-sand-800 mb-1">
              {language === "hi"
                ? "इन फ़िल्टर के साथ कोई पार्टनर वॉशरूम नहीं मिला"
                : "No partner washrooms match all active filters"}
            </p>
            <p className="text-xs text-sand-700">
              {language === "hi"
                ? "कृपया ऊपर दिए गए फ़िल्टर को रीसेट करें।"
                : "Try toggling off one of the filter chips above."}
            </p>
          </div>
        ) : (
          filteredWashrooms.map((w) => {
            const isSelected = selectedWashroom?.id === w.id;
            return (
              <div
                key={w.id}
                onClick={() => selectWashroom(w, true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    selectWashroom(w, true);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white border-sukoon-600 ring-2 ring-sukoon-500/20 shadow-soft"
                    : "bg-cream-50/90 hover:bg-white border-cream-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sukoon-800 bg-sukoon-50 px-2 py-0.5 rounded-md border border-sukoon-200">
                        <PartnerTypeIcon type={w.type} className="w-3 h-3" />
                        {copy.partnerTypes[w.type]}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          w.isOpenNow
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {w.isOpenNow ? copy.openNowBadge : copy.closedBadge}
                      </span>
                      <span className="text-[11px] font-semibold text-sand-700">
                        • {w.distanceKm.toFixed(1)} km
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-sand-900 truncate">
                      {language === "hi" ? w.nameHi : w.name}
                    </h3>
                    <p className="text-xs text-sand-700 truncate">
                      {language === "hi" ? w.areaHi : w.area} • {w.hours}
                    </p>
                  </div>

                  {/* Cleanliness & Quality Score Pill */}
                  <div className="flex flex-col items-end shrink-0">
                    <div
                      className={`px-2.5 py-1 rounded-xl border text-sm font-bold tracking-tight ${getScoreBadgeClasses(
                        w.averageScore
                      )}`}
                    >
                      {w.averageScore.toFixed(1)}
                    </div>
                    <span className="text-[10px] text-sand-700 mt-1">
                      {w.totalRatings}{" "}
                      {language === "hi" ? "रेटिंग" : "ratings"}
                    </span>
                  </div>
                </div>

                {/* Verified Sticker & Facility Badges */}
                <div className="mt-2.5 pt-2.5 border-t border-cream-200 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {w.verifiedPartner && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sukoon-800 bg-sukoon-100/70 px-2 py-0.5 rounded-full">
                        <VerifiedSealIcon className="w-3.5 h-3.5 text-sukoon-700" />
                        {copy.verifiedPartnerSticker}
                      </span>
                    )}
                    {w.womenSafe && (
                      <span
                        title={copy.filters.womenSafe}
                        className="inline-flex items-center gap-1 text-[11px] text-sand-800 bg-cream-200/80 px-2 py-0.5 rounded-full"
                      >
                        <ShieldIcon className="w-3 h-3 text-sukoon-700" />
                        <span>{copy.filters.womenSafe}</span>
                      </span>
                    )}
                    {w.innerLock && (
                      <span
                        title={copy.filters.innerLock}
                        className="inline-flex items-center gap-1 text-[11px] text-sand-800 bg-cream-200/80 px-2 py-0.5 rounded-full"
                      >
                        <LockIcon className="w-3 h-3 text-sukoon-700" />
                        <span>{copy.filters.innerLock}</span>
                      </span>
                    )}
                    {w.hasWater && (
                      <span
                        title={copy.filters.hasWater}
                        className="inline-flex items-center gap-1 text-[11px] text-sand-800 bg-cream-200/80 px-2 py-0.5 rounded-full"
                      >
                        <WaterDropIcon className="w-3 h-3 text-sukoon-700" />
                      </span>
                    )}
                    {w.babyChange && (
                      <span
                        title={copy.filters.babyChange}
                        className="inline-flex items-center gap-1 text-[11px] text-sand-800 bg-cream-200/80 px-2 py-0.5 rounded-full"
                      >
                        <BabyChangeIcon className="w-3 h-3 text-sukoon-700" />
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectWashroom(w, false);
                      openCheckIn("qr");
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-sukoon-700 hover:bg-sukoon-800 text-cream-50 transition"
                  >
                    <QrCodeIcon className="w-3.5 h-3.5" />
                    <span>{copy.checkInRateBtn}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
