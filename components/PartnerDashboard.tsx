"use client";

import React from "react";
import { useSukoon } from "@/lib/context";
import { t } from "@/data/translations";
import {
  VerifiedSealIcon,
  CheckCircleIcon,
  StarIcon,
  QrCodeIcon,
  SparkleCleanIcon,
  ShieldIcon,
  LockIcon,
  WaterDropIcon,
} from "@/components/Icons";

export default function PartnerDashboard() {
  const {
    washrooms,
    partnerSelectedId,
    setPartnerSelectedId,
    selectWashroom,
    openCheckIn,
    language,
  } = useSukoon();

  const copy = t(language);
  const pd = copy.partnerDashboard;

  const partner =
    washrooms.find((w) => w.id === partnerSelectedId) ?? washrooms[0];

  const metrics = partner.partnerMetrics;
  const isAboveThreshold = partner.averageScore >= 4.0;
  const progressPercent = Math.min(
    100,
    Math.max(10, Math.round((partner.averageScore / 5) * 100))
  );

  // Build SVG Sparkline coordinates (8 weeks, range 3.0 to 5.0)
  const trend = metrics.weeklyTrend;
  const svgWidth = 560;
  const svgHeight = 150;
  const padX = 28;
  const padY = 22;
  const minVal = 3.0;
  const maxVal = 5.0;

  const points = trend.map((val, idx) => {
    const x =
      padX + (idx / Math.max(1, trend.length - 1)) * (svgWidth - padX * 2);
    const clamped = Math.min(maxVal, Math.max(minVal, val));
    const y =
      svgHeight -
      padY -
      ((clamped - minVal) / (maxVal - minVal)) * (svgHeight - padY * 2);
    return { x, y, val };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const areaPoints = `${points[0].x},${svgHeight - padY} ${polylinePoints} ${
    points[points.length - 1].x
  },${svgHeight - padY}`;

  // Y position for 4.0 threshold line
  const threshold4Y =
    svgHeight -
    padY -
    ((4.0 - minVal) / (maxVal - minVal)) * (svgHeight - padY * 2);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-5">
      {/* Header & Business Selector */}
      <div className="bg-cream-50 rounded-2xl p-4 sm:p-6 border border-cream-300 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sukoon-50 text-sukoon-800 border border-sukoon-200 text-xs font-bold mb-2">
            <VerifiedSealIcon className="w-4 h-4 text-sukoon-700" />
            <span>{pd.title}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-sand-900">
            {language === "hi" ? partner.nameHi : partner.name}
          </h1>
          <p className="text-xs sm:text-sm text-sand-700 mt-0.5">
            {partner.address} • <span className="font-mono">{partner.code}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div>
            <label
              htmlFor="partner-select"
              className="block text-[11px] font-semibold text-sand-700 mb-1"
            >
              {pd.selectPartner}
            </label>
            <select
              id="partner-select"
              value={partner.id}
              onChange={(e) => setPartnerSelectedId(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 rounded-xl bg-white border border-cream-300 text-xs sm:text-sm font-semibold text-sand-900 focus:outline-none focus:border-sukoon-700"
            >
              {washrooms.map((w) => (
                <option key={w.id} value={w.id}>
                  {language === "hi" ? w.nameHi : w.name} ({w.averageScore.toFixed(1)})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={() => {
              selectWashroom(partner, false);
              openCheckIn("rate");
            }}
            className="sm:mt-5 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-sukoon-700 hover:bg-sukoon-800 text-cream-50 text-xs font-bold transition shadow-xs"
          >
            <QrCodeIcon className="w-4 h-4" />
            <span>{pd.quickCheckInCta}</span>
          </button>
        </div>
      </div>

      {/* 4 Key Partner KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Verified Months */}
        <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300 shadow-soft">
          <span className="text-xs font-semibold text-sand-700 block">
            {pd.verifiedMonths}
          </span>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-sukoon-900">
              {metrics.verifiedMonths}
            </span>
            <span className="text-xs font-bold text-sand-700">
              {pd.monthsUnit}
            </span>
          </div>
          <p className="text-[11px] text-sukoon-800 mt-1.5 font-medium">
            {language === "hi"
              ? "सुकून सत्यापित सदस्य"
              : "Active storefront sticker"}
          </p>
        </div>

        {/* Monthly Stipend */}
        <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300 shadow-soft">
          <span className="text-xs font-semibold text-sand-700 block">
            {pd.monthlyStipend}
          </span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-sukoon-900">
              ₹{metrics.monthlyStipendINR.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-sand-700">/ mo</span>
          </div>
          <p className="text-[11px] text-sand-700 mt-1.5">
            {language === "hi"
              ? "सफाई और साबुन भत्ता"
              : "Cleaning & consumables grant"}
          </p>
        </div>

        {/* UPI Payout Status */}
        <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300 shadow-soft">
          <span className="text-xs font-semibold text-sand-700 block">
            {pd.upiPayoutStatus}
          </span>
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                metrics.upiStatus === "Paid"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}
            >
              <CheckCircleIcon className="w-3.5 h-3.5" />
              UPI: {metrics.upiStatus}
            </span>
          </div>
          <p className="text-[11px] text-sand-700 mt-2 truncate font-mono">
            {metrics.upiHandle} • {metrics.lastPayoutDate}
          </p>
        </div>

        {/* Check-ins This Week */}
        <div className="bg-cream-50 rounded-2xl p-4 border border-cream-300 shadow-soft">
          <span className="text-xs font-semibold text-sand-700 block">
            {pd.checkInsWeek}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-sukoon-900">
              {metrics.checkInsThisWeek}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              +14% vs last wk
            </span>
          </div>
          <p className="text-[11px] text-sand-700 mt-1.5">
            {language === "hi"
              ? `${partner.totalRatings} कुल गुमनाम रेटिंग`
              : `${partner.totalRatings} total verified ratings`}
          </p>
        </div>
      </div>

      {/* "Maintain 4.0+ to keep your sticker" Progress Bar Card */}
      <div className="bg-cream-50 rounded-2xl p-5 sm:p-6 border border-cream-300 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-sand-900 flex items-center gap-2">
              <VerifiedSealIcon className="w-5 h-5 text-sukoon-700" />
              <span>{pd.stickerRuleTitle}</span>
            </h2>
            <p className="text-xs text-sand-700 mt-0.5 max-w-2xl">
              {pd.stickerRuleDesc}
            </p>
          </div>

          <div
            className={`px-3.5 py-2 rounded-2xl border flex items-center gap-2 shrink-0 ${
              isAboveThreshold
                ? "bg-sukoon-50 border-sukoon-200 text-sukoon-900"
                : "bg-amber-50 border-amber-300 text-amber-900"
            }`}
          >
            <StarIcon className="w-4 h-4 text-sukoon-700" />
            <div>
              <span className="text-[10px] uppercase font-bold block leading-none">
                {isAboveThreshold
                  ? language === "hi"
                    ? "स्टिकर सुरक्षित"
                    : "Sticker Active"
                  : language === "hi"
                  ? "सुधार आवश्यक"
                  : "At Risk (<4.0)"}
              </span>
              <span className="text-lg font-extrabold">
                {partner.averageScore.toFixed(1)} / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar with 4.0 (80%) Threshold Marker */}
        <div className="pt-2 pb-4">
          <div className="relative h-4 w-full bg-cream-200 rounded-full overflow-visible border border-cream-300">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isAboveThreshold ? "bg-sukoon-700" : "bg-amber-600"
              }`}
              style={{ width: `${progressPercent}%` }}
            />

            {/* 4.0 Threshold Marker at 80% */}
            <div
              className="absolute -top-2 -bottom-2 w-0.5 bg-sand-900 z-10"
              style={{ left: "80%" }}
            >
              <span className="absolute -bottom-6 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-sand-900 text-cream-50 text-[10px] font-bold">
                {pd.thresholdMarker}
              </span>
            </div>
          </div>

          <div className="flex justify-between text-[11px] font-semibold text-sand-700 mt-7">
            <span>0.0</span>
            <span>2.5</span>
            <span className="text-sukoon-800 font-bold">5.0 Max</span>
          </div>
        </div>
      </div>

      {/* Rating Trend Sparkline & Sub-Score Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 8-Week Sparkline */}
        <div className="lg:col-span-2 bg-cream-50 rounded-2xl p-5 border border-cream-300 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-sand-900">
                {pd.ratingTrendTitle}
              </h3>
              <p className="text-xs text-sand-700">
                {language === "hi"
                  ? "साप्ताहिक औसत स्कोर (पिछले 8 सप्ताह)"
                  : "Weekly rolling score across Clean, Safe, Lock & Water"}
              </p>
            </div>
            <span className="text-xs font-bold text-sukoon-800 bg-sukoon-50 px-2.5 py-1 rounded-lg border border-sukoon-200">
              Now: {partner.averageScore.toFixed(1)}
            </span>
          </div>

          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-40 overflow-visible"
              role="img"
              aria-label="8-week rating trend sparkline"
            >
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F766E" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#0F766E" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* 4.0 Minimum Sticker Threshold Line */}
              <line
                x1={padX}
                y1={threshold4Y}
                x2={svgWidth - padX}
                y2={threshold4Y}
                stroke="#D97706"
                strokeWidth="1.5"
                strokeDasharray="5 4"
              />
              <text
                x={svgWidth - padX}
                y={threshold4Y - 5}
                textAnchor="end"
                className="fill-amber-700 text-[10px] font-bold"
              >
                4.0 Sticker Min
              </text>

              {/* Area under sparkline */}
              <polygon points={areaPoints} fill="url(#sparkFill)" />

              {/* Trend Line */}
              <polyline
                fill="none"
                stroke="#0F766E"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
              />

              {/* Data Points & Labels */}
              {points.map((pt, idx) => (
                <g key={idx}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={idx === points.length - 1 ? 5.5 : 4}
                    fill={idx === points.length - 1 ? "#082F2C" : "#0F766E"}
                    stroke="#FAF8F5"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    className="fill-sand-900 text-[11px] font-bold"
                  >
                    {pt.val.toFixed(1)}
                  </text>
                  <text
                    x={pt.x}
                    y={svgHeight - 4}
                    textAnchor="middle"
                    className="fill-sand-700 text-[10px] font-medium"
                  >
                    {idx === points.length - 1 ? "Now" : `W${idx + 1}`}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* 4 Pillar Metrics Card */}
        <div className="bg-cream-50 rounded-2xl p-5 border border-cream-300 shadow-soft space-y-3">
          <h3 className="text-sm sm:text-base font-bold text-sand-900">
            {language === "hi" ? "4 गुणवत्ता मानक" : "4 Quality Pillars"}
          </h3>
          <div className="space-y-2.5">
            {[
              {
                label: copy.subScores.clean,
                val: partner.scores.clean,
                icon: <SparkleCleanIcon className="w-4 h-4 text-sukoon-700" />,
              },
              {
                label: copy.subScores.safe,
                val: partner.scores.safe,
                icon: <ShieldIcon className="w-4 h-4 text-sukoon-700" />,
              },
              {
                label: copy.subScores.lock,
                val: partner.scores.lock,
                icon: <LockIcon className="w-4 h-4 text-sukoon-700" />,
              },
              {
                label: copy.subScores.water,
                val: partner.scores.water,
                icon: <WaterDropIcon className="w-4 h-4 text-sukoon-700" />,
              },
            ].map((pillar) => (
              <div
                key={pillar.label}
                className="p-3 rounded-xl bg-white border border-cream-200 flex items-center justify-between"
              >
                <span className="inline-flex items-center gap-2 text-xs font-bold text-sand-800">
                  {pillar.icon}
                  {pillar.label}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-cream-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sukoon-700 rounded-full"
                      style={{ width: `${(pillar.val / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-sukoon-900 w-7 text-right">
                    {pillar.val.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
