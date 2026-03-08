import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CloudRain, TrendingDown, Info, CheckCircle } from 'lucide-react';

interface Notification {
    id: number;
    type: 'price_alert' | 'weather' | 'recommendation' | 'system';
    title: string;
    message: string;
    severity: 'warning' | 'info' | 'success' | 'error';
    action?: string;
}

export const SmartNotifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const mockNotifications: Notification[] = [
            {
                id: 1,
                type: 'price_alert',
                title: 'Price Alert! 📉',
                message: 'Tomato price expected to drop 30% next week due to surplus supply.',
                severity: 'warning',
                action: 'Sell Now'
            },
            {
                id: 2,
                type: 'weather',
                title: 'Storm Surge Expected ⛈️',
                message: 'Heavy rain expected in Salem tomorrow. Secure your storage.',
                severity: 'error',
                action: 'View Radar'
            },
            {
                id: 3,
                type: 'recommendation',
                title: 'New Opportunity 🌾',
                message: 'Red Soil detected. Beans recommended for maximum ROI.',
                severity: 'success',
                action: 'View Analysis'
            },
        ];

        setNotifications(mockNotifications);
    }, []);

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const severityColors = {
        warning: 'bg-amber-50 border-amber-200 text-amber-900',
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        error: 'bg-rose-50 border-rose-200 text-rose-900',
    };

    const icons = {
        price_alert: <TrendingDown size={14} />,
        weather: <CloudRain size={14} />,
        recommendation: <CheckCircle size={14} />,
        system: <Info size={14} />,
    };

    return (
        <div className="fixed top-8 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
            {/* Notification Bell */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="pointer-events-auto relative bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 flex items-center justify-center text-gray-900"
            >
                <Bell size={24} className={notifications.length > 0 ? "animate-swing origin-top" : ""} />
                {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-lg px-1.5 py-0.5 text-[10px] font-black shadow-lg">
                        {notifications.length}
                    </span>
                )}
            </motion.button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="pointer-events-auto w-80 bg-white rounded-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] overflow-hidden border border-gray-100 flex flex-col"
                    >
                        <div className="bg-gray-900 text-white p-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest">Intelligence Hub</h3>
                                <p className="text-[10px] font-medium opacity-60">{notifications.length} New Updates</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <motion.div
                                        key={notif.id}
                                        layout
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        exit={{ x: -20, opacity: 0 }}
                                        className={`rounded-2xl border p-4 shadow-sm relative group overflow-hidden ${severityColors[notif.severity]}`}
                                    >
                                        <div className="flex items-start gap-3 relative z-10">
                                            <div className="mt-0.5 opacity-60">{icons[notif.type]}</div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-xs leading-tight mb-1">{notif.title}</h4>
                                                <p className="text-[10px] font-medium leading-relaxed opacity-80 mb-3">{notif.message}</p>
                                                {notif.action && (
                                                    <button className="text-[10px] font-black uppercase tracking-wider underline active:opacity-50">
                                                        {notif.action}
                                                    </button>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeNotification(notif.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/20 rounded-lg transition-all"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        {/* Background decoration */}
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-12 text-center text-gray-400">
                                    <span className="text-4xl mb-4 block">🏝️</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">All caught up!</p>
                                    <p className="text-xs font-medium">No new alerts at this time.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
