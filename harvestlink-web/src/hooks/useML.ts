import { useState, useEffect, useCallback } from "react";
import { checkMLHealth, getCropRecommendation, getDemandForecast, getPriceCrashAlert, getSpoilageRisk } from "../services/mlService";
import type { CropInput, CropResult, DemandInput, DemandResult, PriceAlertInput, PriceAlertResult, SpoilageInput, SpoilageResult } from "../services/mlService";

export function useML() {
    const [isMLOnline, setIsMLOnline] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const check = async () => {
            const online = await checkMLHealth();
            setIsMLOnline(online);
        };
        check();
        const interval = setInterval(check, 30000);
        return () => clearInterval(interval);
    }, []);

    const runCropRecommendation = useCallback(async (input: CropInput): Promise<CropResult> => {
        setIsLoading(true);
        try {
            return await getCropRecommendation(input);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const runDemandForecast = useCallback(async (input: DemandInput): Promise<DemandResult> => {
        setIsLoading(true);
        try {
            return await getDemandForecast(input);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const runPriceCrashAlert = useCallback(async (input: PriceAlertInput): Promise<PriceAlertResult> => {
        setIsLoading(true);
        try {
            return await getPriceCrashAlert(input);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const runSpoilageRisk = useCallback(async (input: SpoilageInput): Promise<SpoilageResult> => {
        setIsLoading(true);
        try {
            return await getSpoilageRisk(input);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isMLOnline,
        isLoading,
        getCropRecommendation: runCropRecommendation,
        getDemandForecast: runDemandForecast,
        getPriceCrashAlert: runPriceCrashAlert,
        getSpoilageRisk: runSpoilageRisk,
    };
}
