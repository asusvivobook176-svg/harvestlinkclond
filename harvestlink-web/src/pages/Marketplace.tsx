import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Navbar } from "../components/layout/Navbar";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../services/api";
import {
    Search, Filter, Plus, ShoppingBag, MapPin,
    ArrowRight, Tag, Package,
    TrendingUp, CheckCircle2, Store
} from "lucide-react";
import { formatCurrency, formatDate } from "../lib/utils";
import { SkeletonCard } from "../components/shared/LoadingSpinner";
import type { CropListing, DemandPost } from "../types";
import { TN_DISTRICTS, TN_VEGETABLES } from "../types";
import { useTranslation } from "react-i18next";

export default function Marketplace() {
    const { user, profile } = useAuth();
    const { t } = useTranslation();
    const [tab, setTab] = useState<"crops" | "demands">("crops");
    const [listings, setListings] = useState<CropListing[]>([]);
    const [demands, setDemands] = useState<DemandPost[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [district, setDistrict] = useState("All");
    const [vegetable, setVegetable] = useState("All");

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [l, d] = await Promise.all([
                apiFetch("/market/listings"),
                apiFetch("/market/demands"),
            ]);
            setListings(l || []);
            setDemands(d || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredListings = listings.filter(l => {
        const matchesSearch = l.crop_name.toLowerCase().includes(search.toLowerCase());
        const matchesDistrict = district === "All" || l.district === district;
        const matchesVeg = vegetable === "All" || l.crop_name === vegetable;
        return matchesSearch && matchesDistrict && matchesVeg;
    });

    const filteredDemands = demands.filter(d => {
        const matchesSearch = d.vegetable_name.toLowerCase().includes(search.toLowerCase());
        const matchesCity = district === "All" || d.city === district;
        const matchesVeg = vegetable === "All" || d.vegetable_name === vegetable;
        return matchesSearch && matchesCity && matchesVeg;
    });

    return (
        <div className="flex min-h-screen bg-green-50/50">
            {user && <Sidebar role={profile?.role === "shop" ? "shop" : "farmer"} />}

            <div className="flex-1 flex flex-col min-w-0">
                {!user && <Navbar />}

                <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">

                    {/* Header & Tabs */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-3">
                                <ShoppingBag className="w-3.5 h-3.5" /> {t("marketplace.subtitle")}
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{t("marketplace.title")}</h1>
                            <p className="text-gray-500 text-sm mt-1">
                                {t("marketplace.listed_by")} {profile?.role === 'shop' ? t("common.farmer") : t("common.shop")}
                            </p>
                        </div>

                        <div className="flex bg-white p-1 rounded-2xl border border-green-100 shadow-sm animate-fade-in-up delay-100">
                            <button
                                onClick={() => setTab("crops")}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "crops" ? "bg-green-600 text-white shadow-md shadow-green-200" : "text-gray-500 hover:text-green-600"}`}
                            >
                                <Package className="w-4 h-4" /> {t("marketplace.all_crops")}
                            </button>
                            <button
                                onClick={() => setTab("demands")}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "demands" ? "bg-green-600 text-white shadow-md shadow-green-200" : "text-gray-500 hover:text-green-600"}`}
                            >
                                <Store className="w-4 h-4" /> {t("shop_dashboard.active_demands")}
                            </button>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="card grid md:grid-cols-4 gap-4 p-4 animate-fade-in-up delay-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                className="input-field pl-10"
                                placeholder={t("marketplace.search_placeholder")}
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                            <select
                                className="input-field pl-10 appearance-none"
                                value={district}
                                onChange={e => setDistrict(e.target.value)}
                            >
                                <option value="All">{t("marketplace.all_districts")}</option>
                                {TN_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                            <select
                                className="input-field pl-10 appearance-none"
                                value={vegetable}
                                onChange={e => setVegetable(e.target.value)}
                            >
                                <option value="All">{t("marketplace.all_crops")}</option>
                                {TN_VEGETABLES.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={() => { setSearch(""); setDistrict("All"); setVegetable("All"); }}
                            className="btn-secondary justify-center gap-2"
                        >
                            <Filter className="w-4 h-4" /> {t("marketplace.filters")}
                        </button>
                    </div>

                    {/* Floating Add Button For Users */}
                    {user && (
                        <div className="fixed bottom-8 right-8 z-40 animate-bounce">
                            <button className="w-16 h-16 rounded-full gradient-card text-white shadow-2xl flex items-center justify-center group relative">
                                <Plus className="w-8 h-8 transition-transform group-hover:rotate-90" />
                                <span className="absolute right-full mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {t("common.new")} {tab === 'crops' ? t("marketplace.all_crops") : t("shop_dashboard.active_demands")}
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Results Grid */}
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <SkeletonCard key={i} lines={4} />)}
                        </div>
                    ) : (
                        <div className="animate-fade-in-up delay-300">
                            {tab === "crops" ? (
                                /* ── Crops Grid ── */
                                filteredListings.length === 0 ? (
                                    <EmptyState text={t("marketplace.no_listings")} t={t} />
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredListings.map((l, i) => (
                                            <div key={l.id} className="card-hover-effect group bg-white rounded-3xl border border-green-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col" style={{ animationDelay: `${i * 0.05}s` }}>
                                                <div className="p-5 flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                            🌾
                                                        </div>
                                                        <span className="badge badge-green">Available</span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-gray-900 mb-1">{l.crop_name}</h3>
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                                                        <MapPin className="w-3.5 h-3.5" /> {l.district}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{t("marketplace.quantity")}</p>
                                                            <p className="text-sm font-black text-gray-900">{l.quantity_kg} kg</p>
                                                        </div>
                                                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Harvested</p>
                                                            <p className="text-sm font-black text-gray-900">{l.harvest_date ? formatDate(l.harvest_date) : 'N/A'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-baseline gap-1 mt-auto">
                                                        <span className="text-2xl font-black text-green-700">{formatCurrency(l.asking_price_rs || 0)}</span>
                                                        <span className="text-gray-400 text-xs font-bold uppercase">/ kg</span>
                                                    </div>
                                                </div>
                                                <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                                                    <button className="btn-primary w-full justify-center group-hover:gap-3 transition-all">
                                                        View Details <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : (
                                /* ── Demands Grid ── */
                                filteredDemands.length === 0 ? (
                                    <EmptyState text={t("shop_dashboard.no_demands")} t={t} />
                                ) : (
                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                        {filteredDemands.map((d, i) => (
                                            <div key={d.id} className="group bg-white rounded-3xl border border-blue-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border-t-4 border-t-blue-500" style={{ animationDelay: `${i * 0.05}s` }}>
                                                <div className="p-5 flex-1">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                            🏪
                                                        </div>
                                                        <span className={`badge ${d.urgency === 'High' ? 'badge-red' : 'badge-blue'}`}>
                                                            {t("marketplace.urgency_label", { urgency: d.urgency })}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-black text-gray-900 mb-1">{d.vegetable_name}</h3>
                                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-4">
                                                        <MapPin className="w-3.5 h-3.5" /> {d.city}
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{t("shop_dashboard.kg_needed")}</p>
                                                            <p className="text-sm font-black text-gray-900">{d.quantity_kg} kg</p>
                                                        </div>
                                                        <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase">{t("shop_dashboard.max_per_kg")}</p>
                                                            <p className="text-sm font-black text-gray-900">{formatCurrency(d.max_price_rs || 0)}</p>
                                                        </div>
                                                    </div>

                                                    <p className="text-[10px] text-blue-500 font-bold uppercase flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3" /> {t("marketplace.demand_matched", { count: 5 })}
                                                    </p>
                                                </div>
                                                <div className="p-4 border-t border-gray-50 bg-gray-50/50">
                                                    <button className="w-full btn-secondary text-blue-700 border-blue-200 hover:bg-blue-50 justify-center group-hover:gap-3 transition-all font-black">
                                                        {t("marketplace.contact_farmer")} <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    )}

                    {/* Education Strip */}
                    <div className="bg-linear-to-r from-green-600 to-emerald-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-4xl shrink-0">
                                🤝
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-black mb-2">{t("marketplace.guarantee_title")}</h2>
                                <p className="text-green-100 text-sm max-w-2xl leading-relaxed">
                                    {t("marketplace.guarantee_desc")}
                                </p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-green-300" />
                                <span className="font-bold">{t("marketplace.verified_profiles")}</span>
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}

function EmptyState({ text, t }: { text: string, t: any }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 bg-white/40 border-2 border-dashed border-gray-200 rounded-[3rem] text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-5xl mb-6 grayscale opacity-50">
                🔎
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">{t("marketplace.no_results_header")}</h3>
            <p className="text-gray-500 max-w-xs">{text}</p>
        </div>
    );
}
