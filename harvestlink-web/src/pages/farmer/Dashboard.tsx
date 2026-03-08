import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, Bell, Bug, ShoppingBag, TrendingUp, ChevronRight, Plus, RefreshCw } from "lucide-react";
import { Sidebar } from "../../components/layout/Sidebar";
import { MLStatusBanner } from "../../components/shared/MLStatusBanner";
import { SkeletonCard } from "../../components/shared/LoadingSpinner";
import { useML } from "../../hooks/useML";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../services/api";
import { formatCurrency, formatDate } from "../../lib/utils";
import type { CropListing, PriceAlert } from "../../types";
import { useTranslation } from "react-i18next";
import {
    MetricCard,
    TrendLineChart,
    YieldComparisonChart,
    CostBenefitChart,
    ActivityHeatmap
} from "../../components/analytics/AnalyticsComponents";
import { DataTable } from "../../components/analytics/DataTable";
import { WeatherWidget } from "../../components/WeatherWidget";
import { CropComparisonTool } from "../../components/features/CropComparisonTool";
import { ROICalculator } from "../../components/features/ROICalculator";
import { CropCalendar } from "../../components/features/CropCalendar";
import { GovernmentSchemes } from "../../components/features/GovernmentSchemes";
import { VideoTutorials } from "../../components/features/VideoTutorials";
import { CommunityForum } from "../../components/features/CommunityForum";
import { FarmerRatingSystem } from "../../components/features/FarmerRatingSystem";
import { SoilHealthDashboard } from "../../components/features/SoilHealthDashboard";
import { IrrigationController } from "../../components/features/IrrigationController";
import { SmartNotifications } from "../../components/features/SmartNotifications";
import { MarketPriceHistory } from "../../components/features/MarketPriceHistory";
import { DocumentManagement } from "../../components/features/DocumentManagement";
import { PestDetection } from "../../components/features/PestDetection";

interface Recommendation {
    id: string;
    recommended_crop: string;
    confidence_score: number;
    season: string;
    created_at: string;
}

