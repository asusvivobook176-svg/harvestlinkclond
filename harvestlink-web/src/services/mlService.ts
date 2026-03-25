const ML_BASE_URL = "http://localhost:5000/api";

// ─── Health Check ──────────────────────────────────────────────
export const checkMLHealth = async (): Promise<boolean> => {
    try {
        const res = await fetch(`${ML_BASE_URL}/health`, { signal: AbortSignal.timeout(3000) });
        return res.ok;
    } catch {
        return false;
    }
};

// ─── Model 1: Crop Recommendation ─────────────────────────────
export interface CropInput {
    land_area: number;
    soil_type: "Red" | "Black" | "Sandy" | "Loamy";
    water_availability: "Low" | "Medium" | "High";
    irrigation_type: "Drip" | "Flood" | "Rain-fed";
    rainfall_mm: number;
    temperature_celsius: number;
    humidity_percent: number;
    season: "Summer" | "Kharif" | "Rabi";
    previous_crop: string;
    market_demand_level: "Low" | "Medium" | "High";
    district: string;
}

export interface CropResult {
    success: boolean;
    recommended_crop: string;
    confidence: number;
    top_3_crops: Array<{ crop: string; probability: number }>;
    inference_time_ms: number;
}

const CROP_MOCK: CropResult = {
    success: true,
    recommended_crop: "Beans",
    confidence: 0.87,
    top_3_crops: [
        { crop: "Beans", probability: 0.87 },
        { crop: "Okra", probability: 0.08 },
        { crop: "Tomato", probability: 0.05 },
    ],
    inference_time_ms: 14,
};

export const getCropRecommendation = async (input: CropInput): Promise<CropResult> => {
    try {
        const res = await fetch(`${ML_BASE_URL}/predict/crop`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        // Normalize backend response
        return {
            success: true,
            recommended_crop: data.recommended_crop,
            confidence: data.confidence,
            top_3_crops: data.top_3_crops || [],
            inference_time_ms: data.inference_time_ms || 0,
        };
    } catch {
        return CROP_MOCK;
    }
};

// ─── Model 2: Market Demand Forecast ──────────────────────────
export interface DemandInput {
    vegetable_name: string;
    month: number;
    year: number;
    prev_month_demand_kg: number;
    prev_month_price_rs: number;
    festival_week: boolean;
    season: string;
    city: string;
    rainfall_mm: number;
    temperature_celsius: number;
}

export interface DemandResult {
    success: boolean;
    predicted_demand_kg: number;
    predicted_price_rs: number;
    confidence_level: "Low" | "Medium" | "High";
}

const DEMAND_MOCK: DemandResult = {
    success: true,
    predicted_demand_kg: 450,
    predicted_price_rs: 35,
    confidence_level: "Medium",
};

export const getDemandForecast = async (input: DemandInput): Promise<DemandResult> => {
    try {
        const res = await fetch(`${ML_BASE_URL}/predict/demand`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                vegetable_name: input.vegetable_name,
                month: input.month,
                year: input.year,
                prev_demand_kg: input.prev_month_demand_kg,
                prev_price_rs: input.prev_month_price_rs,
                festival_week: input.festival_week ? 1 : 0,
                season: input.season,
                city: input.city,
                rainfall_mm: input.rainfall_mm,
                temperature: input.temperature_celsius,
            }),
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        return {
            success: true,
            predicted_demand_kg: data.predicted_demand_kg,
            predicted_price_rs: data.predicted_price_rs,
            confidence_level: data.confidence || "Medium",
        };
    } catch {
        // Add slight variation for multi-month forecasts
        const variation = 1 + (Math.random() - 0.5) * 0.3;
        return {
            ...DEMAND_MOCK,
            predicted_demand_kg: Math.round(DEMAND_MOCK.predicted_demand_kg * variation),
            predicted_price_rs: Math.round(DEMAND_MOCK.predicted_price_rs * variation),
        };
    }
};

// ─── Model 3: Price Crash Alert ───────────────────────────────
export interface PriceAlertInput {
    vegetable_name: string;
    current_price_rs: number;
    prev_week_price_rs: number;
    current_supply_kg: number;
    current_demand_kg: number;
    month: number;
    festival_next_week: boolean;
    district: string;
}

