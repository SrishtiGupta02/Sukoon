"use client";

import React from "react";
import { useSukoon } from "@/lib/context";
import { t } from "@/data/translations";
import {
  CloseIcon,
  PartnerTypeIcon,
  VerifiedSealIcon,
  SparkleCleanIcon,
  ShieldIcon,
  LockIcon,
  WaterDropIcon,
  DirectionsIcon,
  QrCodeIcon,
  StarIcon,
  ClockIcon,
  BabyChangeIcon,
} from "@/components/Icons";

export default function WashroomDetailModal() {
  const {
    selectedWashroom,
    isDetailOpen,
    setIsDetailOpen,
    openCheckIn,
    language,
    setActiveTab,
    setPartnerSelectedId,
  } = useSukoon();

  if (!isDetailOpen || !selectedWashroom) return null;

  const w = selectedWashroom;
  const copy = t(language);

  const subScoreItems = [
    {
      key: "clean",
      label: copy.subScores.clean,
      value: w.scores.clean,
      icon: <SparkleCleanIcon className="w-4 h-4 text-sukoon-700" />,
    },
    {
      key: "safe",
      label: copy.subScores.safe,
      value: w.scores.safe,
      icon: <ShieldIcon className="w-4 h-4 text-sukoon-700" />,
    },
    {
      key: "lock",
      label: copy.subScores.lock,
      value: w.scores.lock,
      icon: <LockIcon className="w-4 h-4 text-sukoon-700" />,
    },
    {
      key: "water",
      label: copy.subScores.water,
      value: w.scores.water,
      icon: <WaterDropIcon className="w-4 h-4 text-sukoon-700" />,
    },
  ];

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${w.lat},${w.lng}`;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-sukoon-950/55 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
      onClick={() => setIsDetailOpen(false)}
    >
      <div
        className="w-full max-w-lg max-h-[92vh] overflow-y-auto bg-cream-50 rounded-t-3xl sm:rounded-3xl border border-cream-300 shadow-elevated text-sand-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner with Verified Partner Sticker */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-sukoon-900 via-sukoon-800 to-sukoon-900 text-cream-50 relative">
          <button
            type="button"
            onClick={() => setIsDetailOpen(false)}
            aria-label="Close detail"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-cream-50 transition"
          >
            <CloseIcon className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3 pr-10">
            {/* Verified Partner Window Sticker */}
            {w.verifiedPartner && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sukoon-50 text-sukoon-900 text-xs font-bold shadow-sm border border-sukoon-200">
                <VerifiedSealIcon className="w-4 h-4 text-sukoon-700" />
                <span>{copy.verifiedPartnerSticker}</span>
                <span className="text-sukoon-700 font-mono text-[11px]">
                  • {w.code}
                </span>
              </div>
            )}

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                w.isOpenNow
                  ? "bg-emerald-400/20 text-emerald-100 border border-emerald-300/30"
                  : "bg-stone-500/30 text-stone-200"
              }`}
            >
              {w.isOpenNow ? copy.openNowBadge : copy.closedBadge}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {language === "hi" ? w.nameHi : w.name}
          </h2>
          <p className="text-xs sm:text-sm text-sukoon-100 mt-1">
            {w.address} • {w.distanceKm.toFixed(1)} km
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/15 text-xs text-sukoon-100">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <PartnerTypeIcon type={w.type} className="w-4 h-4 text-sukoon-200" />
                {copy.partnerTypes[w.type]}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4 text-sukoon-200" />
                {w.hours}
              </span>
            </div>
            {w.babyChange && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-cream-50">
                <BabyChangeIcon className="w-3.5 h-3.5" />
                {copy.filters.babyChange}
              </span>
            )}
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Overall Average + 4 Sub-scores */}
          <div className="bg-cream-100 rounded-2xl p-4 border border-cream-300">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cream-300">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-sand-700">
                  {language === "hi"
                    ? "सत्यापित गुणवत्ता स्कोर"
                    : "Verified Quality Score"}
                </span>
                <p className="text-xs text-sand-700 mt-0.5">
                  {language === "hi"
                    ? `${w.totalRatings} गुमनाम चेक-इन पर आधारित`
                    : `Based on ${w.totalRatings} anonymous check-ins`}
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-sukoon-800 text-cream-50 px-3.5 py-2 rounded-2xl shadow-sm">
                <StarIcon className="w-4 h-4 text-sukoon-200" />
                <span className="text-xl font-extrabold">
                  {w.averageScore.toFixed(1)}
                </span>
                <span className="text-xs text-sukoon-200">/ 5.0</span>
              </div>
            </div>

            {/* 4 Sub-scores Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {subScoreItems.map((item) => {
                const pct = Math.min(100, Math.round((item.value / 5) * 100));
                return (
                  <div
                    key={item.key}
                    className="bg-white rounded-xl p-3 border border-cream-200 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-sand-800 truncate">
                        {item.icon}
                        <span>{item.label}</span>
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold text-sukoon-900 shrink-0">
                        {item.value.toFixed(1)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-cream-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sukoon-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Action Buttons: Check-in & Rate + Directions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => openCheckIn("qr")}
              className="w-full py-3.5 px-4 rounded-2xl bg-sukoon-700 hover:bg-sukoon-800 text-cream-50 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              <QrCodeIcon className="w-5 h-5" />
              <span>{copy.checkInRateBtn}</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-cream-200 text-sukoon-900 border border-cream-300 font-bold text-sm flex items-center justify-center gap-2 transition"
            >
              <DirectionsIcon className="w-5 h-5 text-sukoon-700" />
              <span>{copy.directionsBtn} (Google Maps)</span>
            </a>
          </div>

          {/* Last 3 Anonymous Ratings */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-sand-900">
                {copy.recentRatingsTitle}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setPartnerSelectedId(w.id);
                  setIsDetailOpen(false);
                  setActiveTab("partner");
                }}
                className="text-xs font-semibold text-sukoon-700 hover:text-sukoon-900 underline underline-offset-2"
              >
                {language === "hi"
                  ? "पार्टनर स्टाइपेंड देखें →"
                  : "View Partner Stipend →"}
              </button>
            </div>

            <div className="space-y-2.5">
              {w.recentRatings.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-3.5 rounded-xl bg-white border border-cream-300 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sand-700">
                      {language === "hi"
                        ? `गुमनाम उपयोगकर्ता • ${r.timestampHi}`
                        : `Anonymous user • ${r.timestamp}`}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sukoon-50 text-sukoon-800 font-bold border border-sukoon-200">
                      <StarIcon className="w-3 h-3 text-sukoon-600" />
                      {r.average.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sand-800 leading-relaxed">
                    {language === "hi" ? r.commentHi : r.comment}
                  </p>
                  {r.issueReported && (
                    <span className="inline-block px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium text-[11px]">
                      {language === "hi" ? "रिपोर्ट:" : "Issue noted:"}{" "}
                      {r.issueReported}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Privacy and Safety Copy */}
          <div className="p-3.5 rounded-xl bg-cream-200/80 border border-cream-300 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-sand-800">
              <ShieldIcon className="w-4 h-4 text-sukoon-700 shrink-0" />
              <span className="font-medium">{copy.privacySafetyNotice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
