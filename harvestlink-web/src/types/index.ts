// ─── User / Auth Types ────────────────────────────────────────
export type UserRole = "farmer" | "shop" | "admin" | "wholesale_trader";

export interface Profile {
    id: string;
    role: UserRole;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    created_at: string;
}

// ─── Farmer ───────────────────────────────────────────────────
export type SoilType = "Red" | "Black" | "Sandy" | "Loamy";
export type WaterAvailability = "Low" | "Medium" | "High";
export type IrrigationType = "Drip" | "Flood" | "Rain-fed";

export interface Farmer {
    id: string;
    user_id: string;
    name: string;
    phone: string | null;
    village: string | null;
    district: string | null;
    land_area: number | null;
    soil_type: SoilType | null;
    water_availability: WaterAvailability | null;
    irrigation_type: IrrigationType | null;
    created_at: string;
}

// ─── Shop ─────────────────────────────────────────────────────
export interface Shop {
    id: string;
    user_id: string;
    owner_name: string;
    shop_name: string | null;
    location: string | null;
    city: string | null;
    phone: string | null;
    vegetables_needed: string[] | null;
    created_at: string;
}

// ─── Marketplace ──────────────────────────────────────────────
export type ListingStatus = "available" | "sold" | "expired";
export type DemandStatus = "open" | "fulfilled" | "expired";
export type UrgencyLevel = "Low" | "Medium" | "High";

export interface CropListing {
    id: string;
    farmer_id: string;
    crop_name: string;
    quantity_kg: number | null;
    asking_price_rs: number | null;
    harvest_date: string | null;
    district: string | null;
    description: string | null;
    status: ListingStatus;
    created_at: string;
}

export interface DemandPost {
    id: string;
    shop_id: string;
    vegetable_name: string;
    quantity_kg: number | null;
    max_price_rs: number | null;
    urgency: UrgencyLevel | null;
    city: string | null;
    status: DemandStatus;
    created_at: string;
}

// ─── ML Results ───────────────────────────────────────────────
export interface Recommendation {
    id: string;
    farmer_id: string;
    recommended_crop: string;
    confidence_score: number;
    top_3_crops: { crop: string; probability: number }[];
    input_data: Record<string, unknown>;
    season: string | null;
    created_at: string;
}

export type SeverityLevel = "None" | "Mild" | "Severe";
export type RiskLevel = "Low" | "Medium" | "High";

export interface PriceAlert {
    id: string;
    vegetable_name: string | null;
    district: string | null;
    current_price: number | null;
    predicted_price: number | null;
    crash_alert: boolean | null;
    severity: SeverityLevel | null;
    recommended_action: string | null;
    created_at: string;
}

export interface DemandForecast {
    id: string;
    vegetable_name: string | null;
    city: string | null;
    month: number | null;
    year: number | null;
    predicted_demand_kg: number | null;
    predicted_price_rs: number | null;
    festival_week: boolean | null;
    created_at: string;
}

export interface SpoilageCheck {
    id: string;
    farmer_id: string;
    vegetable_type: string | null;
    risk_level: RiskLevel | null;
    days_remaining: number | null;
    recommended_action: string | null;
    input_data: Record<string, unknown>;
    created_at: string;
}

// ─── TN Constants ─────────────────────────────────────────────
export const TN_DISTRICTS = [
    "Salem", "Coimbatore", "Madurai", "Chennai", "Trichy",
    "Vellore", "Thanjavur", "Tirunelveli", "Erode", "Tirupur",
    "Dindigul", "Cuddalore", "Kanchipuram", "Tiruvannamalai",
];

export const TN_VEGETABLES = [
    "Tomato", "Onion", "Brinjal", "Beans", "Okra",
    "Carrot", "Greens", "Drumstick", "Banana", "Potato",
];

export const PREVIOUS_CROPS = [
    "Rice", "Wheat", "Maize", "Sugarcane", "Cotton",
    "Groundnut", "Sunflower", "Turmeric", "Ginger", "None",
];

export const SOIL_TYPES: SoilType[] = ["Red", "Black", "Sandy", "Loamy"];
