import React from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Maximize2 } from 'lucide-react';

const data = [
    { month: 'Sep', price: 45, avg: 40 },
    { month: 'Oct', price: 52, avg: 42 },
    { month: 'Nov', price: 48, avg: 45 },
    { month: 'Dec', price: 65, avg: 48 },
    { month: 'Jan', price: 72, avg: 50 },
    { month: 'Feb', price: 68, avg: 52 },
];

export const MarketPriceHistory: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-emerald-600" /> Market Price Laboratory
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Advanced price trends, forecasting, and historical benchmarks.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 hover:bg-white transition-all shadow-sm">
                            6 Months
                        </button>
                        <button className="px-4 py-2 border border-emerald-500 bg-emerald-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-emerald-600 shadow-sm">
                            1 Year
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
                    <div className="lg:col-span-3 h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                        fontSize: '10px',
                                        fontWeight: 900,
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                                <Line type="monotone" dataKey="avg" stroke="#94a3b8" strokeDasharray="5 5" dot={false} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4">
                        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <p className="text-[10px] uppercase font-black tracking-widest text-emerald-600/60 mb-2">Price Velocity</p>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="text-emerald-600" size={24} />
                                <p className="text-2xl font-black text-emerald-900">+12.4%</p>
                            </div>
                            <p className="text-[10px] font-bold text-emerald-700/60 mt-2 uppercase tracking-tight">Predicted Bullish Trend</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-100">
                            <p className="text-[10px] uppercase font-black tracking-widest text-rose-600/60 mb-2">Volatility Index</p>
                            <div className="flex items-center gap-2">
                                <TrendingDown className="text-rose-600" size={24} />
                                <p className="text-2xl font-black text-rose-900">-4.2%</p>
                            </div>
                            <p className="text-[10px] font-bold text-rose-700/60 mt-2 uppercase tracking-tight">Lower Risk Predicted</p>
                        </div>
                    </div>
                </div>

                {/* Forecast Table */}
                <div className="border-t border-gray-100 pt-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 uppercase tracking-widest">
                            <Maximize2 className="w-4 h-4 text-emerald-600" /> AI Forecast (Next 3 Months)
                        </h3>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">94% Confidence</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { month: 'Mar', price: '₹75-80', trend: 'up' },
                            { month: 'Apr', price: '₹82-88', trend: 'up' },
                            { month: 'May', price: '₹70-75', trend: 'down' },
                        ].map((f, i) => (
                            <div key={i} className="p-4 rounded-xl border border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{f.month}</p>
                                    <p className="text-sm font-black text-gray-900">{f.price}</p>
                                </div>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${f.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                                    {f.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
