import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Menu, X, ChevronDown, LayoutDashboard, LogOut, User, ShoppingBag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { NotificationCenter } from "./NotificationCenter";

export function Navbar() {
    const { user, profile, logout } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const dashboardLink = profile?.role === "admin"
        ? "/admin/pilot"
        : profile?.role === "shop"
            ? "/shop/dashboard"
            : "/farmer/dashboard";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/");
        setUserMenuOpen(false);
    };

    const navLinks = [
        { to: "/#features", label: t("navbar.features") },
        { to: "/#how-it-works", label: t("navbar.how_it_works") },
        { to: "/marketplace", label: t("navbar.marketplace") },
    ];

    return (
        <nav className={`navbar transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
                    <div className="w-8 h-8 gradient-card rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <TrendingUp className="w-4.5 h-4.5 text-white" style={{ width: "1.125rem", height: "1.125rem" }} />
                    </div>
                    <span className="font-black text-gray-900 text-lg tracking-tight">
                        Harvest<span className="text-green-600">Link</span>
                    </span>
                </Link>

                {/* Nav links (desktop) */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map(({ to, label }) => (
                        <Link key={to} to={to} className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-green-700 hover:bg-green-50 transition-all">
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Auth area (desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <>
                            <NotificationCenter />
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setUserMenuOpen(v => !v)}
                                    className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl border border-green-100 bg-green-50 hover:bg-green-100 transition-all text-sm font-semibold text-green-800"
                                >
                                    <div className="w-7 h-7 gradient-card rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                        {(profile?.full_name || "U")[0].toUpperCase()}
                                    </div>
                                    <span className="max-w-[120px] truncate">{profile?.full_name || t("navbar.my_account")}</span>
                                    <ChevronDown className={`w-3.5 h-3.5 text-green-600 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                                </button>

                                {/* Dropdown */}
                                {userMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in-scale">
                                        <div className="px-4 py-3 border-b border-gray-50">
                                            <p className="text-xs text-gray-400">{t("navbar.signed_in_as")}</p>
                                            <p className="font-semibold text-gray-900 text-sm truncate">{profile?.full_name}</p>
                                            <span className="badge badge-green mt-1">{profile?.role}</span>
                                        </div>
                                        <Link to={dashboardLink} onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                                            <LayoutDashboard className="w-4 h-4" /> {t("navbar.dashboard")}
                                        </Link>
                                        <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                                            <User className="w-4 h-4" /> {t("navbar.profile")}
                                        </Link>
                                        <Link to="/marketplace" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                                            <ShoppingBag className="w-4 h-4" /> {t("navbar.marketplace")}
                                        </Link>
                                        <div className="border-t border-gray-50 mt-2 pt-2">
                                            <button onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                                                <LogOut className="w-4 h-4" /> {t("navbar.sign_out")}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-ghost text-sm">{t("navbar.sign_in")}</Link>
                            <Link to="/register" className="btn-primary text-sm">{t("navbar.get_started")}</Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 rounded-xl hover:bg-green-50 text-gray-700 transition-colors">
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-green-100 bg-white/95 backdrop-blur px-4 py-4 space-y-1 animate-fade-in-up">
                    {navLinks.map(({ to, label }) => (
                        <Link key={to} to={to} onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors">
                            {label}
                        </Link>
                    ))}
                    <div className="border-t border-green-50 pt-3 mt-2 flex flex-col gap-2">
                        {user ? (
                            <>
                                <Link to={dashboardLink} onClick={() => setMobileOpen(false)} className="btn-primary text-sm justify-center">
                                    {profile?.role === "admin" ? "🛡️" : profile?.role === "farmer" ? "🌾" : "🏪"} {t("navbar.dashboard")}
                                </Link>
                                <button onClick={handleLogout} className="btn-secondary text-sm justify-center text-red-600 border-red-200">{t("navbar.sign_out")}</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm justify-center">{t("navbar.sign_in")}</Link>
                                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm justify-center">{t("navbar.get_started")}</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
