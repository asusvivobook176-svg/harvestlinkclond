import { apiFetch } from "./api";

export interface ActivityData {
    user_id: number;
    feature: string;
    action?: string;
}

export interface FeedbackData {
    user_id: number;
    content: string;
    feedback_type?: string;
    prediction_accurate?: boolean;
    rating?: number;
}

export interface TrainingData {
    farmer_id: number;
    crop_advisor?: boolean;
    price_alerts?: boolean;
    spoilage_checker?: boolean;
    status?: string;
    duration?: number;
}

export interface PilotStats {
    total_farmers: number;
    trained_farmers: number;
    feature_usage: Record<string, number>;
    prediction_accuracy: number;
    total_feedback: number;
    adoption_rate: number;
    avg_logins_per_week: number;
    locations: Record<string, number>;
    crops: Record<string, number>;
}

export const pilotService = {
    // ... existing ...
    logActivity: async (data: ActivityData) => {
        return apiFetch("/pilot/activity", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    submitFeedback: async (data: FeedbackData) => {
        return apiFetch("/pilot/feedback", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    getStats: async (): Promise<PilotStats> => {
        return apiFetch("/pilot/stats");
    },

    getParticipants: async () => {
        return apiFetch("/pilot/participants");
    },

    addParticipant: async (data: any) => {
        return apiFetch("/pilot/participants", {
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    logTraining: async (data: TrainingData) => {
        return apiFetch("/pilot/training", {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
};
