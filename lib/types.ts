export type PartnerType = "cafe" | "petrol_pump" | "store" | "mall";

export type Language = "en" | "hi";

export type ActiveTab = "map" | "partner" | "city";

export interface SubScores {
  clean: number;
  safe: number;
  lock: number;
  water: number;
}

export interface AnonymousRating {
  id: string;
  timestamp: string;
  timestampHi: string;
  average: number;
  scores: SubScores;
  comment: string;
  commentHi: string;
  issueReported?: string;
}

export interface PartnerMetrics {
  verifiedMonths: number;
  monthlyStipendINR: number;
  upiHandle: string;
  upiStatus: "Paid" | "Scheduled" | "Processing";
  lastPayoutDate: string;
  checkInsThisWeek: number;
  weeklyTrend: number[]; // 8 weeks of rating history
}

export interface Washroom {
  id: string;
  code: string; // QR short code e.g. SKN-CP-01
  name: string;
  nameHi: string;
  type: PartnerType;
  area: string;
  areaHi: string;
  address: string;
  lat: number;
  lng: number;
  hours: string;
  isOpenNow: boolean;
  womenSafe: boolean;
  hasWater: boolean;
  innerLock: boolean;
  babyChange: boolean;
  verifiedPartner: boolean;
  scores: SubScores;
  averageScore: number;
  totalRatings: number;
  recentRatings: AnonymousRating[];
  partnerMetrics: PartnerMetrics;
}

export interface FilterState {
  openNow: boolean;
  womenSafe: boolean;
  hasWater: boolean;
  innerLock: boolean;
  babyChange: boolean;
}
