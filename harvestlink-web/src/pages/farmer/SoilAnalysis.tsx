import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Beaker, 
    Zap, 
    Droplets, 
    Sprout, 
    AlertCircle, 
    ChevronRight, 
    Save, 
    RefreshCw, 
    Info,
    TrendingUp,
    FileText,
    Sparkles,
    FlaskConical,
    Target
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Sidebar } from "../../components/layout/Sidebar";
import { cn } from "../../lib/utils";

interface SoilNutrients {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    organicMatter: number;
    zinc?: number;
    boron?: number;
}

export default function SoilAnalysisHub() {
    const { t } = useTranslation();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [soilData, setSoilData] = useState<SoilNutrients>({
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        ph: 7.0,
        organicMatter: 0
    });

    const handleInputChange = (field: keyof SoilNutrients, value: string) => {
        setSoilData(prev => ({ ...prev, [field]: parseFloat(value) || 0 }));
    };

    const runAnalysis = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            setIsAnalyzing(false);
            setShowResults(true);
        }, 1500);
    };

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar role="farmer" />
            
            <main className="flex-1 p-6 md:p-10 space-y-10 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-[0.2em]">
                            <div className="p-1 bg-emerald-100 rounded-lg">
                                <FlaskConical className="w-3.5 h-4" />
                            </div>
                            <span>{t('sidebar.farming')}</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            Soil Health Analysis Lab
                        </h1>
                        <p className="text-slate-500 font-medium max-w-xl">
                            Input your lab test results for AI-driven nutrient optimization and fertilizer strategies.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => { setShowResults(false); setSoilData({ nitrogen: 0, phosphorus: 0, potassium: 0, ph: 7, organicMatter: 0 }); }}
                            className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all shadow-sm"
                        >
                            <RefreshCw className="w-5 h-5" />
                        </button>
                        <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-900/10 hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95">
                            <FileText className="w-5 h-5" />
                            Lab Reports
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Input Form Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl" />
                            
                            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <Beaker className="w-6 h-6 text-emerald-600" />
                                Analysis Input
                            </h2>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <InputField 
                                        label="Nitrogen (N)" 
                                        value={soilData.nitrogen} 
                                        onChange={(v) => handleInputChange('nitrogen', v)}
                                        unit="mg/kg"
                                        icon={<Zap className="w-4 h-4" />}
                                    />
                                    <InputField 
                                        label="Phosphorus (P)" 
                                        value={soilData.phosphorus} 
                                        onChange={(v) => handleInputChange('phosphorus', v)}
                                        unit="mg/kg"
                                        icon={<Target className="w-4 h-4" />}
                                    />
                                </div>
                                
                                <InputField 
                                    label="Potassium (K)" 
                                    value={soilData.potassium} 
                                    onChange={(v) => handleInputChange('potassium', v)}
                                    unit="mg/kg"
                                    icon={<TrendingUp className="w-4 h-4" />}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <InputField 
                                        label="Soil pH" 
                                        value={soilData.ph} 
                                        onChange={(v) => handleInputChange('ph', v)}
                                        unit="levels"
                                        step={0.1}
                                        icon={<Droplets className="w-4 h-4" />}
                                    />
                                    <InputField 
                                        label="Organic Matter" 
                                        value={soilData.organicMatter} 
                                        onChange={(v) => handleInputChange('organicMatter', v)}
                                        unit="%"
                                        icon={<Sprout className="w-4 h-4" />}
                                    />
                                </div>

                                <button 
                                    onClick={runAnalysis}
                                    disabled={isAnalyzing}
                                    className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                                >
                                    {isAnalyzing ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            Start Lab Analysis
                                        </>
                                    )}
                                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                </button>
                            </div>
                        </section>

                        <div className="p-6 bg-slate-900 rounded-4xl text-white relative overflow-hidden group">
                            <Info className="absolute bottom-0 right-0 w-32 h-32 text-white/5 -mb-8 -mr-8" />
                            <h4 className="font-black text-lg mb-2">Why analyze minerals?</h4>
                            <p className="text-slate-400 text-sm font-bold leading-relaxed">
                                Minerals like Phosphorus are non-renewable and critical for root development. Precise application saves costs and prevents heavy metal runoff.
                            </p>
                        </div>
                    </div>

                    {/* Results Display Section */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {!showResults ? (
                                <motion.div 
                                    key="welcome"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    className="h-full min-h-[500px] border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center space-y-6"
                                >
                                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center">
                                        <FlaskConical className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">Ready for Analysis</h3>
                                        <p className="text-slate-500 font-bold max-w-sm">Enter your soil test data on the left to generate an AI-powered nutrient report.</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="results"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-8"
                                >
                                    <section className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/30 space-y-10">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-emerald-50 rounded-2xl">
                                                    <Sparkles className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900">Lab Diagnostic</h3>
                                                    <p className="text-slate-400 font-bold text-sm">Generated on {new Date().toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="px-6 py-2 bg-emerald-500 text-white rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                                                Certified High Accuracy
                                            </div>
                                        </div>

                                        {/* Nutrient Gauges */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <NutrientGauge 
                                                label="Phosphorus Focus (P)" 
                                                value={soilData.phosphorus} 
                                                ideal={60} 
                                                color="blue"
                                                subtitle="Crucial for cell division & root growth"
                                            />
                                            <NutrientGauge 
                                                label="Nitrogen Impact (N)" 
                                                value={soilData.nitrogen} 
                                                ideal={75} 
                                                color="emerald"
                                                subtitle="Drives vegetative leaf development"
                                            />
                                        </div>

                                        <div className="p-8 bg-slate-50 rounded-4xl border border-slate-100 space-y-6">
                                            <h4 className="font-black text-slate-900 flex items-center gap-2">
                                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                                Requirement Strategy
                                            </h4>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <StrategyCard 
                                                    mineral="Phosphorus" 
                                                    status={soilData.phosphorus < 60 ? "Deficient" : "Optimal"}
                                                    action={soilData.phosphorus < 60 ? "Increase Phosphorus intake by adding DAP or Rock Phosphate." : "Maintain current levels."}
                                                    color={soilData.phosphorus < 60 ? "amber" : "emerald"}
                                                />
                                                <StrategyCard 
                                                    mineral="pH Balance" 
                                                    status={soilData.ph < 6 || soilData.ph > 7.5 ? "Alert" : "Stable"}
                                                    action={soilData.ph < 6 ? "Soil too acidic. Add Lime/Dolomite." : soilData.ph > 7.5 ? "Too alkaline. Add Gypsum." : "Perfect range for most crops."}
                                                    color={soilData.ph < 6 || soilData.ph > 7.5 ? "rose" : "emerald"}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <button className="flex-1 py-4 bg-slate-100 text-slate-900 rounded-2xl font-black hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                                <Save className="w-4 h-4" />
                                                Save Report
                                            </button>
                                            <button className="flex-2 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-900/10 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                                Connect with Agri-Advisor
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </section>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}

function InputField({ label, value, onChange, unit, icon, step = 1 }: { label: string, value: number, onChange: (v: string) => void, unit: string, icon: React.ReactNode, step?: number }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                {icon}
                {label}
            </label>
            <div className="relative group">
                <input 
                    type="number"
                    step={step}
                    value={value || ""}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-900 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-200/50 transition-all group-hover:bg-slate-100/50"
                    placeholder="Enter value"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{unit}</span>
            </div>
        </div>
    );
}

function NutrientGauge({ label, value, ideal, color, subtitle }: { label: string, value: number, ideal: number, color: "emerald" | "blue" | "amber", subtitle: string }) {
    const percentage = Math.min((value / ideal) * 100, 100);
    const colorClass = color === "emerald" ? "bg-emerald-500" : color === "blue" ? "bg-blue-500" : "bg-amber-500";
    const bgClass = color === "emerald" ? "bg-emerald-50" : color === "blue" ? "bg-blue-50" : "bg-amber-50";

    return (
        <div className={cn("p-6 rounded-4xl border-2 border-transparent transition-all hover:shadow-xl hover:shadow-slate-200/20", bgClass)}>
            <div className="flex items-center justify-between mb-4">
                <h4 className={cn("font-black text-sm uppercase tracking-widest", color === "emerald" ? "text-emerald-900" : color === "blue" ? "text-blue-900" : "text-amber-900")}>{label}</h4>
                <div className="text-right">
                    <span className="block text-2xl font-black text-slate-900 leading-none">{value}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Input mg/kg</span>
                </div>
            </div>
            
            <div className="w-full bg-slate-200/50 rounded-full h-8 p-1.5 relative overflow-hidden ring-1 ring-slate-200/50">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className={cn("h-full rounded-full shadow-lg", colorClass)}
                />
                <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-slate-900/20 z-10" 
                    style={{ left: `${(ideal / value) * percentage}%` }} 
                />
            </div>
            
            <div className="flex justify-between mt-3 px-1">
                <p className="text-[10px] font-bold text-slate-400">{subtitle}</p>
                <p className="text-[10px] font-black text-slate-600 uppercase">Target: {ideal}</p>
            </div>
        </div>
    );
}

function StrategyCard({ mineral, status, action, color }: { mineral: string, status: string, action: string, color: "emerald" | "amber" | "rose" }) {
    const badgeColor = color === "emerald" ? "bg-emerald-100 text-emerald-700" : color === "amber" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";

    return (
        <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm relative group overflow-hidden">
            <div className={cn("absolute top-0 left-0 w-1 h-full", color === "emerald" ? "bg-emerald-500" : color === "amber" ? "bg-amber-500" : "bg-rose-500")} />
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mineral}</span>
                <span className={cn("px-2 py-0.5 rounded-lg text-[10px] font-black uppercase", badgeColor)}>{status}</span>
            </div>
            <p className="text-sm font-bold text-slate-700 leading-relaxed">{action}</p>
            
            <div className="mt-4 flex items-center gap-2 text-xs font-black text-emerald-600 cursor-pointer hover:underline">
                View Treatment Options
                <ChevronRight className="w-3.5 h-3.5" />
            </div>
        </div>
    );
}
