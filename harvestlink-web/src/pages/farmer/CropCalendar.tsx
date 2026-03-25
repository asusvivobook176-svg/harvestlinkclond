import { SmartCropCalendar } from "../../components/features/SmartCropCalendar";
import { Sidebar } from "../../components/layout/Sidebar";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export default function CropCalendar() {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar role="farmer" />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-8 space-y-10">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-1"
                        >
                            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider">
                                <Calendar className="w-4 h-4" />
                                <span>Planning Suite</span>
                            </div>
                            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Agricultural Calendar</h1>
                            <p className="text-slate-500 font-medium">Strategic planning from seed to market with AI-driven insights.</p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <SmartCropCalendar />
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
