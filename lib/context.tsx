"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import {
  ActiveTab,
  FilterState,
  Language,
  SubScores,
} from "@/lib/types";
import {
  WashroomRepository,
  WashroomWithDistance,
} from "@/lib/washroomService";
import { t } from "@/data/translations";

interface SukoonContextValue {
  washrooms: WashroomWithDistance[];
  filteredWashrooms: WashroomWithDistance[];
  filters: FilterState;
  toggleFilter: (key: keyof FilterState) => void;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedWashroom: WashroomWithDistance | null;
  selectWashroom: (washroom: WashroomWithDistance | null, openDetail?: boolean) => void;
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  isCheckInOpen: boolean;
  openCheckIn: (step?: "qr" | "rate") => void;
  closeCheckIn: () => void;
  checkInStep: "qr" | "rate";
  setCheckInStep: (step: "qr" | "rate") => void;
  partnerSelectedId: string;
  setPartnerSelectedId: (id: string) => void;
  submitRating: (
    washroomId: string,
    scores: SubScores,
    issueReported?: string,
    customComment?: string
  ) => void;
  toastMessage: string | null;
  dismissToast: () => void;
  isDemoMode: boolean;
  startDemoMode: () => void;
  stopDemoMode: () => void;
  demoStepIndex: number;
  setDemoStepIndex: React.Dispatch<React.SetStateAction<number>>;
  demoScoresOverride: SubScores | null;
  setDemoScoresOverride: (scores: SubScores | null) => void;
}

const DEFAULT_FILTERS: FilterState = {
  openNow: false,
  womenSafe: false,
  hasWater: false,
  innerLock: false,
  babyChange: false,
};

const SukoonContext = createContext<SukoonContextValue | undefined>(undefined);

export function SukoonProvider({ children }: { children: React.ReactNode }) {
  const [washrooms, setWashrooms] = useState<WashroomWithDistance[]>(() =>
    WashroomRepository.getAll()
  );
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<ActiveTab>("map");
  const [selectedId, setSelectedId] = useState<string | null>("skn-01");
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState<boolean>(false);
  const [checkInStep, setCheckInStep] = useState<"qr" | "rate">("qr");
  const [partnerSelectedId, setPartnerSelectedId] = useState<string>("skn-01");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [demoStepIndex, setDemoStepIndex] = useState<number>(0);
  const [demoScoresOverride, setDemoScoresOverride] = useState<SubScores | null>(
    null
  );

  const filteredWashrooms = useMemo(
    () => WashroomRepository.filterWashrooms(washrooms, filters),
    [washrooms, filters]
  );

  const selectedWashroom = useMemo(
    () => washrooms.find((w) => w.id === selectedId) ?? null,
    [washrooms, selectedId]
  );

  const toggleFilter = useCallback((key: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const selectWashroom = useCallback(
    (washroom: WashroomWithDistance | null, openDetail = true) => {
      if (!washroom) {
        setIsDetailOpen(false);
        return;
      }
      setSelectedId(washroom.id);
      setPartnerSelectedId(washroom.id);
      if (openDetail) {
        setIsDetailOpen(true);
      }
    },
    []
  );

  const openCheckIn = useCallback((step: "qr" | "rate" = "qr") => {
    setCheckInStep(step);
    setIsCheckInOpen(true);
  }, []);

  const closeCheckIn = useCallback(() => {
    setIsCheckInOpen(false);
    setDemoScoresOverride(null);
  }, []);

  const dismissToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  const submitRating = useCallback(
    (
      washroomId: string,
      scores: SubScores,
      issueReported?: string,
      customComment?: string
    ) => {
      setWashrooms((prev) =>
        prev.map((w) =>
          w.id === washroomId
            ? WashroomRepository.applyNewRating(
                w,
                scores,
                issueReported,
                customComment
              )
            : w
        )
      );
      setSelectedId(washroomId);
      setPartnerSelectedId(washroomId);
      setIsCheckInOpen(false);
      setIsDetailOpen(true);
      setDemoScoresOverride(null);

      const copy = t(language);
      setToastMessage(copy.toastThanks);
      setTimeout(() => {
        setToastMessage((current) =>
          current === copy.toastThanks ? null : current
        );
      }, 5000);
    },
    [language]
  );

  const startDemoMode = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setActiveTab("map");
    setIsDetailOpen(false);
    setIsCheckInOpen(false);
    setSelectedId("skn-01");
    setPartnerSelectedId("skn-01");
    setDemoStepIndex(0);
    setIsDemoMode(true);
  }, []);

  const stopDemoMode = useCallback(() => {
    setIsDemoMode(false);
    setDemoScoresOverride(null);
  }, []);

  return (
    <SukoonContext.Provider
      value={{
        washrooms,
        filteredWashrooms,
        filters,
        toggleFilter,
        setFilters,
        resetFilters,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        selectedWashroom,
        selectWashroom,
        isDetailOpen,
        setIsDetailOpen,
        isCheckInOpen,
        openCheckIn,
        closeCheckIn,
        checkInStep,
        setCheckInStep,
        partnerSelectedId,
        setPartnerSelectedId,
        submitRating,
        toastMessage,
        dismissToast,
        isDemoMode,
        startDemoMode,
        stopDemoMode,
        demoStepIndex,
        setDemoStepIndex,
        demoScoresOverride,
        setDemoScoresOverride,
      }}
    >
      {children}
    </SukoonContext.Provider>
  );
}

export function useSukoon() {
  const ctx = useContext(SukoonContext);
  if (!ctx) {
    throw new Error("useSukoon must be used within a SukoonProvider");
  }
  return ctx;
}
