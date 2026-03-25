import { useState } from "react";
import { 
    MessageSquare, 
    Search, 
    Filter, 
    AlertCircle, 
    CheckCircle2, 
    Clock, 
    Send, 
    Paperclip,
    Bell,
    Megaphone,
    ArrowRight,
    Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "../../components/layout/Sidebar";
import { formatDate, cn } from "../../lib/utils";

const mockTickets = [
    { id: "T-101", user: "Ravi Kumar", subject: "Payment delay in Coimbatore", status: "open", priority: "high", created: "2026-03-22T10:00:00Z" },
    { id: "T-102", user: "Salem Traders", subject: "KYC verification pending", status: "in-progress", priority: "medium", created: "2026-03-21T15:30:00Z" },
    { id: "T-103", user: "Priya S.", subject: "Crop insurance inquiry", status: "resolved", priority: "low", created: "2026-03-20T09:15:00Z" },
];

export default function SupportManagement() {
    const [tickets] = useState(mockTickets);
    const [activeTab, setActiveTab] = useState<"tickets" | "announcements">("tickets");

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="admin" />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-8 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm uppercase tracking-wider">
                                <MessageSquare className="w-4 h-4" />
                                <span>Support & Operations</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Platform Support</h1>
                            <p className="text-slate-500 font-medium">Handle user inquiries and broadcast platform announcements.</p>
                        </div>

                        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                            <button 
                                onClick={() => setActiveTab("tickets")}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                    activeTab === "tickets" ? "bg-amber-600 text-white shadow-lg shadow-amber-200" : "text-slate-500 hover:text-amber-600"
                                )}
                            >
                                <AlertCircle className="w-4 h-4" /> Tickets
                            </button>
                            <button 
                                onClick={() => setActiveTab("announcements")}
                                className={cn(
                                    "px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
                                    activeTab === "announcements" ? "bg-amber-600 text-white shadow-lg shadow-amber-200" : "text-slate-500 hover:text-amber-600"
                                )}
                            >
                                <Megaphone className="w-4 h-4" /> Broadcast
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "tickets" ? (
                            <motion.div 
                                key="tickets"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Ticket Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[
                                        { label: "Open Tickets", value: "12", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
                                        { label: "Avg Response", value: "2.4 hrs", icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
                                        { label: "Resolution Rate", value: "98%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                                            <div className={cn("p-4 rounded-2xl", stat.bg)}>
                                                <stat.icon className={cn("w-6 h-6", stat.color)} />
                                            </div>
                                            <div>
                                                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                                                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Ticket List */}
                                <div className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-6 border-b border-slate-50 items-center justify-between flex gap-4">
                                        <div className="relative flex-1 max-w-md">
                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input type="text" placeholder="Search tickets..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm" />
                                        </div>
                                        <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50"><Filter className="w-4 h-4 text-slate-500" /></button>
                                    </div>
                                    <div className="divide-y divide-slate-50">
                                        {tickets.map((ticket) => (
                                            <div key={ticket.id} className="p-6 hover:bg-slate-50/50 transition-all flex items-center justify-between group">
                                                <div className="flex items-center gap-6">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black",
                                                        ticket.priority === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'
                                                    )}>
                                                        {ticket.id}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 mb-0.5">{ticket.subject}</h4>
                                                        <div className="flex items-center gap-3 text-xs text-slate-400 font-bold">
                                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {ticket.user}</span>
                                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(ticket.created)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                        ticket.status === 'open' ? 'bg-rose-50 text-rose-600' : 
                                                        ticket.status === 'in-progress' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                                                    )}>
                                                        {ticket.status}
                                                    </span>
                                                    <button className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        Handle <ArrowRight className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="announcements"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                            >
                                <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm space-y-6">
                                    <h3 className="text-xl font-black text-slate-900">New Broadcast</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Announcement Title</label>
                                            <input type="text" placeholder="e.g. Price surge expected in Salem Market" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Message Content</label>
                                            <textarea rows={6} placeholder="Type your broadcast message here..." className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-amber-500/20" />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-2">
                                                <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-all"><Paperclip className="w-5 h-5" /></button>
                                                <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-all"><Bell className="w-5 h-5" /></button>
                                            </div>
                                            <button className="bg-amber-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-amber-200">
                                                <Send className="w-4 h-4" /> Send Now
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-black text-slate-900">Recent Broadcasts</h3>
                                    {[1, 2].map(i => (
                                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-3 text-amber-600 mb-3">
                                                <Megaphone className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Sent 2 days ago</span>
                                            </div>
                                            <h4 className="font-black text-slate-900 mb-2">Platform Update: New Verification Flow</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2">We have updated the farmer verification process to include digital land records integration for faster approval...</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
