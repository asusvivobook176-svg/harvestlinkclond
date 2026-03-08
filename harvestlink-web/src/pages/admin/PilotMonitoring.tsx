import { useEffect, useState } from "react";
import { Sidebar } from "../../components/layout/Sidebar";
import { pilotService } from "../../services/pilot";
import type { PilotStats } from "../../services/pilot";
import {
    Users,
    CheckCircle2,
    TrendingUp,
    MapPin,
    Filter,
    Activity,
    MessageSquare,
    Zap,
    Star
} from "lucide-react";
import {
    MetricCard,
    ProgressCircle,
} from "../../components/analytics/AnalyticsComponents";

export default function AdminMonitoring() {
    const [stats, setStats] = useState<PilotStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await pilotService.getStats();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch pilot stats:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) {
        return (
            <div className="flex min-h-screen bg-slate-950 items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-950">
            <Sidebar role="admin" />

            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-black text-white flex items-center gap-3">
                            <Activity className="w-10 h-10 text-emerald-500" /> Admin Monitoring
                        </h1>
                        <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">
                            Real-time Admin Program Performance Tracker
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold border border-slate-800 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Filter Cohorts
                        </button>
                        <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-900/20">
                            Export PDF Report
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total Farmers"
                        value={stats.total_farmers.toString()}
                        trend={{ value: 12, isPositive: true }}
                        icon={<Users className="w-5 h-5" />}
                        isDark
                    />
                    <MetricCard
                        title="Trained Profile"
                        value={stats.trained_farmers.toString()}
                        subtitle={`${Math.round((stats.trained_farmers / stats.total_farmers) * 100)}% Completion`}
                        icon={<CheckCircle2 className="w-5 h-5" />}
                        isDark
                    />
                    <MetricCard
                        title="Avg Adoption"
                        value={`${stats.adoption_rate.toFixed(1)}%`}
                        trend={{ value: 5.4, isPositive: true }}
                        icon={<TrendingUp className="w-5 h-5" />}
                        isDark
                    />
                    <MetricCard
                        title="ML Accuracy"
                        value={`${stats.prediction_accuracy.toFixed(1)}%`}
                        subtitle="User Validated"
                        icon={<Zap className="w-5 h-5" />}
                        isDark
                    />
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Feature Adoption */}
                    <div className="lg:col-span-2 bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-black text-white">Feature Adoption PULSE</h3>
                            <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20">LIVE DATA</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {Object.entries(stats.feature_usage).map(([feature, count]) => (
                                <div key={feature} className="text-center group">
                                    <div className="mb-4 flex justify-center">
                                        <ProgressCircle
                                            value={Math.min(100, (count / stats.total_farmers) * 100)}
                                            size={120}
                                            strokeWidth={10}
                                            label={`${count} USERS`}
                                            isDark
                                        />
                                    </div>
                                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Geographical Distribution */}
                    <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8 space-y-6">
                        <h3 className="text-xl font-black text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-emerald-500" /> Locations
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(stats.locations).map(([loc, count], i) => (
                                <div key={loc} className="relative">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-slate-200">{loc}</span>
                                        <span className="text-sm font-black text-emerald-500">{count} Farmers</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full bg-linear-to-r ${i % 2 === 0 ? "from-emerald-500 to-teal-400" : "from-indigo-500 to-purple-400"}`}
                                            style={{ width: `${(count / stats.total_farmers) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Feedback Preview */}
                    <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-white flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-indigo-400" /> Recent Feedback
                            </h3>
                            <button className="text-indigo-400 text-xs font-black uppercase tracking-widest hover:text-indigo-300">View All</button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all cursor-default">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(s => <Star key={s} className={`w-3 h-3 ${s <= 4 ? "text-amber-400 fill-amber-400" : "text-white/10"}`} />)}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500">2 HOURS AGO</span>
                                    </div>
                                    <p className="text-slate-300 text-sm italic">"The price crash alerts saved me from selling my tomatoes too early. Very accurate prediction!"</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-slate-900/50 rounded-3xl border border-slate-800 p-8">
                        <h3 className="text-xl font-black text-white flex items-center gap-2 mb-8">
                            <Zap className="w-5 h-5 text-amber-400" /> Interaction Pulse
                        </h3>
                        <div className="h-[200px] flex items-center justify-center border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 font-bold text-sm">
                            Real-time Activity Heatmap Visualization
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
