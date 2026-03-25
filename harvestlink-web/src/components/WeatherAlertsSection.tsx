import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    CloudRain, 
    Wind, 
    AlertTriangle, 
    Calendar, 
    ShieldCheck, 
    Settings, 
    Droplets,
    CloudSun,
    CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

interface WeatherAlert {
    title: string;
    message: string;
    severity: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
    icon: React.ReactNode;
    actions: string[];
    costSavings?: number;
}

interface WeatherAlertsSectionProps {
    farmLocation?: { lat: number; lng: number; district: string };
}

export const WeatherAlertsSection: React.FC<WeatherAlertsSectionProps> = ({ farmLocation }) => {
    const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

    const MOCK_ALERTS: WeatherAlert[] = [
        {
            title: "Heavy Rainfall Expected",
            message: "IMD predicts heavy rain (>50mm) within the next 24 hours in " + (farmLocation?.district || "your area") + ".",
            severity: 'RED',
            icon: <CloudRain className="w-6 h-6" />,
            actions: ["Stop all irrigation immediately", "Ensure drainage channels are clear", "Move harvested produce to dry storage"],
            costSavings: 4500
        },
        {
            title: "High Humidity - Fungal Risk",
            message: "Sustained humidity above 85% significantly increases risk of Early Blight in Tomato crops.",
            severity: 'ORANGE',
            icon: <AlertTriangle className="w-6 h-6" />,
            actions: ["Apply preventive organic fungicides", "Avoid overhead irrigation", "Check lower leaves for spots"],
            costSavings: 2800
        }
    ];

    useEffect(() => {
        // Simulate API fetch from IMD
        const timer = setTimeout(() => {
            setAlerts(MOCK_ALERTS);
        }, 1500);
        return () => clearTimeout(timer);
    }, [farmLocation?.district]);

    const getSeverityStyles = (severity: string) => {
        switch (severity) {
            case 'RED': return 'bg-rose-50 border-rose-200 text-rose-700';
            case 'ORANGE': return 'bg-orange-50 border-orange-200 text-orange-700';
            case 'YELLOW': return 'bg-amber-50 border-amber-200 text-amber-700';
            default: return 'bg-emerald-50 border-emerald-200 text-emerald-700';
        }
    };

    const getSeverityBadge = (severity: string) => {
        switch (severity) {
            case 'RED': return 'bg-rose-600 text-white shadow-rose-200';
            case 'ORANGE': return 'bg-orange-500 text-white shadow-orange-200';
            case 'YELLOW': return 'bg-amber-400 text-white shadow-amber-200';
            default: return 'bg-emerald-500 text-white shadow-emerald-200';
        }
    };

    const getDayName = (daysAhead: number) => {
        const date = new Date();
        date.setDate(date.getDate() + daysAhead);
        return daysAhead === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <CloudSun className="text-emerald-500" /> Real-Time Weather Intelligence
                    </h2>
                    <p className="text-sm text-slate-400 font-medium">Verified by India Meteorological Department (IMD)</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Updates</span>
                </div>
            </div>

            {/* Active Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {alerts.map((alert, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "p-6 rounded-2xl border-l-4 shadow-sm relative overflow-hidden group",
                                getSeverityStyles(alert.severity)
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-xl shadow-lg", getSeverityBadge(alert.severity))}>
                                        {alert.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight">{alert.title}</h3>
                                        <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 inline-block", getSeverityBadge(alert.severity))}>
                                            {alert.severity} ALERT
                                        </span>
                                    </div>
                                </div>
                                {alert.costSavings && (
                                    <div className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full border border-current/10 font-bold text-xs">
                                        💰 Saves ₹{alert.costSavings}
                                    </div>
                                )}
                            </div>

                            <p className="text-sm border-b border-current/10 pb-4 mb-4 opacity-90">{alert.message}</p>

                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                                    <ShieldCheck size={12} /> Recommended Actions
                                </p>
                                <ul className="grid grid-cols-1 gap-1.5">
                                    {alert.actions.map((action, aIdx) => (
                                        <li key={aIdx} className="text-xs flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-current opacity-50 shrink-0" />
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 7-Day Forecast */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <Calendar size={18} className="text-blue-500" /> 7-Day Detailed Forecast
                        </h3>
                        <button className="text-[10px] font-black uppercase text-blue-600 hover:underline">View Historical Details</button>
                    </div>

                    <div className="grid grid-cols-7 gap-2 overflow-x-auto pb-2">
                        {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className={cn(
                                "min-w-[80px] p-4 rounded-xl text-center transition-all hover:scale-105 cursor-pointer",
                                i === 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 border border-slate-100 hover:bg-slate-100"
                            )}>
                                <p className={cn("text-[10px] font-bold uppercase mb-2", i === 0 ? "text-blue-100" : "text-slate-400")}>
                                    {getDayName(i)}
                                </p>
                                <div className="text-2xl mb-2">{['☀️', '🌤️', '🌧️', '🌧️', '☁️', '☀️', '☀️'][i]}</div>
                                <div className="flex flex-col gap-0.5">
                                    <span className={cn("text-lg font-black", i === 0 ? "text-white" : "text-slate-800")}>{28 + (i % 3)}°</span>
                                    <span className={cn("text-[10px] font-bold", i === 0 ? "text-blue-200" : "text-slate-400")}>{(i * 10) + 10}% Rain</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <Wind className="text-blue-400" size={16} />
                                <span className="text-xs font-bold text-slate-600">Wind: 12 km/h (Optimal for Spraying)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Droplets className="text-emerald-400" size={16} />
                                <span className="text-xs font-bold text-slate-600">Humidity: 65%</span>
                            </div>
                        </div>
                        <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                    </div>
                </div>

                {/* Disease Risk & Impact */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <Bug className="text-rose-500 w-[18px] h-[18px]" /> Disease Risk Assessment
                        </h3>
                        <div className="space-y-5 flex-1">
                            {[
                                { name: 'Early Blight', level: 'High', color: 'bg-rose-500', pct: 85 },
                                { name: 'Powdery Mildew', level: 'Medium', color: 'bg-orange-400', pct: 55 },
                                { name: 'Fruit Borer', level: 'Low', color: 'bg-emerald-500', pct: 20 }
                            ].map((risk, i) => (
                                <div key={i} className="space-y-1.5">
                                    <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-slate-700">{risk.name}</span>
                                        <span className={risk.level === 'High' ? 'text-rose-600' : risk.level === 'Medium' ? 'text-orange-500' : 'text-emerald-600'}>
                                            {risk.level} Risk
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${risk.pct}%` }}
                                            className={cn("h-full rounded-full", risk.color)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-50">
                            <p className="text-[10px] text-slate-400 italic">Historical data + current humidity suggests peak fungal risk.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Weather Impact on Crops */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            🌾 Crop Impact Analysis
                        </h3>
                        <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase">Growth Phase</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">🍅</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">Tomato (Main Crop)</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[95%]" />
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600">OPTIMAL</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Current high temperature and moderate humidity are <strong className="text-emerald-600">perfect</strong> for flowering. No irrigation adjustment needed for the next 48h.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            🌾 Crop Impact Analysis
                        </h3>
                        <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full uppercase">Harvesting Phase</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">🧅</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">Onion (Secondary)</h4>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-500 w-[45%]" />
                                </div>
                                <span className="text-[10px] font-bold text-amber-600">CAUTION</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Heavy rain alert! Harvest onions <strong className="text-amber-600">speedily</strong> today to avoid bulb rot and waterlogging damage.
                    </p>
                </div>
            </div>

            {/* Alert Preferences */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Settings size={20} className="text-emerald-400" /> Weather Alert Preferences
                    </h3>
                    <p className="text-slate-400 text-xs">Don't miss critical alerts. Choose how we notify you.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    {[
                        { label: 'SMS', default: true },
                        { label: 'Push', default: true },
                        { label: 'WhatsApp', default: false },
                        { label: 'Email', default: false }
                    ].map(pref => (
                        <label key={pref.label} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" defaultChecked={pref.default} className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20" />
                            <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{pref.label}</span>
                        </label>
                    ))}
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95">
                    Save Preferences
                </button>
            </div>
        </section>
    );
};

// Re-using the Bug icon from MetricCard if possible, otherwise import from lucide-react
function Bug(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m8 2 1.88 1.88" />
            <path d="M14.12 3.88 16 2" />
            <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
            <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
            <path d="M12 20v-9" />
            <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
            <path d="M6 13H2" />
            <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
            <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
            <path d="M22 13h-4" />
            <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
        </svg>
    )
}
