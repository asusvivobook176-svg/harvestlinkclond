import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, TrendingUp, ArrowRight, Sprout, Zap } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function Login() {
    const { login } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const FEATURES = [
        { icon: "🌾", title: t("dashboard.quick_actions.recommend"), desc: t("recommendation.accuracy_note") },
        { icon: "⚠️", title: t("price_alerts.title"), desc: t("price_alerts.description") },
        { icon: "🛒", title: t("marketplace.title"), desc: t("marketplace.subtitle") },
        { icon: "🥬", title: t("spoilage.title"), desc: t("spoilage.assessment.days_freshness") },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { setError(t("auth.fill_all_fields") || "Please fill in all fields."); return; }
        setError(""); setLoading(true);
        try {
            const data = await login(email, password);
            const role = data.user.role;
            if (role === "farmer") navigate("/farmer/dashboard");
            else if (role === "shop") navigate("/shop/dashboard");
            else navigate("/");
        } catch (err: unknown) {
            let msg = err instanceof Error ? err.message : t("auth.invalid_credentials") || "Invalid email or password. Please try again.";
            if (msg === "Failed to fetch") {
                msg = t("auth.connection_error") || "Connection error: Could not reach the local server.";
            } else if (msg.toLowerCase().includes("rate limit") || msg.toLowerCase().includes("too many")) {
                msg = "Too many login attempts. Please wait a minute and try again.";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left panel (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-5/12 gradient-hero flex-col justify-between p-10 relative overflow-hidden">
                {/* bg decoration */}
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-green-400/10 blur-3xl" />
                <div className="absolute bottom-0 -left-12 w-64 h-64 rounded-full bg-emerald-300/10 blur-2xl" />

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 relative z-10">
                    <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-white text-xl tracking-tight">HarvestLink</span>
                </Link>

                {/* Main copy */}
                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5 text-xs font-semibold text-green-200 w-fit mb-5 border border-white/10">
                        <Zap className="w-3 h-3 text-yellow-300" /> {t("index.hero.badge")}
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 leading-tight">{t("auth.welcome_back_farmer")} 🌾</h2>
                    <p className="text-green-200 text-sm leading-relaxed mb-10 max-w-sm">{t("auth.login_subtitle")}</p>

                    <div className="space-y-3">
                        {FEATURES.map(({ icon, title, desc }) => (
                            <div key={title} className="card-glass-dark flex items-center gap-3 px-4 py-3">
                                <span className="text-2xl">{icon}</span>
                                <div>
                                    <p className="text-white text-sm font-semibold">{title}</p>
                                    <p className="text-green-300/80 text-xs">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom trust */}
                <div className="relative z-10 flex items-center gap-2 text-green-300/70 text-xs">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    {t("index.hero.trusted")}
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center bg-green-50/50 px-4 py-12">
                <div className="w-full max-w-md animate-fade-in-scale">
                    {/* Mobile logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 gradient-card rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-gray-900 text-lg">Harvest<span className="text-green-600">Link</span></span>
                    </Link>

                    <div className="card shadow-xl border-green-100">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-gray-900 mb-1">{t("navbar.sign_in")}</h1>
                            <p className="text-gray-500 text-sm">{t("auth.login_subtitle")}</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5 flex items-start gap-2 animate-fade-in-scale">
                                <span className="mt-0.5 shrink-0">⚠️</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("auth.email")}</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-700">{t("auth.password")}</label>
                                    <button type="button" className="text-xs text-green-600 hover:text-green-800 font-medium transition-colors">
                                        {t("auth.forgot_password")}
                                    </button>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPw ? "text" : "password"}
                                        className="input-field pr-11"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder={t("auth.password")}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-3.5 text-base justify-center mt-2"
                            >
                                {loading
                                    ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t("auth.logging_in")}</>
                                    : <>{t("navbar.sign_in")} <ArrowRight className="w-4 h-4" /></>
                                }
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                {t("auth.no_account")}{" "}
                                <Link to="/register" className="text-green-600 font-semibold hover:text-green-800 transition-colors">
                                    {t("auth.create_free")} →
                                </Link>
                            </p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-3">
                            <Link to="/register?role=farmer" className="flex flex-col items-center gap-1 p-3 rounded-xl bg-green-50 border border-green-100 hover:bg-green-100 transition-all text-center">
                                <Sprout className="w-5 h-5 text-green-600" />
                                <span className="text-xs font-semibold text-green-800">{t("auth.join_as_farmer")}</span>
                            </Link>
                            <Link to="/register?role=shop" className="flex flex-col items-center gap-1 p-3 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-all text-center">
                                <span className="text-lg">🏪</span>
                                <span className="text-xs font-semibold text-amber-800">{t("auth.join_as_shop")}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
