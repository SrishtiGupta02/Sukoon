import { DEMO_LOCATION, SEED_WASHROOMS } from "@/data/seed";
import { AnonymousRating, FilterState, SubScores, Washroom } from "@/lib/types";

export interface WashroomWithDistance extends Washroom {
  distanceKm: number;
}

/**
 * Calculates Haversine distance in kilometers between two coordinates.
 */
export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Data access layer for Partner Washrooms.
 * Currently backed by local /data/seed.ts; structured as a repository
 * so a Supabase client query can be swapped in directly.
 */
export const WashroomRepository = {
  getAll(): WashroomWithDistance[] {
    return SEED_WASHROOMS.map((w) => ({
      ...w,
      distanceKm: calculateDistanceKm(
        DEMO_LOCATION.lat,
        DEMO_LOCATION.lng,
        w.lat,
        w.lng
      ),
    })).sort((a, b) => a.distanceKm - b.distanceKm);
  },

  filterWashrooms(
    washrooms: WashroomWithDistance[],
    filters: FilterState
  ): WashroomWithDistance[] {
    return washrooms
      .filter((w) => {
        if (filters.openNow && !w.isOpenNow) return false;
        if (filters.womenSafe && !w.womenSafe) return false;
        if (filters.hasWater && !w.hasWater) return false;
        if (filters.innerLock && !w.innerLock) return false;
        if (filters.babyChange && !w.babyChange) return false;
        return true;
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  },

  applyNewRating(
    washroom: WashroomWithDistance,
    newScores: SubScores,
    issueReported?: string,
    customComment?: string
  ): WashroomWithDistance {
    // Weighted blend so live demo clearly shows the score moving immediately on screen
    const weightOld = 0.72;
    const weightNew = 0.28;

    const updatedSubScores: SubScores = {
      clean: Number(
        (washroom.scores.clean * weightOld + newScores.clean * weightNew).toFixed(1)
      ),
      safe: Number(
        (washroom.scores.safe * weightOld + newScores.safe * weightNew).toFixed(1)
      ),
      lock: Number(
        (washroom.scores.lock * weightOld + newScores.lock * weightNew).toFixed(1)
      ),
      water: Number(
        (washroom.scores.water * weightOld + newScores.water * weightNew).toFixed(1)
      ),
    };

    const newAverage = Number(
      (
        (updatedSubScores.clean +
          updatedSubScores.safe +
          updatedSubScores.lock +
          updatedSubScores.water) /
        4
      ).toFixed(1)
    );

    const ratingAvg = Number(
      (
        (newScores.clean + newScores.safe + newScores.lock + newScores.water) /
        4
      ).toFixed(1)
    );

    const defaultEn = issueReported
      ? `Checked in via QR. Reported: ${issueReported}.`
      : "Verified via QR scan. Clean, unlocked, and well-maintained partner washroom.";
    const defaultHi = issueReported
      ? `क्यूआर चेक-इन। रिपोर्ट: ${issueReported}`
      : "क्यूआर स्कैन द्वारा सत्यापित। साफ, खुला और सुरक्षित पार्टनर वॉशरूम।";

    const newEntry: AnonymousRating = {
      id: `r-live-${Date.now()}`,
      timestamp: "Just now",
      timestampHi: "अभी-अभी",
      average: ratingAvg,
      scores: newScores,
      comment: customComment?.trim() ? customComment.trim() : defaultEn,
      commentHi: customComment?.trim() ? customComment.trim() : defaultHi,
      issueReported,
    };

    const updatedTrend = [...washroom.partnerMetrics.weeklyTrend.slice(1), newAverage];

    return {
      ...washroom,
      scores: updatedSubScores,
      averageScore: newAverage,
      totalRatings: washroom.totalRatings + 1,
      recentRatings: [newEntry, ...washroom.recentRatings.slice(0, 2)],
      partnerMetrics: {
        ...washroom.partnerMetrics,
        checkInsThisWeek: washroom.partnerMetrics.checkInsThisWeek + 1,
        weeklyTrend: updatedTrend,
      },
    };
  },
};