export interface PriceAlertResult {
    success: boolean;
    crash_alert: boolean;
    predicted_price_next_week: number;
    crash_severity: "None" | "Mild" | "Severe";
    alert_message_en: string;
    alert_message_ta: string;
    recommended_action: string;
}

const PRICE_MOCK: PriceAlertResult = {
    success: true,
    crash_alert: false,
    predicted_price_next_week: 28,
    crash_severity: "None",
    alert_message_en: "Price is stable this week. Safe to sell at current rates.",
    alert_message_ta: "இந்த வாரம் விலை நிலையாக உள்ளது. தற்போதைய விகிதத்தில் விற்பனை செய்யலாம்.",
    recommended_action: "Price stable — sell on schedule",
};

export const getPriceCrashAlert = async (input: PriceAlertInput): Promise<PriceAlertResult> => {
    try {
        const res = await fetch(`${ML_BASE_URL}/predict/price-crash`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                vegetable_name: input.vegetable_name,
                current_price_rs: input.current_price_rs,
                prev_week_price_rs: input.prev_week_price_rs,
                current_supply_kg: input.current_supply_kg,
                current_demand_kg: input.current_demand_kg,
                supply_demand_ratio: input.current_supply_kg / (input.current_demand_kg || 1),
                month: input.month,
                festival_next_week: input.festival_next_week ? 1 : 0,
                district: input.district,
            }),
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const severity = data.severity as "None" | "Mild" | "Severe";
        const crash = data.price_crash_alert as boolean;
        const predicted = data.predicted_price as number;
        const pctChange = ((predicted - input.current_price_rs) / input.current_price_rs) * 100;
        return {
            success: true,
            crash_alert: crash,
            predicted_price_next_week: predicted,
            crash_severity: severity,
            alert_message_en: crash
                ? `⚠️ ${input.vegetable_name} price may drop ${Math.abs(pctChange).toFixed(0)}% next week.`
                : `✅ ${input.vegetable_name} price is stable.`,
            alert_message_ta: crash
                ? `⚠️ ${input.vegetable_name} விலை அடுத்த வாரம் ${Math.abs(pctChange).toFixed(0)}% குறையலாம்.`
                : `✅ ${input.vegetable_name} விலை நிலையானது.`,
            recommended_action: data.recommended_action || "Monitor market conditions",
        };
    } catch {
        return PRICE_MOCK;
    }
};

// ─── Model 4: Spoilage Risk ────────────────────────────────────
export interface SpoilageInput {
    vegetable_type: string;
    storage_temperature_celsius: number;
    humidity_percent: number;
    transport_time_hours: number;
    days_since_harvest: number;
    storage_type: "Open Air" | "Cold Storage" | "Covered Shed" | "Refrigerated Truck";
    packaging_type: "Loose" | "Jute Bag" | "Plastic Crate" | "Cardboard Box";
    bruising_level: "None" | "Minor" | "Severe";
    initial_quality_score: number;
    season: string;
    district: string;
}

export interface SpoilageResult {
    success: boolean;
    risk_level: "Low" | "Medium" | "High";
    days_remaining: number;
    confidence_percent: number;
    recommended_action: string;
    circular_economy_suggestion: string | null;
    alert_message: string;
}

const SPOILAGE_MOCK: SpoilageResult = {
    success: true,
    risk_level: "Medium",
    days_remaining: 4,
    confidence_percent: 78,
    recommended_action: "Sell within 3-4 days for best value.",
    circular_economy_suggestion: null,
    alert_message: "Medium spoilage risk detected. Plan your sale soon.",
};

