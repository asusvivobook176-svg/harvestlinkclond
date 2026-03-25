import { useState, useEffect } from "react";
import { 
    Sprout, 
    Plus, 
    Search, 
    Filter, 
    LayoutGrid, 
    List, 
    ChevronRight, 
    MoreVertical, 
    Calendar, 
    TrendingUp, 
    Droplets, 
    Thermometer,
    Edit3,
    Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../../components/layout/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { formatDate, cn } from "../../lib/utils";
import type { FarmerCrop, CropGrowthStage } from "../../types";

const STAGE_COLORS: Record<CropGrowthStage, string> = {
    "Sowing": "bg-blue-100 text-blue-700 border-blue-200",
    "Vegetative": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Flowering": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "Fruition": "bg-orange-100 text-orange-700 border-orange-200",
    "Harvesting": "bg-red-100 text-red-700 border-red-200",
};

const STAGE_PROGRESS: Record<CropGrowthStage, number> = {
    "Sowing": 10,
    "Vegetative": 30,
    "Flowering": 60,
    "Fruition": 85,
    "Harvesting": 100,
};

export default function MyCrops() {
    const { farmer } = useAuth();
    const [crops, setCrops] = useState<FarmerCrop[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStage, setFilterStage] = useState<string>("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        const fetchCrops = async () => {
            if (!farmer?.id) return;
            try {
                // In a real app, this would be apiFetch(`/farmer/crops?farmer_id=${farmer.id}`)
                // For now, using mock data that follows the new type
                const mockCrops: FarmerCrop[] = [
                    {
                        id: "1",
                        farmer_id: farmer.id,
                        crop_name: "Tomatoes",
                        variety: "PKM-1",
                        area_acres: 2.5,
                        sown_date: "2026-01-15",
                        expected_harvest_date: "2026-04-20",
                        growth_stage: "Fruition",
                        health_score: 88,
                        estimated_yield_kg: 1200,
                        soil_moisture: 65,
                        temperature: 28,
                        notes: "Healthy growth, regular irrigation maintained.",
                        created_at: "2026-01-15T10:00:00Z",
                        updated_at: "2026-03-20T14:30:00Z"
                    },
                    {
                        id: "2",
                        farmer_id: farmer.id,
                        crop_name: "Onions",
                        variety: "CO-4",
                        area_acres: 1.2,
                        sown_date: "2026-02-10",
                        expected_harvest_date: "2026-05-15",
                        growth_stage: "Vegetative",
                        health_score: 92,
                        estimated_yield_kg: 800,
                        soil_moisture: 58,
                        temperature: 30,
                        notes: "Initial stages, pest control applied.",
                        created_at: "2026-02-10T09:00:00Z",
                        updated_at: "2026-03-18T11:20:00Z"
                    },
                    {
                        id: "3",
                        farmer_id: farmer.id,
                        crop_name: "Brinjal",
                        variety: "CO-2",
                        area_acres: 0.8,
                        sown_date: "2026-03-05",
                        expected_harvest_date: "2026-06-10",
                        growth_stage: "Sowing",
                        health_score: 95,
                        estimated_yield_kg: 500,
                        soil_moisture: 72,
                        temperature: 27,
                        notes: "Recently sown, watering in progress.",
                        created_at: "2026-03-05T08:30:00Z",
                        updated_at: "2026-03-05T08:30:00Z"
                    }
                ];
                setCrops(mockCrops);
                // Real call: const data = await apiFetch(`/farmer/crops?farmer_id=${farmer.id}`);
                // setCrops(data);
            } catch (err) {
                console.error("Error fetching crops:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCrops();
    }, [farmer?.id]);

    const filteredCrops = crops.filter(crop => {
        const matchesSearch = crop.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             (crop.variety?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
        const matchesStage = filterStage === "All" || crop.growth_stage === filterStage;
        return matchesSearch && matchesStage;
    });

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="farmer" />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-8 space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-1"
                        >
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
                                <Sprout className="w-4 h-4" />
                                <span>Farm Inventory</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Crops</h1>
                            <p className="text-slate-500 font-medium">Manage and track your seasonal production lifecycle.</p>
                        </motion.div>

                        <motion.button 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 flex items-center gap-2 transition-all self-start md:self-center"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Add New Crop</span>
                        </motion.button>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: "Active Crops", value: crops.length, icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Total Area", value: `${crops.reduce((acc, c) => acc + (c.area_acres ?? 0), 0)} Acres`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Avg. Health", value: `${Math.round(crops.reduce((acc, c) => acc + c.health_score, 0) / (crops.length || 1))}%`, icon: Thermometer, color: "text-amber-600", bg: "bg-amber-50" },
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
                                    placeholder="Search by crop name or variety..."
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500/20 font-medium transition-all"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="relative group">
                                <select 
                                    className="pl-10 pr-8 py-3 bg-slate-50 border-none rounded-2xl text-slate-700 font-bold focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer"
                                    value={filterStage}
                                    onChange={(e) => setFilterStage(e.target.value)}
                                >
                                    <option value="All">All Stages</option>
                                    <option value="Sowing">Sowing</option>
                                    <option value="Vegetative">Vegetative</option>
                                    <option value="Flowering">Flowering</option>
                                    <option value="Fruition">Fruition</option>
                                    <option value="Harvesting">Harvesting</option>
                                </select>
                                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-1.5 bg-slate-50 rounded-2xl">
                            <button 
                                onClick={() => setViewMode("grid")}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all",
                                    viewMode === "grid" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => setViewMode("list")}
                                className={cn(
                                    "p-2.5 rounded-xl transition-all",
                                    viewMode === "list" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Crops Grid/List */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl" />
                            ))}
                        </div>
                    ) : filteredCrops.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-4xl border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-emerald-50 flex items-center justify-center rounded-3xl mb-4">
                                <Sprout className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">No crops found</h3>
                            <p className="text-slate-500 mb-6">Start by adding your first seasonal crop.</p>
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
                            >
                                Add Your First Crop
                            </button>
                        </div>
                    ) : viewMode === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredCrops.map((crop, i) => (
                                    <CropCard key={crop.id} crop={crop} index={i} />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Crop & Variety</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Growth Stage</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Health</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Area</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredCrops.map((crop) => (
                                        <CropRow key={crop.id} crop={crop} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

function CropCard({ crop, index }: { crop: FarmerCrop; index: number }) {
    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-white rounded-4xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-colors" />
            
            <div className="flex items-start justify-between relative mb-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-emerald-200">
                        {crop.crop_name[0]}
                    </div>
                    <div>
                        <h4 className="text-xl font-black text-slate-900 leading-tight">{crop.crop_name}</h4>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{crop.variety ?? "Standard"}</p>
                    </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50 rounded-xl">
                        <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-red-600 transition-colors bg-slate-50 rounded-xl">
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="space-y-6 relative">
                <div className="flex items-center justify-between">
                    <span className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border",
                        STAGE_COLORS[crop.growth_stage]
                    )}>
                        {crop.growth_stage}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-900 font-black">
                        <span className="text-xl">{crop.health_score}</span>
                        <span className="text-xs text-slate-400 uppercase tracking-tighter">Score</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest">
                        <span>Cycle Progress</span>
                        <span>{STAGE_PROGRESS[crop.growth_stage]}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${STAGE_PROGRESS[crop.growth_stage]}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Moisture</p>
                        <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span className="font-black text-slate-900">{crop.soil_moisture}%</span>
                        </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temp</p>
                        <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span className="font-black text-slate-900">{crop.temperature}°C</span>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-300" />
                        <span className="text-xs font-bold text-slate-500">Harvest {formatDate(crop.expected_harvest_date ?? "")}</span>
                    </div>
                    <button className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all group/btn">
                        Details <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

function CropRow({ crop }: { crop: FarmerCrop }) {
    return (
        <tr className="hover:bg-slate-50/50 transition-colors group">
            <td className="px-6 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white text-lg font-black group-hover:scale-110 transition-transform">
                        {crop.crop_name[0]}
                    </div>
                    <div>
                        <p className="font-black text-slate-900">{crop.crop_name}</p>
                        <p className="text-xs font-bold text-slate-400">{crop.variety}</p>
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    STAGE_COLORS[crop.growth_stage]
                )}>
                    {crop.growth_stage}
                </span>
            </td>
            <td className="px-6 py-5 text-center">
                <div className="inline-flex flex-col items-center">
                    <span className="font-black text-slate-900">{crop.health_score}%</span>
                    <div className="w-16 h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div 
                            className={cn(
                                "h-full",
                                crop.health_score > 90 ? "bg-emerald-500" : crop.health_score > 70 ? "bg-blue-500" : "bg-amber-500"
                            )} 
                            style={{ width: `${crop.health_score}%` }} 
                        />
                    </div>
                </div>
            </td>
            <td className="px-6 py-5">
                <div className="flex items-center gap-2 font-bold text-slate-700">
                    <TrendingUp className="w-4 h-4 text-slate-300" />
                    {crop.area_acres} Acres
                </div>
            </td>
            <td className="px-6 py-5 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors bg-slate-50 rounded-xl">
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
