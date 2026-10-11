"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSukoon } from "@/lib/context";
import { CloseIcon, PlayIcon } from "@/components/Icons";

interface DemoStep {
  id: number;
  titleEn: string;
  titleHi: string;
  captionEn: string;
  captionHi: string;
  durationSec: number;
}

const DEMO_STEPS: DemoStep[] = [
  {
    id: 0,
    titleEn: "1/8 • Map & Problem Context",
    titleHi: "1/8 • मानचित्र और समस्या संदर्भ",
    captionEn:
      "25 Verified Partner Washrooms across Delhi NCR (cafes, fuel stations, stores & malls) sorted by distance from Connaught Place.",
    captionHi:
      "कनॉट प्लेस से दूरी के अनुसार दिल्ली NCR में 25 सत्यापित पार्टनर वॉशरूम।",
    durationSec: 11,
  },
  {
    id: 1,
    titleEn: "2/8 • Women-First Safety Filters",
    titleHi: "2/8 • महिला-सुरक्षा फ़िल्टर",
    captionEn:
      "Filtering live for Open now + Women-safe + Inner lock so women can hydrate and travel with confidence.",
    captionHi:
      "अभी खुला है + महिला-सुरक्षित + अंदरूनी कुंडी फ़िल्टर लागू किया गया।",
    durationSec: 11,
  },
  {
    id: 2,
    titleEn: "3/8 • Selecting a Partner Pin",
    titleHi: "3/8 • पार्टनर पिन का चयन",
    captionEn:
      "Selecting Bharat Energy Fuel Station in Connaught Place — previously locked, now a 24x7 Verified Partner.",
    captionHi:
      "कनॉट प्लेस में भारत एनर्जी फ्यूल स्टेशन का चयन — अब 24x7 सत्यापित पार्टनर।",
    durationSec: 11,
  },
  {
    id: 3,
    titleEn: "4/8 • Washroom Detail & Sub-Scores",
    titleHi: "4/8 • वॉशरूम विवरण और 4 सब-स्कोर",
    captionEn:
      "Inspecting Clean, Safe, Lock & Water scores, the Verified Partner sticker, last 3 anonymous ratings, and Google Maps directions.",
    captionHi:
      "सफाई, सुरक्षा, लॉक और पानी स्कोर, वेरिफाइड स्टिकर और पिछली 3 गुमनाम रेटिंग।",
    durationSec: 13,
  },
  {
    id: 4,
    titleEn: "5/8 • Simulated Door QR Check-In",
    titleHi: "5/8 • दरवाजे पर क्यूआर चेक-इन",
    captionEn:
      "Scanning the Sukoon QR sticker at the washroom door — 100% anonymous, no login or personal data required.",
    captionHi:
      "दरवाजे पर लगे सुकून क्यूआर स्टिकर को स्कैन करना — बिना लॉगिन, पूरी तरह गुमनाम।",
    durationSec: 10,
  },
  {
    id: 5,
    titleEn: "6/8 • 10-Second Rating & Live Score Update",
    titleHi: "6/8 • 10-सेकंड रेटिंग और लाइव स्कोर अपडेट",
    captionEn:
      "Setting the 4 tap-sliders to 5.0 and submitting — watch the washroom's score and review list update live with confirmation toast.",
    captionHi:
      "4 टैप-स्लाइडर्स से रेटिंग सबमिट करना — स्कोर और रिव्यू तुरंत लाइव अपडेट होते हैं।",
    durationSec: 12,
  },
  {
    id: 6,
    titleEn: "7/8 • Partner Business Dashboard",
    titleHi: "7/8 • पार्टनर व्यवसाय डैशबोर्ड",
    captionEn:
      "Business owner tracks ₹4,000/mo UPI cleaning stipend, weekly check-ins, 8-week rating sparkline, and the 4.0+ sticker threshold.",
    captionHi:
      "पार्टनर डैशबोर्ड: ₹4,000/माह UPI स्टाइपेंड, साप्ताहिक चेक-इन और 4.0+ स्टिकर प्रगति बार।",
    durationSec: 11,
  },
  {
    id: 7,
    titleEn: "8/8 • City & CSR Sponsor Impact",
    titleHi: "8/8 • सिटी और CSR स्पॉन्सर डैशबोर्ड",
    captionEn:
      "Coverage heatmap across Delhi NCR and illustrative unit economics: ₹3,500/mo stipend vs. ₹15L+ to build a new civic block.",
    captionHi:
      "दिल्ली NCR कवरेज हीटमैप और लागत तुलना: ₹3,500/माह स्टाइपेंड बनाम नया निर्माण।",
    durationSec: 11,
  },
];

