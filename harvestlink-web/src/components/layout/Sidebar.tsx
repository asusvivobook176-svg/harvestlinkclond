import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../lib/utils";
import {
    LayoutDashboard, Sprout, Bell, Bug, ShoppingBag, TrendingUp,
    ClipboardList, LogOut, ChevronRight, TrendingUp as Brand, MessageSquare, Settings
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageToggle } from "../LanguageToggle";

interface SidebarProps { role: "farmer" | "shop" | "admin"; }

const farmerLinks = [
    { to: "/farmer/dashboard", icon: LayoutDashboard, label: "sidebar.dashboard", color: "text-green-300" },
    { to: "/farmer/recommend", icon: Sprout, label: "sidebar.farming", color: "text-emerald-300" },
    { to: "/farmer/alerts", icon: Bell, label: "sidebar.alerts", color: "text-amber-300" },
    { to: "/farmer/spoilage", icon: Bug, label: "sidebar.quality", color: "text-red-300" },
    { to: "/farmer/crops", icon: ShoppingBag, label: "sidebar.market", color: "text-blue-300" },
    { to: "/farmer/training", icon: ClipboardList, label: "sidebar.training_portal", color: "text-indigo-300" },
    { to: "/feedback", icon: MessageSquare, label: "common.feedback", color: "text-purple-300" },
];

const adminLinks = [
    { to: "/admin/pilot", icon: LayoutDashboard, label: "sidebar.pilot_monitoring", color: "text-emerald-300" },
    { to: "/admin/command", icon: TrendingUp, label: "sidebar.dashboard", color: "text-green-300" },
    { to: "/admin/settings", icon: Settings, label: "Settings", color: "text-violet-300" },
    { to: "/", icon: Sprout, label: "Home", color: "text-blue-300" },
];

const shopLinks = [
    { to: "/shop/dashboard", icon: LayoutDashboard, label: "sidebar.dashboard", color: "text-green-300" },
    { to: "/shop/forecast", icon: TrendingUp, label: "sidebar.forecast", color: "text-blue-300" },
    { to: "/shop/demands", icon: ClipboardList, label: "sidebar.inventory", color: "text-amber-300" },
    { to: "/marketplace", icon: ShoppingBag, label: "sidebar.market", color: "text-purple-300" },
];

export function Sidebar({ role }: SidebarProps) {
    const { logout, profile, farmer, shop } = useAuth();
    const { t } = useTranslation();
    const location = useLocation();
    const links = role === "farmer" ? farmerLinks : role === "shop" ? shopLinks : adminLinks;
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        await logout();
    };

    const displayName = profile?.full_name || "User";
    const displaySub = role === "farmer"
        ? `${farmer?.district || "Tamil Nadu"} · ${farmer?.land_area || 0} acres`
        : shop?.shop_name || "Shop Owner";

    return (
        <aside className="sidebar flex flex-col h-screen sticky top-0 shrink-0">
            {/* Header */}
            <div className="p-5 pb-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-5">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm transition-all group-hover:bg-white/25">
                            <Brand className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-white text-base tracking-tight">
                            Harvest<span className="text-green-300">Link</span>
                        </span>
                    </Link>
                    <LanguageToggle />
                </div>

                {/* User info */}
                <Link to="/profile" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-white font-bold text-sm shrink-0 border border-white/20 transition-all group-hover:bg-white/25">
                        {displayName[0].toUpperCase()}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-white font-semibold text-sm truncate leading-tight">{displayName}</p>
                        <p className="text-green-300/70 text-xs truncate">{displaySub}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-green-400/50 ml-auto shrink-0 group-hover:text-green-300 transition-colors" />
                </Link>
            </div>

            {/* Role badge */}
            <div className="px-5 pt-4 pb-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full w-fit">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-300 text-xs font-semibold uppercase tracking-wide">
                        {role === "farmer" ? t("common.farmer_portal") : role === "shop" ? t("common.shop_portal") : t("common.admin_portal")}
                    </span>
                </div>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
                {links.map(({ to, icon: Icon, label, color }) => {
                    const isActive = location.pathname === to;
                    return (
                        <Link
                            key={to}
                            to={to}
                            className={cn(
                                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative",
                                isActive
                                    ? "bg-white text-green-800 shadow-lg shadow-black/20"
                                    : "text-green-100/80 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-green-500 rounded-full -ml-0.5" />
                            )}
                            <Icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-green-700" : color)} />
                            <span className="truncate">{t(label)}</span>
                            {isActive && <ChevronRight className="w-3.5 h-3.5 text-green-400 ml-auto" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: Profile link + Logout */}
            <div className="p-3 border-t border-white/10 space-y-1">
                <Link to="/profile" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-green-100/70 hover:bg-white/10 hover:text-white transition-all">
                    <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center text-[10px] font-bold">{displayName[0]}</div>
                    {t("sidebar.profile")}
                </Link>
                <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-300/80 hover:bg-red-500/20 hover:text-red-200 transition-all w-full text-left"
                >
                    <LogOut className="w-4 h-4 shrink-0" />
                    {loggingOut ? t("sidebar.signing_out") : t("sidebar.logout")}
                </button>
            </div>
        </aside>
    );
}
