import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface ROIInputs {
    initialInvestment: number;
    cropYield: number;
    marketPrice: number;
    expenses: number;
}

interface ROIResults {
    revenue: number;
    profit: number;
    roiPercent: number;
    paybackPeriod: number;
    netProfit: number;
}

export const ROICalculator: React.FC = () => {
    const { t } = useTranslation();
    const [inputs, setInputs] = useState<ROIInputs>({
        initialInvestment: 50000,
        cropYield: 500,
        marketPrice: 70,
        expenses: 15000,
    });

    const [roi, setRoi] = useState<ROIResults | null>(null);

    const calculateROI = () => {
        const revenue = inputs.cropYield * inputs.marketPrice;
        const profit = revenue - inputs.expenses;
        const netProfit = profit - inputs.initialInvestment;
        const roiPercent = (netProfit / inputs.initialInvestment) * 100;
        const paybackPeriod = inputs.initialInvestment / (profit > 0 ? profit : 1);

        setRoi({
            revenue,
            profit,
            roiPercent,
            paybackPeriod,
            netProfit
        });
    };

    useEffect(() => {
        calculateROI();
    }, [inputs]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-linear-to-br from-gray-900 via-emerald-950 to-green-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-emerald-500/20"
        >
            <div className="p-8">
                <h2 className="text-2xl font-black mb-2 flex items-center gap-2">
                    <span className="text-emerald-400">💰</span> {t('roi.title', 'Agricultural ROI Calculator')}
                </h2>
                <p className="text-emerald-300/60 text-sm mb-8">{t('roi.subtitle', 'Calculate your expected returns and plan your investments with precision.')}</p>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Inputs Section */}
                    <div className="space-y-5">
                        {[
                            { id: 'initialInvestment', label: 'Initial Investment (₹)', min: 0 },
                            { id: 'cropYield', label: 'Expected Yield (kg)', min: 0 },
                            { id: 'marketPrice', label: 'Market Price (₹/kg)', min: 0 },
                            { id: 'expenses', label: 'Input Expenses (Seeds, Fert, etc.) (₹)', min: 0 },
                        ].map((input) => (
                            <div key={input.id}>
                                <label className="block text-xs font-black uppercase tracking-wider text-emerald-400/80 mb-2">
                                    {input.label}
                                </label>
                                <input
                                    type="number"
                                    value={inputs[input.id as keyof ROIInputs]}
                                    onChange={(e) => setInputs({ ...inputs, [input.id]: Number(e.target.value) })}
                                    className="w-full px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-hidden transition-all"
                                    placeholder="0"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Results Section */}
                    <div className="flex flex-col justify-center">
                        {roi && (
                            <div className="grid grid-cols-1 gap-4">
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/5"
                                >
                                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400/60">Estimated Revenue</p>
                                    <p className="text-4xl font-black text-white">₹{roi.revenue.toLocaleString()}</p>
                                </motion.div>

                                <div className="grid grid-cols-2 gap-4">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                        className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/5"
                                    >
                                        <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400/60">Net Profit</p>
                                        <p className={`text-xl font-black ${roi.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            ₹{roi.netProfit.toLocaleString()}
                                        </p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/5"
                                    >
                                        <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400/60">ROI %</p>
                                        <p className={`text-xl font-black ${roi.roiPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {roi.roiPercent.toFixed(1)}%
                                        </p>
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-emerald-500/10 rounded-2xl p-6 border border-emerald-500/20 mt-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400/80 mb-1">Payback Period</p>
                                            <p className="text-2xl font-black text-white">{roi.paybackPeriod.toFixed(1)} <span className="text-sm font-medium opacity-60 uppercase">Harvests</span></p>
                                        </div>
                                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-2xl">
                                            ⏳
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
