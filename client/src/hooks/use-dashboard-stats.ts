import { useState, useCallback } from "react";
import { axiosInstance } from "@/lib/axios";

// =============================================================================
// TYPES
// =============================================================================

export interface DailyCount {
  date: string;
  count: number;
}

export interface ServiceUsage {
  service_name: string;
  service_key: string;
  total_calls: number;
  recent_calls: DailyCount[];
}

export interface DashboardStats {
  total_calls: number;
  services: ServiceUsage[];
  time_range: string;
}

export type TimeRange = "7d" | "30d" | "90d";

interface UseDashboardStatsReturn {
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchStats: (range?: TimeRange) => Promise<void>;
}

// =============================================================================
// SERVICE COLORS
// =============================================================================

export const SERVICE_COLORS: Record<string, string> = {
  "generative-identity": "hsl(280, 85%, 65%)",  // Purple
  "traffic-analytics": "hsl(200, 85%, 55%)",    // Blue
  "email-service": "hsl(150, 70%, 50%)",        // Green
  "email-fraud": "hsl(35, 90%, 55%)",           // Orange
  "captcha": "hsl(340, 75%, 55%)",              // Pink
  "trust": "hsl(170, 70%, 45%)",                // Teal
};

// =============================================================================
// HOOK
// =============================================================================

export function useDashboardStats(): UseDashboardStatsReturn {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (range: TimeRange = "7d") => {
    setIsLoading(true);
    setError(null);

    try {
      // Small delay to prevent rapid duplicate requests during development
      await new Promise(resolve => setTimeout(resolve, 50));
      const response = await axiosInstance.get<DashboardStats>(
        `/api/dashboard/stats?range=${range}`
      );
      setStats(response.data);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } }; message?: string };
      const message = axiosError.response?.data?.error || axiosError.message || "Failed to fetch dashboard stats";
      setError(message);
      console.error("Dashboard stats error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
  };
}