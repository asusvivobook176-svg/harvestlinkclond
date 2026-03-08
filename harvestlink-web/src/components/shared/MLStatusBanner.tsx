import { TrendingDown, Wifi, WifiOff } from "lucide-react";

export function MLStatusBanner({ isOnline }: { isOnline: boolean | null }) {
    if (isOnline === true || isOnline === null) return null;

    return (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 flex items-center gap-2.5 animate-fade-in-up">
            <WifiOff className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="flex-1 min-w-0">
                <span className="text-amber-800 text-sm font-semibold">ML Backend Offline · </span>
                <span className="text-amber-700 text-xs">Showing demo results. Start Flask server at <code className="bg-amber-100 px-1 rounded text-xs font-mono">localhost:5000</code> for live AI.</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium shrink-0">
                <TrendingDown className="w-3.5 h-3.5" />Mock Data
            </div>
        </div>
    );
}

export function MLOnlineBadge({ isOnline }: { isOnline: boolean | null }) {
    return (
        <div className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isOnline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {isOnline ? (
                <><Wifi className="w-3 h-3" /><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />Live AI</>
            ) : (
                <><WifiOff className="w-3 h-3" />Demo Mode</>
            )}
        </div>
    );
}
