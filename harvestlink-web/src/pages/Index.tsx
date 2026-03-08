import { Link } from "react-router-dom";
import { ArrowRight, Sprout, TrendingUp, Star, Zap, Users, BarChart2, Leaf, CheckCircle } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Navbar } from "../components/layout/Navbar";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import ElectricBorder from "../components/shared/ElectricBorder";
import Prism from "../components/Prism";


function useCountUp(target: number, duration = 2200, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

function StatItem({ value, suffix, label, started, icon }: { value: number; suffix: string; label: string; started: boolean; icon: string }) {
    const count = useCountUp(value, 2200, started);
    return (
        <div className="text-center group">
            <div className="text-3xl mb-1">{icon}</div>
            <div className="text-4xl md:text-5xl font-black text-white tracking-normal">
                {suffix === "₹" ? "₹" : ""}{count.toLocaleString("en-IN")}{suffix !== "₹" ? suffix : ""}
            </div>
            <div className="text-green-300 mt-1.5 text-sm font-medium">{label}</div>
        </div>
    );
}

const FEATURES = (t: TFunction) => [
    { icon: "🌾", title: t("index.features.rec.title"), desc: t("index.features.rec.desc"), color: "from-green-500/10 to-emerald-500/5", badge: "Most Popular" },
    { icon: "📈", title: t("index.features.forecast.title"), desc: t("index.features.forecast.desc"), color: "from-blue-500/10 to-cyan-500/5", badge: "New" },
    { icon: "⚠️", title: t("index.features.alerts.title"), desc: t("index.features.alerts.desc"), color: "from-amber-500/10 to-orange-500/5", badge: "" },
    { icon: "🥬", title: t("index.features.spoilage.title"), desc: t("index.features.spoilage.desc"), color: "from-emerald-500/10 to-teal-500/5", badge: "" },
    { icon: "🛒", title: t("index.features.market.title"), desc: t("index.features.market.desc"), color: "from-purple-500/10 to-violet-500/5", badge: "" },
    { icon: "⚡", title: t("index.features.insights.title"), desc: t("index.features.insights.desc"), color: "from-rose-500/10 to-pink-500/5", badge: "" },
];

const TESTIMONIALS = [
    { name: "Ravi Kumar", district: "Salem", quote: "HarvestLink told me to plant beans instead of tomatoes — I earned 40% more that season. Couldn't believe an app could do this!", avatar: "👨‍🌾", crops: "6 yrs farming · Tomato, Beans" },
    { name: "Meena Devi", district: "Madurai", quote: "The price crash alert saved me ₹15,000. I stored my onions instead of panic-selling at a loss. This app is a lifesaver.", avatar: "👩‍🌾", crops: "4 yrs farming · Onion, Carrot" },
    { name: "Suresh Selvam", district: "Coimbatore", quote: "Direct connection with shops means no middlemen. I sold my entire tomato harvest in 2 days through the marketplace!", avatar: "🧑‍🌾", crops: "9 yrs farming · Tomato, Brinjal" },
];

const HOW_IT_WORKS = (t: TFunction) => [
    { step: "01", icon: "🌱", title: t("index.how_it_works.step1.title"), desc: t("index.how_it_works.step1.desc"), color: "bg-green-50 text-green-700" },
    { step: "02", icon: "🤖", title: t("index.how_it_works.step2.title"), desc: t("index.how_it_works.step2.desc"), color: "bg-blue-50 text-blue-700" },
    { step: "03", icon: "💰", title: t("index.how_it_works.step3.title"), desc: t("index.how_it_works.step3.desc"), color: "bg-amber-50 text-amber-700" },
];

// Floating UI preview card
function FloatingCard({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={`card-glass-dark rounded-2xl p-4 shadow-2xl ${className}`}>
            {children}
        </div>
    );
}

export default function IndexPage() {
    const { t } = useTranslation();
    const statsRef = useRef<HTMLDivElement>(null);
    const [statsVisible, setStatsVisible] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    const features = FEATURES(t);
    const howItWorks = HOW_IT_WORKS(t);

    useEffect(() => {
        const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => setActiveTestimonial(a => (a + 1) % TESTIMONIALS.length), 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden">
            <Navbar />

            {/* ── HERO ── */}
            <section className="gradient-hero noise-overlay text-white min-h-[92vh] pt-10 pb-24 px-4 relative overflow-hidden flex items-center">
                {/* Prism Background Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <Prism
                        animationType="3drotate"
                        scale={3.2}
                        hueShift={120}
                        colorFrequency={0.2}
                        timeScale={0.3}
                        glow={1.5}
                        noise={0.1}
                        suspendWhenOffscreen={true}
                    />
                </div>

                {/* Background decorative circles */}
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-green-400/10 blur-3xl z-1" />
                <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl z-1" />
                <div className="absolute top-1/2 right-1/4 w-64 h-64 rounded-full bg-green-500/8 blur-2xl animate-spin-slow z-1" />

                <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Copy */}
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center mb-7">
                            <ElectricBorder color="#4ade80" borderRadius={100} className="px-1 py-1">
                                <div className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-200">
                                    <Star className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                                    {t("index.hero.trusted")}
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                </div>
                            </ElectricBorder>
                        </div>

                        <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] mb-6 tracking-normal">
                            {t("index.hero.title")}
                        </h1>

                        <p className="text-lg text-green-100/90 max-w-lg mb-10 leading-relaxed">
                            {t("index.hero.subtitle")}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <Link to="/register?role=farmer" data-cursor-color="#4ade80" className="cursor-target group inline-flex items-center gap-2.5 bg-white text-green-900 font-bold py-4 px-8 rounded-2xl hover:bg-green-50 transition-all shadow-2xl hover:shadow-green-900/20 hover:-translate-y-1 text-base">
                                <Sprout className="w-5 h-5 text-green-600" />
                                {t("index.hero.farmer_cta")}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/register?role=shop" data-cursor-color="#3b82f6" className="cursor-target group inline-flex items-center gap-2.5 glass-card text-white font-bold py-4 px-8 rounded-2xl transition-all hover:-translate-y-1 hover:bg-white/15 text-base">
                                🏪 {t("index.hero.shop_cta")}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="flex items-center gap-6 text-sm text-green-300">
                            {[{ icon: <CheckCircle className="w-4 h-4 text-green-400" />, text: t("index.hero.free") }, { icon: <Zap className="w-4 h-4 text-yellow-400" />, text: t("index.hero.secure") }].map(({ icon, text }) => (
                                <div key={text} className="flex items-center gap-1.5">{icon}{text}</div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Floating UI preview */}
                    <div className="hidden lg:flex flex-col gap-4 relative animate-fade-in-left delay-200">
                        {/* Main card */}
                        <FloatingCard className="animate-float">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-green-400/20 flex items-center justify-center text-lg">🤖</div>
                                <div>
                                    <p className="text-white/90 text-xs font-semibold">{t("recommendation.ai_analysis")}</p>
                                    <p className="text-green-400/70 text-xs">94.5% {t("recommendation.confidence")}</p>
                                </div>
                                <span className="ml-auto badge badge-green text-xs">Live</span>
                            </div>
                            <div className="text-center py-3 bg-green-400/10 rounded-xl mb-3">
                                <p className="text-white text-3xl font-black">🌾 Tomato</p>
                                <p className="text-green-300 text-xs mt-1">{t("recommendation.best_crop_note", { soil: t("dashboard.soil"), district: "Salem" })}</p>
                            </div>
                            <div className="flex gap-2">
                                {[{ crop: "Beans", prob: 81 }, { crop: "Brinjal", prob: 67 }].map(({ crop, prob }) => (
                                    <div key={crop} className="flex-1 bg-white/5 rounded-lg p-2 text-center">
                                        <p className="text-white/80 text-xs font-semibold">{crop}</p>
                                        <p className="text-green-400 text-xs">{prob}%</p>
                                    </div>
                                ))}
                            </div>
                        </FloatingCard>

                        <div className="flex gap-4">
                            <FloatingCard className="flex-1 animate-float-slow">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">⚠️</span>
                                    <p className="text-white/90 text-xs font-semibold">{t("price_alerts.title")}</p>
                                </div>
                                <p className="text-red-300 text-sm font-bold">Onion crash in 7 days</p>
                                <p className="text-white/50 text-xs">Sell before Thursday</p>
                            </FloatingCard>

                            <FloatingCard className="flex-1 animate-float">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">🛒</span>
                                    <p className="text-white/90 text-xs font-semibold">{t("shop_dashboard.active_demands")}</p>
                                </div>
                                <p className="text-green-300 text-sm font-bold">200kg Tomato</p>
                                <p className="text-white/50 text-xs">Chennai · ₹28/kg</p>
                            </FloatingCard>
                        </div>

                        {/* Spoilage card */}
                        <FloatingCard className="animate-float delay-200">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🥬</span>
                                    <p className="text-white/90 text-xs font-semibold">{t("spoilage.assessment.title")}</p>
                                </div>
                                <span className="badge badge-green text-xs">Low Risk</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-black text-white">8</div>
                                <div>
                                    <p className="text-green-300 text-xs">{t("spoilage.history.days_left")}</p>
                                    <div className="progress-bar w-28 mt-1"><div className="progress-fill" style={{ width: "80%" }} /></div>
                                </div>
                            </div>
                        </FloatingCard>
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ── */}
            <section ref={statsRef} className="relative py-16 px-4" style={{ background: "linear-gradient(135deg, #14532d 0%, #15803d 100%)" }}>
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
                    <StatItem value={2400} suffix="+" label={t("index.stats.farmers_helped")} started={statsVisible} icon="👨‍🌾" />
                    <StatItem value={945} suffix="%" label={t("index.stats.accuracy")} started={statsVisible} icon="🎯" />
                    <StatItem value={23} suffix="Cr+" label={t("index.stats.losses_prevented")} started={statsVisible} icon="💰" />
                    <StatItem value={8500} suffix="Kg" label={t("index.stats.waste_reduced")} started={statsVisible} icon="♻️" />
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section id="how-it-works" className="py-28 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="section-tag mx-auto w-fit">⚡ {howItWorks[0].icon + " " + t("index.how_it_works.subtitle")}</div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{t("index.how_it_works.title")}</h2>
                        <div className="divider-green" />
                        <p className="text-gray-500 max-w-md mx-auto">{t("index.how_it_works.subtitle")}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-linear-to-r from-green-200 via-green-400 to-green-200" />
                        {howItWorks.map(({ step, icon, title, desc, color }, i) => (
                            <div key={step} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                                <div className={`w-20 h-20 ${color} rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg transition-transform hover:scale-110 duration-300`}>
                                    {icon}
                                </div>
                                <span className="text-7xl font-black text-green-50 pointer-events-none select-none absolute opacity-80" style={{ marginTop: "-5rem", marginLeft: "2rem" }}>{step}</span>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FEATURES GRID ── */}
            <section id="features" className="py-28 px-4" style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)" }}>
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="section-tag mx-auto w-fit">🔬 4 AI Models</div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{t("index.features.title")}</h2>
                        <div className="divider-green" />
                        <p className="text-gray-500 max-w-md mx-auto">{t("index.features.subtitle")}</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map(({ icon, title, desc, color, badge }, i) => (
                            <div key={title} className={`cursor-target feature-card animate-fade-in-up bg-linear-to-br ${color}`} style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="text-4xl">{icon}</div>
                                    {badge && <span className="badge badge-green">{badge}</span>}
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-28 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="section-tag mx-auto w-fit">💬 Real Stories</div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{t("index.testimonials.title")}</h2>
                        <div className="divider-green" />
                    </div>

                    {/* Featured testimonial */}
                    <div className="max-w-2xl mx-auto mb-10">
                        <div className="card border-green-100 text-center p-8 shadow-xl">
                            <div className="text-6xl mb-4">{TESTIMONIALS[activeTestimonial].avatar}</div>
                            <p className="text-gray-700 text-lg italic leading-relaxed mb-6">"{TESTIMONIALS[activeTestimonial].quote}"</p>
                            <div>
                                <p className="font-bold text-gray-900 text-lg">{TESTIMONIALS[activeTestimonial].name}</p>
                                <p className="text-green-600 text-sm font-medium">📍 {TESTIMONIALS[activeTestimonial].district}, Tamil Nadu</p>
                                <p className="text-gray-400 text-xs mt-1">{TESTIMONIALS[activeTestimonial].crops}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2">
                        {TESTIMONIALS.map((_, i) => (
                            <button key={i} onClick={() => setActiveTestimonial(i)} className={`transition-all rounded-full ${i === activeTestimonial ? "w-8 h-2.5 bg-green-600" : "w-2.5 h-2.5 bg-green-200 hover:bg-green-400"}`} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TRUST BAR ── */}
            <section className="py-12 px-4 bg-green-50 border-y border-green-100">
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: <Users className="w-5 h-5 text-green-600" />, label: "2,400+ Farmers", sub: "Across Tamil Nadu" },
                            { icon: <BarChart2 className="w-5 h-5 text-blue-600" />, label: "94.5% Accuracy", sub: "Random Forest model" },
                            { icon: <Zap className="w-5 h-5 text-amber-500" />, label: "< 200ms", sub: "ML inference time" },
                            { icon: <Leaf className="w-5 h-5 text-emerald-600" />, label: "4 AI Models", sub: "Crop, Price, Demand, Spoilage" },
                        ].map(({ icon, label, sub }) => (
                            <div key={label} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center border border-green-100">{icon}</div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{label}</p>
                                    <p className="text-gray-400 text-xs">{sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="gradient-hero py-28 px-4 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23fff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E\")" }} />
                <div className="max-w-2xl mx-auto relative z-10">
                    <div className="text-6xl mb-6 animate-float">🌾</div>
                    <h2 className="text-4xl md:text-5xl font-black mb-4">{t("index.cta.title")}</h2>
                    <p className="text-green-100 mb-10 text-xl">{t("index.cta.subtitle")}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register?role=farmer" className="group inline-flex items-center gap-2.5 bg-white text-green-900 font-bold py-4 px-10 rounded-2xl hover:bg-green-50 transition-all shadow-2xl hover:-translate-y-1 text-lg">
                            <Sprout className="w-5 h-5 text-green-600" />
                            {t("index.cta.join")}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/marketplace" className="group inline-flex items-center gap-2.5 glass-card text-white font-bold py-4 px-10 rounded-2xl hover:bg-white/15 transition-all hover:-translate-y-1 text-lg">
                            {t("index.cta.browse")}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="bg-gray-950 text-gray-400 py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-10 mb-12">
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-9 h-9 gradient-card rounded-xl flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-white font-black text-xl tracking-tight">HarvestLink</span>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{t("index.footer.tagline")}</p>
                        </div>
                        <div>
                            <p className="text-white font-semibold mb-4 text-sm">{t("index.footer.platform")}</p>
                            <div className="space-y-2.5 text-sm">
                                {[{ to: "/marketplace", label: t("navbar.marketplace") }, { to: "/login", label: t("navbar.sign_in") }, { to: "/register", label: t("auth.register_now") }].map(({ to, label }) => (
                                    <Link key={to} to={to} className="block hover:text-green-400 transition-colors">{label}</Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-white font-semibold mb-4 text-sm">{t("index.footer.ai_features")}</p>
                            <div className="space-y-2.5 text-sm">
                                {[t("sidebar.farming"), t("sidebar.alerts"), t("sidebar.forecast"), t("sidebar.quality")].map(f => (
                                    <p key={f} className="text-gray-500">{f}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-gray-600">© 2025 HarvestLink · Built for Tamil Nadu Farmers with ❤️ · {t("index.footer.rights")}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            All systems operational
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
