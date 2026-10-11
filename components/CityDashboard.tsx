"use client";

import React from "react";
import { useSukoon } from "@/lib/context";
import { t } from "@/data/translations";
import MapView from "@/components/MapView";
import {
  VerifiedSealIcon,
  ShieldIcon,
  StarIcon,
  CheckCircleIcon,
} from "@/components/Icons";

export default function CityDashboard() {
  const { washrooms, selectedWashroom, selectWashroom, language } = useSukoon();
  const copy = t(language);
  const cd = copy.cityDashboard;

  const totalWeeklyCheckIns = washrooms.reduce(
    (sum, w) => sum + w.partnerMetrics.checkInsThisWeek,
    0
  );
  const monthlyCheckIns = totalWeeklyCheckIns * 4;

  const networkAvg = (
    washrooms.reduce((sum, w) => sum + w.averageScore, 0) / washrooms.length
  ).toFixed(2);

  const womenSafeCount = washrooms.filter((w) => w.womenSafe).length;

  const topClusters = [
    {
      zone: language === "hi" ? "कनॉट प्लेस और जनपथ" : "Connaught Place & Janpath",
      partners: 4,
      weeklyCheckIns: 515,
      avgScore: 4.6,
    },
    {
      zone: language === "hi" ? "लाजपत नगर और डिफेंस कॉलोनी" : "Lajpat Nagar & Defence Colony",
      partners: 3,
      weeklyCheckIns: 418,
      avgScore: 4.5,
    },
    {
      zone: language === "hi" ? "साकेत और मालवीय नगर" : "Saket & Malviya Nagar",
      partners: 3,
      weeklyCheckIns: 362,
      avgScore: 4.4,
    },
    {
      zone: language === "hi" ? "नोएडा सेक्टर 18" : "Noida Sector 18",
      partners: 2,
      weeklyCheckIns: 207,
      avgScore: 4.3,
    },
    {
      zone: language === "hi" ? "चांदनी चौक और करोल बाग" : "Chandni Chowk & Karol Bagh",
      partners: 2,
      weeklyCheckIns: 382,
      avgScore: 4.5,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 space-y-5">
      {/* Header Banner */}
      <div className="bg-sukoon-900 text-cream-50 rounded-2xl p-5 sm:p-6 border border-sukoon-800 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sukoon-200 text-xs font-bold mb-2">
            <VerifiedSealIcon className="w-4 h-4 text-sukoon-200" />
            <span>Nette Toilette Civic Partnership Model • Delhi NCR</span>
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            {cd.title}
          </h1>
          <p className="text-xs sm:text-sm text-sukoon-100 mt-1 max-w-2xl">
            {cd.subtitle}
          </p>
        </div>

        <div className="bg-white/10 border border-white/15 rounded-2xl px-4 py-3 text-xs text-cream-100 max-w-xs">
          <p className="font-bold text-white mb-0.5">
            {language === "hi" ? "समस्या और समाधान" : "Why Partner Washrooms?"}
          </p>
          <p className="leading-relaxed text-[11px]">
            {language === "hi"
              ? "महिलाएं वॉशरूम न मिलने के कारण पानी कम पीती हैं। सुकून मौजूदा कैफे और पेट्रोल पंप के बंद वॉशरूम को स्टाइपेंड देकर सबके लिए खोलता है।"
              : "Women avoid drinking water when out. Instead of waiting years to build new blocks, Sukoon unlocks existing cafe, store & fuel station washrooms today."}
          </p>
        </div>
      </div>

      {/* 4 Civic KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300 shadow-soft">
          <span className="text-xs font-semibold text-sand-700 block">
            {cd.activeWashrooms}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-sukoon-900">
              {washrooms.length}
            </span>
            <span className="text-xs font-semibold text-sukoon-700">
              Delhi NCR
            </span>
          </div>
          <p className="text-[11px] text-sand-700 mt-1.5">
            {language === "hi"
              ? "100% क्यूआर सत्यापित पार्टनर"
              : "100% QR-verified partner washrooms"}
          </p>
        </div>

        <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300 shadow-soft">
          <span className="text-xs font-semibold text-sand-700 block">
            {cd.totalCheckIns}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-sukoon-900">
              {monthlyCheckIns.toLocaleString("en-IN")}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              {totalWeeklyCheckIns}/wk
            </span>
          </div>
          <p className="text-[11px] text-sand-700 mt-1.5">
            {language === "hi"
              ? "गुमनाम क्यूआर स्कैन"
              : "Anonymous door QR scans"}
          </p>
        </div>

        <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300 shadow-soft">
          <span className="text-xs font-semibold text-sand-700 block">
            {cd.networkRating}
          </span>
          <div className="mt-2 flex items-center gap-1.5">
            <StarIcon className="w-5 h-5 text-sukoon-700" />
            <span className="text-2xl sm:text-3xl font-extrabold text-sukoon-900">
              {networkAvg}
            </span>
            <span className="text-xs text-sand-700">/ 5.0</span>
          </div>
          <p className="text-[11px] text-sand-700 mt-1.5">
            {language === "hi"
              ? "सफाई, सुरक्षा, लॉक और पानी"
              : "Across Clean, Safe, Lock & Water"}
          </p>
        </div>

        <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300 shadow-soft">
          <span className="text-xs font-semibold text-sand-700 block">
            {cd.womenSafeCoverage}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-sukoon-900">
              {Math.round((womenSafeCount / washrooms.length) * 100)}%
            </span>
            <span className="text-xs text-sand-700">
              ({womenSafeCount}/{washrooms.length})
            </span>
          </div>
          <p className="text-[11px] text-sand-700 mt-1.5">
            {language === "hi"
              ? "अच्छी रोशनी और सुरक्षित कुंडी"
              : "Lit approach & verified inner lock"}
          </p>
        </div>
      </div>

      {/* Coverage Map Heatmap + Commercial Cluster Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-cream-50 rounded-2xl p-4 border border-cream-300 shadow-soft flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="text-base font-bold text-sand-900">
                {cd.heatmapTitle}
              </h2>
              <p className="text-xs text-sand-700">{cd.heatmapDesc}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-sukoon-50 text-sukoon-800 border border-sukoon-200">
              {language === "hi" ? "लाइव हीटमैप लेयर" : "Live Coverage Heatmap"}
            </span>
          </div>

          <div className="h-[360px] w-full">
            <MapView
              washrooms={washrooms}
              selectedWashroom={selectedWashroom}
              onSelectWashroom={(w) => selectWashroom(w, true)}
              language={language}
              mode="heatmap"
            />
          </div>
        </div>

        {/* High-Demand Commercial Hubs */}
        <div className="bg-cream-50 rounded-2xl p-4 sm:p-5 border border-cream-300 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-sand-900 mb-1">
              {language === "hi"
                ? "प्रमुख बाज़ार कवरेज"
                : "High-Footfall Market Clusters"}
            </h3>
            <p className="text-xs text-sand-700 mb-3">
              {language === "hi"
                ? "महिला खरीदारों और यात्रियों के प्रमुख केंद्र"
                : "Active partner clusters by weekly check-in demand"}
            </p>

            <div className="space-y-2.5">
              {topClusters.map((c) => (
                <div
                  key={c.zone}
                  className="p-3 rounded-xl bg-white border border-cream-200 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sand-900">
                      {c.zone}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-sukoon-800 bg-sukoon-50 px-2 py-0.5 rounded border border-sukoon-200">
                      <StarIcon className="w-3 h-3 text-sukoon-700" />
                      {c.avgScore.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-sand-700">
                    <span>{c.partners} Partner washrooms</span>
                    <span className="font-semibold text-sand-900">
                      {c.weeklyCheckIns} check-ins/wk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-sukoon-50 border border-sukoon-200 text-xs text-sukoon-900">
            <span className="font-bold block">
              {language === "hi"
                ? "जीरो-कैपेक्स विस्तार"
                : "Zero-CapEx Civic Scaling"}
            </span>
            <span className="text-[11px]">
              {language === "hi"
                ? "नए पार्टनर को जोड़ने में केवल 48 घंटे और एक क्यूआर स्टिकर लगता है।"
                : "Onboarding a new café or petrol pump takes 48 hours and a QR window sticker."}
            </span>
          </div>
        </div>
      </div>

      {/* Cost Comparison: Monthly Stipend vs Building a New Facility (Clearly Labelled as Illustrative) */}
      <div className="bg-cream-50 rounded-2xl p-5 sm:p-6 border border-cream-300 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-sand-900">
              {cd.costComparisonTitle}
            </h2>
            <p className="text-xs text-sand-700">
              {language === "hi"
                ? "प्रति वॉशरूम मासिक स्टाइपेंड बनाम नया निर्माण खर्च (उदाहरणात्मक)"
                : "Monthly partner stipend vs. capital & maintenance cost of building a new civic block"}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            {cd.illustrativeBadge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sukoon Partner Washroom Model */}
          <div className="p-5 rounded-2xl bg-sukoon-900 text-cream-50 border border-sukoon-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sukoon-200">
                <CheckCircleIcon className="w-4 h-4 text-sukoon-300" />
                {cd.sukoonModelTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sukoon-700 text-cream-50">
                {cd.illustrativeBadge}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {cd.sukoonCost}
              </span>
              <span className="text-xs text-sukoon-200">
                ({cd.sukoonAnnual})
              </span>
            </div>

            <p className="text-xs text-sukoon-100 font-medium">
              {cd.sukoonCapex}
            </p>

            {/* Visual Cost Bar (Relative 2.3% of Year-1 New Build) */}
            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-[11px] text-sukoon-200">
                <span>Year-1 Outlay per Washroom</span>
                <span className="font-bold text-white">₹42,000</span>
              </div>
              <div className="w-full h-3 bg-sukoon-950 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-sukoon-400 rounded-full"
                  style={{ width: "6%" }}
                />
              </div>
            </div>
          </div>

          {/* Building a New Standalone Block */}
          <div className="p-5 rounded-2xl bg-white border border-cream-300 text-sand-900 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sand-700">
                {cd.newBuildTitle}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cream-200 text-sand-800">
                {cd.illustrativeBadge}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-sand-900">
                {cd.newBuildCost}
              </span>
              <span className="text-xs text-sand-700">
                ({cd.newBuildAnnual})
              </span>
            </div>

            <p className="text-xs text-sand-700 font-medium">
              {cd.newBuildOpex}
            </p>

            {/* Visual Cost Bar (100% reference) */}
            <div className="pt-2 space-y-1">
              <div className="flex justify-between text-[11px] text-sand-700">
                <span>Year-1 CapEx + OpEx Outlay (Illustrative)</span>
                <span className="font-bold text-sand-900">₹18,36,000</span>
              </div>
              <div className="w-full h-3 bg-cream-200 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-amber-600 rounded-full"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-sukoon-50 border border-sukoon-200 flex items-center gap-3 text-xs sm:text-sm font-semibold text-sukoon-900">
          <ShieldIcon className="w-5 h-5 text-sukoon-700 shrink-0" />
          <span>{cd.impactCallout}</span>
        </div>
      </div>
    </div>
  );
}
