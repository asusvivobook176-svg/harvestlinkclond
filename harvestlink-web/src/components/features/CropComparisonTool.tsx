import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Crop {
    name: string;
    avgYield: number;
    avgProfit: number;
    waterRequired: number;
    season: string;
    riskLevel: 'Low' | 'Medium' | 'High';
}

const allCrops: Crop[] = [
    {
        name: 'Tomato',
        avgYield: 450,
        avgProfit: 35000,
        waterRequired: 500,
        season: 'Summer',
        riskLevel: 'Medium'
    },
    {
        name: 'Beans',
        avgYield: 600,
        avgProfit: 42000,
        waterRequired: 400,
        season: 'Kharif',
        riskLevel: 'Low'
    },
    {
        name: 'Onion',
        avgYield: 400,
        avgProfit: 50000,
        waterRequired: 600,
        season: 'Rabi',
        riskLevel: 'High'
    },
    {
        name: 'Rice',
        avgYield: 550,
        avgProfit: 28000,
        waterRequired: 1200,
        season: 'Kharif',
        riskLevel: 'Medium'
    },
];

export const CropComparisonTool: React.FC = () => {
    const [selectedCrops, setSelectedCrops] = useState<Crop[]>([]);

    const handleCropSelection = (crop: Crop) => {
        setSelectedCrops(prev => {
            if (prev.find(c => c.name === crop.name)) {
                return prev.filter(c => c.name !== crop.name);
            }
            return [...prev, crop];
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-emerald-600">🔍</span> Compare Strategic Crops
                </h2>
                <p className="text-gray-500 text-sm mb-6">Compare yields, profits, and risk levels to make informed planting decisions.</p>

                {/* Crop Selection */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {allCrops.map((crop) => (
                        <motion.button
                            key={crop.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCropSelection(crop)}
                            className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${selectedCrops.find(c => c.name === crop.name)
                                    ? 'border-emerald-600 bg-emerald-50'
                                    : 'border-gray-100 bg-white hover:border-emerald-200'
                                }`}
                        >
                            {selectedCrops.find(c => c.name === crop.name) && (
                                <div className="absolute top-0 right-0 p-1 bg-emerald-600 text-white rounded-bl-lg">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            )}
                            <p className="font-black text-gray-900">{crop.name}</p>
                            <p className="text-xs text-gray-500 font-medium">₹{crop.avgProfit.toLocaleString()} / acre</p>
                        </motion.button>
                    ))}
                </div>

                {/* Comparison Table */}
                {selectedCrops.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="overflow-hidden rounded-xl border border-gray-100 shadow-sm"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-900 text-left">
                                        <th className="px-6 py-4 font-black uppercase tracking-wider text-[10px]">Strategic Metric</th>
                                        {selectedCrops.map(crop => (
                                            <th key={crop.name} className="px-6 py-4 font-black text-center min-w-[120px] bg-emerald-50/30">
                                                {crop.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { key: 'avgYield', label: 'Avg Yield (kg/acre)', color: 'text-emerald-600' },
                                        { key: 'avgProfit', label: 'Avg Profit (₹/acre)', color: 'text-emerald-700', format: (v: number) => `₹${v.toLocaleString()}` },
                                        { key: 'waterRequired', label: 'Water (mm)', color: 'text-blue-600' },
                                        { key: 'riskLevel', label: 'Risk Level', color: (v: string) => v === 'High' ? 'text-red-500' : v === 'Medium' ? 'text-amber-500' : 'text-emerald-500' }
                                    ].map(metric => (
                                        <tr key={metric.label} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-500 bg-gray-50/30">{metric.label}</td>
                                            {selectedCrops.map(crop => (
                                                <td key={crop.name} className={`px-6 py-4 text-center font-black ${typeof metric.color === 'function' ? metric.color(crop[metric.key as keyof Crop] as string) : metric.color}`}>
                                                    {metric.format ? metric.format(crop[metric.key as keyof Crop] as number) : crop[metric.key as keyof Crop]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <div className="py-12 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400">
                        <span className="text-4xl mb-2">📊</span>
                        <p className="font-medium">Select crops above to see comparison</p>
                    </div>
                )}
            </div>
        </div>
    );
};
