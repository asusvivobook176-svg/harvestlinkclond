import { useState, useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { apiFetch } from "../services/api";
import {
    User, Mail, Building, Sprout,
    Save, LogOut, ShieldCheck, ChevronRight,
    Trash2, Clock, Camera
} from "lucide-react";
import { TN_DISTRICTS } from "../types";
import { useTranslation } from "react-i18next";
import { NotificationPreferences } from "../components/NotificationPreferences";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Profile() {
    const { user, profile, farmer, shop, logout } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [pilotStatus, setPilotStatus] = useState<any>(null);

    // Basic info
    const [fullName, setFullName] = useState(profile?.full_name || "");
    const [phone, setPhone] = useState(profile?.phone || "");

    // Farmer specific
    const [district, setDistrict] = useState(farmer?.district || "Salem");
    const [village, setVillage] = useState(farmer?.village || "");
    const [landArea, setLandArea] = useState(farmer?.land_area?.toString() || "");

    // Shop specific
    const [shopName, setShopName] = useState(shop?.shop_name || "");
    const [shopCity, setShopCity] = useState(shop?.city || "Chennai");

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "");
            setPhone(profile.phone || "");
        }
        if (farmer) {
            setDistrict(farmer.district || "Salem");
            setVillage(farmer.village || "");
            setLandArea(farmer.land_area?.toString() || "");
        }
        if (shop) {
            setShopName(shop.shop_name || "");
            setShopCity(shop.city || "Chennai");
        }

        // Fetch pilot status
        if (user?.id) {
            apiFetch(`/pilot/status/${user.id}`)
                .then(setPilotStatus)
                .catch(() => setPilotStatus({ is_participant: false }));
        }
    }, [profile, farmer, shop, user?.id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setSuccess(false);

        try {
            // Update profile
            await apiFetch(`/auth/profile/${user.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    name: fullName,
                    phone
                })
            });

            // Update role-specific table
            if (profile?.role === "farmer" && farmer?.id) {
                await apiFetch("/farmer/update", {
                    method: "POST",
                    body: JSON.stringify({
                        id: farmer.id,
                        name: fullName,
                        phone,
                        district,
                        village,
                        land_area: parseFloat(landArea) || 0
                    })
                });
            } else if (profile?.role === "shop" && shop?.id) {
                await apiFetch("/shop/update", {
                    method: "POST",
                    body: JSON.stringify({
                        id: shop.id,
                        owner_name: fullName,
                        shop_name: shopName,
                        city: shopCity,
                        phone
                    })
                });
            }

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar role={(profile?.role || user?.role || "farmer") as "farmer" | "shop"} />

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto w-full">

                    <div className="animate-fade-in-up">
                        <h1 className="text-3xl font-black text-slate-900 mb-2">{t("profile.title")}</h1>
                        <p className="text-slate-500 text-sm">{t("profile.subtitle")}</p>
                    </div>

                    <div className="mt-8 grid lg:grid-cols-12 gap-8">
                        {/* Sidebar info */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="card shadow-md p-6 flex flex-col items-center text-center animate-fade-in-up delay-100">
                                <div className="relative group mb-4">
                                    <div className="w-24 h-24 bg-linear-to-tr from-green-500 to-emerald-600 rounded-4xl flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-green-100 mb-2">
                                        {profile?.full_name?.charAt(0) || "U"}
                                    </div>
                                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                                        <Camera className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">{profile?.full_name}</h2>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 mb-4 flex items-center gap-1.5 justify-center">
                                    <span className={`w-2 h-2 rounded-full ${profile?.role === 'farmer' ? 'bg-green-500' : 'bg-blue-500'}`} />
                                    {t("profile.account_type", { role: profile?.role === 'farmer' ? t("common.farmer") : t("common.shop") })}
                                </p>
                                <div className="w-full h-px bg-slate-100 my-4" />
                                <div className="w-full space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Mail className="w-4 h-4 text-slate-300" />
                                        <span className="truncate">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-600">
                                        <Clock className="w-4 h-4 text-slate-300" />
                                        <span>{t("profile.joined", { date: new Date(profile?.created_at || '').toLocaleDateString() })}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="card shadow-sm p-2 animate-fade-in-up delay-200">
                                <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                                        <span className="text-sm font-bold text-slate-800">{t("profile.security")}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1" />
                                </button>
                                <button
                                    onClick={() => logout()}
                                    className="w-full p-4 flex items-center justify-between hover:bg-red-50 rounded-2xl transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <LogOut className="w-5 h-5 text-red-500" />
                                        <span className="text-sm font-bold text-red-600">{t("profile.sign_out")}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-red-200 group-hover:translate-x-1" />
                                </button>
                            </div>

                            <button className="flex items-center gap-2 text-red-400 text-xs font-bold px-4 hover:text-red-500 transition-colors mx-auto">
                                <Trash2 className="w-3.5 h-3.5" /> {t("profile.deactivate")}
                            </button>
                        </div>

                        {/* Main Form */}
                        <div className="lg:col-span-8 animate-fade-in-up delay-200">
                            <form onSubmit={handleUpdate} className="card shadow-xl p-6 lg:p-8 space-y-8">

                                {/* Section 1: Personal */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                        <User className="w-5 h-5 text-slate-400" />
                                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs">{t("profile.personal_info")}</h3>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">{t("profile.full_name")}</label>
                                            <input className="input-field" value={fullName} onChange={e => setFullName(e.target.value)} placeholder={t("profile.full_name")} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">{t("profile.phone_number")}</label>
                                            <input className="input-field" value={phone} onChange={e => setPhone(e.target.value)} placeholder={t("profile.phone_number")} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Role Specific */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                        {profile?.role === 'farmer' ? <Sprout className="w-5 h-5 text-green-500" /> : <Building className="w-5 h-5 text-blue-500" />}
                                        <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs">
                                            {profile?.role === 'farmer' ? t("profile.farm_details") : t("profile.shop_details")}
                                        </h3>
                                    </div>

                                    {profile?.role === 'farmer' ? (
                                        <div className="space-y-4">
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">{t("recommendation.district")}</label>
                                                    <select className="input-field appearance-none" value={district} onChange={e => setDistrict(e.target.value)}>
                                                        {TN_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-500 uppercase">{t("profile.village")}</label>
                                                    <input className="input-field" value={village} onChange={e => setVillage(e.target.value)} placeholder={t("profile.village_placeholder")} />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t("dashboard.stats.land_area")}</label>
                                                <input type="number" step="0.1" className="input-field" value={landArea} onChange={e => setLandArea(e.target.value)} placeholder="0.5" />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t("profile.shop_name")}</label>
                                                <input className="input-field" value={shopName} onChange={e => setShopName(e.target.value)} placeholder={t("profile.shop_name_placeholder")} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-500 uppercase">{t("profile.city")}</label>
                                                <select className="input-field appearance-none" value={shopCity} onChange={e => setShopCity(e.target.value)}>
                                                    {TN_DISTRICTS.map(d => <option key={d}>{d}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div>
                                        {success && <p className="text-emerald-600 text-sm font-bold flex items-center gap-1 animate-fade-in-scale">
                                            <ShieldCheck className="w-4 h-4" /> {t("profile.updated_success")}
                                        </p>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary min-w-[140px] justify-center shadow-lg shadow-green-100"
                                    >
                                        {loading ? (
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <><Save className="w-4 h-4 mr-2" /> {t("profile.save_changes")}</>
                                        )}
                                    </button>
                                </div>
                            </form>

                            {/* Notification Preferences */}
                            <div className="mt-8">
                                <NotificationPreferences />
                            </div>

                            {/* Pilot Status (Only for Farmers) */}
                            {profile?.role === 'farmer' && pilotStatus?.is_participant && (
                                <div className="mt-8 bg-linear-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold">Pilot Program Status</h3>
                                                <p className="text-xs text-slate-400">Mission: Coimbatore/Salem Testing</p>
                                            </div>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                                    <span className="text-sm text-slate-400">Training Attendance</span>
                                                    {pilotStatus.training_completed ? (
                                                        <span className="flex items-center gap-1.5 text-xs font-black uppercase text-emerald-400">
                                                            <CheckCircle2 className="w-4 h-4" /> Completed
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-500">
                                                            <AlertCircle className="w-4 h-4" /> Pending
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Assigned Crop</p>
                                                    <p className="text-sm font-bold text-slate-200">{pilotStatus.crop_type || 'General'}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Joined Date</p>
                                                    <p className="text-sm font-bold text-slate-200">{new Date(pilotStatus.joined_date).toLocaleDateString()}</p>
                                                </div>
                                                <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
                                                    <p className="text-[10px] uppercase font-black mb-1">Active Reward</p>
                                                    <p className="text-sm font-black">Early Bird Badge ✨</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </main>
            </div>
        </div>
    );
}
