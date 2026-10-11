"use client";

import React, { useEffect, useRef } from "react";
import type LType from "leaflet";
import "leaflet/dist/leaflet.css";
import { DEMO_LOCATION } from "@/data/seed";
import { WashroomWithDistance } from "@/lib/washroomService";
import { Language } from "@/lib/types";

interface MapViewProps {
  washrooms: WashroomWithDistance[];
  selectedWashroom: WashroomWithDistance | null;
  onSelectWashroom: (washroom: WashroomWithDistance) => void;
  language: Language;
  mode?: "pins" | "heatmap";
}

function getPinColors(score: number, isSelected: boolean) {
  if (score >= 4.6) {
    return {
      bg: isSelected ? "#082F2C" : "#0F766E",
      border: isSelected ? "#99F6E4" : "#FAF8F5",
      badge: "#CCFBF1",
    };
  }
  if (score >= 4.0) {
    return {
      bg: isSelected ? "#0F766E" : "#0D9488",
      border: isSelected ? "#CCFBF1" : "#FAF8F5",
      badge: "#E6FFFA",
    };
  }
  return {
    bg: isSelected ? "#92400E" : "#D97706",
    border: isSelected ? "#FDE68A" : "#FAF8F5",
    badge: "#FEF3C7",
  };
}

export default function MapView({
  washrooms,
  selectedWashroom,
  onSelectWashroom,
  language,
  mode = "pins",
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const markersLayerRef = useRef<LType.LayerGroup | null>(null);
  const leafletModuleRef = useRef<typeof LType | null>(null);

  // Initialize Leaflet map once
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (!containerRef.current || mapRef.current) return;
      const L = (await import("leaflet")).default;
      if (!isMounted || !containerRef.current || mapRef.current) return;

      leafletModuleRef.current = L;

      const initialCenter: [number, number] =
        mode === "heatmap"
          ? [28.595, 77.225]
          : [DEMO_LOCATION.lat, DEMO_LOCATION.lng];
      const initialZoom = mode === "heatmap" ? 11 : 13;

      const map = L.map(containerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false,
        attributionControl: true,
      });

      L.control.zoom({ position: "topright" }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = layerGroup;
      mapRef.current = map;

      renderMapMarkers(L, map, layerGroup);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersLayerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderMapMarkers = (
    L: typeof LType,
    map: LType.Map,
    layerGroup: LType.LayerGroup
  ) => {
    layerGroup.clearLayers();

    // Fixed Demo Location marker (Connaught Place)
    const userIcon = L.divIcon({
      className: "sukoon-user-marker",
      html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;width:28px;height:28px;">
          <span style="position:absolute;width:28px;height:28px;border-radius:9999px;background:rgba(13,148,136,0.28);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></span>
          <span style="position:relative;width:14px;height:14px;border-radius:9999px;background:#0F766E;border:3px solid #FAF8F5;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></span>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([DEMO_LOCATION.lat, DEMO_LOCATION.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    })
      .bindTooltip(
        language === "hi"
          ? "आपका डेमो स्थान: राजीव चौक, कनॉट प्लेस"
          : "Fixed Demo Location: Rajiv Chowk, CP",
        { direction: "top", offset: [0, -10] }
      )
      .addTo(layerGroup);

    // Washroom pins or heatmap circles
    washrooms.forEach((w) => {
      const isSelected = selectedWashroom?.id === w.id;

      if (mode === "heatmap") {
        // Outer demand heat aura
        const radiusMeters = Math.max(650, w.partnerMetrics.checkInsThisWeek * 7.5);
        const heatColor =
          w.averageScore >= 4.6
            ? "#0F766E"
            : w.averageScore >= 4.0
            ? "#14B8A6"
            : "#D97706";

        L.circle([w.lat, w.lng], {
          radius: radiusMeters,
          color: heatColor,
          weight: 1,
          fillColor: heatColor,
          fillOpacity: 0.24,
        }).addTo(layerGroup);

        L.circle([w.lat, w.lng], {
          radius: radiusMeters * 0.45,
          color: heatColor,
          weight: 0,
          fillColor: heatColor,
          fillOpacity: 0.38,
        }).addTo(layerGroup);
      }

      const colors = getPinColors(w.averageScore, isSelected);
      const scale = isSelected ? "scale(1.14)" : "scale(1)";
      const shadow = isSelected
        ? "0 8px 20px rgba(8,47,44,0.42)"
        : "0 3px 10px rgba(8,47,44,0.24)";

      const pinHtml = `
        <div style="
          transform:${scale};
          transition:transform 0.2s ease;
          display:inline-flex;
          align-items:center;
          gap:4px;
          padding:4px 8px;
          border-radius:9999px;
          background:${colors.bg};
          color:#FAF8F5;
          border:2px solid ${colors.border};
          box-shadow:${shadow};
          font-family:inherit;
          font-weight:700;
          font-size:12px;
          line-height:1;
          white-space:nowrap;
          cursor:pointer;
        ">
          <span style="width:6px;height:6px;border-radius:9999px;background:${colors.badge};display:inline-block;"></span>
          <span>${w.averageScore.toFixed(1)}</span>
        </div>
      `;

      const icon = L.divIcon({
        className: "sukoon-washroom-pin",
        html: pinHtml,
        iconSize: [52, 28],
        iconAnchor: [26, 14],
      });

      const marker = L.marker([w.lat, w.lng], {
        icon,
        zIndexOffset: isSelected ? 900 : 100,
      });

      marker.on("click", () => {
        onSelectWashroom(w);
      });

      marker.bindTooltip(
        `<div style="font-weight:600;font-size:12px;">${
          language === "hi" ? w.nameHi : w.name
        }</div><div style="font-size:11px;color:#57534E;">${
          language === "hi" ? w.areaHi : w.area
        } • ${w.averageScore.toFixed(1)} / 5</div>`,
        { direction: "top", offset: [0, -14] }
      );

      marker.addTo(layerGroup);
    });
  };

  // Update markers whenever washrooms, selection, language, or mode changes
  useEffect(() => {
    if (
      leafletModuleRef.current &&
      mapRef.current &&
      markersLayerRef.current
    ) {
      renderMapMarkers(
        leafletModuleRef.current,
        mapRef.current,
        markersLayerRef.current
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [washrooms, selectedWashroom, language, mode]);

  // Smooth flyTo when selectedWashroom changes in pin mode
  useEffect(() => {
    if (!mapRef.current || !selectedWashroom || mode === "heatmap") return;
    mapRef.current.flyTo([selectedWashroom.lat, selectedWashroom.lng], 14, {
      duration: 0.85,
    });
  }, [selectedWashroom?.id, mode]);

  const handleRecenterCP = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([DEMO_LOCATION.lat, DEMO_LOCATION.lng], 13, {
      duration: 0.8,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[320px] bg-cream-200 overflow-hidden rounded-2xl border border-cream-300">
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Score Color Legend Overlay */}
      <div className="absolute top-3 left-3 z-[400] bg-cream-50/95 backdrop-blur-md border border-cream-300 rounded-xl px-3 py-2 shadow-soft text-xs text-sand-800 flex flex-wrap items-center gap-3">
        <span className="font-semibold text-sand-900">
          {language === "hi" ? "स्वच्छता स्कोर:" : "Cleanliness Score:"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sukoon-700 inline-block" />
          <span>4.6+</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sukoon-600 inline-block" />
          <span>4.0–4.5</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
          <span>&lt;4.0</span>
        </span>
      </div>

      {/* Fixed Demo Location Pill & Recenter */}
      {mode === "pins" && (
        <button
          type="button"
          onClick={handleRecenterCP}
          className="absolute bottom-3 left-3 z-[400] bg-cream-50/95 hover:bg-white backdrop-blur-md border border-cream-300 rounded-xl px-3 py-2 shadow-soft text-xs font-medium text-sukoon-800 flex items-center gap-2 transition"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-sukoon-600 ring-4 ring-sukoon-100" />
          <span>
            {language === "hi"
              ? "डेमो स्थान: कनॉट प्लेस (री-सेंटर)"
              : "Demo Location: Connaught Place"}
          </span>
        </button>
      )}
    </div>
  );
}
