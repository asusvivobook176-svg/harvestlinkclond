import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Power, Timer, Zap, Leaf } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface IrrigationSchedule {
    day: string;
    waterRequired: number;
    time: string;
    durationMins: number;
}

export const IrrigationController: React.FC = () => {
    const { t } = useTranslation();
    const [isAutomatic, setIsAutomatic] = useState(true);
    const [irrigationSchedule] = useState<IrrigationSchedule[]>([
        { day: 'Monday', waterRequired: 25, time: '06:00 AM', durationMins: 30 },
        { day: 'Wednesday', waterRequired: 25, time: '06:00 AM', durationMins: 30 },
        { day: 'Friday', waterRequired: 25, time: '06:00 AM', durationMins: 30 },
    ]);

    return (
        <div className="bg-linear-to-br from-cyan-600 via-blue-700 to-indigo-800 text-white rounded-2xl shadow-xl overflow-hidden border border-white/10">
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black flex items-center gap-2">
                            <Droplets className="w-6 h-6 text-cyan-300" /> {t('irrigation.title', 'Smart Irrigation System')}
                        </h2>
                        <p className="text-cyan-100/60 text-sm mt-1">{t('irrigation.subtitle', 'AI-driven precision water management and automation.')}</p>
                    </div>
                    <button
                        onClick={() => setIsAutomatic(!isAutomatic)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all shadow-lg ${isAutomatic
                                ? 'bg-white text-cyan-700'
                                : 'bg-white/10 text-white border border-white/20'
                            }`}
                    >
                        {isAutomatic ? <Zap size={14} fill="currentColor" /> : <Power size={14} />}
                        {isAutomatic ? 'AUTOMATIC MODE' : 'MANUAL CONTROL'}
                    </button>
                </div>

                {/* Real-time Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-3">Soil Moisture</p>
                        <div className="flex items-end justify-between mb-2">
                            <p className="text-3xl font-black">65%</p>
                            <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">Optimal</p>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '65%' }}
                                className="h-full bg-cyan-400"
                            />
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-2">Cycle Status</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                                <Timer size={20} />
                            </div>
                            <div>
                                <p className="text-lg font-black leading-tight">Cycle Done</p>
                                <p className="text-[10px] font-medium text-cyan-200">Today, 06:30 AM</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/5 flex flex-col justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-200 mb-2">Next Watering</p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                                <Timer size={20} />
                            </div>
                            <div>
                                <p className="text-lg font-black leading-tight">Tomorrow</p>
                                <p className="text-[10px] font-medium text-cyan-200">06:00 AM (250L)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Schedule */}
                <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-white/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-cyan-200 mb-6 flex items-center gap-2">
                        <Timer className="w-4 h-4" /> Operational Schedule
                    </h3>
                    <div className="space-y-3">
                        {irrigationSchedule.map((sched, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ x: 5 }}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                    <div>
                                        <p className="font-black text-sm">{sched.day}</p>
                                        <p className="text-[10px] font-medium text-cyan-200 uppercase tracking-wider">
                                            {sched.time} · {sched.durationMins} Mins
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-cyan-300">{sched.waterRequired}L</p>
                                    <p className="text-[10px] font-black text-cyan-200/50 uppercase">Per cycle</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Conservation Stats */}
                <div className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg">
                            <Leaf size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">Conservation Impact</p>
                            <p className="text-2xl font-black text-white">2,450L <span className="text-xs font-medium opacity-60 uppercase">Saved This Month</span></p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-emerald-400 font-black text-2xl">+35%</p>
                        <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Efficiency</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
