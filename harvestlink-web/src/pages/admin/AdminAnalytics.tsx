import { 
    Activity, 
    Users, 
    TrendingUp, 
    TrendingDown, 
    AlertCircle, 
    Download,
    Globe,
    ShieldCheck,
    Calendar
} from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../../components/layout/Sidebar";
import { 
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import { cn } from "../../lib/utils";

const data = [
    { name: "Jan", users: 400, transactions: 240, revenue: 2400 },
    { name: "Feb", users: 600, transactions: 300, revenue: 3200 },
    { name: "Mar", users: 900, transactions: 450, revenue: 5800 },
    { name: "Apr", users: 1200, transactions: 600, revenue: 8400 },
];

const categoryData = [
    { name: "Farmers", value: 65, color: "#10b981" },
    { name: "Traders", value: 25, color: "#3b82f6" },
    { name: "Logistics", value: 10, color: "#8b5cf6" },
];

export default function AdminAnalytics() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-1"
                        >
                            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm uppercase tracking-wider">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Platform Control Center</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Analytics</h1>
                            <p className="text-slate-500 font-medium">Real-time health monitoring of the HarvestLink ecosystem.</p>
                        </motion.div>

                        <div className="flex items-center gap-3">
                            <button className="bg-white border text-slate-700 px-5 py-2.5 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Last 30 Days</span>
                            </button>
                            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-2xl font-bold shadow-lg shadow-slate-200 flex items-center gap-2 hover:bg-slate-800 transition-all">
                                <Download className="w-4 h-4" />
                                <span>Report</span>
                            </button>
                        </div>
                    </div>

                    {/* KPI Pulse */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Active Users", value: "24.5k", surge: "+12%", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                            { label: "Total Volume", value: "840 Tons", surge: "+8%", icon: Activity, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Market Volatility", value: "Low", surge: "-2%", icon: TrendingDown, color: "text-amber-600", bg: "bg-amber-50" },
                            { label: "Critical Alerts", value: "3", surge: "Action Reqd", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
                        ].map((kpi, i) => (
                            <motion.div 
                                key={kpi.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("p-3 rounded-2xl", kpi.bg)}>
                                        <kpi.icon className={cn("w-6 h-6", kpi.color)} />
                                    </div>
                                    <span className={cn("text-xs font-black px-2 py-1 rounded-lg", kpi.color.replace('text', 'bg') + '/10', kpi.color)}>
                                        {kpi.surge}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{kpi.label}</p>
                                <h3 className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</h3>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-8 rounded-4xl border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900">Ecosystem Growth</h3>
                                <div className="flex gap-2">
                                    <button className="text-xs font-black text-blue-600 px-3 py-1 bg-blue-50 rounded-lg">Users</button>
                                    <button className="text-xs font-black text-slate-400 px-3 py-1 hover:bg-slate-50 rounded-lg">Revenue</button>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            cursor={{ stroke: '#3b82f6', strokeWidth: 2 }}
                                        />
                                        <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="text-xl font-black text-slate-900">User Distribution</h3>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4">
                                {categoryData.map((cat) => (
                                    <div key={cat.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span className="text-sm font-bold text-slate-600">{cat.name}</span>
                                        </div>
                                        <span className="font-black text-slate-900">{cat.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Regional Performance */}
                    <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Regional Performance</h3>
                                <p className="text-slate-400 text-sm font-medium">District-wise data processing & supply chain efficiency.</p>
                            </div>
                            <button className="text-rose-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                                View Full Map <Globe className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {["Salem", "Coimbatore", "Madurai"].map((district) => (
                                <div key={district} className="p-5 border border-slate-50 rounded-3xl hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="font-black text-slate-900">{district}</p>
                                        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-black">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>EXCELLENT</span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs font-bold text-slate-400">
                                            <span>Active Farmers</span>
                                            <span className="text-slate-700">1,240</span>
                                        </div>
                                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 w-[75%]" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
