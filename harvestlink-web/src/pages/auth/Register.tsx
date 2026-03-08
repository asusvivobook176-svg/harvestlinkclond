import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowLeft, Check, TrendingUp, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { TN_DISTRICTS, TN_VEGETABLES, SOIL_TYPES } from "../../types";
import type { UserRole } from "../../types";
import { useTranslation } from "react-i18next";

const SOIL_EMOJI: Record<string, string> = { Red: "🟥", Black: "⬛", Sandy: "🟡", Loamy: "🟫" };

export default function Register() {
    const { t } = useTranslation();
    const [params] = useSearchParams();
    const [step, setStep] = useState(0);
    const [role, setRole] = useState<UserRole | null>((params.get("role") as UserRole) || null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    // Basic fields
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    // Farmer fields
    const [village, setVillage] = useState("");
    const [district, setDistrict] = useState("Salem");
    const [landArea, setLandArea] = useState("2");
    const [soilType, setSoilType] = useState<"Red" | "Black" | "Sandy" | "Loamy">("Red");
    const [waterAvailability, setWaterAvailability] = useState<"Low" | "Medium" | "High">("Medium");
    const [irrigationType, setIrrigationType] = useState<"Drip" | "Flood" | "Rain-fed">("Drip");

    // Shop fields
    const [shopName, setShopName] = useState("");
    const [shopCity, setShopCity] = useState("Chennai");
    const [shopLocation, setShopLocation] = useState("");
    const [selectedVegs, setSelectedVegs] = useState<string[]>([]);

    const IRRIGATION_TYPES = [
        { value: "Drip", emoji: "💧", desc: t("register.irrigation.drip_desc") },
        { value: "Flood", emoji: "🌊", desc: t("register.irrigation.flood_desc") },
        { value: "Rain-fed", emoji: "🌧️", desc: t("register.irrigation.rain_desc") },
    ] as const;

    const WATER_OPTIONS = [t("common.low"), t("common.medium"), t("common.high")] as const;
    const WATER_VALUES = ["Low", "Medium", "High"] as const;

    const { register } = useAuth();
    const navigate = useNavigate();

    const totalSteps = role ? 3 : 1;
    const progress = role ? Math.round(((step + 1) / totalSteps) * 100) : 0;

    const toggleVeg = (v: string) => setSelectedVegs(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);

    const handleSubmit = async () => {
        if (!role) { setError(t("auth.select_role") || "Please select a role."); return; }
        if (!fullName || !email || !password) { setError(t("auth.fill_all_fields") || "Fill in all required fields."); return; }
        if (password.length < 6) { setError(t("auth.password_min") || "Password must be at least 6 characters."); return; }
        setError(""); setLoading(true);
        try {
            const details = role === "farmer"
                ? { village, district, land_area: parseFloat(landArea) || 1, soil_type: soilType, water_availability: waterAvailability, irrigation_type: irrigationType }
                : { shop_name: shopName, city: shopCity, location: shopLocation, vegetables_needed: selectedVegs };
            await register(email, password, role, fullName, phone, details);
            navigate(role === "farmer" ? "/farmer/dashboard" : "/shop/dashboard");
        } catch (err: unknown) {
            let msg = err instanceof Error ? err.message : t("auth.registration_failed") || "Registration failed. Please try again.";
            if (msg === "Failed to fetch") {
                msg = t("auth.connection_error") || "Connection error: Could not reach the local server.";
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const STEPS_PREVIEW = [
        t("auth.role_select"),
        t("auth.your_information"),
        role === "farmer" ? t("auth.farm_details") : t("auth.shop_details")
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-5/12 gradient-hero flex-col justify-between p-10 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-green-400/10 blur-3xl" />
                <div className="absolute bottom-0 -left-12 w-64 h-64 rounded-full bg-emerald-300/10 blur-2xl" />

                <Link to="/" className="flex items-center gap-2.5 relative z-10">
                    <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-black text-white text-xl tracking-tight">HarvestLink</span>
                </Link>

                <div className="relative z-10 flex-1 flex flex-col justify-center">
                    <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                        {role === "farmer" ? `🌾 ${t("auth.join_as_farmer")}` : role === "shop" ? `🏪 ${t("auth.join_as_shop")}` : `🚀 ${t("auth.register_title")}`}
                    </h2>
                    <p className="text-green-200 text-sm leading-relaxed mb-10 max-w-sm">
                        {t("index.hero.subtitle")}
                    </p>

                    {/* Steps preview */}
                    <div className="space-y-4">
                        {STEPS_PREVIEW.map((s, i) => (
                            <div key={s} className="flex items-center gap-3">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${i < step ? "bg-green-400 text-white" : i === step ? "bg-white text-green-800" : "bg-white/20 text-white/50"}`}>
                                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                                </div>
                                <span className={`text-sm ${i <= step ? "text-white font-semibold" : "text-green-300/60"}`}>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Progress bar */}
                {role && (
                    <div className="relative z-10">
                        <div className="flex justify-between text-xs text-green-300/70 mb-2">
                            <span>{t("auth.progress")}</span><span>{progress}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                )}
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center bg-green-50/50 px-4 py-12 overflow-y-auto">
                <div className="w-full max-w-md animate-fade-in-scale">
                    <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                        <div className="w-8 h-8 gradient-card rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-black text-gray-900 text-lg">Harvest<span className="text-green-600">Link</span></span>
                    </Link>

                    <div className="card shadow-xl border-green-100">
                        <div className="mb-6">
                            <h1 className="text-2xl font-black text-gray-900 mb-1">
                                {step === 0 ? t("auth.register_title") : step === 1 ? t("auth.your_information") : role === "farmer" ? t("auth.farm_details") : t("auth.shop_details")}
                            </h1>
                            <p className="text-gray-500 text-sm">{t("auth.step_x_of_y", { step: step + 1, total: role ? 3 : 1 })}</p>

                            {/* Mobile progress */}
                            <div className="progress-bar mt-3">
                                <div className="progress-fill" style={{ width: role ? `${progress}%` : "33%" }} />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 animate-fade-in-scale">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* ── Step 0: Role selection ── */}
                        {step === 0 && (
                            <div className="space-y-4">
                                <p className="text-sm font-semibold text-gray-700">{t("auth.role_select")}</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { role: "farmer" as UserRole, emoji: "👨‍🌾", title: t("auth.farmer"), desc: t("auth.farmer_desc") },
                                        { role: "shop" as UserRole, emoji: "🏪", title: t("auth.shop_owner"), desc: t("auth.shop_desc") },
                                    ].map(({ role: r, emoji, title, desc }) => (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setRole(r)}
                                            className={`p-5 rounded-2xl border-2 text-left transition-all hover:-translate-y-0.5 ${role === r ? "border-green-500 bg-green-50 shadow-md" : "border-gray-100 hover:border-green-200 bg-white"}`}
                                        >
                                            <span className="text-3xl block mb-2">{emoji}</span>
                                            <p className="font-bold text-gray-900 text-sm">{title}</p>
                                            <p className="text-gray-400 text-xs mt-1 leading-tight">{desc}</p>
                                            {role === r && <Check className="w-4 h-4 text-green-600 mt-2" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Step 1: Basic Info ── */}
                        {step === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("profile.full_name")}</label>
                                    <input className="input-field" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t("profile.full_name")} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("auth.email")}</label>
                                    <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("auth.password")}</label>
                                    <div className="relative">
                                        <input type={showPw ? "text" : "password"} className="input-field pr-11" value={password} onChange={e => setPassword(e.target.value)} placeholder={t("auth.password_placeholder") || "Min 6 characters"} required />
                                        <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t("profile.phone_number")} <span className="text-gray-400 font-normal">({t("common.optional")})</span></label>
                                    <input type="tel" className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9876543210" />
                                </div>
                            </div>
                        )}

                        {/* ── Step 2 (Farmer): Farm Details ── */}
                        {step === 2 && role === "farmer" && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("auth.village")}</label>
                                        <input className="input-field" value={village} onChange={e => setVillage(e.target.value)} placeholder={t("auth.village_placeholder")} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("common.district")}</label>
                                        <select className="input-field" value={district} onChange={e => setDistrict(e.target.value)}>
                                            {TN_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("recommendation.form.land_area")}: <span className="text-green-600 font-bold">{landArea} {t("common.acres")}</span></label>
                                    <input type="range" min="0.5" max="20" step="0.5" value={landArea} onChange={e => setLandArea(e.target.value)} className="w-full accent-green-600" />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">{t("recommendation.form.soil_type")}</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {SOIL_TYPES.map(s => (
                                            <button key={s} type="button" onClick={() => setSoilType(s as typeof soilType)} className={`p-3 rounded-xl border-2 text-left transition-all text-sm ${soilType === s ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-green-200"}`}>
                                                <span className="mr-1">{SOIL_EMOJI[s] || "🌍"}</span>
                                                <span className="font-semibold">{s}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">{t("auth.water_availability") || "Water Availability"}</label>
                                    <div className="flex gap-2">
                                        {WATER_VALUES.map((w, i) => (
                                            <button key={w} type="button" onClick={() => setWaterAvailability(w)} className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${waterAvailability === w ? "border-green-500 bg-green-50 text-green-700" : "border-gray-100 hover:border-green-200 text-gray-600"}`}>{WATER_OPTIONS[i]}</button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">{t("auth.irrigation_type") || "Irrigation Type"}</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {IRRIGATION_TYPES.map(({ value, emoji, desc }) => (
                                            <button key={value} type="button" onClick={() => setIrrigationType(value as typeof irrigationType)} className={`p-2.5 rounded-xl border-2 text-center transition-all ${irrigationType === value ? "border-green-500 bg-green-50" : "border-gray-100 hover:border-green-200"}`}>
                                                <span className="text-xl block mb-0.5">{emoji}</span>
                                                <span className="text-xs font-semibold">{value}</span>
                                                <span className="text-xs text-gray-400 block leading-tight">{desc}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Step 2 (Shop): Shop Details ── */}
                        {step === 2 && role === "shop" && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("auth.shop_name")}</label>
                                    <input className="input-field" value={shopName} onChange={e => setShopName(e.target.value)} placeholder={t("auth.shop_name_placeholder")} required />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("auth.city")}</label>
                                        <select className="input-field" value={shopCity} onChange={e => setShopCity(e.target.value)}>
                                            {TN_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t("auth.location")}</label>
                                        <input className="input-field" value={shopLocation} onChange={e => setShopLocation(e.target.value)} placeholder={t("auth.location_placeholder")} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">{t("auth.vegs_you_buy")} <span className="text-gray-400">({t("auth.select_all")})</span></label>
                                    <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto py-1">
                                        {TN_VEGETABLES.map(v => (
                                            <button key={v} type="button" onClick={() => toggleVeg(v)} className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${selectedVegs.includes(v) ? "border-green-500 bg-green-500 text-white" : "border-gray-200 text-gray-600 hover:border-green-300"}`}>
                                                {selectedVegs.includes(v) && <Check className="w-3 h-3 inline mr-1" />}{v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation */}
                        <div className="flex gap-3 mt-7">
                            {step > 0 && (
                                <button onClick={() => setStep(s => s - 1)} className="btn-secondary flex items-center gap-2 flex-1 justify-center">
                                    <ArrowLeft className="w-4 h-4" />{t("auth.back")}
                                </button>
                            )}

                            {step === 0 && (
                                <button onClick={() => { if (!role) { setError(t("auth.select_role") || "Please select a role."); return; } setError(""); setStep(1); }} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                                    {t("auth.continue")}<ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                            {step === 1 && (
                                <button onClick={() => { if (!fullName || !email || !password) { setError(t("auth.fill_all_fields") || "Fill in all fields."); return; } setError(""); setStep(2); }} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                                    {t("auth.continue")}<ArrowRight className="w-4 h-4" />
                                </button>
                            )}
                            {step === 2 && (
                                <button onClick={handleSubmit} disabled={loading} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                                    {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{t("auth.creating_account")}</> : <>{t("auth.create_account")}<ArrowRight className="w-4 h-4" /></>}
                                </button>
                            )}
                        </div>

                        <p className="text-center text-sm text-gray-500 mt-5">
                            {t("auth.have_account")}{" "}
                            <Link to="/login" className="text-green-600 font-semibold hover:text-green-800">{t("auth.sign_in_now")} →</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
