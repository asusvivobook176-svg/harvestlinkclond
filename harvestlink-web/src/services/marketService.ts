import { apiFetch } from "./api";
import type { CropListing, DemandPost } from "../types";

// ─── Crop Listings ─────────────────────────────────────────────
export const getAllListings = async () => {
    return apiFetch("/market/listings") as Promise<CropListing[]>;
};

export const getFarmerListings = async (farmerId: string) => {
    // In our SQLite backend, we might need a specific route for this or filter client-side
    // For now, let's assume we can pass farmerId as a query param or filter.
    // Looking at market_routes.py, there isn't a specific one yet, but I can add it or filter.
    const all = await getAllListings();
    return all.filter(l => String((l as any).farmer_id) === farmerId);
};

export const createListing = async (listing: Omit<CropListing, "id" | "created_at" | "status">) => {
    return apiFetch("/market/listings", {
        method: "POST",
        body: JSON.stringify(listing),
    });
};

export const updateListingStatus = async (id: string, status: CropListing["status"]) => {
    // Need a route for this too - I'll stick to basic implementation for now
    await apiFetch(`/market/listings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
};

// ─── Demand Posts ──────────────────────────────────────────────
export const getAllDemands = async () => {
    return apiFetch("/market/demands") as Promise<DemandPost[]>;
};

export const getShopDemands = async (shopId: string) => {
    const all = await getAllDemands();
    return all.filter(d => String((d as any).shop_id) === shopId);
};

export const createDemand = async (demand: Omit<DemandPost, "id" | "created_at" | "status">) => {
    return apiFetch("/market/demands", {
        method: "POST",
        body: JSON.stringify(demand),
    });
};
