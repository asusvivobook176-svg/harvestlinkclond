import { useTranslation } from "react-i18next";
interface SpinnerProps { size?: "sm" | "md" | "lg"; text?: string; className?: string; }

export function LoadingSpinner({ size = "md", text, className = "" }: SpinnerProps) {
    const sizes = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-12 h-12" };
    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <div className={`${sizes[size]} border-3 border-green-100 border-t-green-500 rounded-full animate-spin`}
                style={{ borderWidth: size === "sm" ? 2 : 3 }} />
            {text && <p className="text-gray-500 text-sm font-medium animate-pulse">{text}</p>}
        </div>
    );
}

export function PageLoader({ text }: { text?: string }) {
    const { t } = useTranslation();
    return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center">
            <div className="text-center animate-fade-in-scale">
                <div className="relative w-20 h-20 mx-auto mb-6">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-green-100" />
                    {/* Spinning arc */}
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin" />
                    {/* Center emoji */}
                    <div className="absolute inset-0 flex items-center justify-center text-3xl animate-float">🌾</div>
                </div>
                <p className="font-semibold text-gray-600">{text || t("common.loading")}</p>
                <p className="text-green-500 text-xs mt-1">{t("common.harvest_link_tagline")}</p>
            </div>
        </div>
    );
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
    return (
        <div className="card space-y-3">
            <div className="skeleton h-4 w-3/4 rounded-lg" />
            {Array.from({ length: lines - 1 }).map((_, i) => (
                <div key={i} className={`skeleton h-3 rounded-lg ${i % 2 === 0 ? "w-full" : "w-5/6"}`} />
            ))}
        </div>
    );
}

export function SkeletonText({ lines = 2, className = "" }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className={`skeleton h-3 rounded ${i === lines - 1 ? "w-4/6" : "w-full"}`} />
            ))}
        </div>
    );
}
