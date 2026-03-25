import { useState, useEffect } from "react";
import { 
    Store, 
    Plus, 
    Search, 
    Filter, 
    LayoutGrid, 
    List, 
    MoreVertical, 
    Calendar, 
    PackageCheck, 
    Edit3,
    Users,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../../components/layout/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency, formatDate, cn } from "../../lib/utils";
import type { DemandPost } from "../../types";

export default function MyDemands() {
    const { shop } = useAuth();
    const [demands, setDemands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterUrgency, setFilterUrgency] = useState<string>("All");

    useEffect(() => {
        const fetchDemands = async () => {
            if (!shop?.id) return;
            try {
                // Mock data for demands
                const mockDemands = [
                    {
                        id: "d1",
                        shop_id: shop.id,
                        vegetable_name: "Tomatoes",
                        quantity_kg: 500,
                        fulfilled_kg: 320,
                        max_price_rs: 30,
                        delivery_date: "2026-03-28",
                        urgency: "High",
                        city: shop.city || "Salem",
                        status: "Active",
                        matched_farmers: 8,
                        created_at: "2026-03-20T10:00:00Z"
                    },
                    {
                        id: "d2",
                        shop_id: shop.id,
                        vegetable_name: "Onions",
                        quantity_kg: 1000,
                        fulfilled_kg: 1000,
                        max_price_rs: 25,
                        delivery_date: "2026-03-22",
                        urgency: "Medium",
                        city: shop.city || "Salem",
                        status: "Fulfilled",
                        matched_farmers: 12,
                        created_at: "2026-03-15T09:00:00Z"
                    },
                    {
                        id: "d3",
                        shop_id: shop.id,
                        vegetable_name: "Potatoes",
                        quantity_kg: 800,
                        fulfilled_kg: 150,
                        max_price_rs: 20,
                        delivery_date: "2026-04-05",
                        urgency: "Low",
                        city: shop.city || "Salem",
                        status: "Active",
                        matched_farmers: 4,
                        created_at: "2026-03-21T11:20:00Z"
                    }
                ];
                setDemands(mockDemands);
            } catch (err) {
                console.error("Error fetching demands:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDemands();
    }, [shop?.id]);

    const filteredDemands = demands.filter(d => {
        const matchesSearch = d.vegetable_name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesUrgency = filterUrgency === "All" || d.urgency === filterUrgency;
        return matchesSearch && matchesUrgency;
    });

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="shop" />
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
                                <Store className="w-4 h-4" />
                                <span>Procurement Manager</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Active Demands</h1>
                            <p className="text-slate-500 font-medium">Post requirements and track fulfillment from local farmers.</p>
                        </motion.div>

                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Post New Demand</span>
                        </motion.button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Active Demands", value: demands.filter(d => d.status === "Active").length, icon: Store, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Overall Fulfillment", value: `${Math.round((demands.reduce((acc, d) => acc + d.fulfilled_kg, 0) / demands.reduce((acc, d) => acc + d.quantity_kg, 1)) * 100)}%`, icon: PackageCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Potential Suppliers", value: demands.reduce((acc, d) => acc + d.matched_farmers, 0), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
                        ].map((stat, i) => (
                            <motion.div 
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5"
                            >
                                <div className={cn("p-4 rounded-2xl", stat.bg)}>
                                    <stat.icon className={cn("w-6 h-6", stat.color)} />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center flex-1 gap-4 max-w-2xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search vegetable name..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/20 font-medium transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <select 
                                    className="pl-10 pr-8 py-3 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer text-sm"
                                    value={filterUrgency}
                                    onChange={(e) => setFilterUrgency(e.target.value)}
                                >
                                    <option value="All">All Urgency</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </select>
                                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl">
                            <button onClick={() => setViewMode("grid")} className={cn("p-2.5 rounded-xl transition-all", viewMode === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400")}>
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button onClick={() => setViewMode("list")} className={cn("p-2.5 rounded-xl transition-all", viewMode === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400")}>
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Grid/List View */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl" />)}
                        </div>
                    ) : (
                        <div className={cn(viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden")}>
                            {viewMode === "grid" ? (
                                filteredDemands.map((demand, i) => (
                                    <DemandCard key={demand.id} demand={demand} index={i} />
                                ))
                            ) : (
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Vegetable</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Progress</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Urgency</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Target Date</th>
                                            <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredDemands.map((demand) => (
                                            <DemandRow key={demand.id} demand={demand} />
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function DemandCard({ demand, index }: { demand: any; index: number }) {
    const progress = (demand.fulfilled_kg / demand.quantity_kg) * 100;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-4xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all group"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200">
                        {demand.vegetable_name[0]}
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-slate-900 leading-tight">{demand.vegetable_name}</h4>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{demand.status}</p>
                    </div>
                </div>
                <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    demand.urgency === "High" ? "bg-rose-50 text-rose-600 border-rose-100" : 
                    demand.urgency === "Medium" ? "bg-amber-50 text-amber-600 border-amber-100" : 
                    "bg-blue-50 text-blue-600 border-blue-100"
                )}>
                    {demand.urgency}
                </span>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                        <span>Fulfillment</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className={cn("h-full", progress > 80 ? "bg-emerald-500" : "bg-blue-500")}
                        />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">{demand.fulfilled_kg}kg / {demand.quantity_kg}kg secured</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Price</p>
                        <span className="font-black text-slate-900">{formatCurrency(demand.max_price_rs)}/kg</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Potential</p>
                        <div className="flex items-center gap-1.5 font-black text-blue-600">
                            <Users className="w-3.5 h-3.5" />
                            <span>{demand.matched_farmers} farmers</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-300" />
                        <span className="text-xs font-bold text-slate-500">Target: {formatDate(demand.delivery_date)}</span>
                    </div>
                    <button className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                        Manage <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function DemandRow({ demand }: { demand: any }) {
    const progress = (demand.fulfilled_kg / demand.quantity_kg) * 100;
    return (
        <tr className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg font-black">{demand.vegetable_name[0]}</div>
                    <p className="font-black text-slate-900">{demand.vegetable_name}</p>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="w-32 space-y-1">
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold">{Math.round(progress)}% Completed</p>
                </div>
            </td>
            <td className="px-6 py-5 text-center">
                <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    demand.urgency === "High" ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
                )}>
                    {demand.urgency}
                </span>
            </td>
            <td className="px-6 py-5">
                <p className="font-bold text-slate-700 text-sm">{formatDate(demand.delivery_date)}</p>
            </td>
            <td className="px-6 py-5 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-xl">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-xl">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}
