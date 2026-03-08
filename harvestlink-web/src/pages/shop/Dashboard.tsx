import { useEffect, useState } from "react";
import {
    ShoppingBag,
    TrendingUp,
    Plus,
    ChevronRight,
    RefreshCw,
    Truck,
    PackageCheck,
    AlertCircle
} from "lucide-react";
import { Sidebar } from "../../components/layout/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "../../services/api";
import { formatCurrency } from "../../lib/utils";
import {
    MetricCard,
    TrendLineChart,
    ComparisonBarChart,
    ProgressCircle,
    ActivityHeatmap
} from "../../components/analytics/AnalyticsComponents";
import { DataTable } from "../../components/analytics/DataTable";

export default function ShopDashboard() {
    const { shop, profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [analytics, setAnalytics] = useState<any>({
        fulfillment: null,
        suppliers: null,
        priceTrends: null
    });

    const fetchData = async () => {
        if (!shop?.id) { setLoading(false); return; }
        try {
            const [ful, sup, pri] = await Promise.all([
                apiFetch(`/analytics/shop/fulfillment?shop_id=${shop.id}`),
                apiFetch(`/analytics/shop/supplier-consistency?shop_id=${shop.id}`),
                apiFetch(`/analytics/shop/price-trends?shop_id=${shop.id}`),
            ]);
            setAnalytics({
                fulfillment: ful,
                suppliers: sup,
                priceTrends: pri
            });
        } catch (err) {
            console.error("Error fetching shop dashboard data:", err);
        }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => { fetchData(); }, [shop?.id]);

    const handleRefresh = () => { setRefreshing(true); fetchData(); };

    const supplierColumns = [
        { header: 'Supplier Name', accessor: 'supplier_name' },
        { header: 'Deliveries', accessor: 'delivery_count' },
        {
            header: 'Reliability',
            accessor: 'reliability_score',
            render: (val: number) => (
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${val > 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{val}%</span>
                </div>
            )
        },
        {
            header: 'Quality',
            accessor: 'quality_score',
            render: (val: number) => (
                <div className="flex items-center gap-1">
                    <span className="text-amber-400">★</span>
                    <span className="font-bold">{val}</span>
                </div>
            )
        },
        {
            header: 'Rating',
            accessor: 'overall_rating',
            render: (val: string) => (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold">
                    {val}
                </span>
            )
        }
    ];

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar role="shop" />

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <p className="text-blue-600 text-sm font-semibold mb-1">
                                Welcome back, {profile?.full_name?.split(" ")[0] || "Partner"} 👋
                            </p>
                            <h1 className="text-3xl font-black text-slate-900">{shop?.shop_name || "Shop Dashboard"}</h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Managing inventory and demand fulfillment
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleRefresh} disabled={refreshing} className="btn-ghost text-sm flex items-center gap-1.5 border border-slate-100 bg-white shadow-xs">
                                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
                            </button>
                            <button className="btn-primary text-sm flex items-center gap-1.5 shadow-md bg-blue-600 hover:bg-blue-700">
                                <Plus className="w-4 h-4" /> Post New Demand
                            </button>
                        </div>
                    </div>

                    {!loading && analytics.fulfillment && (
                        <div className="space-y-6 animate-fade-in">
                            {/* KPI Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <MetricCard
                                    title="Overall Fulfillment"
                                    value={`${Math.round(analytics.fulfillment.overall_fulfillment_rate)}%`}
                                    trend={{ value: 5.4, isPositive: true }}
                                    icon={<PackageCheck className="w-5 h-5" />}
                                />
                                <MetricCard
                                    title="Active Shortages"
                                    value={analytics.fulfillment.critical_shortages}
                                    subtitle="Crops below 50% fulfillment"
                                    trend={{ value: 2, isPositive: false }}
                                    icon={<AlertCircle className="w-5 h-5" />}
                                />
                                <MetricCard
                                    title="Price Stability"
                                    value="High"
                                    subtitle="Avg volatility: 2.5%"
                                    icon={<TrendingUp className="w-5 h-5" />}
                                />
                                <MetricCard
                                    title="Fulfillment Savings"
                                    value={formatCurrency(analytics.priceTrends?.savings_potential || 0)}
                                    subtitle="Potential savings identified"
                                    icon={<ShoppingBag className="w-5 h-5" />}
                                />
                            </div>

                            <div className="grid lg:grid-cols-3 gap-6">
                                <div className="lg:col-span-2 space-y-6">
                                    <TrendLineChart
                                        data={analytics.priceTrends?.price_trends || []}
                                        xKey="date"
                                        yKey="purchase_price"
                                        title="Purchase Price Volatility"
                                        color="#2563eb"
                                    />
                                    <DataTable
                                        title="Supplier Consistency & Performance"
                                        data={analytics.suppliers?.suppliers || []}
                                        columns={supplierColumns}
                                    />
                                </div>
                                <div className="lg:col-span-1 space-y-6">
                                    <ComparisonBarChart
                                        data={analytics.fulfillment.fulfillment_metrics}
                                        xKey="crop"
                                        yKey1="requested"
                                        yKey2="fulfilled"
                                        title="Demand vs Fulfillment"
                                    />
                                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Top Supplier Mix</h4>
                                        <div className="flex items-center justify-center py-4">
                                            <ProgressCircle
                                                value={analytics.fulfillment.overall_fulfillment_rate}
                                                size={160}
                                                strokeWidth={12}
                                                label="Service Level"
                                            />
                                        </div>
                                        <div className="mt-6 space-y-3">
                                            {analytics.suppliers?.suppliers.slice(0, 3).map((s: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-500">{s.supplier_name}</span>
                                                    <span className="font-bold text-slate-700">{s.delivery_count} Deliveries</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <ActivityHeatmap data={[]} title="Procurement Activity" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Active Demands */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Truck className="w-5 h-5 text-blue-600" /> Active Demands
                                </h3>
                                <button className="text-blue-600 text-xs font-bold hover:text-blue-800">View All</button>
                            </div>
                            <div className="space-y-4">
                                {analytics.fulfillment?.fulfillment_metrics.slice(0, 4).map((d: any, i: number) => (
                                    <div key={i} className="p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-slate-900">{d.crop}</p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">Quantity: {d.requested}kg</p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.fulfillment_rate > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {Math.round(d.fulfillment_rate)}% Full
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${d.fulfillment_rate > 80 ? 'bg-emerald-500' : 'bg-amber-400'}`}
                                                style={{ width: `${d.fulfillment_rate}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inventory Context */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-indigo-600" /> Nearby Inventory
                                </h3>
                                <button className="text-indigo-600 text-xs font-bold hover:text-indigo-800 flex items-center gap-1">
                                    Open Marketplace <ChevronRight className="w-3" />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {['Tomato', 'Onion', 'Potato', 'Carrot'].map((c, i) => (
                                    <div key={i} className="p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                                        <p className="font-bold text-slate-700 text-sm">{c}</p>
                                        <p className="text-xl font-black text-slate-900 mt-1">₹{35 + i * 5}<span className="text-[10px] font-normal text-slate-400">/kg</span></p>
                                        <p className="text-[10px] text-emerald-600 font-bold mt-1">12 farmers listing</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
