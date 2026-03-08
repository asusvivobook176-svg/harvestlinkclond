import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, Mail, MessageSquare, Smartphone, Save, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NotificationPreferences: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [prefs, setPrefs] = useState({
        in_app: true,
        email: true,
        sms: false,
        push: true
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (user?.id) {
            fetch(`http://localhost:5000/api/notifications/preferences/${user.id}`)
                .then(res => res.json())
                .then(data => setPrefs(data))
                .catch(err => console.error("Error fetching preferences:", err));
        }
    }, [user?.id]);

    const handleToggle = (key: keyof typeof prefs) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
        setSaved(false);
    };

    const savePreferences = async () => {
        if (!user?.id) return;
        setSaving(true);
        try {
            const response = await fetch(`http://localhost:5000/api/notifications/preferences/${user.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prefs)
            });
            if (response.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (err) {
            console.error("Error saving preferences:", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{t('settings.notifications.title', 'Notification Settings')}</h3>
                        <p className="text-xs text-slate-500">{t('settings.notifications.subtitle', 'Choose how you want to be alerted')}</p>
                    </div>
                </div>
                <button
                    onClick={savePreferences}
                    disabled={saving}
                    className={`btn-primary py-2 px-4 text-xs flex items-center gap-2 ${saved ? 'bg-emerald-600 border-emerald-600' : ''}`}
                >
                    {saved ? <ShieldCheck className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">In-App Notifications</p>
                            <p className="text-[10px] text-slate-400">Alerts inside the dashboard feed</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={prefs.in_app} onChange={() => handleToggle('in_app')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Email Alerts</p>
                            <p className="text-[10px] text-slate-400">Daily summaries and high-priority news</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={prefs.email} onChange={() => handleToggle('email')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">SMS (Twilio)</p>
                            <p className="text-[10px] text-slate-400">Urgent price alerts to your phone</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={prefs.sms} onChange={() => handleToggle('sms')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-purple-500 shadow-sm">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Push Notifications</p>
                            <p className="text-[10px] text-slate-400">Mobile browser alerts for real-time updates</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={prefs.push} onChange={() => handleToggle('push')} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                </div>
            </div>
        </div>
    );
};
