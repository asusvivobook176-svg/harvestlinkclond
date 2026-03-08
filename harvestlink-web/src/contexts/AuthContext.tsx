import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../services/api";
import type { Profile, Farmer, Shop, UserRole } from "../types";

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    farmer: Farmer | null;
    shop: Shop | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (
        email: string,
        password: string,
        role: UserRole,
        fullName: string,
        phone: string,
        details: Partial<Farmer> | Partial<Shop>
    ) => Promise<any>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [farmer, setFarmer] = useState<Farmer | null>(null);
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchExtendedProfile = useCallback(async (userId: number, role: UserRole) => {
        try {
            if (role === "farmer") {
                const data = await apiFetch(`/farmer/${userId}`);
                setFarmer(data as Farmer);
            } else if (role === "shop") {
                const data = await apiFetch(`/shop/${userId}`);
                setShop(data as Shop);
            }
        } catch (err) {
            console.error("Error fetching extended profile:", err);
        }
    }, []);

    const fetchProfile = useCallback(async (userId: number) => {
        try {
            const data = await apiFetch(`/auth/profile/${userId}`);
            if (data) {
                setProfile({
                    id: String(data.id),
                    role: data.role as UserRole,
                    full_name: data.name as string,
                    email: data.email as string,
                    phone: (data.phone as string) || null,
                    created_at: (data.created_at as string) || new Date().toISOString(),
                });
                await fetchExtendedProfile(data.id, data.role as UserRole);
            }
        } catch (err) {
            console.error("Error fetching profile — clearing session:", err);
            localStorage.removeItem("harvestlink_token");
            localStorage.removeItem("harvestlink_user");
            setUser(null);
            setProfile(null);
        }
    }, [fetchExtendedProfile]);

    useEffect(() => {
        const storedUser = localStorage.getItem("harvestlink_user");
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                fetchProfile(parsedUser.id).finally(() => setLoading(false));
            } catch {
                localStorage.removeItem("harvestlink_token");
                localStorage.removeItem("harvestlink_user");
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, [fetchProfile]);

    const login = useCallback(async (email: string, password: string) => {
        setLoading(true);
        try {
            const data = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            });

            localStorage.setItem("harvestlink_token", data.token);
            localStorage.setItem("harvestlink_user", JSON.stringify(data.user));
            setUser(data.user);
            await fetchProfile(data.user.id);
            return data;
        } finally {
            setLoading(false);
        }
    }, [fetchProfile]);

    const register = useCallback(async (
        email: string,
        password: string,
        role: UserRole,
        fullName: string,
        phone: string,
        details: Partial<Farmer> | Partial<Shop>
    ) => {
        setLoading(true);
        try {
            await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({ email, password, name: fullName, role }),
            });

            const loginData = await login(email, password);
            const userId = loginData.user.id;

            if (role === "farmer") {
                await apiFetch("/farmer/register", {
                    method: "POST",
                    body: JSON.stringify({ user_id: userId, name: fullName, phone, ...details }),
                });
            } else if (role === "shop") {
                await apiFetch("/shop/register", {
                    method: "POST",
                    body: JSON.stringify({
                        user_id: userId,
                        owner_name: fullName,
                        shop_name: ("shop_name" in details ? details.shop_name : fullName) as string,
                        phone,
                        ...details
                    }),
                });
            }

            await fetchProfile(userId);
            return loginData;
        } finally {
            setLoading(false);
        }
    }, [login, fetchProfile]);

    const logout = useCallback(async () => {
        localStorage.removeItem("harvestlink_token");
        localStorage.removeItem("harvestlink_user");
        setUser(null);
        setProfile(null);
        setFarmer(null);
        setShop(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, farmer, shop, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
