import { Sidebar } from "../../components/layout/Sidebar";
import { FeedbackForm } from "../../components/FeedbackForm";
import { MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function FarmerFeedback() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen bg-green-50/50">
            <Sidebar role="farmer" />
            <div className="flex-1 flex flex-col min-w-0">
                <main className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-6">
                    <div className="animate-fade-in-up">
                        <p className="text-green-600 text-sm font-semibold mb-1 flex items-center gap-1.5">
                            <MessageSquare className="w-4 h-4" /> {t("feedback.pilot_program")}
                        </p>
                        <h1 className="text-3xl font-black text-gray-900">{t("feedback.title")}</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {t("feedback.subtitle")}
                        </p>
                    </div>

                    <FeedbackForm />

                    <div className="card bg-indigo-50 border-indigo-100 flex items-start gap-4">
                        <div className="bg-indigo-600 p-2 rounded-lg text-white">
                            <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900 text-sm">{t("feedback.need_immediate_help")}</h3>
                            <p className="text-indigo-700 text-xs mt-0.5">
                                {t("feedback.join_whatsapp")}
                            </p>
                            <a
                                href="https://wa.me/yourgroup"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                            >
                                {t("feedback.open_whatsapp")}
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
