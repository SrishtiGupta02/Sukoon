"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
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

const QR_READER_ELEMENT_ID = "sukoon-html5-qr-reader";

export default function CheckInModal() {
  const {
    washrooms,
    selectedWashroom,
    selectWashroom,
    isCheckInOpen,
    closeCheckIn,
    checkInStep,
    setCheckInStep,
    submitRating,
    language,
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

  // Camera scanner states
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraStarting, setCameraStarting] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [qrMatchError, setQrMatchError] = useState<string | null>(null);

  const scannerRef = useRef<{
    stop: () => Promise<void>;
    clear: () => void;
    isScanning?: boolean;
  } | null>(null);

  const stopScanner = useCallback(async () => {
    const instance = scannerRef.current;
    scannerRef.current = null;
    if (instance) {
      try {
        if (instance.isScanning) {
          await instance.stop();
        }
      } catch {
        // ignore stop errors
      }
      try {
        instance.clear();
      } catch {
        // ignore clear errors
      }
    }
    setCameraActive(false);
    setCameraStarting(false);
  }, []);

  // Reset form and stop camera when opening/closing or switching steps
  useEffect(() => {
    if (isCheckInOpen) {
      setScores({ clean: 5, safe: 5, lock: 5, water: 5 });
      setSelectedIssue("");
      setComment("");
      setCameraError(null);
      setQrMatchError(null);
    } else {
      stopScanner();
    }
  }, [isCheckInOpen, selectedWashroom?.id, stopScanner]);

  useEffect(() => {
    if (checkInStep !== "qr") {
      stopScanner();
    }
  }, [checkInStep, stopScanner]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  // Sync with Demo Mode slider overrides if active
  useEffect(() => {
    if (demoScoresOverride) {
      setScores(demoScoresOverride);
    }
  }, [demoScoresOverride]);

  const handleStartCamera = async () => {
    setQrMatchError(null);
    setCameraError(null);
    setCameraStarting(true);
    setCameraActive(true);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      await stopScanner();
      setCameraActive(true);
      setCameraStarting(true);

      const html5QrCode = new Html5Qrcode(QR_READER_ELEMENT_ID);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 200, height: 200 },
        },
        async (decodedText) => {
          const normalized = decodedText.trim().toUpperCase();
          const matched = washrooms.find(
            (item) =>
              item.code.toUpperCase() === normalized ||
              item.id.toUpperCase() === normalized
          );

          if (matched) {
            setQrMatchError(null);
            await stopScanner();
            selectWashroom(matched, false);
            setCheckInStep("rate");
          } else {
            setQrMatchError("This isn't a Sukoon sticker.");
          }
        },
        () => {
          // Ignore frame-by-frame no-QR errors
        }
      );

      setCameraStarting(false);
    } catch {
      await stopScanner();
      setCameraError(
        language === "hi"
          ? "कैमरा अनुमति अस्वीकृत या कोई कैमरा नहीं मिला। नीचे दिए गए विकल्प का उपयोग करें।"
          : "Camera permission denied or no camera found. Use the fallback button below."
      );
    }
  };

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
          /* Step 1: Real Camera QR Scanner + Fallback */
          <div className="p-6 text-center space-y-4">
            <p className="text-xs sm:text-sm text-sand-700 max-w-xs mx-auto">
              {copy.qrSubtitle}
            </p>

            {/* Camera Container / Initial Prompt */}
            <div className="relative mx-auto w-64 min-h-[240px] rounded-3xl bg-sukoon-950 p-3 flex flex-col items-center justify-center overflow-hidden shadow-inner border-4 border-sukoon-800">
              <div
                id={QR_READER_ELEMENT_ID}
                className={`w-full overflow-hidden rounded-2xl ${
                  cameraActive ? "block" : "hidden"
                }`}
              />

              {!cameraActive && (
                <div className="bg-cream-50 rounded-2xl p-4 text-sukoon-900 flex flex-col items-center shadow-md w-full max-w-[200px]">
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-sukoon-800 mb-1.5">
                    <VerifiedSealIcon className="w-3.5 h-3.5 text-sukoon-700" />
                    <span>SUKOON VERIFIED</span>
                  </div>
                  <QrCodeIcon className="w-16 h-16 text-sukoon-950" />
                  <span className="mt-1.5 font-mono text-xs font-bold text-sukoon-800">
                    {w.code}
                  </span>
                  <button
                    type="button"
                    onClick={handleStartCamera}
                    className="mt-3 w-full py-2 px-3 rounded-xl bg-sukoon-700 hover:bg-sukoon-800 text-cream-50 text-xs font-bold transition shadow-xs"
                  >
                    {language === "hi" ? "स्टिकर स्कैन करें" : "Scan sticker"}
                  </button>
                </div>
              )}

              {cameraStarting && (
                <p className="text-xs font-semibold text-sukoon-200 mt-2">
                  {language === "hi"
                    ? "कैमरा शुरू हो रहा है..."
                    : "Starting camera..."}
                </p>
              )}
            </div>

            {/* Invalid QR Error Banner */}
            {qrMatchError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold"
              >
                {qrMatchError}
              </div>
            )}

            {/* Camera Permission / No Camera Fallback Notice */}
            {cameraError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-cream-200 border border-cream-300 text-sand-800 text-xs font-medium"
              >
                {cameraError}
              </div>
            )}

            {/* Primary Camera Trigger (when not active) + Fallback Simulate Button */}
            <div className="space-y-2.5 pt-1">
              {!cameraActive && (
                <button
                  type="button"
                  onClick={handleStartCamera}
                  className="w-full py-3 px-4 rounded-2xl bg-sukoon-800 hover:bg-sukoon-900 text-cream-50 font-bold text-sm transition shadow-xs"
                >
                  {language === "hi" ? "स्टिकर स्कैन करें" : "Scan sticker"}
                </button>
              )}

              <button
                type="button"
                onClick={async () => {
                  await stopScanner();
                  setCheckInStep("rate");
                }}
                className={`w-full py-3 px-4 rounded-2xl font-bold text-sm transition ${
                  cameraError
                    ? "bg-sukoon-700 hover:bg-sukoon-800 text-cream-50 shadow-sm"
                    : "bg-cream-200 hover:bg-cream-300 text-sukoon-950 border border-cream-300"
                }`}
              >
                {copy.qrScanInstantBtn}
              </button>
            </div>

            <div className="pt-1">
              <Link
                href="/stickers"
                target="_blank"
                className="text-[11px] font-semibold text-sukoon-700 hover:text-sukoon-900 underline underline-offset-2"
              >
                {language === "hi"
                  ? "प्रिंट करने योग्य पार्टनर क्यूआर स्टिकर खोलें (/stickers) ↗"
                  : "Open printable partner QR stickers (/stickers) ↗"}
              </Link>
            </div>
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