const TOTAL_DURATION_SEC = DEMO_STEPS.reduce((acc, s) => acc + s.durationSec, 0); // 90s

export default function DemoController() {
  const {
    isDemoMode,
    stopDemoMode,
    demoStepIndex,
    setDemoStepIndex,
    washrooms,
    setFilters,
    resetFilters,
    selectWashroom,
    setIsDetailOpen,
    openCheckIn,
    closeCheckIn,
    setCheckInStep,
    submitRating,
    setActiveTab,
    setPartnerSelectedId,
    setDemoScoresOverride,
    language,
  } = useSukoon();

  const [isPaused, setIsPaused] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2>(1);
  const [stepElapsedSec, setStepElapsedSec] = useState(0);
  const hasSubmittedInStep5 = useRef(false);

  // Execute side-effects when entering each demo step
  useEffect(() => {
    if (!isDemoMode) return;
    setStepElapsedSec(0);

    const targetWashroom =
      washrooms.find((w) => w.id === "skn-02") ?? washrooms[0];

    if (demoStepIndex === 0) {
      hasSubmittedInStep5.current = false;
      setActiveTab("map");
      resetFilters();
      closeCheckIn();
      setIsDetailOpen(false);
    } else if (demoStepIndex === 1) {
      setActiveTab("map");
      closeCheckIn();
      setIsDetailOpen(false);
      setFilters({
        openNow: true,
        womenSafe: true,
        hasWater: false,
        innerLock: true,
        babyChange: false,
      });
    } else if (demoStepIndex === 2) {
      setActiveTab("map");
      closeCheckIn();
      selectWashroom(targetWashroom, false);
    } else if (demoStepIndex === 3) {
      setActiveTab("map");
      closeCheckIn();
      selectWashroom(targetWashroom, true);
    } else if (demoStepIndex === 4) {
      setActiveTab("map");
      selectWashroom(targetWashroom, false);
      openCheckIn("qr");
    } else if (demoStepIndex === 5) {
      setActiveTab("map");
      selectWashroom(targetWashroom, false);
      openCheckIn("rate");
      setDemoScoresOverride({ clean: 5.0, safe: 5.0, lock: 5.0, water: 5.0 });
    } else if (demoStepIndex === 6) {
      closeCheckIn();
      setIsDetailOpen(false);
      setPartnerSelectedId(targetWashroom.id);
      setActiveTab("partner");
    } else if (demoStepIndex === 7) {
      closeCheckIn();
      setIsDetailOpen(false);
      setActiveTab("city");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemoMode, demoStepIndex]);

  // Mid-step action during Step 5: auto-submit rating halfway through the step so user sees the live score update and toast
  useEffect(() => {
    if (!isDemoMode || demoStepIndex !== 5) return;
    const targetWashroom =
      washrooms.find((w) => w.id === "skn-02") ?? washrooms[0];

    if (stepElapsedSec >= 5 && !hasSubmittedInStep5.current) {
      hasSubmittedInStep5.current = true;
      submitRating(
        targetWashroom.id,
        { clean: 5.0, safe: 5.0, lock: 5.0, water: 5.0 },
        undefined,
        "Spotless and unlocked during pitch demo check-in!"
      );
    }
  }, [isDemoMode, demoStepIndex, stepElapsedSec, washrooms, submitRating]);

  // Timer tick
  useEffect(() => {
    if (!isDemoMode || isPaused) return;
    const currentStep = DEMO_STEPS[demoStepIndex];
    if (!currentStep) {
      stopDemoMode();
      return;
    }

    const intervalMs = 1000 / speedMultiplier;
    const timer = setInterval(() => {
      setStepElapsedSec((prev) => {
        if (prev + 1 >= currentStep.durationSec) {
          if (demoStepIndex + 1 < DEMO_STEPS.length) {
            setDemoStepIndex((idx) => idx + 1);
          } else {
            stopDemoMode();
          }
          return 0;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [
    isDemoMode,
    isPaused,
    demoStepIndex,
    speedMultiplier,
    setDemoStepIndex,
    stopDemoMode,
  ]);

  if (!isDemoMode) return null;

  const currentStep = DEMO_STEPS[demoStepIndex] ?? DEMO_STEPS[0];
  const completedSecBefore = DEMO_STEPS.slice(0, demoStepIndex).reduce(
    (acc, s) => acc + s.durationSec,
    0
  );
  const totalElapsedSec = Math.min(
    TOTAL_DURATION_SEC,
    completedSecBefore + stepElapsedSec
  );
  const overallPct = Math.round((totalElapsedSec / TOTAL_DURATION_SEC) * 100);

  return (
    <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-5 sm:w-[480px] z-[60] bg-sukoon-950/95 text-cream-50 backdrop-blur-md rounded-2xl border border-sukoon-700 shadow-elevated p-4 space-y-2.5">
      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-sukoon-900 rounded-full overflow-hidden">
        <div
          className="h-full bg-sukoon-400 transition-all duration-300"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      {/* Step Header & Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-sukoon-200 truncate">
            {language === "hi" ? currentStep.titleHi : currentStep.titleEn}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
          <span className="text-[11px] font-mono text-sukoon-200">
            {totalElapsedSec}s / {TOTAL_DURATION_SEC}s
          </span>

          <button
            type="button"
            onClick={() =>
              setSpeedMultiplier((prev) => (prev === 1 ? 2 : 1))
            }
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-bold text-cream-50 transition"
            title="Toggle playback speed"
          >
            {speedMultiplier}x
          </button>

          <button
            type="button"
            onClick={() => setIsPaused((prev) => !prev)}
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] font-bold text-cream-50 transition"
          >
            {isPaused
              ? language === "hi"
                ? "चालू करें"
                : "Resume"
              : language === "hi"
              ? "रोकें"
              : "Pause"}
          </button>

          <button
            type="button"
            onClick={() => {
              if (demoStepIndex + 1 < DEMO_STEPS.length) {
                setDemoStepIndex(demoStepIndex + 1);
              } else {
                stopDemoMode();
              }
            }}
            className="px-2.5 py-0.5 rounded bg-sukoon-700 hover:bg-sukoon-600 text-[11px] font-bold text-white transition"
          >
            {language === "hi" ? "अगला" : "Next"}
          </button>

          <button
            type="button"
            onClick={stopDemoMode}
            aria-label="Stop Demo Mode"
            className="p-1 rounded hover:bg-white/15 text-cream-200 transition"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Narration Caption */}
      <p className="text-xs text-cream-100 leading-relaxed">
        {language === "hi" ? currentStep.captionHi : currentStep.captionEn}
      </p>

      {/* Step Dots for instant jump */}
      <div className="flex items-center gap-1.5 pt-1">
        {DEMO_STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setDemoStepIndex(s.id)}
            aria-label={`Jump to step ${s.id + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              s.id === demoStepIndex
                ? "w-6 bg-sukoon-300"
                : s.id < demoStepIndex
                ? "w-3 bg-sukoon-600"
                : "w-3 bg-white/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
