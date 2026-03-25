import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Calendar, 
    ChevronRight, 
    TrendingUp, 
    Droplets, 
    Sun, 
    Info,
    Smartphone,
    Leaf,
    Sparkles,
    CircleDollarSign,
    Zap,
    Warehouse,
    Store,
    ShoppingBag,
    AlertTriangle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";

type ViewMode = "gantt" | "calendar" | "strategy" | "details" | "financial";

export function SmartCropCalendar() {
    const { t } = useTranslation();
    const [selectedCrop, setSelectedCrop] = useState("tomato");
    const [viewMode, setViewMode] = useState<ViewMode>("gantt");

    return (
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full -mr-48 -mt-48 opacity-40 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full -ml-32 -mb-32 opacity-30 blur-3xl" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-[0.2em]">
                        <div className="p-1 bg-emerald-100 rounded-lg">
                            <Zap className="w-3.5 h-3.5 fill-emerald-600" />
                        </div>
                        <span>{t('crop_calendar.title').split('-')[0].trim()}</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        {t('crop_calendar.title')}
                    </h2>
                    <p className="text-slate-500 font-medium max-w-xl text-lg">
                        {t('crop_calendar.subtitle')}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                    <div className="flex items-center gap-2 bg-slate-100/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 overflow-x-auto no-scrollbar max-w-full">
                        {(["gantt", "calendar", "strategy", "details", "financial"] as ViewMode[]).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode)}
                                className={cn(
                                    "px-4 py-2.5 rounded-xl text-xs font-black transition-all duration-500 flex items-center gap-2 whitespace-nowrap",
                                    viewMode === mode 
                                        ? "bg-white text-emerald-600 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200" 
                                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                )}
                            >
                                {mode === "gantt" && <Calendar className="w-3.5 h-3.5" />}
                                {mode === "calendar" && <Calendar className="w-3.5 h-3.5 text-blue-500" />}
                                {mode === "strategy" && <Zap className="w-3.5 h-3.5" />}
                                {mode === "details" && <Info className="w-3.5 h-3.5" />}
                                {mode === "financial" && <CircleDollarSign className="w-3.5 h-3.5" />}
                                <span className="capitalize">{t(`crop_calendar.view_${mode}`)}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <Leaf className="w-4 h-4 text-emerald-500 group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                        <select
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            className="w-full pl-11 pr-12 py-4 bg-emerald-50 border-2 border-transparent rounded-2xl text-emerald-900 font-black appearance-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-200/50 cursor-pointer transition-all hover:bg-emerald-100/50 text-sm md:text-base"
                        >
                            <option value="tomato">{t('crop_calendar.crops.tomato')}</option>
                            <option value="onion">{t('crop_calendar.crops.onion')}</option>
                            <option value="chili">{t('crop_calendar.crops.chili')}</option>
                            <option value="brinjal">{t('crop_calendar.crops.brinjal')}</option>
                            <option value="cucumber">{t('crop_calendar.crops.cucumber')}</option>
                        </select>
                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                            <ChevronRight className="w-4 h-4 text-emerald-600 rotate-90" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50/50 rounded-[3rem] border border-slate-200/60 p-6 md:p-10 min-h-[500px] relative overflow-hidden backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewMode + selectedCrop}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full"
                    >
                        {viewMode === "gantt" && <GanttChartView crop={selectedCrop} />}
                        {viewMode === "calendar" && <MonthlyCalendarView crop={selectedCrop} />}
                        {viewMode === "strategy" && <StrategyView crop={selectedCrop} />}
                        {viewMode === "details" && <DetailsView crop={selectedCrop} />}
                        {viewMode === "financial" && <FinancialView crop={selectedCrop} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2.5rem] shadow-2xl shadow-emerald-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-2xl" />
                <div className="relative z-10 flex items-center gap-5 text-white">
                    <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl shadow-inner group transition-all">
                        <Smartphone className="w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <p className="font-black text-xl leading-tight mb-1">Take the Eppo System anywhere</p>
                        <p className="text-emerald-50/80 text-sm font-bold">Sync your AI calendar with the HarvestLink mobile app</p>
                    </div>
                </div>
                <button className="relative z-10 bg-white text-emerald-700 px-10 py-5 rounded-2xl font-black shadow-xl shadow-emerald-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 group whitespace-nowrap active:scale-95">
                    {t('crop_calendar.get_app_cta')}
                    <div className="p-1.5 bg-emerald-50 rounded-lg group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </button>
            </div>
        </section>
    );
}

