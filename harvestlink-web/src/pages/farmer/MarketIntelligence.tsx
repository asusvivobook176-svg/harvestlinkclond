import { useState, useEffect } from "react";
import { 
    TrendingUp, 
    ArrowUpRight, 
    ArrowDownRight, 
    MapPin, 
    Search,
    BarChart3,
    Info,
    Download
} from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../../components/layout/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";
import { 
    PriceComparisonChart, 
    TrendLineChart,
    MetricCard 
} from "../../components/analytics/AnalyticsComponents";
import { TN_DISTRICTS, TN_VEGETABLES } from "../../types";

export default function MarketIntelligence() {
    const { farmer } = useAuth();
    const [district, setDistrict] = useState(farmer?.district || "Salem");
    const [vegetable, setVegetable] = useState("Tomato");
    const [timeframe, setTimeframe] = useState("6m");
    const [loading, setLoading] = useState(true);

    // Mock data for charts
    const priceHistory = [
        { month: "Oct", actual: 22, avg: 25 },
        { month: "Nov", actual: 28, avg: 26 },
        { month: "Dec", actual: 45, avg: 30 },
        { month: "Jan", actual: 38, avg: 32 },
        { month: "Feb", actual: 32, avg: 30 },
        { month: "Mar", actual: 35, avg: 31 },
    ];

    const marketVolume = [
        { month: "Oct", volume: 1200, price: 24 },
        { month: "Nov", volume: 1500, price: 22 },
        { month: "Dec", volume: 800, price: 48 },
        { month: "Jan", volume: 950, price: 38 },
        { month: "Feb", volume: 1400, price: 30 },
        { month: "Mar", volume: 1600, price: 28 },
    ];

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [district, vegetable]);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="farmer" />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-1"
                        >
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-wider">
                                <BarChart3 className="w-4 h-4" />
                                <span>Market Intelligence</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Price Trends</h1>
                            <p className="text-slate-500 font-medium">Data-driven insights for better sell-timing decisions.</p>
                        </motion.div>

                        <div className="flex items-center gap-2">
                            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
                                <Download className="w-4 h-4" />
                                <span>Export PDF</span>
                            </button>
                        </div>
                    </div>

                    {/* Selectors */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-6">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">District</label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select 
                                    className="pl-10 pr-8 py-2.5 bg-slate-50 border-none rounded-xl text-slate-700 font-bold focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer text-sm"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                >
                                    {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Vegetable</label>
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select 
                                    className="pl-10 pr-8 py-2.5 bg-slate-50 border-none rounded-xl text-slate-700 font-bold focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer text-sm"
                                    value={vegetable}
                                    onChange={(e) => setVegetable(e.target.value)}
                                >
                                    {TN_VEGETABLES.map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Timeframe</label>
                            <div className="flex p-1 bg-slate-50 rounded-xl">
                                {["1m", "3m", "6m", "1y"].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setTimeframe(t)}
                                        className={cn(
                                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                                            timeframe === t ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                        )}
                                    >
                                        {t.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <MetricCard 
                            title="Current Price" 
                            value="₹35 /kg" 
                            trend={{ value: 12, isPositive: true }}
                            icon={<TrendingUp className="w-5 h-5" />}
                        />
                        <MetricCard 
                            title="District Avg" 
                            value="₹31 /kg" 
                            subtitle="Last 30 days"
                        />
                        <MetricCard 
                            title="Market Demand" 
                            value="High" 
                            subtitle="Based on search volume"
                            color="#3b82f6"
                        />
                        <MetricCard 
                            title="Price Stability" 
                            value="Medium" 
                            subtitle="Volatility Index"
                            color="#f59e0b"
                        />
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {loading ? (
                            <div className="h-[400px] bg-white animate-pulse rounded-3xl col-span-2" />
                        ) : (
                            <>
                                <PriceComparisonChart 
                                    data={priceHistory}
                                    xKey="month"
                                    yKey1="actual"
                                    yKey2="avg"
                                    title={`Price Volatility vs 5-Year Average - ${vegetable}`}
                                />
                                <TrendLineChart 
                                    data={marketVolume}
                                    xKey="month"
                                    yKey="volume"
                                    title="Monthly Market Arrival Volume (Quintals)"
                                    color="#3b82f6"
                                />
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 lg:col-span-2">
                                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                        <Info className="w-5 h-5 text-blue-500" /> Market Prediction Insight
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-8 items-center">
                                        <div className="space-y-4">
                                            <p className="text-slate-600 leading-relaxed">
                                                Based on historical data for <span className="font-bold text-slate-900">{vegetable}</span> in <span className="font-bold text-slate-900">{district}</span>, 
                                                prices are expected to <span className="font-bold text-emerald-600">rise by 15%</span> over the next 3 weeks due to lower arrival volumes from neighboring states.
                                            </p>
                                            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                                <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-1">Expert Advice</p>
                                                <p className="text-sm text-blue-700">Consider delaying harvest by 10 days if crop maturity allows, to capitalize on peak pricing window.</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                                            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Neighboring Markets</h4>
                                            <div className="space-y-3">
                                                {[
                                                    { name: "Coimbatore", price: 38, icon: ArrowUpRight, color: "text-emerald-500" },
                                                    { name: "Madurai", price: 34, icon: ArrowDownRight, color: "text-rose-500" },
                                                    { name: "Trichy", price: 36, icon: ArrowUpRight, color: "text-emerald-500" },
                                                ].map(m => (
                                                    <div key={m.name} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-xs">
                                                        <span className="font-bold text-slate-700">{m.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-black text-slate-900">₹{m.price}</span>
                                                            <m.icon className={cn("w-4 h-4", m.color)} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
