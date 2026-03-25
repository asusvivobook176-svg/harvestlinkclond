import { Sidebar } from "../../components/layout/Sidebar";
import { WeatherAlertsSection } from "../../components/WeatherAlertsSection";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";

export default function WeatherIntelligence() {
    const { farmer } = useAuth();

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar role="farmer" />

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-6 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-1 mb-2 animate-fade-in-up">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Weather Intelligence Center</h1>
                        <p className="text-slate-500 font-medium">Advanced meteorology for your farm in {farmer?.district || "Salem"}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
                        >
                            <WeatherAlertsSection farmLocation={{ lat: 11.6643, lng: 78.1460, district: farmer?.district || "Salem" }} />
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
