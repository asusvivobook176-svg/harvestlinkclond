import { useState, useEffect } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { MLOnlineBadge, MLStatusBanner } from "../../components/shared/MLStatusBanner";
import { useML } from "../../hooks/useML";
import { useAuth } from "../../hooks/useAuth";
import { pilotService } from "../../services/pilot";
import { apiFetch } from "../../services/api";
import { TN_VEGETABLES } from "../../types";
import type { SpoilageCheck } from "../../types";
import { Bug, History, ShieldEllipsis, AlertTriangle, CheckCircle2, RotateCcw, Save, Leaf, Thermometer, Droplets, Info, RefreshCw } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { useTranslation } from "react-i18next";

export default function SpoilageChecker() {
    const { getSpoilageRisk, isMLOnline } = useML();
    const { farmer } = useAuth();
    const { t } = useTranslation();

    const [vegetable, setVegetable] = useState(TN_VEGETABLES[0]);
    const [temperature, setTemperature] = useState("30");
    const [humidity, setHumidity] = useState("70");
    const [storageType, setStorageType] = useState<any>("Ambient");
    const [transportTime, setTransportTime] = useState("4");

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [saved, setSaved] = useState(false);
    const [history, setHistory] = useState<SpoilageCheck[]>([]);

    const fetchHistory = async () => {
        if (!farmer?.id) return;
        try {
            const data = await apiFetch(`/market/spoilage_checks?farmer_id=${farmer.id}`);
            setHistory((data || []) as SpoilageCheck[]);
        } catch (err) {
            console.error("Error fetching spoilage history:", err);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [farmer?.id]);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);
        try {
            const res = await getSpoilageRisk({
                vegetable_type: vegetable,
                storage_temperature_celsius: parseFloat(temperature),
                humidity_percent: parseFloat(humidity),
                storage_type: "Open Air", // Simulating a fixed valid type for now
                transport_time_hours: parseFloat(transportTime),
                days_since_harvest: 1,
                packaging_type: "Loose",
                bruising_level: "None",
                initial_quality_score: 90,
                season: "Summer",
                district: "Salem"
            });
            setResult(res);
            if (farmer?.user_id) {
                pilotService.logActivity({
                    user_id: parseInt(farmer.user_id),
                    feature: "Spoilage Checker",
                    action: "check_risk"
                }).catch(err => console.error("Activity log failed:", err));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!farmer?.id || !result) return;
        try {
            await apiFetch("/market/spoilage_checks", {
                method: "POST",
                body: JSON.stringify({
                    farmer_id: farmer.id,
                    vegetable_type: result.vegetable_type,
                    risk_level: result.risk_level,
                    days_remaining: result.days_remaining,
                    recommended_action: result.recommended_action,
                    input_data: { vegetable, temperature, humidity, storageType, transportTime },
                })
            });
            setSaved(true);
            fetchHistory();
        } catch (err) {
            console.error("Error saving spoilage check:", err);
        }
    };

    const reset = () => { setResult(null); setSaved(false); };

    const getRiskColor = (risk: string | null) => {
        if (risk === "Low") return "text-green-600 border-green-200 bg-green-50";
        if (risk === "Medium") return "text-amber-600 border-amber-200 bg-amber-50";
        return "text-red-600 border-red-200 bg-red-50";
    };

    const getRiskIcon = (risk: string | null) => {
        if (risk === "Low") return <CheckCircle2 className="w-10 h-10" />;
        if (risk === "Medium") return <AlertTriangle className="w-10 h-10" />;
        return <ShieldEllipsis className="w-10 h-10" />;
    };

    return (
        <div className="flex min-h-screen bg-green-50/50">
            <Sidebar role="farmer" />
            <div className="flex-1 flex flex-col min-w-0">
                <MLStatusBanner isOnline={isMLOnline} />
                <main className="flex-1 p-6 space-y-6 max-w-5xl mx-auto w-full">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="animate-fade-in-up">
                            <p className="text-red-600 text-sm font-semibold mb-1 flex items-center gap-1.5">
                                <Bug className="w-4 h-4" /> {t("spoilage.quality_control")}
                            </p>
                            <h1 className="text-3xl font-black text-gray-900">{t("spoilage.title")}</h1>
                            <p className="text-gray-500 text-sm mt-1">{t("spoilage.description")}</p>
                        </div>
                        <MLOnlineBadge isOnline={isMLOnline} />
                    </div>

                    {!result ? (
                        <div className="grid lg:grid-cols-12 gap-8 items-start">
                            {/* Form Side */}
                            <div className="lg:col-span-7 card shadow-lg animate-fade-in-up">
                                <form onSubmit={handleCheck} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">{t("spoilage.form.vegetable_type")}</label>
                                            <select className="input-field" value={vegetable} onChange={e => setVegetable(e.target.value)}>
                                                {TN_VEGETABLES.map(v => <option key={v} value={v}>{t(`common.${v.toLowerCase()}`) || v}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">{t("spoilage.form.storage_type")}</label>
                                            <select className="input-field" value={storageType} onChange={e => setStorageType(e.target.value)}>
                                                <option value="Ambient">{t("spoilage.storage_types.ambient")}</option>
                                                <option value="Refrigerated">{t("spoilage.storage_types.refrigerated")}</option>
                                                <option value="Cold Storage">{t("spoilage.storage_types.cold_storage")}</option>
                                                <option value="Shaded">{t("spoilage.storage_types.shaded")}</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <Thermometer className="w-3.5 h-3.5 text-red-500" /> {t("spoilage.form.temp")} (°C)
                                                </span>
                                                <span className="text-sm font-black text-gray-900">{temperature}°C</span>
                                            </label>
                                            <input type="range" min="0" max="50" step="1" value={temperature} onChange={e => setTemperature(e.target.value)} className="w-full accent-red-500" />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1.5">
                                                    <Droplets className="w-3.5 h-3.5 text-blue-500" /> {t("spoilage.form.humidity")} (%)
                                                </span>
                                                <span className="text-sm font-black text-gray-900">{humidity}%</span>
                                            </label>
                                            <input type="range" min="10" max="100" step="1" value={humidity} onChange={e => setHumidity(e.target.value)} className="w-full accent-blue-500" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">{t("spoilage.form.transport_time")} <span className="text-gray-400 font-normal">({t("spoilage.form.hours_to_market")})</span></label>
                                        <div className="flex items-center gap-3">
                                            <input type="range" min="1" max="48" step="1" value={transportTime} onChange={e => setTransportTime(e.target.value)} className="flex-1 accent-amber-500" />
                                            <span className="w-16 text-center font-black text-gray-900 bg-gray-50 py-1 rounded-lg border border-gray-100">{transportTime}h</span>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full py-4 text-base font-black justify-center shadow-red-100"
                                    >
                                        {loading ? (
                                            <><RefreshCw className="w-5 h-5 animate-spin" /> {t("spoilage.form.calculating")}</>
                                        ) : (
                                            <><ShieldEllipsis className="w-5 h-5" /> {t("spoilage.form.analyze_btn")}</>
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Tips / Info Side */}
                            <div className="lg:col-span-5 space-y-4">
                                <div className="card bg-linear-to-br from-indigo-600 to-blue-700 text-white border-none shadow-xl animate-fade-in-up delay-100">
                                    <h3 className="font-bold flex items-center gap-2 mb-3">
                                        <Info className="w-5 h-5" /> {t("spoilage.why_check.title")}
                                    </h3>
                                    <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                                        {t("spoilage.why_check.note")}
                                    </p>
                                    <ul className="space-y-3 text-sm font-medium">
                                        <li className="flex items-center gap-2 pb-2 border-b border-white/10">
                                            <CheckCircle2 className="w-4 h-4 text-green-300" /> {t("spoilage.why_check.decide_when")}
                                        </li>
                                        <li className="flex items-center gap-2 pb-2 border-b border-white/10">
                                            <CheckCircle2 className="w-4 h-4 text-green-300" /> {t("spoilage.why_check.decide_storage")}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-green-300" /> {t("spoilage.why_check.decide_window")}
                                        </li>
                                    </ul>
                                </div>

                                <div className="card border-gray-100 animate-fade-in-up delay-200">
                                    <h3 className="font-bold text-gray-900 mb-3 text-sm">{t("spoilage.circular_tips.title")}</h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        {t("spoilage.circular_tips.note")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (loading || !result) ? (
                        <div className="h-full flex flex-col items-center justify-center py-20 animate-pulse">
                            <div className="w-20 h-20 bg-gray-100 rounded-full mb-4" />
                            <div className="h-4 bg-gray-100 rounded w-48" />
                        </div>
                    ) : (
                        /* Results View */
                        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-scale">
                            <div className={`card border-2 shadow-2xl p-8 text-center ${getRiskColor(result.risk_level)}`}>
                                <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-white/50 border-4 border-white shadow-sm">
                                    {getRiskIcon(result.risk_level)}
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest mb-1">{t("spoilage.assessment.title")}</p>
                                <h2 className="text-4xl font-black mb-2">{t("common.risk_level_label", { risk: t(`common.${result.risk_level.toLowerCase()}`) })}</h2>
                                <div className="w-16 h-1 bg-current mx-auto mb-6 opacity-20 rounded-full" />

                                <div className="flex justify-center items-baseline gap-2 mb-8">
                                    <span className="text-6xl font-black text-gray-900">{result.days_remaining}</span>
                                    <span className="text-xl font-bold text-gray-500">{t("spoilage.assessment.days_freshness")}</span>
                                </div>

                                <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-white mb-8">
                                    <p className="text-gray-900 font-bold mb-1.5 flex items-center justify-center gap-2">
                                        <Leaf className="w-4 h-4 text-green-600" /> {t("spoilage.assessment.recommended_action")}
                                    </p>
                                    <p className="text-gray-600 text-sm leading-relaxed">{result.recommended_action}</p>
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={reset} className="btn-secondary flex-1 justify-center py-3">
                                        <RotateCcw className="w-4 h-4 mr-2" /> {t("spoilage.assessment.try_another")}
                                    </button>
                                    <button onClick={handleSave} disabled={saved} className="btn-primary flex-1 justify-center py-3">
                                        {saved ? <><Leaf className="w-4 h-4 mr-2" />{t("spoilage.assessment.saved")}</> : <><Save className="w-4 h-4 mr-2" />{t("spoilage.assessment.save_check")}</>}
                                    </button>
                                </div>
                            </div>

                            {/* Circular Economy Suggestions */}
                            {result.risk_level !== "Low" && (
                                <div className="card border-amber-100 bg-amber-50/50">
                                    <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                                        {t("spoilage.circular_solutions.title")}
                                    </h3>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
                                            <p className="font-bold text-sm text-gray-900 mb-1">{t("spoilage.circular_solutions.process.title")}</p>
                                            <p className="text-xs text-gray-500">{t("spoilage.circular_solutions.process.note")}</p>
                                        </div>
                                        <div className="p-4 bg-white rounded-xl border border-amber-100 shadow-sm">
                                            <p className="font-bold text-sm text-gray-900 mb-1">{t("spoilage.circular_solutions.local.title")}</p>
                                            <p className="text-xs text-gray-500">{t("spoilage.circular_solutions.local.note")}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* History Feed */}
                    {history.length > 0 && (
                        <section className="animate-fade-in-up delay-300">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <History className="w-5 h-5 text-gray-400" /> {t("spoilage.history.title")}
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {history.map((h, i) => (
                                    <div key={h.id} className="card p-4 hover:shadow-md transition-all group" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="font-bold text-gray-900">{h.vegetable_type}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{formatDate(h.created_at)}</span>
                                        </div>
                                        <div className="flex items-end justify-between">
                                            <div>
                                                <p className="text-2xl font-black text-gray-900 leading-none">{h.days_remaining}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{t("spoilage.history.days_left")}</p>
                                            </div>
                                            <span className={`badge ${h.risk_level === 'Low' ? 'badge-green' : h.risk_level === 'Medium' ? 'badge-amber' : 'badge-red'}`}>
                                                {t("common.risk_level_label", { risk: t(`common.${(h.risk_level || 'low').toLowerCase()}`) })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </main>
            </div>
        </div>
    );
}
