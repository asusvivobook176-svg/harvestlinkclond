import React from 'react';

interface HealthIndicatorProps {
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'LOADING';
    label: string;
    details?: string;
    isDark?: boolean;
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({ status, label, details, isDark }) => {
    const config = {
        HEALTHY: { color: 'bg-emerald-500', text: isDark ? 'text-emerald-400' : 'text-emerald-700', bg: isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200' },
        WARNING: { color: 'bg-amber-500', text: isDark ? 'text-amber-400' : 'text-amber-700', bg: isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200' },
        CRITICAL: { color: 'bg-rose-500', text: isDark ? 'text-rose-400' : 'text-rose-700', bg: isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200' },
        LOADING: { color: 'bg-slate-500', text: isDark ? 'text-slate-400' : 'text-slate-500', bg: isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200' },
    }[status];

    return (
        <div className={`p-4 rounded-2xl border ${config.bg} flex items-center gap-4 transition-all hover:shadow-md`}>
            <div className="relative shrink-0">
                <div className={`w-3 h-3 rounded-full ${config.color} relative z-10`} />
                <div className={`absolute inset-0 w-3 h-3 rounded-full ${config.color} animate-ping opacity-75 z-0`} />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-black uppercase tracking-widest truncate ${config.text}`}>{label}</p>
                    <span className={`text-[10px] font-bold shrink-0 ${config.text}`}>{status}</span>
                </div>
                {details && <p className={`text-[10px] mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{details}</p>}
            </div>
        </div>
    );
};
