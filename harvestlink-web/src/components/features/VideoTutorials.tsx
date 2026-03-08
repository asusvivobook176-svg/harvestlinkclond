import React from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Clock, Star } from 'lucide-react';

interface Video {
    id: number;
    title: string;
    provider: string;
    duration: string;
    rating: number;
    thumbnail: string;
    category: string;
}

const tutorials: Video[] = [
    {
        id: 1,
        title: 'Modern Drip Irrigation Setup',
        provider: 'AgriTech India',
        duration: '12:45',
        rating: 4.8,
        thumbnail: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=800&auto=format&fit=crop',
        category: 'Technique'
    },
    {
        id: 2,
        title: 'Organic Fertilizer Production',
        provider: 'Sustainable Farms',
        duration: '08:20',
        rating: 4.9,
        thumbnail: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?q=80&w=800&auto=format&fit=crop',
        category: 'Soil Health'
    },
    {
        id: 3,
        title: 'Pest Identification Guide',
        provider: 'Krishi Vigyan',
        duration: '15:10',
        rating: 4.7,
        thumbnail: 'https://images.unsplash.com/photo-1591901193306-69677271836c?q=80&w=800&auto=format&fit=crop',
        category: 'Protection'
    },
    {
        id: 4,
        title: 'Smart Greenhouse Management',
        provider: 'Digital Farmer',
        duration: '10:30',
        rating: 4.6,
        thumbnail: 'https://images.unsplash.com/photo-1585314062604-1a357de8fb9a?q=80&w=800&auto=format&fit=crop',
        category: 'Innovation'
    },
];

export const VideoTutorials: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                    <Play className="w-6 h-6 text-emerald-600" /> Professional Training
                </h2>
                <p className="text-gray-500 text-sm mb-8">Master advanced farming techniques with our curated video library.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tutorials.map(video => (
                        <motion.div
                            key={video.id}
                            whileHover={{ scale: 1.02 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-3">
                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-white/90 shadow-xl flex items-center justify-center text-emerald-600 scale-90 group-hover:scale-100 transition-transform">
                                        <Play fill="currentColor" size={20} />
                                    </div>
                                </div>
                                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2 py-1 rounded-lg flex items-center gap-1">
                                    <Clock size={10} /> {video.duration}
                                </div>
                                <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                                    {video.category}
                                </div>
                            </div>

                            <h3 className="font-black text-gray-900 text-sm leading-tight group-hover:text-emerald-600 transition-colors mb-1 line-clamp-1">
                                {video.title}
                            </h3>
                            <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                                <span className="flex items-center gap-1"><BookOpen size={12} /> {video.provider}</span>
                                <span className="flex items-center gap-0.5 text-amber-500"><Star size={12} fill="currentColor" /> {video.rating}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="w-full mt-8 py-4 rounded-xl border-2 border-dashed border-gray-100 text-gray-400 font-black text-sm hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all">
                    Browse Library (240+ More Videos)
                </button>
            </div>
        </div>
    );
};
