import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    ComposedChart,
    Scatter,
} from 'recharts';

interface MetricCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    icon?: React.ReactNode;
    isDark?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, trend, icon, isDark }) => (
    <div className={`${isDark ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-900' : 'bg-white border-slate-100'} p-6 rounded-2xl shadow-sm border flex flex-col justify-between hover:shadow-md transition-all duration-300`}>
        <div className="flex justify-between items-start">
            <div>
                <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'} mb-1`}>{title}</p>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
                {subtitle && <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'} mt-1 uppercase tracking-tight`}>{subtitle}</p>}
            </div>
            {icon && (
                <div className={`p-2 rounded-lg ${isDark ? 'bg-slate-800/50 text-emerald-500' : 'bg-slate-50 text-primary'}`}>
                    {icon}
                </div>
            )}
        </div>
        {trend && (
            <div className={`mt-4 flex items-center text-sm ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                <span className="font-bold">{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
                <span className={`ml-1 font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>vs last month</span>
            </div>
        )}
    </div>
);

interface ChartProps {
    data: any[];
    xKey: string;
    yKey: string;
    title: string;
    color?: string;
    isDark?: boolean;
}

export const TrendLineChart: React.FC<ChartProps> = ({ data, xKey, yKey, title, color = "#10b981", isDark }) => (
    <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'} p-6 rounded-2xl shadow-sm border h-[300px]`}>
        <h4 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-700'} mb-4`}>{title}</h4>
        <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis
                    dataKey={xKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#fff',
                        borderRadius: '12px',
                        border: isDark ? '1px solid #1e293b' : 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        color: isDark ? '#f1f5f9' : '#1e293b'
                    }}
                    itemStyle={{ color: isDark ? '#f1f5f9' : '#1e293b' }}
                />
                <Line
                    type="monotone"
                    dataKey={yKey}
                    stroke={color}
                    strokeWidth={3}
                    dot={{ r: 4, fill: color, strokeWidth: 2, stroke: isDark ? '#0f172a' : '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export const ComparisonBarChart: React.FC<Omit<ChartProps, 'yKey'> & { yKey1?: string, yKey2?: string }> = ({ data, xKey, yKey1, yKey2, title, color = "#10b981", isDark }) => (
    <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'} p-6 rounded-2xl shadow-sm border h-[300px]`}>
        <h4 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-700'} mb-4`}>{title}</h4>
        <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1e293b" : "#f1f5f9"} />
                <XAxis
                    dataKey={xKey}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                    dy={10}
                />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10 }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: isDark ? '#0f172a' : '#fff',
                        borderRadius: '12px',
                        border: isDark ? '1px solid #1e293b' : 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        color: isDark ? '#f1f5f9' : '#1e293b'
                    }}
                    cursor={{ fill: isDark ? '#1e293b' : '#f8fafc', opacity: 0.4 }}
                />
                <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '0px', paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}
                />
                {yKey1 && <Bar dataKey={yKey1} fill={color} radius={[4, 4, 0, 0]} barSize={20} />}
                {yKey2 && <Bar dataKey={yKey2} fill={isDark ? "#334155" : "#94a3b8"} radius={[4, 4, 0, 0]} barSize={20} />}
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const ActivityHeatmap: React.FC<{ data: any[], title: string, isDark?: boolean }> = ({ title, data, isDark }) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return (
        <div className={`${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'} p-6 rounded-2xl shadow-sm border`}>
            <h4 className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-700'} mb-4`}>{title}</h4>
            <div className={`flex gap-2 text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'} mb-2`}>
                {days.map((day, i) => <div key={i} className="w-4 text-center">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 28 }).map((_, i) => {
                    const activity = data?.[i]?.count || Math.floor(Math.random() * 5);
                    const levels = isDark ? [
                        'bg-slate-800',
                        'bg-emerald-900/40',
                        'bg-emerald-900/70',
                        'bg-emerald-600',
                        'bg-emerald-400'
                    ] : [
                        'bg-slate-50',
                        'bg-emerald-100',
                        'bg-emerald-300',
                        'bg-emerald-500',
                        'bg-emerald-700'
                    ];
                    return (
                        <div
                            key={i}
                            className={`h-4 w-4 rounded-sm ${levels[activity % 5]} transition-all hover:scale-110 cursor-pointer shadow-xs`}
                            title={`Activity level: ${activity}`}
                        />
                    );
                })}
            </div>
            <div className={`mt-4 flex justify-between items-center text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                <span>Frequency</span>
                <div className="flex gap-1 items-center">
                    <span>Low</span>
                    <div className="flex gap-1">
                        <div className={`w-2 h-2 rounded-xs ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`} />
                        <div className={`w-2 h-2 rounded-xs ${isDark ? 'bg-emerald-400' : 'bg-emerald-700'}`} />
                    </div>
                    <span>High</span>
                </div>
            </div>
        </div>
    );
};

export const ProgressCircle: React.FC<{ value: number, label: string, size?: number, strokeWidth?: number, color?: string, isDark?: boolean }> = ({ value, label, size = 120, strokeWidth = 10, color = "#10b981", isDark }) => {
    const data = [
        { name: 'Completed', value: value },
        { name: 'Remaining', value: Math.max(0, 100 - value) },
    ];
    return (
        <div className={`relative flex items-center justify-center`} style={{ width: size, height: size }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        innerRadius={(size / 2) - strokeWidth}
                        outerRadius={size / 2}
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={450}
                        stroke="none"
                    >
                        <Cell key="cell-0" fill={color} />
                        <Cell key="cell-1" fill={isDark ? "#1e293b" : "#f1f5f9"} />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{Math.round(value)}%</span>
                {label && <span className={`text-[8px] font-bold uppercase tracking-tighter ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</span>}
            </div>
        </div>
    );
};

export const PriceComparisonChart: React.FC<{ data: any[], xKey: string, yKey1: string, yKey2: string, title: string }> = ({ data, xKey, yKey1, yKey2, title }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[300px]">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">{title}</h4>
        <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorY1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorY2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey={xKey} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Area type="monotone" dataKey={yKey1} name="Actual" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorY1)" strokeWidth={2} />
                <Area type="monotone" dataKey={yKey2} name="Target" stroke="#ec4899" fillOpacity={1} fill="url(#colorY2)" strokeWidth={2} strokeDasharray="5 5" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

export const YieldComparisonChart: React.FC<{ data: any[], title: string }> = ({ data, title }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[350px]">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">{title}</h4>
        <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="crop_name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                <Bar name="Predicted Yield" dataKey="predicted_yield" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar name="Actual Sold" dataKey="actual_yield" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const CostBenefitChart: React.FC<{ data: any[], title: string }> = ({ data, title }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[350px]">
        <h4 className="text-sm font-semibold text-slate-700 mb-4">{title}</h4>
        <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis dataKey="crop_name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Bar name="Revenue" dataKey="revenue" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={15} />
                <Bar name="Est. Cost" dataKey="estimated_cost" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={15} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

export const SupplyDemandComposedChart: React.FC<{ data: any[], title: string }> = ({ data, title }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[350px]">
        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-700 mb-4">{title}</h4>
        <ResponsiveContainer width="100%" height="85%">
            <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} name="Volume" />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} name="Price" />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Bar yAxisId="left" dataKey="volume" name="Supply Volume (kg)" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Line yAxisId="right" type="monotone" dataKey="price" name="Market Price (₹)" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);

