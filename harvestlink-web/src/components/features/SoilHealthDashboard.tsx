import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Beaker, Sprout, AlertCircle } from 'lucide-react';

interface SoilData {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    organicMatter: number;
}

export const SoilHealthDashboard: React.FC = () => {
    const [soilData] = useState<SoilData>({
        nitrogen: 65,
        phosphorus: 45,
        potassium: 70,
        ph: 6.8,
        organicMatter: 2.5,
    });

    const recommendations = [
        { nutrient: 'Nitrogen', status: soilData.nitrogen < 75 ? 'Low' : 'Optimal', action: soilData.nitrogen < 75 ? 'Apply 20kg/acre urea' : 'Maintain current levels' },
        { nutrient: 'Phosphorus', status: soilData.phosphorus < 60 ? 'Low' : 'Optimal', action: soilData.phosphorus < 60 ? 'Increase DAP intake by 15%' : 'Optimal levels detected' },
        { nutrient: 'Potassium', status: soilData.potassium < 80 ? 'Low' : 'Optimal', action: soilData.potassium < 80 ? 'Add potash during next cycle' : 'No action required' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                    <Beaker className="w-6 h-6 text-emerald-600" /> Soil Health Analytics
                </h2>
                <p className="text-gray-500 text-sm mb-8">Real-time nutrient analysis and scientific soil management.</p>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Nitrogen (N)', value: soilData.nitrogen, unit: 'mg/kg', ideal: 75, color: 'emerald' },
                        { label: 'Phosphorus (P)', value: soilData.phosphorus, unit: 'mg/kg', ideal: 60, color: 'blue' },
                        { label: 'Potassium (K)', value: soilData.potassium, unit: 'mg/kg', ideal: 80, color: 'amber' },
                    ].map((nutrient, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -5 }}
                            className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100"
                        >
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3">{nutrient.label}</p>
                            <div className="flex items-baseline gap-1 mb-4">
                                <p className="text-3xl font-black text-gray-900">{nutrient.value}</p>
                                <p className="text-xs font-bold text-gray-400">{nutrient.unit}</p>
                            </div>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(nutrient.value / nutrient.ideal) * 100}%` }}
                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                    className={`h-full rounded-full ${nutrient.value >= nutrient.ideal
                                            ? 'bg-emerald-500'
                                            : nutrient.value >= nutrient.ideal * 0.7
                                                ? 'bg-amber-500'
                                                : 'bg-rose-500'
                                        }`}
                                />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                Target: {nutrient.ideal} {nutrient.unit}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    <div className="bg-linear-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                                <Activity size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600/60">Soil pH Level</p>
                                <p className="text-2xl font-black text-emerald-900">{soilData.ph}</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase text-emerald-600 tracking-wider">Neutral</span>
                    </div>

                    <div className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                                <Sprout size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-blue-600/60">Organic Matter</p>
                                <p className="text-2xl font-black text-blue-900">{soilData.organicMatter}%</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-white rounded-full text-[10px] font-black uppercase text-blue-600 tracking-wider">Good</span>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-sm font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-widest">
                        <AlertCircle className="w-4 h-4 text-emerald-600" /> Treatment Plan
                    </h3>
                    <div className="space-y-4">
                        {recommendations.map((rec, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100"
                            >
                                <div className={`w-2 h-2 rounded-full ${rec.status === 'Optimal' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 animate-pulse'}`} />
                                <div className="flex-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{rec.nutrient}</span>
                                    <p className="text-xs font-bold text-gray-900">{rec.action}</p>
                                </div>
                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${rec.status === 'Optimal' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                                    {rec.status}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