function MonthlyCalendarView({ crop }: { crop: string }) {
    const { t } = useTranslation();
    const [notes, setNotes] = useState<Record<string, string>>({
        "12": "Check drip irrigation efficiency",
        "15": "Organic fertilizer application",
        "24": "Prepare for harvest labor recruitment"
    });
    const [activeDay, setActiveDay] = useState<string | null>(null);
    const [noteInput, setNoteInput] = useState("");

    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

    const handleSaveNote = () => {
        if (activeDay) {
            setNotes({ ...notes, [activeDay]: noteInput });
            setActiveDay(null);
            setNoteInput("");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-blue-500" />
                    October 2026 - {crop}
                </h3>
                <div className="flex gap-2">
                    <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" /> Growth Phase
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-blue-500" /> Activity Logged
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-3">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest pb-2">
                        {d}
                    </div>
                ))}
                {days.map(day => (
                    <motion.button
                        key={day}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            setActiveDay(day);
                            setNoteInput(notes[day] || "");
                        }}
                        className={cn(
                            "h-24 p-3 rounded-2xl border transition-all text-left relative group overflow-hidden",
                            notes[day] 
                                ? "bg-blue-50 border-blue-200" 
                                : "bg-white border-slate-100 hover:border-emerald-200",
                            activeDay === day && "ring-4 ring-emerald-500/20 border-emerald-500"
                        )}
                    >
                        <span className={cn(
                            "text-xs font-black",
                            notes[day] ? "text-blue-600" : "text-slate-400"
                        )}>{day}</span>
                        
                        {notes[day] && (
                            <div className="mt-2 text-[10px] font-bold text-slate-600 line-clamp-2 leading-tight">
                                {notes[day]}
                            </div>
                        )}

                        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Info className="w-4 h-4 text-slate-300" />
                        </div>
                    </motion.button>
                ))}
            </div>

            <AnimatePresence>
                {activeDay && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-black text-slate-900">Day {activeDay} Activity</h4>
                                <button onClick={() => setActiveDay(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                                    <ChevronRight className="w-5 h-5 rotate-90" />
                                </button>
                            </div>
                            
                            <textarea
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                placeholder={t('crop_calendar.placeholder_note')}
                                className="w-full h-32 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-bold text-sm resize-none"
                            />

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setActiveDay(null)}
                                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveNote}
                                    className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Sparkles className="w-4 h-4" />
                                    {t('crop_calendar.save_note')}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function GanttChartView({ crop }: { crop: string }) {
    const { t } = useTranslation();
    
    const phases = [
        { key: 'seed', color: 'from-blue-400 to-indigo-500', width: '15%', date: 'Oct 1-10', icon: Calendar },
        { key: 'growth', color: 'from-emerald-400 to-teal-500', width: '50%', date: 'Oct 10 - Dec 24', icon: TrendingUp },
        { key: 'harvest', color: 'from-amber-400 to-orange-500', width: '25%', date: 'Dec 25 - Jan 24', icon: Leaf },
        { key: 'sell', color: 'from-rose-400 to-pink-500', width: '10%', date: 'Jan 1-15', icon: CircleDollarSign, highlight: true },
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {t('crop_calendar.eppo_system')}
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Focus</p>
                        <p className="text-sm font-black text-slate-900">{crop}</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-emerald-600" />
                    </div>
                </div>
            </div>

            <div className="relative py-16 px-4">
                {/* Timeline background line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 rounded-full -translate-y-1/2 opacity-40" />
                
                <div className="flex w-full h-40 items-center justify-between relative z-10">
                    {phases.map((phase, idx) => (
                        <div key={phase.key} style={{ width: phase.width }} className="group relative px-1">
                            {/* Hover info card */}
                            <div className="absolute bottom-full mb-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-4 group-hover:translate-y-0 flex flex-col items-center">
                                <div className="bg-slate-900 text-white p-3 rounded-2xl shadow-2xl min-w-[120px] text-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{t(`crop_calendar.phases.${phase.key}`)}</p>
                                    <p className="text-xs font-black">{phase.date}</p>
                                </div>
                                <div className="w-3 h-3 bg-slate-900 rotate-45 -mt-1.5" />
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <div className={cn(
                                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110",
                                    phase.highlight ? "bg-rose-100 text-rose-600 ring-4 ring-rose-50" : "bg-white text-slate-400 border border-slate-100"
                                )}>
                                    <phase.icon className={cn("w-6 h-6", phase.highlight && "animate-bounce")} />
                                </div>
                                
                                <div className="w-full relative px-1">
                                    <motion.div 
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ duration: 0.8, delay: idx * 0.1, ease: "circOut" }}
                                        className={cn(
                                            "h-5 w-full rounded-full bg-gradient-to-r shadow-lg transition-all transform origin-left cursor-pointer",
                                            phase.color,
                                            phase.highlight ? "shadow-rose-200 ring-4 ring-rose-500/10" : "opacity-90 hover:opacity-100"
                                        )}
                                    />
                                    <span className="absolute top-full mt-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                        {t(`crop_calendar.phases.${phase.key}`).split('(')[0].trim()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Sparkles className="w-24 h-24 text-rose-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-rose-50 rounded-xl">
                            <Zap className="w-5 h-5 text-rose-600 fill-rose-600" />
                        </div>
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Festival Pricing Synergy</h4>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-900">{t('crop_calendar.festivals.pongal')}</h3>
                        <div className="p-5 bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl border border-rose-100/50">
                            <p className="text-rose-900 font-black text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                {t('crop_calendar.festivals.price_boost')}
                            </p>
                            <p className="text-rose-700/70 font-bold text-xs mt-1 italic italic">Harvest scheduled for Jan 5-10 for maximum margin.</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm group"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <Sun className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Weather Intelligence</h4>
                    </div>
                    <div className="space-y-4">
                        {[
                            { icon: Droplets, text: t('crop_calendar.weather.monsoon'), color: "text-blue-500", bg: "bg-blue-50" },
                            { icon: Sun, text: t('crop_calendar.weather.winter'), color: "text-amber-500", bg: "bg-amber-50" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                <div className={cn("p-2.5 rounded-xl shadow-sm", item.bg)}>
                                    <item.icon className={cn("w-5 h-5", item.color)} />
                                </div>
                                <span className="text-slate-700 text-sm font-bold leading-relaxed">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function StrategyView({ crop }: { crop: string }) {
    const { t } = useTranslation();
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
            <div className="lg:col-span-2 space-y-8">
                {/* AI Insights Card */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-8 rounded-4xl border border-slate-200/60 shadow-xl shadow-slate-200/30 relative overflow-hidden"
                >
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50" />
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-100 rounded-2xl">
                                <Zap className="w-6 h-6 text-emerald-600 fill-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t('crop_calendar.insights.title')}</h3>
                        </div>
                        <div className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black rounded-lg uppercase">Real-time</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-emerald-200 transition-colors group">
                            <div className="flex items-center gap-3 mb-3">
                                <TrendingUp className="w-5 h-5 text-emerald-600" />
                                <span className="font-black text-slate-900">{t('crop_calendar.insights.demand')}</span>
                            </div>
                            <p className="text-sm text-slate-600 font-bold leading-relaxed">
                                {t('crop_calendar.insights.demand_desc', { district: 'Coimbatore' })}
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-amber-200 transition-colors group">
                            <div className="flex items-center gap-3 mb-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                <span className="font-black text-slate-900">{t('crop_calendar.insights.risk')}</span>
                            </div>
                            <p className="text-sm text-slate-600 font-bold leading-relaxed">
                                {t('crop_calendar.insights.risk_desc')}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Local Input Advisor */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900 p-8 rounded-4xl text-white relative overflow-hidden"
                >
                    <Warehouse className="absolute bottom-0 right-0 w-48 h-48 text-white/5 -mb-12 -mr-12" />
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
                            <ShoppingBag className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-black tracking-tight">{t('crop_calendar.inputs.title')}</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: Leaf, label: t('crop_calendar.inputs.seeds'), value: "Hybrid CO-5 Tomato", store: "KRT Agri Store" },
                            { icon: Droplets, label: t('crop_calendar.inputs.fertilizer'), value: "Bio-NPK Liquid Mix", store: "Muthu Inputs" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-white/10 rounded-xl">
                                        <item.icon className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-0.5">{item.label}</p>
                                        <p className="font-bold">{item.value}</p>
                                    </div>
                                </div>
                                <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-xs font-black rounded-xl hover:bg-emerald-500 hover:text-white transition-all">
                                    {t('crop_calendar.inputs.buy_now')}
                                </button>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Marketplace Matching Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-600 rounded-4xl p-8 text-white flex flex-col shadow-2xl shadow-emerald-900/20"
            >
                <div className="mb-10 text-center space-y-4">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center shadow-inner">
                        <Store className="w-10 h-10" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black mb-1">{t('crop_calendar.market.matching')}</h3>
                        <p className="text-emerald-100/70 font-bold text-sm">Strategic Buyer Connections</p>
                    </div>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="p-6 bg-white/10 backdrop-blur-sm rounded-[2.5rem] border border-white/20 text-center group transition-all hover:bg-white/15">
                        <p className="text-emerald-50 text-3xl font-black mb-2 group-hover:scale-110 transition-transform">12</p>
                        <p className="font-bold text-sm leading-tight text-emerald-100">{t('crop_calendar.market.shops_interested', { count: 12 })}</p>
                    </div>

                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest px-2">Market Insight</p>
                        <div className="bg-emerald-700/50 p-4 rounded-3xl border border-emerald-500/30 text-xs font-bold leading-relaxed">
                            Buyers from <span className="text-white underline underline-offset-4 decoration-emerald-400 decoration-2">Salem Market</span> are actively searching for {crop} volume similar to yours for the Pongal window.
                        </div>
                    </div>
                </div>

                <button className="mt-8 w-full py-5 bg-white text-emerald-600 rounded-3xl font-black shadow-xl shadow-emerald-900/10 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 group">
                    {t('crop_calendar.market.pre_book')}
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>
        </div>
    );
}

function DetailsView({ crop }: { crop: string }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-4xl border border-slate-200/60 shadow-lg shadow-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <Info className="w-32 h-32 text-emerald-600" />
                    </div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                            <Leaf className="w-7 h-7 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Technical Profile: {crop}</h3>
                            <p className="text-emerald-600 font-bold text-sm tracking-wide">AI-Optimized Production Guide</p>
                        </div>
                    </div>
                    
                    <div className="space-y-8 text-slate-600 font-medium">
                        <p className="text-lg leading-relaxed text-slate-500">
                            Our AI analysis of your soil health documents and regional weather suggests an optimized <span className="text-emerald-600 font-black">112-day cycle</span>. Target pH is 6.5-7.0 with precision irrigation triggered during the bloom phase in late November.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { label: "Water Requirement", value: "450-600mm / Cycle", sub: "Priority during Eppo 2" },
                                { label: "Soil Prep Time", value: "12-15 Days", sub: "Deep tilling required" },
                                { label: "Est. Yield", value: "12-15 Tons/Acre", sub: "Top 10% benchmark" },
                                { label: "Labor Peak", value: "Dec 15 onwards", sub: "Harvest & Grading" },
                            ].map((spec, i) => (
                                <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-md transition-all">
                                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{spec.label}</span>
                                    <span className="text-slate-900 font-black text-lg block">{spec.value}</span>
                                    <span className="text-[10px] text-emerald-600 font-bold mt-1 block tracking-tight">{spec.sub}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="bg-slate-900 p-8 rounded-4xl text-white relative overflow-hidden group">
                    <Zap className="absolute top-0 right-0 w-24 h-24 text-white/5 -mt-8 -mr-8 group-hover:rotate-12 transition-transform duration-700" />
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h4 className="font-black text-xl tracking-tight">AI Task Advisor</h4>
                    </div>
                    <ul className="space-y-5">
                        {[
                            { text: "Order CO-4 Seeds (15th Sept)", status: "done", date: "Sept 15" },
                            { text: "Check Drip System Leakage", status: "done", date: "Sept 20" },
                            { text: "Bio-Fertilizer Batch 1", status: "pending", date: "Oct 05" },
                            { text: "Pest Scouting (Thrips)", status: "pending", date: "Oct 20" },
                            { text: "Flush Irrigation Lines", status: "pending", date: "Nov 10" },
                        ].map((task, i) => (
                            <li key={i} className={cn(
                                "flex items-start gap-4 p-4 rounded-2xl transition-all cursor-default",
                                task.status === "done" ? "bg-white/5 opacity-50" : "bg-white/10 hover:bg-white/20 ring-1 ring-white/10"
                            )}>
                                <div className={cn(
                                    "mt-1 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                                    task.status === "done" ? "bg-emerald-500" : "border-2 border-emerald-500/50"
                                )}>
                                    {task.status === "done" && <Zap className="w-3 h-3 text-white fill-white" />}
                                </div>
                                <div>
                                    <p className="font-bold text-sm leading-tight">{task.text}</p>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase mt-1 tracking-widest">{task.date}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="p-6 bg-emerald-50 rounded-4xl border border-emerald-100 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                        <Smartphone className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-xs font-black text-emerald-900 mb-1">Get Weekly Alerts</p>
                    <p className="text-[10px] text-emerald-600 font-bold mb-4">Join 2,500+ farmers in your region</p>
                    <button className="w-full py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-200">Enable Push Notifications</button>
                </div>
            </div>
        </div>
    );
}

function FinancialView({ crop }: { crop: string }) {
    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: "Est. Lifecycle Cost", value: "₹45,000", color: "text-slate-900", icon: CircleDollarSign, bg: "bg-white" },
                    { label: "Est. Total Revenue", value: "₹1,25,000", color: "text-emerald-600", icon: TrendingUp, bg: "bg-emerald-50/50", border: "border-emerald-100" },
                    { label: "Potential Net Profit", value: "₹80,000", color: "text-blue-600", icon: Sparkles, bg: "bg-blue-50/50", border: "border-blue-100" },
                ].map((stat) => (
                    <motion.div 
                        key={stat.label} 
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                            "p-8 rounded-[2.5rem] border shadow-xl shadow-slate-200/20 transition-all",
                            stat.bg,
                            stat.border || "border-slate-100"
                        )}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={cn("w-8 h-8", stat.color)} />
                            <div className="px-2 py-0.5 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">AI Projection</div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <span className={cn("text-3xl font-black mt-1 block", stat.color)}>{stat.value}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <div className="bg-white p-10 rounded-4xl border border-slate-200/60 shadow-lg relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 pointer-events-none" />
                <div className="flex items-center justify-between mb-10 relative">
                    <div className="space-y-1">
                        <h4 className="font-black text-2xl text-slate-900 tracking-tight">Price Trend Intelligence</h4>
                        <p className="text-slate-400 text-sm font-bold flex items-center gap-2">
                           Market Projection for {crop} • <span className="text-emerald-500">Aura-AI Forecast</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {['1M', '3M', '6M'].map(p => (
                            <button key={p} className={cn(
                                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                                p === '3M' ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:bg-slate-50"
                            )}>{p}</button>
                        ))}
                    </div>
                </div>

                <div className="h-64 flex items-end gap-3 px-2 relative z-10">
                    {[35, 42, 38, 55, 85, 75, 60, 95, 100].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group/bar">
                            <div className="relative w-full flex flex-col items-center">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.05, ease: "backOut" }}
                                    className={cn(
                                        "w-full rounded-2xl transition-all duration-500 relative group-hover/bar:brightness-110",
                                        h > 80 ? "bg-emerald-500 shadow-lg shadow-emerald-200" : h > 50 ? "bg-blue-400 shadow-lg shadow-blue-100" : "bg-slate-200"
                                    )}
                                >
                                    {h === 100 && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded-md whitespace-nowrap animate-bounce shadow-xl">
                                            Peak Window 🚀
                                        </div>
                                    )}
                                </motion.div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                {['Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i]}
                            </span>
                        </div>
                    ))}
                </div>
                
                <div className="mt-12 flex items-center gap-8 border-t border-slate-100 pt-8 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">High Margin</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-400" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Normal Range</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-slate-200" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Input Heavy</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
