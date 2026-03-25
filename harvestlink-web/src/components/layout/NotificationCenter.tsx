import { useState } from "react";
import { 
    Bell, 
    X, 
    CheckCircle2, 
    AlertCircle, 
    Info, 
    Clock, 
    ChevronRight,
    Trash2,
    Settings,
    MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";

export type NotificationType = "success" | "warning" | "info" | "urgent";

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    timestamp: string;
    read: boolean;
    category?: string;
}

interface NotificationCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "New Demand Match",
            message: "A farmer near Salem has tomatoes available that match your demand.",
            type: "success",
            timestamp: new Date().toISOString(),
            read: false,
            category: "Procurement"
        },
        {
            id: "2",
            title: "Price Alert: Tomato",
            message: "Market prices for tomatoes are expected to drop by 15% next week.",
            type: "warning",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            category: "Intelligence"
        },
        {
            id: "3",
            title: "Verification Successful",
            message: "Your business profile has been verified. You now have the 'Trusted Trader' badge.",
            type: "info",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            read: true,
            category: "Account"
        }
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 lg:hidden"
                    />
                    <motion.div 
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-100 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 rounded-xl relative">
                                    <Bell className="w-5 h-5 text-blue-600" />
                                    {notifications.some(n => !n.read) && (
                                        <span className="absolute top-0 right-0 w-3 h-3 bg-rose-500 border-2 border-white rounded-full" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 leading-tight">Notifications</h2>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notifications.filter(n => !n.read).length} Unread Messages</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                                    <Settings className="w-5 h-5" />
                                </button>
                                <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 transition-colors bg-slate-50 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between gap-4">
                            <button onClick={markAllRead} className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors">
                                Mark all as read
                            </button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto">
                            {notifications.length > 0 ? (
                                <div className="divide-y divide-slate-50">
                                    {notifications.map((n) => (
                                        <NotificationItem 
                                            key={n.id} 
                                            notification={n} 
                                            onDelete={() => deleteNotification(n.id)} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-12 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                        <Bell className="w-10 h-10 text-slate-200" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-400">All caught up!</h3>
                                    <p className="text-sm text-slate-400 font-medium">We'll notify you when something important happens.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50/50 border-t border-slate-50">
                            <button className="w-full bg-white border border-slate-200 py-3 rounded-2xl text-xs font-black text-slate-600 uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                Clear History <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function NotificationItem({ notification: n, onDelete }: { notification: Notification; onDelete: () => void }) {
    return (
        <motion.div 
            layout
            className={cn(
                "p-6 relative group transition-all",
                !n.read ? "bg-blue-50/30" : "bg-white hover:bg-slate-50/50"
            )}
        >
            <div className="flex gap-4">
                <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    n.type === "success" ? "bg-emerald-50 text-emerald-600" :
                    n.type === "warning" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                )}>
                    {n.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : 
                     n.type === "warning" ? <AlertCircle className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{n.category || "Alert"}</span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-300 font-bold">
                            <Clock className="w-3 h-3" />
                            <span>Just now</span>
                        </div>
                    </div>
                    <h4 className={cn("text-sm font-black", n.read ? "text-slate-600" : "text-slate-900")}>{n.title}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{n.message}</p>
                </div>
            </div>
            
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <button 
                    onClick={onDelete}
                    className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}
