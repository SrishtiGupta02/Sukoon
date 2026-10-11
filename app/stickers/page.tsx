"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import { SEED_WASHROOMS } from "@/data/seed";
import { Washroom } from "@/lib/types";
import {
  SukoonLogoIcon,
  VerifiedSealIcon,
  CloseIcon,
} from "@/components/Icons";

export default function StickersPage() {
  const [svgMap, setSvgMap] = useState<Record<string, string>>({});
  const [focusedWashroom, setFocusedWashroom] = useState<Washroom | null>(null);

  useEffect(() => {
    let mounted = true;
    async function generateAll() {
      const entries: Record<string, string> = {};
      for (const w of SEED_WASHROOMS) {
        try {
          const svg = await QRCode.toString(w.code, {
            type: "svg",
            margin: 2,
            width: 220,
            color: {
              dark: "#082F2C",
              light: "#FFFFFF",
            },
          });
          entries[w.code] = svg;
        } catch {
          // ignore
        }
      }
      if (mounted) {
        setSvgMap(entries);
      }
    }
    generateAll();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream-100 text-sand-900 py-6 px-4 sm:px-8">
      {/* Top Bar (Hidden when printing) */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 bg-cream-50 p-4 rounded-2xl border border-cream-300 shadow-soft print:hidden">
        <div className="flex items-center gap-3">
          <SukoonLogoIcon className="w-9 h-9" />
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-sukoon-950">
              Sukoon • Printable Partner QR Stickers
            </h1>
            <p className="text-xs text-sand-700">
              Open this page on a second screen or print to scan with the live camera on the Check-in screen.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-sukoon-700 hover:bg-sukoon-800 text-cream-50 text-xs sm:text-sm font-bold transition shadow-xs"
          >
            Print Stickers
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-white hover:bg-cream-200 text-sukoon-900 border border-cream-300 text-xs sm:text-sm font-bold transition"
          >
            ← Back to Map
          </Link>
        </div>
      </div>

      {/* Grid of 25 Printable Partner Stickers */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 print:grid-cols-3 print:gap-4">
        {SEED_WASHROOMS.map((w) => (
          <div
            key={w.id}
            onClick={() => setFocusedWashroom(w)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setFocusedWashroom(w);
              }
            }}
            className="bg-white rounded-3xl p-5 border-2 border-sukoon-800 shadow-soft flex flex-col items-center text-center cursor-pointer hover:shadow-elevated transition break-inside-avoid"
          >
            {/* Sticker Header Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sukoon-900 text-cream-50 text-[11px] font-extrabold uppercase tracking-wider mb-3">
              <VerifiedSealIcon className="w-3.5 h-3.5 text-sukoon-200" />
              <span>Sukoon Verified Partner</span>
            </div>

            <h2 className="text-sm font-bold text-sand-900 line-clamp-1">
              {w.name}
            </h2>
            <p className="text-[11px] text-sand-700 mb-3">{w.area}</p>

            {/* Scannable QR Code SVG */}
            <div
              className="w-44 h-44 bg-white p-2 rounded-2xl border border-cream-300 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: svgMap[w.code] ?? "" }}
            />

            {/* QR Payload Code */}
            <div className="mt-3 px-3 py-1 rounded-lg bg-sukoon-50 border border-sukoon-200 font-mono text-xs font-extrabold text-sukoon-900">
              {w.code}
            </div>

            <p className="mt-2 text-[10px] text-sand-700">
              Scan to verify cleanliness • Anonymous • No login
            </p>
          </div>
        ))}
      </div>

      {/* Fullscreen Single-Sticker Modal for Easy Phone-to-Screen Demo Scanning */}
      {focusedWashroom && (
        <div
          className="fixed inset-0 z-50 bg-sukoon-950/75 backdrop-blur-xs flex items-center justify-center p-4 print:hidden"
          onClick={() => setFocusedWashroom(null)}
        >
          <div
            className="bg-white rounded-3xl p-7 border-4 border-sukoon-800 shadow-elevated max-w-sm w-full flex flex-col items-center text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setFocusedWashroom(null)}
              aria-label="Close sticker preview"
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-200 hover:bg-cream-300 flex items-center justify-center text-sand-900"
            >
              <CloseIcon className="w-4 h-4" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sukoon-900 text-cream-50 text-xs font-extrabold uppercase tracking-wider mb-3">
              <VerifiedSealIcon className="w-4 h-4 text-sukoon-200" />
              <span>Sukoon Verified Partner</span>
            </div>

            <h3 className="text-lg font-bold text-sand-900">
              {focusedWashroom.name}
            </h3>
            <p className="text-xs text-sand-700 mb-4">
              {focusedWashroom.address}
            </p>

            <div
              className="w-64 h-64 bg-white p-3 rounded-2xl border-2 border-cream-300 flex items-center justify-center"
              dangerouslySetInnerHTML={{
                __html: svgMap[focusedWashroom.code] ?? "",
              }}
            />

            <div className="mt-4 px-4 py-1.5 rounded-xl bg-sukoon-50 border border-sukoon-200 font-mono text-base font-extrabold text-sukoon-900">
              {focusedWashroom.code}
            </div>

            <p className="mt-3 text-xs text-sand-700">
              Point the Sukoon Check-in camera at this QR code
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
