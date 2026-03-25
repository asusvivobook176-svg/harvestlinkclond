import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Award, TrendingUp } from 'lucide-react';

interface FarmerRank {
    name: string;
    rating: number;
    reviews: number;
    status: 'Gold' | 'Silver' | 'Bronze';
    impactArea: string;
    joined: string;
}

const ranks: FarmerRank[] = [
    { name: 'Arun Vijay', rating: 4.9, reviews: 156, status: 'Gold', impactArea: 'Salem', joined: '2023' },
    { name: 'Meena K.', rating: 4.8, reviews: 92, status: 'Gold', impactArea: 'Erode', joined: '2024' },
    { name: 'John Doe', rating: 4.7, reviews: 45, status: 'Silver', impactArea: 'Madurai', joined: '2024' },
];

export const FarmerRatingSystem: React.FC = () => {
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden border border-white/50">
            <div className="p-6">
                <h2 className="text-lg font-black text-gray-900 mb-1 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Community Trust
                </h2>
                <p className="text-gray-400 text-xs mb-6 font-medium">Top performing members this month</p>

                <div className="space-y-4">
                    {ranks.map((farmer, idx) => (
                        <motion.div
                            key={farmer.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-3 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-white hover:shadow-md transition-all flex flex-wrap items-center justify-between gap-2"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${farmer.status === 'Gold' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {farmer.name[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-black text-gray-900 text-xs">{farmer.name}</h3>
                                        {farmer.status === 'Gold' && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                                    </div>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={8} fill={s <= Math.floor(farmer.rating) ? "currentColor" : "none"} strokeWidth={3} />
                                            ))}
                                        </div>
                                        <span className="text-[8px] font-bold text-gray-400 ml-1">{farmer.rating}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider flex items-center gap-1 ${farmer.status === 'Gold' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-50 text-slate-700 border border-slate-100'
                                    }`}>
                                    <Award size={10} /> {farmer.status[0]}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-4 bg-emerald-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg shadow-emerald-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <TrendingUp size={16} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-tighter opacity-80 leading-none mb-1">Your Standing</p>
                            <p className="text-xs font-black">Top 15%</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
