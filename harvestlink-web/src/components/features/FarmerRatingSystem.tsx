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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                    <Star className="w-6 h-6 text-amber-500" /> Community Trust & Ratings
                </h2>
                <p className="text-gray-500 text-sm mb-8">Recognizing high-quality producers and reliable community members.</p>

                <div className="space-y-4">
                    {ranks.map((farmer, idx) => (
                        <motion.div
                            key={farmer.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group p-5 rounded-2xl border border-gray-100 bg-gray-50/20 hover:bg-white hover:shadow-lg transition-all flex flex-wrap items-center justify-between gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black ${farmer.status === 'Gold' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {farmer.name[0]}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-black text-gray-900 text-sm">{farmer.name}</h3>
                                        {farmer.status === 'Gold' && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                                    </div>
                                    <div className="flex items-center gap-1 mt-1">
                                        <div className="flex text-amber-400">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={10} fill={s <= Math.floor(farmer.rating) ? "currentColor" : "none"} strokeWidth={3} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-400 ml-1">{farmer.rating} ({farmer.reviews} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Impact Area</p>
                                    <p className="font-bold text-gray-900 text-xs">{farmer.impactArea}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${farmer.status === 'Gold' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                                    }`}>
                                    <Award size={14} /> {farmer.status} Badge
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-8 bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-gray-900">Your Standing</p>
                            <p className="text-xs font-medium text-emerald-700">Top 15% in Salem Cluster</p>
                        </div>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800 transition-colors">
                        View My Profile →
                    </button>
                </div>
            </div>
        </div>
    );
};
