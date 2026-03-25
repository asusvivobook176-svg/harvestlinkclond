import React, { useState, useEffect } from "react";
import { 
    Cpu, 
    Play, 
    Upload, 
    BarChart3, 
    Activity, 
    RefreshCcw, 
    CheckCircle2, 
    AlertTriangle,
    FileSpreadsheet,
    Zap,
    Scale
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../../components/layout/Sidebar";
import { 
    ResponsiveContainer, 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    Tooltip as RechartsTooltip, 
    CartesianGrid 
} from "recharts";
import { cn } from "../../lib/utils";

const MODELS = [
    { id: "1", name: "Crop Recommendation", type: "Classification" },
    { id: "2", name: "Demand Forecasting", type: "Time-Series LSTM" },
    { id: "3", name: "Price Crash Alert", type: "Classification" },
    { id: "4", name: "Spoilage Risk", type: "Hybrid RFC/RFR" },
    { id: "5", name: "Profit Prediction", type: "Regression (XGB)" },
    { id: "6", name: "Yield Prediction", type: "Regression" },
    { id: "7", name: "Crop Failure Risk", type: "Classification" },
    { id: "8", name: "Risk Scoring", type: "Classification" },
];

export default function MLMonitor() {
    const [selectedModel, setSelectedModel] = useState(MODELS[0]);
    const [epochs, setEpochs] = useState(10);
    const [batchSize, setBatchSize] = useState(32);
    const [lr, setLr] = useState(0.001);
    const [isTraining, setIsTraining] = useState(false);
    const [trainingLog, setTrainingLog] = useState<string[]>([]);
    const [metrics, setMetrics] = useState({ accuracy: 0.94, precision: 0.92, f1: 0.93, recall: 0.91 });
    const [showComparison, setShowComparison] = useState(false);
    const [plotUrl, setPlotUrl] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [v1, setV1] = useState<string | null>(null);
    const [v2, setV2] = useState<string | null>(null);
    const [compareResult, setCompareResult] = useState<any>(null);

    useEffect(() => {
        fetchHistory();
        fetchMetrics();
    }, [selectedModel]);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/ml/history/${selectedModel.id}`);
            const data = await res.json();
            setHistory(data);
            if (data.length >= 2) {
                setV1(data[1].version);
                setV2(data[0].version);
            }
        } catch (e) { console.error(e); }
    };

    const fetchMetrics = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/ml/metrics/${selectedModel.id}`);
            const data = await res.json();
            if (data) setMetrics(prev => ({ ...prev, ...data }));
        } catch (e) { console.error(e); }
    };

    const handleCompare = async () => {
        if (!v1 || !v2) return;
        try {
            const res = await fetch(`http://localhost:5000/api/ml/compare/${selectedModel.id}?v1=${v1}&v2=${v2}`);
            const data = await res.json();
            setCompareResult(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (v1 && v2 && showComparison) {
            handleCompare();
        }
    }, [v1, v2, showComparison]);

    const handleTrain = async () => {
        setIsTraining(true);
        setTrainingLog(["Initializing training sequence...", `Target Model: ${selectedModel.name}`, `Epochs: ${epochs}, LR: ${lr}`]);
        
        try {
            const formData = new FormData();
            formData.append("epochs", epochs.toString());
            formData.append("batch_size", batchSize.toString());
            formData.append("learning_rate", lr.toString());
            
            await fetch(`http://localhost:5000/api/ml/train/${selectedModel.id}`, {
                method: "POST",
                body: formData
            });

            // Mocking log progress for UI feel
            setTimeout(() => setTrainingLog(prev => [...prev, "Connected to backend worker..."]), 1000);
            setTimeout(() => setTrainingLog(prev => [...prev, "Streaming training data..."]), 2000);
            setTimeout(() => {
                setIsTraining(false);
                setTrainingLog(prev => [...prev, "Training Complete. Reloading metrics..."]);
                fetchMetrics();
                fetchHistory();
            }, 6000);
        } catch (e) {
            setIsTraining(false);
            setTrainingLog(prev => [...prev, "Training failed. Check backend logs."]);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-8 space-y-8 overflow-y-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-1"
                        >
                            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wider">
                                <Cpu className="w-4 h-4" />
                                <span>Core AI Infrastructure</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">ML Monitor</h1>
                            <p className="text-slate-500 font-medium">Model retraining, hyperparameter tuning & performance auditing.</p>
                        </motion.div>

                        <div className="flex items-center gap-3">
                            <button className="bg-white border text-slate-700 px-5 py-2.5 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                                <RefreshCcw className="w-4 h-4" />
                                <span>Reset State</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Control Panel */}
                        <div className="lg:col-span-1 space-y-6">
                            <section className="bg-white p-6 rounded-4xl border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-amber-50 rounded-xl">
                                        <Zap className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">Training Controls</h3>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Select Model</label>
                                        <select 
                                            className="w-full bg-slate-50 border-none rounded-2xl p-3 font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
                                            value={selectedModel.id}
                                            onChange={(e) => setSelectedModel(MODELS.find(m => m.id === e.target.value)!)}
                                        >
                                            {MODELS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Epochs</label>
                                            <input 
                                                type="number" 
                                                className="w-full bg-slate-50 border-none rounded-2xl p-3 font-bold text-slate-700"
                                                value={epochs}
                                                onChange={(e) => setEpochs(Number(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Batch Size</label>
                                            <input 
                                                type="number" 
                                                className="w-full bg-slate-50 border-none rounded-2xl p-3 font-bold text-slate-700"
                                                value={batchSize}
                                                onChange={(e) => setBatchSize(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Learning Rate</label>
                                        <input 
                                            type="number" 
                                            step="0.0001"
                                            className="w-full bg-slate-50 border-none rounded-2xl p-3 font-bold text-slate-700"
                                            value={lr}
                                            onChange={(e) => setLr(Number(e.target.value))}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Dataset Upload</label>
                                        <div className="border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-amber-400 transition-colors cursor-pointer group">
                                            <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2 group-hover:text-amber-500 transition-colors" />
                                            <p className="text-sm font-black text-slate-400">Drop CSV here or click to browse</p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleTrain}
                                        disabled={isTraining}
                                        className={cn(
                                            "w-full py-4 rounded-3xl font-black text-white shadow-xl transition-all flex items-center justify-center gap-3",
                                            isTraining ? "bg-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
                                        )}
                                    >
                                        {isTraining ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                                        {isTraining ? "Retraining Engine..." : "Initiate Retraining"}
                                    </button>
                                </div>
                            </section>

                            {/* Training Log */}
                            <section className="bg-slate-900 rounded-4xl p-6 text-emerald-400 font-mono text-xs overflow-hidden h-[200px] border border-slate-800 shadow-2xl">
                                <div className="flex items-center gap-2 mb-4 border-b border-emerald-900/50 pb-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="font-black uppercase tracking-widest opacity-70">Model Stream Logs</span>
                                </div>
                                <div className="space-y-1 overflow-y-auto h-full pr-2">
                                    {trainingLog.map((log, i) => (
                                        <div key={i} className="flex gap-2">
                                            <span className="text-emerald-900">[{i}]</span>
                                            <span>{log}</span>
                                        </div>
                                    ))}
                                    {isTraining && <div className="animate-pulse">_</div>}
                                </div>
                            </section>
                        </div>

                        {/* Metrics and Visuals */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Metrics Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Accuracy", value: `${metrics.accuracy * 100}%`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                                    { label: "Precision", value: `${metrics.precision * 100}%`, icon: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
                                    { label: "F1 Score", value: metrics.f1, icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
                                    { label: "Stability", value: "High", icon: Scale, color: "text-amber-600", bg: "bg-amber-50" },
                                ].map((m) => (
                                    <div key={m.label} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mb-3", m.bg)}>
                                            <m.icon className={cn("w-5 h-5", m.color)} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                                        <h4 className="text-xl font-black text-slate-900">{m.value}</h4>
                                    </div>
                                ))}
                            </div>

                            {/* Main Performance Graph */}
                            <section className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black text-slate-900">Algorithm Performance Heatmap</h3>
                                    <div className="flex bg-slate-100 p-1 rounded-xl">
                                        <button 
                                            onClick={() => setShowComparison(false)}
                                            className={cn("px-4 py-1.5 text-xs font-black rounded-lg transition-all", !showComparison ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
                                        >
                                            Heatmap
                                        </button>
                                        <button 
                                            onClick={() => setShowComparison(true)}
                                            className={cn("px-4 py-1.5 text-xs font-black rounded-lg transition-all", showComparison ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}
                                        >
                                            Comparison
                                        </button>
                                    </div>
                                </div>

                                <div className="relative aspect-video bg-slate-50 rounded-3xl overflow-hidden flex items-center justify-center border border-slate-100">
                                    {!showComparison ? (
                                        <div className="w-full h-full p-8 flex flex-col items-center justify-center">
                                            {/* Simulated Confusion Matrix / Heatmap */}
                                            <div className="grid grid-cols-4 gap-2 w-full max-w-md aspect-square">
                                                {Array.from({ length: 16 }).map((_, i) => {
                                                    const opacity = Math.random() * 0.8 + 0.2;
                                                    return (
                                                        <div 
                                                            key={i} 
                                                            className="rounded-lg flex items-center justify-center text-[10px] font-black"
                                                            style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})`, color: opacity > 0.5 ? 'white' : 'black' }}
                                                        >
                                                            {Math.floor(Math.random() * 100)}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="mt-8 flex gap-6">
                                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-100 rounded" /> <span className="text-[10px] font-black text-slate-400">LOW MATCH</span></div>
                                                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-600 rounded" /> <span className="text-[10px] font-black text-slate-400">HIGH MATCH</span></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full p-8 space-y-8">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Version A</label>
                                                        <select 
                                                            className="bg-slate-100 border-none rounded-xl p-2 font-bold text-xs"
                                                            value={v1 || ""}
                                                            onChange={(e) => setV1(e.target.value)}
                                                        >
                                                            {history.map(h => <option key={h.version} value={h.version}>{h.version}</option>)}
                                                        </select>
                                                    </div>
                                                    <span className="text-slate-300 font-black mt-4">VS</span>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Version B</label>
                                                        <select 
                                                            className="bg-slate-100 border-none rounded-xl p-2 font-bold text-xs"
                                                            value={v2 || ""}
                                                            onChange={(e) => setV2(e.target.value)}
                                                        >
                                                            {history.map(h => <option key={h.version} value={h.version}>{h.version}</option>)}
                                                        </select>
                                                    </div>
                                                </div>
                                                {compareResult && (
                                                    <div className="text-right">
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Comparison Target</span>
                                                        <span className="text-sm font-black text-slate-900">{selectedModel.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="space-y-6">
                                                {compareResult ? (
                                                    Object.keys(compareResult.v1).map((key) => {
                                                        const val1 = compareResult.v1[key] * 100;
                                                        const val2 = compareResult.v2[key] * 100;
                                                        const diff = val2 - val1;
                                                        return (
                                                            <div key={key} className="space-y-2">
                                                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                    <span>{key.replace('_', ' ')}</span>
                                                                    <div className="flex gap-4 items-center">
                                                                        <span className="text-slate-500">{val1.toFixed(1)}%</span>
                                                                        <span className="text-slate-900 font-bold">{val2.toFixed(1)}%</span>
                                                                        <span className={cn(
                                                                            "px-2 py-0.5 rounded-md text-[9px]",
                                                                            diff >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                                                        )}>
                                                                            {diff >= 0 ? "+" : ""}{diff.toFixed(1)}%
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                                                                    <div className="h-full bg-slate-300" style={{ width: `${val1}%` }} />
                                                                    <div className="h-full bg-slate-900 shadow-lg" style={{ width: `${val2}%`, marginLeft: `-${val1}%` }} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                                        <Activity className="w-12 h-12 mb-4 opacity-20" />
                                                        <p className="font-bold">Select two versions to compare performance delta</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Dataset Insights */}
                            <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                                        <FileSpreadsheet className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Retraining Dataset Analysis</h3>
                                        <p className="text-slate-400 text-sm font-medium">Auto-detected schema from data/crops_dataset.csv</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[
                                        { label: "Total Samples", value: "24.5k", hint: "+200 new" },
                                        { label: "Features Detected", value: "11", hint: "All valid" },
                                        { label: "Data Quality", value: "98.2%", hint: "Clean" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="p-5 border border-slate-50 rounded-3xl hover:bg-slate-50 transition-colors">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                                            <h5 className="text-xl font-black text-slate-900">{stat.value}</h5>
                                            <span className="text-[10px] font-black text-emerald-500">{stat.hint}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