export default function FarmerDashboard() {
    const { farmer, profile } = useAuth();
    const { t } = useTranslation();
    const { isMLOnline } = useML();
    const [recs, setRecs] = useState<Recommendation[]>([]);
    const [listings, setListings] = useState<CropListing[]>([]);
    const [alerts, setAlerts] = useState<PriceAlert[]>([]);
    const [analytics, setAnalytics] = useState<any>({
        revenue: null,
        yields: null,
        costs: null
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [trendsPeriod, setTrendsPeriod] = useState("daily");

    const QUICK_ACTIONS = [
        { to: "/farmer/recommend", icon: Sprout, label: t("dashboard.quick_actions.recommend"), sub: t("dashboard.quick_actions.recommend_sub"), color: "from-green-500 to-emerald-600", emoji: "🌾" },
        { to: "/farmer/alerts", icon: Bell, label: t("dashboard.quick_actions.alerts"), sub: t("dashboard.quick_actions.alerts_sub"), color: "from-amber-500 to-orange-500", emoji: "⚠️" },
        { to: "/farmer/spoilage", icon: Bug, label: t("dashboard.quick_actions.spoilage"), sub: t("dashboard.quick_actions.spoilage_sub"), color: "from-red-500 to-rose-600", emoji: "🥬" },
        { to: "/marketplace", icon: ShoppingBag, label: t("dashboard.quick_actions.marketplace"), sub: t("dashboard.quick_actions.marketplace_sub"), color: "from-blue-500 to-indigo-600", emoji: "🛒" },
    ];

    const fetchData = async () => {
        if (!farmer?.id) { setLoading(false); return; }
        try {
            const [r, c, a, rev, yld, cst] = await Promise.all([
                apiFetch(`/recommendations?farmer_id=${farmer.id}`),
                apiFetch("/market/listings"),
                apiFetch("/market/alerts"),
                apiFetch(`/analytics/farmer/revenue-trends?farmer_id=${farmer.id}&period=${trendsPeriod}`),
                apiFetch(`/analytics/farmer/yield-analysis?farmer_id=${farmer.id}`),
                apiFetch(`/analytics/farmer/cost-benefit?farmer_id=${farmer.id}`),
            ]);
            setRecs((r || []) as Recommendation[]);
            setListings((c || []).filter((l: any) => l.farmer_id === farmer.id) as CropListing[]);
            setAlerts((a || []) as PriceAlert[]);
            setAnalytics({
                revenue: rev,
                yields: yld,
                costs: cst
            });
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => { fetchData(); }, [farmer?.id, trendsPeriod]);

    const handleRefresh = () => { setRefreshing(true); fetchData(); };

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return t("dashboard.greeting.morning");
        if (h < 17) return t("dashboard.greeting.afternoon");
        return t("dashboard.greeting.evening");
    };

    const STAT_DATA = [
        { label: t("dashboard.stats.recommendations"), value: recs.length, icon: "🌾", color: "green", link: "/farmer/recommend" },
        { label: t("dashboard.stats.active_listings"), value: listings.filter(l => l.status === "available").length, icon: "📦", color: "blue", link: "/farmer/crops" },
        { label: t("dashboard.stats.price_alerts"), value: alerts.filter(a => a.crash_alert).length, icon: "⚠️", color: "amber", link: "/farmer/alerts" },
        { label: t("dashboard.stats.land_area"), value: farmer?.land_area || 0, icon: "🏞️", color: "purple", link: "/profile" },
    ];

    const yieldColumns = [
        { header: 'Crop Name', accessor: 'crop_name' },
        { header: 'Predicted (kg)', accessor: 'predicted_yield' },
        { header: 'Actual Sold (kg)', accessor: 'actual_yield' },
        {
            header: 'Accuracy',
            accessor: 'accuracy_percentage',
            render: (val: number) => (
                <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${val > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${val}%` }} />
                    </div>
                    <span className="font-bold">{val}%</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'efficiency',
            render: (val: string) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${val === 'EXCELLENT' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                    {val}
                </span>
            )
        }
    ];

    return (
        <div className="flex min-h-screen bg-green-50/50">
            <Sidebar role="farmer" />

            <div className="flex-1 flex flex-col min-w-0">
                <MLStatusBanner isOnline={isMLOnline} />

                <main className="flex-1 p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="animate-fade-in-up">
                            <p className="text-green-600 text-sm font-semibold mb-1">
                                {greeting()}, {profile?.full_name?.split(" ")[0] || t("common.farmer")} 👋
                            </p>
                            <h1 className="text-3xl font-black text-gray-900">{t("dashboard.title")}</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {farmer?.village && `${farmer.village}, `}{farmer?.district || "Tamil Nadu"} · {farmer?.soil_type || "—"} {t("dashboard.soil")}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <SmartNotifications />
                            <button onClick={handleRefresh} disabled={refreshing} className="btn-ghost text-sm flex items-center gap-1.5 border border-green-100 bg-white shadow-xs">
                                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />{t("common.refresh")}
                            </button>
                            <Link to="/farmer/crops" className="btn-primary text-sm flex items-center gap-1.5 shadow-md">
                                <Plus className="w-4 h-4" />{t("dashboard.add_listing")}
                            </Link>
                        </div>
                    </div>

                    {/* Phase 1 Bonus: Weather Widget */}
                    {!loading && (
                        <div className="grid grid-cols-1 gap-6">
                            <WeatherWidget district={farmer?.district || "Salem"} />
                        </div>
                    )}

                    {/* Stat Cards */}
                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} lines={2} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {STAT_DATA.map(({ label, value, icon, color, link }, i) => (
                                <Link key={label} to={link} className={`stat-card ${color} block animate-fade-in-up shadow-sm hover:shadow-md transition-all`} style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                                    <div className="flex items-start justify-between mb-2">
                                        <span className="text-2xl">{icon}</span>
                                        <ChevronRight className="w-4 h-4 text-gray-300" />
                                    </div>
                                    <p className="text-3xl font-black text-gray-900">{value}</p>
                                    <p className="text-xs font-medium text-gray-500 mt-1 leading-tight">{label}</p>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Advanced Analytics Section */}
                    {!loading && analytics.revenue && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" /> Business Intelligence
                                </h2>
                                <div className="flex bg-white rounded-xl p-1 shadow-xs border border-emerald-100 text-[10px] font-bold">
                                    {['daily', 'weekly', 'monthly'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setTrendsPeriod(t)}
                                            className={`px-4 py-1.5 rounded-lg transition-all ${trendsPeriod === t ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-emerald-600'}`}
                                        >
                                            {t.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <MetricCard
                                    title="Total Revenue"
                                    value={formatCurrency(analytics.revenue.summary.total_revenue)}
                                    trend={{ value: analytics.revenue.summary.trend_percentage, isPositive: true }}
                                    icon={<TrendingUp className="w-5 h-5" />}
                                />
                                <MetricCard
                                    title="Net Profit"
                                    value={formatCurrency(analytics.costs?.total_profit || 0)}
                                    subtitle="Est. earnings after costs"
                                    trend={{ value: 8.2, isPositive: true }}
                                />
                                <MetricCard
                                    title="Overall Accuracy"
                                    value={`${Math.round(analytics.yields?.overall_accuracy || 0)}%`}
                                    subtitle="Actual vs Predicted"
                                    trend={{ value: 2.4, isPositive: (analytics.yields?.overall_accuracy || 0) > 90 }}
                                />
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <TrendLineChart
                                        data={analytics.revenue.data}
                                        xKey="date"
                                        yKey="revenue"
                                        title={`Revenue Trends (${trendsPeriod.charAt(0).toUpperCase() + trendsPeriod.slice(1)})`}
                                        color="#10b981"
                                    />
                                    <DataTable
                                        title="Detailed Yield Performance"
                                        data={analytics.yields?.crops || []}
                                        columns={yieldColumns}
                                    />
                                </div>
                                <div className="lg:col-span-1 space-y-6">
                                    <YieldComparisonChart
                                        data={analytics.yields?.crops || []}
                                        title="Predicted vs Sold (Visual)"
                                    />
                                    <CostBenefitChart
                                        data={analytics.costs?.crops || []}
                                        title="Profit Margins by Crop"
                                    />
                                    <ActivityHeatmap data={[]} title="Daily Farm Activity" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" /> {t("dashboard.quick_actions_header")}
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {QUICK_ACTIONS.map(({ to, label, sub, color, emoji }, i) => (
                                <Link
                                    key={to}
                                    to={to}
                                    className={`group relative overflow-hidden rounded-2xl p-5 bg-linear-to-br ${color} text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 animate-fade-in-up`}
                                    style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
                                >
                                    <div className="absolute top-3 right-3 text-3xl opacity-20 group-hover:opacity-30 transition-opacity">{emoji}</div>
                                    <p className="font-bold text-sm mb-1 leading-tight">{label}</p>
                                    <p className="text-white/70 text-xs">{sub}</p>
                                    <div className="mt-3 flex items-center gap-1 text-xs text-white/80 font-medium">
                                        {t("common.go")} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Phase 1 Bonus: Agricultural Planning Suite */}
                    {!loading && (
                        <div className="space-y-6 animate-fade-in pb-12">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <span className="text-emerald-600">🛠️</span> {t("dashboard.agricultural_planning_suite")}
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <CropCalendar />
                                <div className="space-y-6">
                                    <ROICalculator />
                                    <CropComparisonTool />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phase 3 Bonus: Smart Farming Dashboards */}
                    {!loading && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <span className="text-blue-600">📡</span> {t("dashboard.smart_farming_intelligence")}
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                <MarketPriceHistory />
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <SoilHealthDashboard />
                                    <IrrigationController />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phase 2 Bonus: Community & Information */}
                    {!loading && (
                        <div className="space-y-6 animate-fade-in pb-12">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <span className="text-emerald-600">🤝</span> {t("dashboard.community_knowledge_hub")}
                            </h2>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <CommunityForum />
                                    <VideoTutorials />
                                </div>
                                <div className="lg:col-span-1 space-y-6">
                                    <FarmerRatingSystem />
                                    <GovernmentSchemes />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Phase 4 Bonus: Management & AI */}
                    {!loading && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                                <span className="text-rose-600">🤖</span> {t("dashboard.ai_tools_document_vault")}
                            </h2>
                            <div className="grid grid-cols-1 gap-6">
                                <PestDetection />
                                <DocumentManagement />
                            </div>
                        </div>
                    )}

                    {/* Two-column: Recommendations + Alerts */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Recent Recommendations */}
                        <div className="card shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Sprout className="w-5 h-5 text-green-600" />{t("dashboard.recent_recommendations")}
                                </h2>
                                <Link to="/farmer/recommend" className="text-green-600 text-xs font-semibold hover:text-green-800 flex items-center gap-0.5">
                                    {t("common.new")} <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            {loading ? (
                                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
                            ) : recs.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="text-4xl mb-3">🤖</div>
                                    <p className="text-gray-400 text-sm">{t("dashboard.no_recommendations")}</p>
                                    <Link to="/farmer/recommend" className="btn-primary text-xs mt-3 inline-flex">{t("dashboard.get_first_recommendation")}</Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {recs.map((r, i) => (
                                        <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition-colors group" style={{ animationDelay: `${i * 0.05}s` }}>
                                            <div className="w-10 h-10 gradient-card rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                                {r.recommended_crop[0]}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-gray-900 text-sm truncate">{r.recommended_crop}</p>
                                                <p className="text-gray-400 text-xs">{r.season} · {formatDate(r.created_at)}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                                                    <div className="h-full bg-green-500" style={{ width: `${Math.round((r.confidence_score || 0) * 100)}%` }} />
                                                </div>
                                                <p className="text-[10px] text-gray-400 mt-1 font-bold">{Math.round((r.confidence_score || 0) * 100)}%</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Price Alerts */}
                        <div className="card shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-amber-500" />{t("dashboard.price_alerts_header")}
                                </h2>
                                <Link to="/farmer/alerts" className="text-green-600 text-xs font-semibold hover:text-green-800 flex items-center gap-0.5">
                                    {t("common.check")} <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                            {loading ? (
                                <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
                            ) : alerts.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="text-4xl mb-3">🔔</div>
                                    <p className="text-gray-400 text-sm">{t("dashboard.no_alerts")}</p>
                                    <Link to="/farmer/alerts" className="btn-primary text-xs mt-3 inline-flex">{t("dashboard.check_prices")}</Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {alerts.map(a => (
                                        <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${a.crash_alert ? "border-red-100 bg-red-50/40" : "border-green-100 bg-green-50/40"}`}>
                                            <span className="text-xl mt-0.5">{a.crash_alert ? "🔴" : "🟢"}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <p className="font-bold text-sm text-gray-900 truncate">{a.vegetable_name}</p>
                                                    {a.severity && (
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${a.severity === "Severe" ? "bg-red-100 text-red-600" : a.severity === "Mild" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"}`}>{a.severity}</span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 truncate">{a.recommended_action || t("dashboard.no_action_needed")}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <p className="text-xs font-bold text-gray-700">{formatCurrency(a.current_price || 0)}</p>
                                                <p className="text-xs text-gray-400">{t("common.now")}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* My Listings */}
                    <div className="card shadow-sm">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-blue-500" />{t("dashboard.my_listings")}
                            </h2>
                            <Link to="/farmer/crops" className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 shadow-sm">
                                <Plus className="w-3.5 h-3.5" />{t("dashboard.add_listing")}
                            </Link>
                        </div>
                        {loading ? (
                            <div className="grid md:grid-cols-3 gap-4">{[1, 2, 3].map(i => <SkeletonCard key={i} lines={3} />)}</div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-12 bg-green-50/50 rounded-2xl border-2 border-dashed border-green-100">
                                <div className="text-4xl mb-3">📦</div>
                                <p className="text-gray-500 font-medium mb-3">{t("dashboard.no_listings")}</p>
                                <Link to="/farmer/crops" className="btn-primary text-sm inline-flex items-center gap-2">
                                    <Plus className="w-4 h-4" />{t("dashboard.list_first_crop")}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-3 gap-4">
                                {listings.map(l => (
                                    <div key={l.id} className="p-4 rounded-xl border border-green-100 hover:border-green-300 hover:shadow-md transition-all bg-white">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-gray-900">{l.crop_name}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${l.status === "available" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>{l.status}</span>
                                        </div>
                                        <p className="text-2xl font-black text-green-700">{formatCurrency(l.asking_price_rs || 0)}<span className="text-sm font-normal text-gray-400">/kg</span></p>
                                        <p className="text-xs text-gray-400 mt-1">{l.quantity_kg} kg · {l.district} · {formatDate(l.created_at)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div >
        </div >
    );
}

