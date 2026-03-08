import React, { useState, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, TrendingDown, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Notification {
    id: number;
    title: string;
    message: string;
    notification_type: 'price_alert' | 'spoilage_warning' | 'demand_update' | 'recommendation';
    is_read: boolean;
    created_at: string;
}

export const NotificationCenter: React.FC = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // In a real app, user_id would come from auth context
    const userId = 1;

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/notifications/${userId}`);
            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter((n: Notification) => !n.is_read).length);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await fetch(`http://localhost:5000/api/notifications/read/${id}`, { method: 'POST' });
            setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'price_alert': return <TrendingDown className="text-red-500 w-5 h-5" />;
            case 'spoilage_warning': return <AlertTriangle className="text-orange-500 w-5 h-5" />;
            case 'demand_update': return <Target className="text-blue-500 w-5 h-5" />;
            case 'recommendation': return <Info className="text-green-500 w-5 h-5" />;
            default: return <Bell className="text-gray-500 w-5 h-5" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors duration-200"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-white">{t('notifications')}</h3>
                        <span className="text-xs text-slate-500">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={`p-4 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer ${!n.is_read ? 'bg-blue-500/5' : ''}`}
                                    onClick={() => !n.is_read && markAsRead(n.id)}
                                >
                                    <div className="flex gap-3">
                                        <div className="mt-1">{getIcon(n.notification_type)}</div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <p className={`text-sm font-medium ${!n.is_read ? 'text-white' : 'text-slate-300'}`}>{n.title}</p>
                                                {!n.is_read && <Check className="w-4 h-4 text-blue-500" />}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{n.message}</p>
                                            <p className="text-[10px] text-slate-600 mt-2">
                                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="p-3 bg-slate-800/50 text-center">
                        <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View all activity</button>
                    </div>
                </div>
            )}
        </div>
    );
};
