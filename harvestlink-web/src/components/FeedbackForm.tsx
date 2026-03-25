import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { pilotService } from "../services/pilot";
import { MessageSquare, Star, CheckCircle2, ThumbsUp, ThumbsDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export function FeedbackForm() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Standard fields
    const [feedbackType] = useState("Survey");

    // Expanded survey fields
    const [survey, setSurvey] = useState({
        overall_satisfaction: 5,
        crop_advisor_rating: 5,
        price_alerts_rating: 5,
        spoilage_rating: 5,
        marketplace_rating: 5,
        crop_accuracy: true,
        price_accuracy: true,
        spoilage_accuracy: true,
        bugs_found: 0,
        bug_description: "",
        easy_to_use: true,
        usability_comments: "",
        language_sufficient: true,
        suggestions: "",
        would_recommend: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setLoading(true);
        try {
            // Store structured survey as JSON in content field for now
            // or pass as a separate object if backend is ready (it is now!)
            await pilotService.submitFeedback({
                user_id: user.id,
                content: JSON.stringify(survey),
                feedback_type: feedbackType,
                rating: survey.overall_satisfaction,
                prediction_accurate: survey.crop_accuracy && survey.price_accuracy && survey.spoilage_accuracy
            });
            setSubmitted(true);
        } catch (err) {
            console.error("Feedback submission failed:", err);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="card text-center p-12 bg-emerald-50 border-emerald-200 animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">{t("feedback.feedback_saved")}</h3>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto">{t("feedback.thank_you")}</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all"
                >
                    {t("feedback.submit_another")}
                </button>
            </div>
        );
    }

    const StarRating = ({ value, onChange, label }: { value: number, onChange: (v: number) => void, label: string }) => (
        <div className="space-y-2">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(s => (
                    <button key={s} type="button" onClick={() => onChange(s)} className="focus:outline-none transition-transform hover:scale-110">
                        <Star className={`w-6 h-6 ${s <= value ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
                    </button>
                ))}
            </div>
        </div>
    );

    const BinarySelect = ({ value, onChange, label }: { value: boolean, onChange: (v: boolean) => void, label: string }) => (
        <div className="space-y-2">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{label}</p>
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => onChange(true)}
                    className={`flex-1 py-2 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${value ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-100 text-slate-400"}`}
                >
                    <ThumbsUp className="w-4 h-4" /> {t("common.yes")}
                </button>
                <button
                    type="button"
                    onClick={() => onChange(false)}
                    className={`flex-1 py-2 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${!value ? "border-red-500 bg-red-50 text-red-700" : "border-slate-100 text-slate-400"}`}
                >
                    <ThumbsDown className="w-4 h-4" /> {t("common.no")}
                </button>
            </div>
        </div>
    );

    return (
        <div className="card shadow-xl border-white/50 space-y-6 p-6">
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-slate-900">{t("common.feedback")}</h2>
                    <p className="text-slate-500 text-[10px] font-medium uppercase tracking-wider">{t("feedback.pilot_program_assessment")}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Overall Satisfaction */}
                <section className="space-y-4">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t("feedback.overall_experience")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <StarRating
                            label={t("feedback.overall_satisfaction")}
                            value={survey.overall_satisfaction}
                            onChange={v => setSurvey({ ...survey, overall_satisfaction: v })}
                        />
                        <BinarySelect
                            label={t("feedback.would_recommend")}
                            value={survey.would_recommend}
                            onChange={v => setSurvey({ ...survey, would_recommend: v })}
                        />
                    </div>
                </section>

                {/* 2. Feature Ratings */}
                <section className="space-y-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t("feedback.feature_ratings_section")}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <StarRating label={t("feedback.crop_advisor")} value={survey.crop_advisor_rating} onChange={v => setSurvey({ ...survey, crop_advisor_rating: v })} />
                        <StarRating label={t("feedback.price_alerts")} value={survey.price_alerts_rating} onChange={v => setSurvey({ ...survey, price_alerts_rating: v })} />
                    </div>
                </section>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                >
                    {loading ? <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin" /> : "Submit Feedback →"}
                </button>
            </form>
        </div>
    );
}
