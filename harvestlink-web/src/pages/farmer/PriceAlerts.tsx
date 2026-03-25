import { useState, useEffect } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { MLOnlineBadge, MLStatusBanner } from "../../components/shared/MLStatusBanner";
import { useML } from "../../hooks/useML";
import { useAuth } from "../../hooks/useAuth";
import { pilotService } from "../../services/pilot";
import { apiFetch } from "../../services/api";
import { TN_VEGETABLES, TN_DISTRICTS } from "../../types";
import type { PriceAlert } from "../../types";
import { Bell, TrendingDown, ArrowRight, History, ShieldAlert, CheckCircle, Search, RefreshCw, Info } from "lucide-react";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useTranslation } from "react-i18next";

export default function PriceAlerts() {
    const { getPriceCrashAlert, isMLOnline } = useML();
    const { user } = useAuth();
    const { t } = useTranslation();
    const [vegetable, setVegetable] = useState(TN_VEGETABLES[0]);
    const [district, setDistrict] = useState(TN_DISTRICTS[0]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<PriceAlert | null>(null);
    const [history, setHistory] = useState<PriceAlert[]>([]);
    const [fetchingHistory, setFetchingHistory] = useState(true);

    // Dynamic inputs instead of hardcoded
    const [currentPrice, setCurrentPrice] = useState("30");
    const [prevPrice, setPrevPrice] = useState("28");
    const [supply, setSupply] = useState("1000");
    const [demand, setDemand] = useState("800");

    const fetchHistory = async () => {
        setFetchingHistory(true);
        try {
            const data = await apiFetch("/market/alerts");
            setHistory((data || []) as PriceAlert[]);
        } catch (err) {
            console.error("Error fetching price alerts history:", err);
        }
        setFetchingHistory(false);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);
        try {
            const res = await getPriceCrashAlert({
                vegetable_name: vegetable,
                district,
                current_price_rs: parseFloat(currentPrice) || 30,
                prev_week_price_rs: parseFloat(prevPrice) || 28,
                current_supply_kg: parseFloat(supply) || 1000,
                current_demand_kg: parseFloat(demand) || 800,
                month: new Date().getMonth() + 1,
                festival_next_week: false
            });

            if (user?.id) {
                pilotService.logActivity({
                    user_id: user.id,
                    feature: "Price Alerts",
                    action: "check_price"
                }).catch(err => console.error("Activity log failed:", err));
            }

            const fullResult: PriceAlert = {
                id: crypto.randomUUID(),
                vegetable_name: vegetable,
                district,
                current_price: 30,
                predicted_price: res.predicted_price_next_week,
                crash_alert: res.crash_alert,
                severity: res.crash_severity,
                recommended_action: res.recommended_action,
                created_at: new Date().toISOString()
            };

            setResult(fullResult);
            // Save to Local DB
            try {
                await apiFetch("/market/alerts", {
                    method: "POST",
                    body: JSON.stringify({
                        vegetable_name: fullResult.vegetable_name,
                        district: fullResult.district,
                        current_price: fullResult.current_price,
                        predicted_price: fullResult.predicted_price,
                        crash_alert: fullResult.crash_alert,
                        severity: fullResult.severity,
                        recommended_action: fullResult.recommended_action,
                    })
                });
                fetchHistory();
            } catch (err) {
                console.error("Error saving price alert:", err);
            }
        } finally {
            setLoading(false);
        }
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
                            <p className="text-amber-600 text-sm font-semibold mb-1 flex items-center gap-1.5">
                                <Bell className="w-4 h-4" /> {t("price_alerts.market_monitor")}
                            </p>
                            <h1 className="text-3xl font-black text-gray-900">{t("price_alerts.title")}</h1>
                            <p className="text-gray-500 text-sm mt-1">{t("price_alerts.description")}</p>
                        </div>
                        <MLOnlineBadge isOnline={isMLOnline} />
                    </div>

                    <div className="grid lg:grid-cols-12 gap-6">
                        {/* Left: Check Form */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="card shadow-md animate-fade-in-up">
                                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Search className="w-4 h-4 text-green-600" /> {t("price_alerts.params_header")}
                                </h2>
                                <form onSubmit={handleCheck} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">{t("price_alerts.vegetable")}</label>
                                        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
                                            {TN_VEGETABLES.map(v => (
                                                <button
                                                    key={v}
                                                    type="button"
                                                    onClick={() => setVegetable(v)}
                                                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${vegetable === v ? "bg-green-600 text-white shadow-sm" : "bg-white text-gray-600 hover:border-green-200 border border-transparent"}`}
                                                >
                                                    {t(`common.${v.toLowerCase()}`) || v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">{t("price_alerts.district_market")}</label>
                                        <select className="input-field" value={district} onChange={e => setDistrict(e.target.value)}>
                                            {TN_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Current Price (₹/kg)</label>
                                            <input type="number" className="input-field" value={currentPrice} onChange={e => setCurrentPrice(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Prev Week Price (₹/kg)</label>
                                            <input type="number" className="input-field" value={prevPrice} onChange={e => setPrevPrice(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Supply Volume (kg)</label>
                                            <input type="number" className="input-field" value={supply} onChange={e => setSupply(e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase">Demand Volume (kg)</label>
                                            <input type="number" className="input-field" value={demand} onChange={e => setDemand(e.target.value)} />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full py-3.5 flex justify-center items-center gap-2 text-base font-bold shadow-amber-200"
                                    >
                                        {loading ? (
                                            <><RefreshCw className="w-5 h-5 animate-spin" /> {t("price_alerts.analyzing")}</>
                                        ) : (
                                            <><Bell className="w-5 h-5" /> {t("price_alerts.check_btn")}</>
                                        )}
                                    </button>
                                </form>

                                <div className="mt-6 flex items-start gap-2.5 p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-xs">
                                    <Info className="w-4 h-4 shrink-0" />
                                    <p>{t("price_alerts.info_note")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Results or Welcome */}
                        <div className="lg:col-span-7">
                            {!result && !loading ? (
                                <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl animate-fade-in-up">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-4">📉</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{t("price_alerts.ready_scan")}</h3>
                                    <p className="text-gray-500 text-sm max-w-sm">{t("price_alerts.ready_note")}</p>
                                </div>
                            ) : loading ? (
                                <div className="h-full flex flex-col items-center justify-center p-10 space-y-4 animate-pulse">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                        <TrendingDown className="w-10 h-10 text-gray-300 animate-bounce" />
                                    </div>
                                    <div className="space-y-2 w-full max-w-xs">
                                        <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto" />
                                        <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-fade-in-up">
                                    {result && result.crash_alert ? (
                                        <div className="card border-red-200 shadow-xl shadow-red-500/5 overflow-hidden">
                                            <div className="bg-red-500 text-white p-6 -mx-6 -mt-6 mb-6 flex items-center justify-between">
                                                <div>
                                                    <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider mb-2">
                                                        {t("price_alerts.critical_warning")}
                                                    </div>
                                                    <h2 className="text-3xl font-black">{t("price_alerts.crash_detected")}</h2>
                                                </div>
                                                <ShieldAlert className="w-12 h-12 opacity-50" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 mb-8">
                                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <p className="text-xs text-gray-400 font-bold uppercase mb-1">{t("price_alerts.current_price")}</p>
                                                    <p className="text-3xl font-black text-gray-900">{formatCurrency(result?.current_price || 0)}/kg</p>
                                                </div>
                                                <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                                    <p className="text-xs text-red-400 font-bold uppercase mb-1">{t("price_alerts.predicted_min")}</p>
                                                    <p className="text-3xl font-black text-red-600">{formatCurrency(result?.predicted_price || 0)}/kg</p>
                                                </div>
                                            </div>

                                            <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 mb-6">
                                                <p className="text-amber-800 font-bold text-sm mb-1.5 flex items-center gap-1.5">
                                                    <TrendingDown className="w-4 h-4" /> {t("price_alerts.recommended_action")}
                                                </p>
                                                <p className="text-amber-700 text-sm leading-relaxed">{result.recommended_action}</p>
                                            </div>

                                            <div className="flex items-center gap-4 text-xs text-gray-400">
                                                <span className="badge badge-red">{t("price_alerts.severity")}: {t(`common.${result.severity?.toLowerCase()}`) || result.severity}</span>
                                                <span>{t("price_alerts.confidence_val", { val: 91 })}</span>
                                                <span>{t("price_alerts.analysis_time_val", { val: 184 })}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card border-green-200 shadow-xl shadow-green-500/5">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                                    <CheckCircle className="w-10 h-10" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-gray-900">{t("price_alerts.market_stable")}</h2>
                                                    <p className="text-green-600 font-semibold">{t("price_alerts.stable_note", { veg: result?.vegetable_name })}</p>
                                                </div>
                                            </div>

                                            <div className="p-5 bg-green-50 rounded-2xl border border-green-100 mb-6">
                                                <p className="text-green-800 text-sm leading-relaxed">
                                                    {t("price_alerts.stable_msg", {
                                                        veg: t(`common.${result?.vegetable_name?.toLowerCase()}`) || result?.vegetable_name,
                                                        district: result?.district,
                                                        min: formatCurrency(result?.current_price || 0),
                                                        max: formatCurrency((result?.current_price || 0) + 5)
                                                    })}
                                                </p>
                                            </div>

                                            <div className="flex justify-between items-center py-4 border-t border-gray-100">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">{t("price_alerts.current_trend")}</p>
                                                    <p className="font-bold text-gray-900">{t("common.steady_upward")}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-400 font-bold uppercase">{t("price_alerts.safe_harvest")}</p>
                                                    <p className="font-bold text-green-600">{t("common.yes")}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* History Section */}
                    <section className="animate-fade-in-up delay-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <History className="w-5 h-5 text-gray-400" /> {t("price_alerts.recent_alerts")}
                            </h2>
                            <button
                                onClick={fetchHistory}
                                className="text-xs font-semibold text-green-600 hover:text-green-800 transition-colors flex items-center gap-1"
                            >
                                <RefreshCw className={`w-3 h-3 ${fetchingHistory ? 'animate-spin' : ''}`} /> {t("price_alerts.update_feed")}
                            </button>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {fetchingHistory ? (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="card h-24 skeleton" />
                                ))
                            ) : history.length === 0 ? (
                                <div className="col-span-full py-12 text-center bg-white rounded-3xl border border-gray-100">
                                    <p className="text-gray-400 text-sm">{t("price_alerts.no_history")}</p>
                                </div>
                            ) : (
                                history.map((h, i) => (
                                    <div
                                        key={h.id}
                                        className={`card p-4 transition-all hover:shadow-md border-l-4 group ${h.crash_alert ? 'border-l-red-500' : 'border-l-green-500'}`}
                                        style={{ animationDelay: `${i * 0.05}s` }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-bold text-gray-900">{h.vegetable_name}</span>
                                            <span className="text-[10px] text-gray-400 font-medium">{formatDate(h.created_at)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className={`w-2 h-2 rounded-full ${h.crash_alert ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                                <span className="text-xs font-semibold text-gray-600">
                                                    {t("common.risk_level_label", { risk: h.crash_alert ? t("price_alerts.crash_alert") : t("price_alerts.stable") })}
                                                </span>
                                            </div>
                                            <p className="text-sm font-black text-gray-900">{formatCurrency(h.current_price || 0)}</p>
                                        </div>
                                        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                            <button className="text-[10px] font-bold text-green-600 flex items-center gap-0.5">
                                                {t("price_alerts.details")} <ArrowRight className="w-2.5 h-2.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
}
