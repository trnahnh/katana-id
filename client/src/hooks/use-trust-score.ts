import { useState, useCallback } from "react";
import { axiosInstance } from "@/lib/axios";
import { collectFingerprint, type FingerprintData } from "@/lib/fingerprint";

// =============================================================================
// TYPES
// =============================================================================

interface Signal {
  name: string;
  score: number;
  reason: string;
}

interface TrustScoreResult {
  score: number;
  signals: Signal[];
  recommendation: "allow" | "captcha" | "block";
  fingerprint_id: string;
}

interface UseTrustScoreReturn {
  checkTrust: (email: string) => Promise<TrustScoreResult | null>;
  recordFingerprint: (userId?: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  fingerprint: FingerprintData | null;
}

// =============================================================================
// HOOK
// =============================================================================

export function useTrustScore(): UseTrustScoreReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<FingerprintData | null>(null);

  const checkTrust = useCallback(async (email: string): Promise<TrustScoreResult | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const fp = await collectFingerprint();
      setFingerprint(fp);

      const response = await axiosInstance.post<TrustScoreResult>("/api/trust/score", {
        fingerprint: fp,
        email,
      });

      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to check trust score";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const recordFingerprint = useCallback(async (userId?: number): Promise<void> => {
    try {
      const fp = fingerprint || await collectFingerprint();

      await axiosInstance.post("/api/trust/record", {
        fingerprint: fp,
        user_id: userId,
      });
    } catch (err) {
      console.error("Failed to record fingerprint:", err);
    }
  }, [fingerprint]);

  return {
    checkTrust,
    recordFingerprint,
    isLoading,
    error,
    fingerprint,
  };
}