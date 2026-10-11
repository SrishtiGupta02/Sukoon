"use client";

import React, { useEffect, useState } from "react";
import { useSukoon } from "@/lib/context";
import { t } from "@/data/translations";
import { SubScores } from "@/lib/types";
import {
  CloseIcon,
  QrCodeIcon,
  SparkleCleanIcon,
  ShieldIcon,
  LockIcon,
  WaterDropIcon,
  VerifiedSealIcon,
} from "@/components/Icons";

export default function CheckInModal() {
  const {
    selectedWashroom,
    isCheckInOpen,
    closeCheckIn,
    checkInStep,
    setCheckInStep,
    submitRating,
    language,
    isDemoMode,
    demoScoresOverride,
  } = useSukoon();

  const [scores, setScores] = useState<SubScores>({
    clean: 5,
    safe: 5,
    lock: 5,
    water: 5,
  });
  const [selectedIssue, setSelectedIssue] = useState<string>("");
  const [comment, setComment] = useState<string>("");

  // Reset form when opening
  useEffect(() => {
    if (isCheckInOpen) {
      setScores({ clean: 5, safe: 5, lock: 5, water: 5 });
      setSelectedIssue("");
      setComment("");
    }
  }, [isCheckInOpen, selectedWashroom?.id]);

  // Sync with Demo Mode slider overrides if active
  useEffect(() => {
    if (demoScoresOverride) {
      setScores(demoScoresOverride);
    }
  }, [demoScoresOverride]);

  // Auto-advance simulated QR scan after 1.7s when not controlled by Demo Mode
  useEffect(() => {
    if (!isCheckInOpen || checkInStep !== "qr" || isDemoMode) return;
    const timer = setTimeout(() => {
      setCheckInStep("rate");
    }, 1700);
    return () => clearTimeout(timer);
  }, [isCheckInOpen, checkInStep, isDemoMode, setCheckInStep]);

  if (!isCheckInOpen || !selectedWashroom) return null;

  const w = selectedWashroom;
  const copy = t(language);

  const sliderConfigs: {
    key: keyof SubScores;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "clean",
      label: copy.subScores.clean,
      icon: <SparkleCleanIcon className="w-4 h-4 text-sukoon-700" />,
    },
    {
      key: "safe",
      label: copy.subScores.safe,
      icon: <ShieldIcon className="w-4 h-4 text-sukoon-700" />,
    },
    {
      key: "lock",
      label: copy.subScores.lock,
      icon: <LockIcon className="w-4 h-4 text-sukoon-700" />,
    },
    {
      key: "water",
      label: copy.subScores.water,
      icon: <WaterDropIcon className="w-4 h-4 text-sukoon-700" />,
    },
  ];

  const liveAverage = (
    (scores.clean + scores.safe + scores.lock + scores.water) /
    4
  ).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRating(
      w.id,
      scores,
      selectedIssue || undefined,
      comment || undefined
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-sukoon-950/65 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn"
      onClick={closeCheckIn}
    >
      <div
        className="w-full max-w-md max-h-[92vh] overflow-y-auto bg-cream-50 rounded-t-3xl sm:rounded-3xl border border-cream-300 shadow-elevated text-sand-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-sukoon-900 text-cream-50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sukoon-200">
              {w.code} • {language === "hi" ? w.nameHi : w.name}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {checkInStep === "qr" ? copy.qrTitle : copy.rateTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCheckIn}
            aria-label="Close check-in"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-cream-50 transition"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {checkInStep === "qr" ? (
          /* Step 1: Simulated QR Scan Screen */
          <div className="p-6 text-center space-y-5">
            <p className="text-xs sm:text-sm text-sand-700 max-w-xs mx-auto">
              {copy.qrSubtitle}
            </p>

            {/* Camera Viewfinder Simulation */}
            <div className="relative mx-auto w-56 h-56 rounded-3xl bg-sukoon-950 p-5 flex flex-col items-center justify-center overflow-hidden shadow-inner border-4 border-sukoon-800">
              {/* Corner Reticles */}
              <span className="absolute top-3 left-3 w-7 h-7 border-t-4 border-l-4 border-sukoon-200 rounded-tl-lg" />
              <span className="absolute top-3 right-3 w-7 h-7 border-t-4 border-r-4 border-sukoon-200 rounded-tr-lg" />
              <span className="absolute bottom-3 left-3 w-7 h-7 border-b-4 border-l-4 border-sukoon-200 rounded-bl-lg" />
              <span className="absolute bottom-3 right-3 w-7 h-7 border-b-4 border-r-4 border-sukoon-200 rounded-br-lg" />

              {/* Animated Scanning Line */}
              <div className="absolute inset-x-4 h-0.5 bg-sukoon-400 shadow-[0_0_12px_#2dd4bf] animate-scanLine" />

              {/* Simulated Storefront Sticker inside Viewfinder */}
              <div className="bg-cream-50 rounded-2xl p-3.5 text-sukoon-900 flex flex-col items-center shadow-md">
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sukoon-800 mb-1.5">
                  <VerifiedSealIcon className="w-3.5 h-3.5 text-sukoon-700" />
                  <span>SUKOON VERIFIED</span>
                </div>
                <QrCodeIcon className="w-20 h-20 text-sukoon-950" />
                <span className="mt-1 font-mono text-[11px] font-bold text-sukoon-800">
                  {w.code}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-sukoon-800">
              <span className="w-2 h-2 rounded-full bg-sukoon-600 animate-ping" />
              <span>{copy.qrSimulating}</span>
            </div>

            <button
              type="button"
              onClick={() => setCheckInStep("rate")}
              className="w-full py-3 px-4 rounded-2xl bg-sukoon-700 hover:bg-sukoon-800 text-cream-50 font-bold text-sm transition"
            >
              {copy.qrScanInstantBtn}
            </button>
          </div>
        ) : (
          /* Step 2: 10-Second Rating Form (4 Tap-Sliders + Optional Issue Report) */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="flex items-center justify-between bg-sukoon-50 border border-sukoon-200 rounded-2xl px-4 py-2.5">
              <span className="text-xs text-sukoon-900 font-medium pr-2">
                {copy.rateSubtitle}
              </span>
              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-sukoon-700 block">
                  {language === "hi" ? "कुल स्कोर" : "Your Avg"}
                </span>
                <span className="text-lg font-extrabold text-sukoon-900">
                  {liveAverage}
                </span>
              </div>
            </div>

            {/* 4 Tap-Sliders */}
            <div className="space-y-3">
              {sliderConfigs.map((item) => {
                const currentVal = scores[item.key];
                return (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-2xl bg-white border border-cream-300 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-sand-900">
                        {item.icon}
                        {item.label}
                      </span>
                      <span className="text-sm font-extrabold text-sukoon-800 bg-sukoon-50 px-2.5 py-0.5 rounded-lg border border-sukoon-200">
                        {currentVal.toFixed(1)} / 5
                      </span>
                    </div>

                    {/* Large Tap Targets (1 to 5) + Range Slider */}
                    <div className="grid grid-cols-5 gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => {
                        const active = currentVal >= num;
                        const exact = Math.round(currentVal) === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() =>
                              setScores((prev) => ({
                                ...prev,
                                [item.key]: num,
                              }))
                            }
                            className={`py-2 rounded-xl text-xs font-bold border transition ${
                              exact
                                ? "bg-sukoon-800 text-cream-50 border-sukoon-900 shadow-xs"
                                : active
                                ? "bg-sukoon-100 text-sukoon-900 border-sukoon-300"
                                : "bg-cream-100 text-sand-700 border-cream-300 hover:bg-cream-200"
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.5}
                      value={currentVal}
                      onChange={(e) =>
                        setScores((prev) => ({
                          ...prev,
                          [item.key]: parseFloat(e.target.value),
                        }))
                      }
                      aria-label={item.label}
                      className="w-full accent-sukoon-700 h-1.5 bg-cream-200 rounded-lg cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            {/* Optional Report Issue */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-sand-800">
                {copy.reportIssueLabel}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {copy.issues.map((issue) => {
                  const active = selectedIssue === issue;
                  return (
                    <button
                      key={issue}
                      type="button"
                      onClick={() =>
                        setSelectedIssue((prev) =>
                          prev === issue ? "" : issue
                        )
                      }
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
                        active
                          ? "bg-amber-600 text-white border-amber-700"
                          : "bg-white text-sand-800 border-cream-300 hover:bg-cream-200"
                      }`}
                    >
                      {issue}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  language === "hi"
                    ? "छोटी टिप्पणी जोड़ें (वैकल्पिक)..."
                    : "Add a quick anonymous note (optional)..."
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-cream-300 text-xs text-sand-900 placeholder:text-sand-700/60 focus:outline-none focus:border-sukoon-600"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-sukoon-700 hover:bg-sukoon-800 text-cream-50 font-bold text-sm shadow-sm transition"
            >
              {copy.submitRatingBtn}
            </button>

            <p className="text-[11px] text-center text-sand-700">
              {copy.privacySafetyNotice}
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
