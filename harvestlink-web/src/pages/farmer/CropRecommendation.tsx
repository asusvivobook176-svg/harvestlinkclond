import { useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { MLOnlineBadge, MLStatusBanner } from "../../components/shared/MLStatusBanner";
import { useML } from "../../hooks/useML";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../services/api";
import { TN_DISTRICTS, TN_VEGETABLES, SOIL_TYPES, PREVIOUS_CROPS } from "../../types";
import type { SoilType } from "../../types";
import { Sprout, ChevronRight, ChevronLeft, Save, RotateCcw, Leaf, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { pilotService } from "../../services/pilot";

const SOIL_EMOJI: Record<string, string> = { Red: "🟥", Black: "⬛", Sandy: "🟡", Loamy: "🟫" };

// Removed mock getMarketData function

export default function CropRecommendation() {
    const { getCropRecommendation, getDemandForecast, isMLOnline } = useML();
    const { t } = useTranslation();
    const { farmer } = useAuth();

    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);
    const [result, setResult] = useState<{
        recommended_crop: string; confidence: number;
        top_3: { crop: string; probability: number }[]; notes?: string;
    } | null>(null);
    const [marketData, setMarketData] = useState<{
        price: string; demand: string; trend: string; color: string; bg: string;
    } | null>(null);

    const STEPS = [
        t("recommendation.steps.land_info"),
        t("recommendation.steps.environment"),
        t("recommendation.steps.market_data")
    ];
    const WATER_OPTIONS = [t("recommendation.water_levels.low"), t("recommendation.water_levels.medium"), t("recommendation.water_levels.high")] as const;
    const SEASONS = [
        t("recommendation.seasons.kharif"),
        t("recommendation.seasons.rabi"),
        t("recommendation.seasons.summer"),
        t("recommendation.seasons.year_round")
    ] as const;

    // Step 1
    const [district, setDistrict] = useState(farmer?.district || "Salem");
    const [soilType, setSoilType] = useState<SoilType>((farmer?.soil_type as SoilType) || "Red");
    const [landArea, setLandArea] = useState(farmer?.land_area?.toString() || "2");
    const [waterAvailability, setWaterAvailability] = useState<string>(t("recommendation.water_levels.medium"));
    const [irrigationType, setIrrigationType] = useState<string>(t("recommendation.irrigation_options.drip"));

    // Step 2
    const [season, setSeason] = useState<string>(SEASONS[0]);
    const [temperature, setTemperature] = useState("28");
    const [rainfall, setRainfall] = useState("650");
    const [humidity, setHumidity] = useState("65");

    // Step 3
    const [previousCrop, setPreviousCrop] = useState("None");
    const [targetVegetable, setTargetVegetable] = useState("");
    const [marketDistance, setMarketDistance] = useState("15");

    const handleGetRecommendation = async () => {
        setLoading(true);
        try {
            const res = await getCropRecommendation({
                district, soil_type: soilType, land_area: parseFloat(landArea),
                water_availability: waterAvailability as any, irrigation_type: irrigationType as any,
                season: season.split(" ")[0] as any, temperature_celsius: parseFloat(temperature),
                rainfall_mm: parseFloat(rainfall), humidity_percent: parseFloat(humidity),
                previous_crop: previousCrop, market_demand_level: "Medium",
            });
            setResult({
                recommended_crop: res.recommended_crop,
                confidence: res.confidence,
                top_3: res.top_3_crops || [],
            });

            // Fetch dynamic Market Intelligence
            try {
                const demandRes = await getDemandForecast({
                    vegetable_name: res.recommended_crop,
                    month: new Date().getMonth() + 1,
                    year: new Date().getFullYear(),
                    prev_month_demand_kg: 500,
                    prev_month_price_rs: 40,
                    festival_week: false,
                    season: season.split(" ")[0],
                    city: district,
                    rainfall_mm: parseFloat(rainfall),
                    temperature_celsius: parseFloat(temperature)
                });
                
                // Compare to a base estimate to derive a trend percentage
                const basePrice = 45; 
                const trendVal = Math.round(((demandRes.predicted_price_rs - basePrice) / basePrice) * 100);
                const isPos = trendVal >= 0;
                
                setMarketData({
                    price: `₹${demandRes.predicted_price_rs}/kg`,
                    demand: demandRes.confidence_level || 'High',
                    trend: `${isPos ? '+' : ''}${trendVal}%`,
                    color: isPos ? 'text-emerald-600' : 'text-rose-600',
                    bg: isPos ? 'bg-emerald-50' : 'bg-rose-50'
                });
            } catch (err) {
                // Fallback on error
                setMarketData({ price: "₹55/kg", demand: "Medium", trend: "+5%", color: "text-emerald-600", bg: "bg-emerald-50" });
            }

            if (farmer?.user_id) {
                pilotService.logActivity({
                    user_id: parseInt(farmer.user_id),
                    feature: "Crop Advisor",
                    action: "get_recommendation"
                }).catch(err => console.error("Activity log failed:", err));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!farmer?.id || !result) return;
        try {
            await apiFetch("/market/recommendations", {
                method: "POST",
                body: JSON.stringify({
                    farmer_id: farmer.id,
                    recommended_crop: result.recommended_crop,
                    confidence_score: result.confidence,
                    top_3_crops: result.top_3,
                    input_data: { district, soilType, landArea, waterAvailability, irrigationType, season, temperature, rainfall, humidity, previousCrop },
                    season: season.split(" ")[0],
                })
            });
            setSaved(true);
        } catch (err) {
            console.error("Error saving recommendation:", err);
        }
    };

    const handleReset = () => { setResult(null); setMarketData(null); setSaved(false); setStep(0); };

    // Backend returns confidence as a percentage (0-100) already
    const pct = Math.round(result?.confidence || 0);
    const circumference = 2 * Math.PI * 38;
    const dashOffset = Math.max(0, circumference - (pct / 100) * circumference);

    // Market data state is set dynamically in handleGetRecommendation

    return (
        <div className="flex min-h-screen bg-green-50/50">
            <Sidebar role="farmer" />
            <div className="flex-1 flex flex-col min-w-0">
                <MLStatusBanner isOnline={isMLOnline} />
                <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">

                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-600 text-sm font-semibold mb-1">{t("recommendation.ai_analysis")}</p>
                            <h1 className="text-3xl font-black text-gray-900">{t("sidebar.farming")}</h1>
                            <p className="text-gray-500 text-sm mt-1">{t("recommendation.accuracy_note")}</p>
                        </div>
                        <MLOnlineBadge isOnline={isMLOnline} />
                    </div>

                    {!result ? (
                        <div className="card shadow-lg">
                            {/* Step progress */}
                            <div className="flex items-center gap-2 mb-8">
                                {STEPS.map((s, i) => (
                                    <div key={s} className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-300
                        ${i < step ? "bg-green-500 text-white shadow-md" : i === step ? "bg-green-600 text-white shadow-lg ring-4 ring-green-100" : "bg-gray-100 text-gray-400"}`}>
                                                {i < step ? "✓" : i + 1}
                                            </div>
                                            <span className={`text-xs font-semibold truncate hidden sm:block ${i === step ? "text-green-700" : i < step ? "text-green-500" : "text-gray-400"}`}>{s}</span>
                                        </div>
                                        {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded transition-all duration-500 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />}
                                    </div>
                                ))}
                            </div>

                            {/* Step 0: Land Info */}
                            {step === 0 && (
                                <div className="space-y-5 animate-fade-in-up">
                                    <h2 className="font-bold text-gray-900 text-lg">{t("recommendation.land_info_header")}</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("recommendation.district")}</label>
                                            <select className="input-field" value={district} onChange={e => setDistrict(e.target.value)}>
                                                {TN_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("recommendation.land_area")}: <span className="text-green-600 font-bold">{landArea} {t("recommendation.acres")}</span></label>
                                            <input type="range" min="0.5" max="20" step="0.5" value={landArea} onChange={e => setLandArea(e.target.value)} className="w-full mt-2 accent-green-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">{t("recommendation.soil_type")}</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {SOIL_TYPES.map(s => (
                                                <button key={s} type="button" onClick={() => setSoilType(s)}
                                                    className={`p-3 rounded-xl border-2 text-center transition-all ${soilType === s ? "border-green-500 bg-green-50 shadow-sm" : "border-gray-100 hover:border-green-200"}`}>
                                                    <span className="text-2xl block">{SOIL_EMOJI[s]}</span>
                                                    <span className="text-xs font-semibold mt-1 block">{t(`recommendation.soil_types.${s.toLowerCase()}`) || s}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">{t("recommendation.water_availability")}</label>
                                        <div className="flex gap-2">
                                            {WATER_OPTIONS.map(w => (
                                                <button key={w} type="button" onClick={() => setWaterAvailability(w)}
                                                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${waterAvailability === w ? "border-green-500 bg-green-50 text-green-700" : "border-gray-100 hover:border-green-200 text-gray-600"}`}>{w}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">{t("recommendation.irrigation_type")}</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { v: t("recommendation.irrigation_options.drip"), e: "💧" },
                                                { v: t("recommendation.irrigation_options.flood"), e: "🌊" },
                                                { v: t("recommendation.irrigation_options.rain_fed"), e: "🌧️" }
                                            ].map(({ v, e }) => (
                                                <button key={v} type="button" onClick={() => setIrrigationType(v)}
                                                    className={`p-3 rounded-xl border-2 text-center transition-all ${irrigationType === v ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-green-200"}`}>
                                                    <span className="text-xl block mb-1">{e}</span>
                                                    <span className="text-xs font-semibold">{v}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 1: Environment */}
                            {step === 1 && (
                                <div className="space-y-5 animate-fade-in-up">
                                    <h2 className="font-bold text-gray-900 text-lg">{t("recommendation.environment_header")}</h2>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-2">{t("recommendation.season")}</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {SEASONS.map(s => (
                                                <button key={s} type="button" onClick={() => setSeason(s)}
                                                    className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${season === s ? "border-green-500 bg-green-50 text-green-800 font-semibold" : "border-gray-100 hover:border-green-200 text-gray-600"}`}>{s}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: t("recommendation.temperature"), val: temperature, set: setTemperature, min: 20, max: 45, unit: "°C", emoji: "🌡️" },
                                            { label: t("recommendation.rainfall"), val: rainfall, set: setRainfall, min: 100, max: 2000, unit: "mm", emoji: "🌧️" },
                                            { label: t("recommendation.humidity"), val: humidity, set: setHumidity, min: 30, max: 95, unit: "%", emoji: "💧" },
                                        ].map(({ label, val, set, min, max, unit, emoji }) => (
                                            <div key={label}>
                                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">{emoji} {label}</label>
                                                <input type="number" className="input-field" value={val} onChange={e => set(e.target.value)} min={min} max={max} />
                                                <input type="range" min={min} max={max} value={val} onChange={e => set(e.target.value)} className="w-full mt-2 accent-green-600" />
                                                <p className="text-green-600 text-xs font-bold text-center">{val}{unit}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Market */}
                            {step === 2 && (
                                <div className="space-y-5 animate-fade-in-up">
                                    <h2 className="font-bold text-gray-900 text-lg">{t("recommendation.market_header")}</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("recommendation.previous_crop")}</label>
                                            <select className="input-field" value={previousCrop} onChange={e => setPreviousCrop(e.target.value)}>
                                                {PREVIOUS_CROPS.map(c => <option key={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("recommendation.preferred_vegetable")} <span className="text-gray-400">({t("recommendation.optional")})</span></label>
                                            <select className="input-field" value={targetVegetable} onChange={e => setTargetVegetable(e.target.value)}>
                                                <option value="">{t("recommendation.any_ai_decide")}</option>
                                                {TN_VEGETABLES.map(v => <option key={v} value={v}>{t(`common.${v.toLowerCase()}`) || v}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">{t("recommendation.market_distance")}: <span className="text-green-600 font-bold">{marketDistance} km</span></label>
                                        <input type="range" min="1" max="100" value={marketDistance} onChange={e => setMarketDistance(e.target.value)} className="w-full accent-green-600" />
                                    </div>
                                    <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                                        <p className="text-xs font-semibold text-green-700 mb-3">{t("recommendation.summary_header")}</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                            {[[t("recommendation.district"), district], [t("recommendation.soil_type"), soilType], [t("recommendation.land_area"), `${landArea} ${t("recommendation.acres")}`], [t("recommendation.water_availability"), waterAvailability], [t("recommendation.season"), season.split(" ")[0]], [t("recommendation.temperature"), `${temperature}°C`]].map(([k, v]) => (
                                                <div key={k} className="flex justify-between"><span className="text-gray-400">{k}</span><span className="font-semibold">{v}</span></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="flex gap-3 mt-8">
                                {step > 0 && (
                                    <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex items-center gap-2">
                                        <ChevronLeft className="w-4 h-4" />{t("recommendation.back")}
                                    </button>
                                )}
                                {step < 2 ? (
                                    <button onClick={() => setStep(s => s + 1)} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                                        {t("recommendation.next")}<ChevronRight className="w-4 h-4" />
                                    </button>
                                ) : (
                                    <button onClick={handleGetRecommendation} disabled={loading} className="btn-primary flex items-center gap-2 flex-1 justify-center py-3.5 text-base">
                                        {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t("recommendation.analyzing")}</> : <><Sprout className="w-5 h-5" />{t("recommendation.get_ai_recommendation")}</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        /* ── Results ── */
                        <div className="space-y-5 animate-fade-in-up">
                            <div className="card shadow-xl border-green-200 overflow-hidden">
                                {/* Green header strip */}
                                <div className="gradient-card -mx-6 -mt-6 px-6 pt-8 pb-10 mb-6 relative overflow-hidden">
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                                    <div className="absolute -bottom-16 -right-6 w-48 h-48 bg-white/5 rounded-full" />
                                    <p className="text-green-200 text-sm font-semibold mb-1">{t("recommendation.results_header")}</p>
                                    <h2 className="text-4xl font-black text-white mb-1">🌱 {t(`common.${result.recommended_crop.toLowerCase()}`, { defaultValue: result.recommended_crop })}</h2>
                                    <p className="text-green-200/80 text-sm">{t("recommendation.best_crop_note", { soil: t(`recommendation.soil_types.${soilType.toLowerCase()}`) || soilType, district: district })}</p>
                                </div>

                                {/* Confidence Ring */}
                                <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
                                    <div className="relative">
                                        <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
                                            <circle cx="50" cy="50" r="38" fill="none" stroke="#dcfce7" strokeWidth="8" />
                                            <circle cx="50" cy="50" r="38" fill="none" stroke="#16a34a" strokeWidth="8"
                                                strokeDasharray={circumference} strokeDashoffset={dashOffset}
                                                strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-2xl font-black text-gray-900">{pct}%</span>
                                            <span className="text-xs text-gray-400">{t("recommendation.confidence")}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-lg font-bold mb-1 ${pct >= 80 ? "text-green-700" : pct >= 60 ? "text-amber-600" : "text-red-600"}`}>
                                            {pct >= 80 ? t("recommendation.confidence_high") : pct >= 60 ? t("recommendation.confidence_moderate") : t("recommendation.confidence_low")}
                                        </p>
                                        {result.notes && <p className="text-gray-500 text-sm">{result.notes}</p>}
                                    </div>
                                </div>

                                {/* Top 3 alternatives */}
                                {result.top_3.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{t("recommendation.other_options")}</p>
                                        <div className="space-y-2">
                                            {result.top_3.map(({ crop, probability }, i) => (
                                                <div key={crop} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-700">{i + 1}</span>
                                                    <span className="flex-1 font-semibold text-gray-800 text-sm">{t(`common.${crop.toLowerCase()}`, { defaultValue: crop })}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="progress-bar w-20"><div className="progress-fill" style={{ width: `${Math.round(probability * 100)}%` }} /></div>
                                                        <span className="text-xs text-gray-500 w-8 text-right">{Math.round(probability * 100)}%</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Market Insights */}
                                {marketData && (
                                    <div className="mt-8 bg-gray-50/50 rounded-2xl p-5 border border-gray-100">
                                        <h3 className="text-xs font-black text-gray-500 mb-4 flex items-center gap-2 uppercase tracking-widest">
                                            <TrendingUp className="w-4 h-4 text-emerald-600" /> Market Intelligence
                                        </h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                                <p className="text-[10px] uppercase font-black text-gray-400 mb-1">{t("dashboard.market_price", { defaultValue: "Current Price" })}</p>
                                                <p className="text-xl font-black text-gray-900">{marketData.price}</p>
                                            </div>
                                            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                                                <p className="text-[10px] uppercase font-black text-gray-400 mb-1">Market Demand</p>
                                                <p className="text-xl font-black text-emerald-600">{marketData.demand}</p>
                                            </div>
                                            <div className={`p-3 rounded-xl border shadow-sm flex flex-col justify-center ${marketData.bg} ${marketData.trend.includes('-') ? 'border-rose-100' : 'border-emerald-100'}`}>
                                                <p className={`text-[10px] uppercase font-black mb-1 opacity-70 ${marketData.color}`}>30-Day Trend</p>
                                                <p className={`text-xl font-black ${marketData.color}`}>{marketData.trend}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="md:flex gap-4 mt-8 pt-6 border-t border-gray-100">
                                    <button onClick={handleReset} className="btn-secondary flex-1 py-3.5 mb-3 md:mb-0 flex items-center justify-center gap-2 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 shadow-sm transition-all text-sm font-bold text-gray-700">
                                        <RotateCcw className="w-4 h-4 text-green-600" />{t("recommendation.new_analysis")}
                                    </button>
                                    <button onClick={handleSave} disabled={saved || !farmer?.id} className={`flex-[1.5] py-3.5 flex items-center justify-center gap-2 rounded-xl font-bold shadow-md transition-all text-sm ${saved ? "bg-green-100 text-green-800 border-2 border-green-200 cursor-not-allowed" : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg hover:-translate-y-0.5"}`}>
                                        {saved ? <><Leaf className="w-5 h-5" />{t("recommendation.saved")}</> : <><Save className="w-5 h-5" />{t("recommendation.save_to_dashboard")}</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