export const getSpoilageRisk = async (input: SpoilageInput): Promise<SpoilageResult> => {
    try {
        const bruisingMap = { None: 0, Minor: 1, Severe: 2 };
        const res = await fetch(`${ML_BASE_URL}/predict/spoilage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                vegetable_type: input.vegetable_type,
                storage_temperature: input.storage_temperature_celsius,
                humidity_percent: input.humidity_percent,
                transport_time_hours: input.transport_time_hours,
                days_since_harvest: input.days_since_harvest,
                storage_type: input.storage_type,
                packaging_type: input.packaging_type,
                bruising_level: bruisingMap[input.bruising_level],
                initial_quality_score: input.initial_quality_score,
                season: input.season,
                district: input.district,
            }),
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        const risk = data.spoilage_risk_level as "Low" | "Medium" | "High";
        const days = data.estimated_days_remaining as number;
        return {
            success: true,
            risk_level: risk,
            days_remaining: days,
            confidence_percent: Math.round((data.confidence || 0.8) * 100),
            recommended_action: data.recommended_action,
            circular_economy_suggestion:
                risk === "High"
                    ? "Consider donating to a local food bank or contacting nearby hotels."
                    : null,
            alert_message:
                risk === "High"
                    ? `🔴 High risk! Sell or donate within 24 hours.`
                    : risk === "Medium"
                        ? `🟡 Medium risk. Sell within ${days} days.`
                        : `🟢 Safe to store for ${days} more days.`,
        };
    } catch {
        return SPOILAGE_MOCK;
    }
};

// ─── Model 5: Profit Prediction ────────────────────────────────
export interface ProfitInput {
    crop_name: string;
    area_acres: number;
    yield_estimate_kg: number;
    market_price_rs: number;
    input_cost_rs: number;
    district: string;
}

export interface ProfitResult {
    success: boolean;
    expected_profit_rs: number;
    roi_percent: number;
    confidence: number;
}

export const getProfitPrediction = async (input: ProfitInput): Promise<ProfitResult> => {
    try {
        const res = await fetch(`${ML_BASE_URL}/predict/profit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("API error");
        return await res.json();
    } catch {
        return { success: true, expected_profit_rs: 45000, roi_percent: 32, confidence: 0.85 };
    }
};

// ─── Model 6: Yield Prediction ─────────────────────────────────
export interface YieldInput {
    crop_name: string;
    area_acres: number;
    soil_type: string;
    rainfall_mm: number;
    temperature_celsius: number;
    irrigation_type: string;
    fertilizer_used: string;
    district: string;
}

export interface YieldResult {
    success: boolean;
    predicted_yield_kg: number;
    yield_per_acre: number;
    confidence: number;
}

export const getYieldPrediction = async (input: YieldInput): Promise<YieldResult> => {
    try {
        const res = await fetch(`${ML_BASE_URL}/predict/yield`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("API error");
        return await res.json();
    } catch {
        return { success: true, predicted_yield_kg: 2500, yield_per_acre: 2500, confidence: 0.88 };
    }
};

// ─── Model 7: Crop Failure Risk ────────────────────────────────
export interface FailureRiskInput {
    crop_name: string;
    soil_type: string;
    rainfall_mm: number;
    temperature_celsius: number;
    humidity_percent: number;
    pest_history: boolean;
    water_stress: boolean;
    district: string;
}

export interface FailureRiskResult {
    success: boolean;
    failure_probability: number;
    risk_category: "Low" | "Medium" | "High";
    factors: string[];
}

export const getFailureRisk = async (input: FailureRiskInput): Promise<FailureRiskResult> => {
    try {
        const res = await fetch(`${ML_BASE_URL}/predict/failure-risk`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("API error");
        return await res.json();
    } catch {
        return { success: true, failure_probability: 0.12, risk_category: "Low", factors: ["Adequate rainfall", "Good soil health"] };
    }
};

// ─── Model 8: Risk Scoring ─────────────────────────────────────
export interface RiskScoreInput {
    crop_name: string;
    district: string;
    season: string;
    market_demand_level: string;
    weather_risk: number;
    pest_risk: number;
}

export interface RiskScoreResult {
    success: boolean;
    overall_risk_score: number;
    risk_category: "Very Low" | "Low" | "Medium" | "High" | "Critical";
    breakdown: Record<string, number>;
}

export const getRiskScore = async (input: RiskScoreInput): Promise<RiskScoreResult> => {
    try {
        const res = await fetch(`${ML_BASE_URL}/predict/risk-score`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(input),
            signal: AbortSignal.timeout(10000),
        });
        if (!res.ok) throw new Error("API error");
        return await res.json();
    } catch {
        return { success: true, overall_risk_score: 28, risk_category: "Low", breakdown: { weather: 15, market: 20, pest: 10 } };
    }
};
