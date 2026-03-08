import { useEffect, useState } from "react";
import {
    Activity,
    Users,
    ShieldAlert,
    RefreshCw,
    Globe,
    Zap,
    HeartPulse
} from "lucide-react";
import { Sidebar } from "../../components/layout/Sidebar";
import { apiFetch } from "../../services/api";
import {
    MetricCard,
    TrendLineChart,
    ComparisonBarChart,
    ProgressCircle,
    ActivityHeatmap
} from "../../components/analytics/AnalyticsComponents";
import { HealthIndicator } from "../../components/analytics/HealthIndicator";

export default function PilotDashboard() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analytics, setAnalytics] = useState<any>({
        health: null,
        growth: null,
        engagement: null
    });

    const fetchData = async () => {
        try {
            const [health, growth, engagement] = await Promise.all([
                apiFetch('/analytics/admin/system-health'),
                apiFetch('/analytics/admin/user-growth'),
                apiFetch('/analytics/admin/engagement'),
            ]);
            setAnalytics({ health, growth, engagement });
        } catch (err) {
            console.error("Error fetching admin analytics:", err);
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleRefresh = () => { setRefreshing(true); fetchData(); };

    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar role="admin" />

            <div className="flex-1 flex flex-col min-w-0 text-slate-300">
                <main className="flex-1 p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="animate-fade-in">
                            <h1 className="text-3xl font-black text-white flex items-center gap-3">
                                <Activity className="w-8 h-8 text-emerald-500" /> Command Center
                            </h1>
                            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">
                                Real-time Pilot Program Intelligence
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleRefresh} disabled={refreshing} className="bg-slate-900 text-slate-400 hover:text-white px-4 py-2 rounded-xl border border-slate-800 transition-all flex items-center gap-2 text-sm font-bold shadow-lg">
                                <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} /> Sync Data
                            </button>
                            <div className="h-10 w-px bg-slate-800 mx-2" />
                            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">Live Monitor</span>
                            </div>
                        </div>
                    </div>

                    {/* Loading skeleton */}
                    {loading && (
                        <div className="space-y-4 animate-pulse">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-20 bg-slate-800/60 rounded-2xl" />
                                ))}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-28 bg-slate-800/60 rounded-2xl" />
                                ))}
                            </div>
                            <div className="h-64 bg-slate-800/60 rounded-2xl" />
                        </div>
                    )}

                    {!loading && analytics.health && (
                        <div className="space-y-6 animate-fade-in">
                            {/* System Status Indicators */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <HealthIndicator
                                    label="Database Core"
                                    status={analytics.health.components.database === 'HEALTHY' ? 'HEALTHY' : 'WARNING'}
                                    details="SQLite WAL enabled | 30ms timeout"
                                    isDark
                                />
                                <HealthIndicator
                                    label="API Gateway"
                                    status="HEALTHY"
                                    details="Global edge optimization active"
                                    isDark
                                />
                                <HealthIndicator
                                    label="ML Services"
                                    status="HEALTHY"
                                    details="Inference latency: 142ms"
                                    isDark
                                />
                                <HealthIndicator
                                    label="Frontend"
                                    status="HEALTHY"
                                    details="Vite HMR running | 0% drop"
                                    isDark
                                />
                            </div>

                            {/* KPI Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <MetricCard
                                    title="Active Users"
                                    value={analytics.engagement.daily_active_users}
                                    trend={{ value: 14.2, isPositive: true }}
                                    icon={<Users className="w-5 h-5" />}
                                    isDark
                                />
                                <MetricCard
                                    title="Uptime"
                                    value={`${analytics.health.uptime_percentage}%`}
                                    subtitle="Last 30 days"
                                    trend={{ value: 0.1, isPositive: true }}
                                    icon={<ShieldAlert className="w-5 h-5" />}
                                    isDark
                                />
                                <MetricCard
                                    title="Avg Session"
                                    value={`${analytics.engagement.average_session_duration}m`}
                                    subtitle="Engagement depth"
                                    icon={<Zap className="w-5 h-5" />}
                                    isDark
                                />
                                <MetricCard
                                    title="Error Rate"
                                    value={`${analytics.health.error_rate}%`}
                                    subtitle="System stability"
                                    trend={{ value: 0.4, isPositive: analytics.health.error_rate < 1 }}
                                    icon={<ShieldAlert className="w-5 h-5" />}
                                    isDark
                                />
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <TrendLineChart
                                        data={analytics.growth?.growth_trends || []}
                                        xKey="date"
                                        yKey="total_users"
                                        title="System-wide User Growth"
                                        color="#10b981"
                                        isDark
                                    />
                                    <div className="bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
                                        <h4 className="text-white text-sm font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                                            <HeartPulse className="w-4 h-4 text-emerald-500" /> Platform Adoption
                                        </h4>
                                        <div className="grid md:grid-cols-3 gap-8">
                                            {analytics.engagement.feature_usage.map((f: any, i: number) => (
                                                <div key={i} className="text-center w-full">
                                                    <div className="flex items-center justify-center mb-4">
                                                        <ProgressCircle value={f.adoption_rate} size={100} strokeWidth={8} label="Adoption" isDark />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{f.feature.replace('_', ' ')}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="lg:col-span-1 space-y-6">
                                    <ComparisonBarChart
                                        data={analytics.growth?.growth_trends.slice(-7) || []}
                                        xKey="date"
                                        yKey1="farmers"
                                        yKey2="shop_owners"
                                        title="Role Distribution (Daily)"
                                        isDark
                                    />
                                    <div className="bg-linear-to-br from-indigo-900 to-slate-900 p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
                                            <Globe className="w-32 h-32 text-white" />
                                        </div>
                                        <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-6">Operational Status</h4>
                                        <div className="space-y-5 relative z-10">
                                            {[
                                                { label: "Server Load", value: "24%", status: "OPTIMAL" },
                                                { label: "Storage", value: "68 / 250 GB", status: "NORMAL" },
                                                { label: "Network Latency", value: "32ms", status: "LOW" }
                                            ].map((stat, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between items-end mb-1.5">
                                                        <p className="text-xs font-bold text-slate-400">{stat.label}</p>
                                                        <p className="text-[10px] font-black text-indigo-400">{stat.status}</p>
                                                    </div>
                                                    <div className="text-xl font-black text-white">{stat.value}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <ActivityHeatmap data={[]} title="System Interaction Pulse" isDark />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
