import { Sidebar } from "../../components/layout/Sidebar";
import { PestDetection } from "../../components/features/PestDetection";
import { DocumentManagement } from "../../components/features/DocumentManagement";
import { useAuth } from "../../hooks/useAuth";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Bot, FileText } from "lucide-react";

export default function AITools() {
    const { farmer } = useAuth();
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <Sidebar role="farmer" />

            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-6 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-1 mb-2 animate-fade-in-up">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <Bot className="text-emerald-500 w-8 h-8" /> {t("dashboard.ai_tools_document_vault")}
                        </h1>
                        <p className="text-slate-500 font-medium italic">Advanced AI diagnostics & secure agricultural storage for {farmer?.name}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl w-fit text-xs font-bold uppercase tracking-wider">
                                <Bot size={14} /> AI Diagnostic Tool
                            </div>
                            <PestDetection />
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl w-fit text-xs font-bold uppercase tracking-wider">
                                <FileText size={14} /> Secure Document Vault
                            </div>
                            <DocumentManagement />
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
