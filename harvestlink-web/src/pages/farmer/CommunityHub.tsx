import { Sidebar } from "../../components/layout/Sidebar";
import { FeedbackForm } from "../../components/FeedbackForm";
import { CommunityForum } from "../../components/features/CommunityForum";
import { VideoTutorials } from "../../components/features/VideoTutorials";
import { FarmerRatingSystem } from "../../components/features/FarmerRatingSystem";
import { GovernmentSchemes } from "../../components/features/GovernmentSchemes";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Users, MessageSquare, GraduationCap, Landmark, ShieldCheck } from "lucide-react";

export default function CommunityHub() {
    const { } = useAuth();
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar role="farmer" />

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-6 space-y-8">
                    {/* Header */}
                    <div className="flex flex-col gap-1 mb-2 animate-fade-in-up">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Users className="text-emerald-500 w-8 h-8" /> {t("dashboard.community_knowledge_hub")}
                        </h1>
                        <p className="text-slate-500 font-medium italic">Learn, grow, and share with the HarvestLink community</p>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column: Community & Learning */}
                        <div className="xl:col-span-2 space-y-8">
                            <motion.section 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl w-fit text-xs font-bold uppercase tracking-wider">
                                    <MessageSquare size={14} /> Peer Discussions
                                </div>
                                <CommunityForum />
                            </motion.section>

                            <motion.section 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl w-fit text-xs font-bold uppercase tracking-wider">
                                    <GraduationCap size={14} /> Knowledge Academy
                                </div>
                                <VideoTutorials />
                            </motion.section>
                        </div>

                        {/* Right Column: Feedback, Rating & Schemes */}
                        <div className="space-y-8">
                            <motion.section 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-xl w-fit text-xs font-bold uppercase tracking-wider">
                                    <MessageSquare size={14} /> Platform Assessment
                                </div>
                                <FeedbackForm />
                            </motion.section>

                            <motion.section 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl w-fit text-xs font-bold uppercase tracking-wider">
                                    <ShieldCheck size={14} /> Community Trust & Ratings
                                </div>
                                <FarmerRatingSystem />
                            </motion.section>
                        </div>
                    </div>

                    {/* Full Width Bottom Section: Government Schemes (Landscape) */}
                    <motion.section 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-4 pt-4 border-t border-slate-100"
                    >
                        <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-xl w-fit text-xs font-bold uppercase tracking-wider">
                            <Landmark size={14} /> Government Schemes & Subsidies
                        </div>
                        <GovernmentSchemes />
                    </motion.section>
                </main>
            </div>
        </div>
    );
}
