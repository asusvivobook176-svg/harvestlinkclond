import { useState, useEffect } from "react";
import { 
    History, 
    Search, 
    Filter, 
    Download, 
    FileText, 
    ArrowUpRight,
    CreditCard,
    CheckCircle2,
    Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "../../components/layout/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency, cn } from "../../lib/utils";

export default function Transactions() {
    const { profile } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!profile?.id) return;
            try {
                // Mock transaction data
                const mockTx = [
                    {
                        id: "TX-1001",
                        date: "2026-03-20T14:30:00Z",
                        farmer_name: "Ravi Kumar",
                        crop: "Tomatoes",
                        quantity_kg: 200,
                        amount: 6000,
                        status: "Paid",
                        payment_method: "UPI",
                        type: "Purchase"
                    },
                    {
                        id: "TX-1002",
                        date: "2026-03-18T11:20:00Z",
                        farmer_name: "Selvam M.",
                        crop: "Onions",
                        quantity_kg: 500,
                        amount: 12500,
                        status: "Processing",
                        payment_method: "Bank Transfer",
                        type: "Purchase"
                    },
                    {
                        id: "TX-1003",
                        date: "2026-03-15T09:45:00Z",
                        farmer_name: "Priya S.",
                        crop: "Brinjal",
                        quantity_kg: 100,
                        amount: 3200,
                        status: "Paid",
                        payment_method: "Cash",
                        type: "Purchase"
                    }
                ];
                setTransactions(mockTx);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            }
        };
        fetchTransactions();
    }, [profile?.id]);

    const filteredTx = transactions.filter(tx => 
        tx.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.crop.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="shop" />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-1"
                        >
                            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm uppercase tracking-wider">
                                <History className="w-4 h-4" />
                                <span>Financial Records</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Transactions</h1>
                            <p className="text-slate-500 font-medium">History of your procurements and payments.</p>
                        </motion.div>

                        <button className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            <span>Export History</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Total Procurement</p>
                            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(transactions.reduce((acc, t) => acc + t.amount, 0))}</h3>
                            <div className="mt-4 flex items-center gap-1.5 text-emerald-500 text-xs font-bold">
                                <ArrowUpRight className="w-3.5 h-3.5" />
                                <span>12% from last month</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Pending Payments</p>
                            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(transactions.filter(t => t.status === "Processing").reduce((acc, t) => acc + t.amount, 0))}</h3>
                            <div className="mt-4 flex items-center gap-1.5 text-amber-500 text-xs font-bold">
                                <Clock className="w-3.5 h-3.5" />
                                <span>2 transactions processing</span>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Active Suppliers</p>
                            <h3 className="text-2xl font-black text-slate-900">{new Set(transactions.map(t => t.farmer_name)).size} Farmers</h3>
                            <div className="mt-4 flex items-center gap-1.5 text-indigo-500 text-xs font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Verified supply chain</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    placeholder="Search by ID, farmer or crop..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50">
                                <Filter className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <tr>
                                        <th className="px-8 py-5">Transaction Details</th>
                                        <th className="px-8 py-5">Value</th>
                                        <th className="px-8 py-5">Status</th>
                                        <th className="px-8 py-5">Method</th>
                                        <th className="px-8 py-5 text-right">Invoice</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredTx.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900">{tx.farmer_name}</p>
                                                        <p className="text-xs text-slate-400 font-bold">{tx.id} • {tx.crop}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="font-black text-slate-900">{formatCurrency(tx.amount)}</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{tx.quantity_kg} kg @ ₹{tx.amount/tx.quantity_kg}/kg</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                    tx.status === "Paid" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                                                )}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-slate-300" />
                                                    <span className="text-xs font-bold text-slate-600">{tx.payment_method}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
