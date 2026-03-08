import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { useAuth } from "./hooks/useAuth";
import { PageLoader } from "./components/shared/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { ChatbotWidget } from "./components/ChatbotWidget";
import { MarketChatbot } from "./components/MarketChatbot";
import SplashCursor from "./components/SplashCursor";
import TargetCursor from "./components/TargetCursor";
import { AuthProvider } from "./contexts/AuthContext";
import { CursorEffectProvider, useCursorEffect } from "./contexts/CursorEffectContext";

// Eagerly loaded pages
import IndexPage from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import FarmerDashboard from "./pages/farmer/Dashboard";
import CropRecommendation from "./pages/farmer/CropRecommendation";
import PriceAlerts from "./pages/farmer/PriceAlerts";
import SpoilageChecker from "./pages/farmer/SpoilageChecker";
import ShopDashboard from "./pages/shop/Dashboard";
import Marketplace from "./pages/Marketplace";
import Profile from "./pages/Profile";
import FarmerFeedback from "./pages/farmer/Feedback";

// Lazily loaded pages
const PilotDashboard = lazy(() => import("./pages/admin/PilotDashboard"));
const PilotMonitoring = lazy(() => import("./pages/admin/PilotMonitoring"));
const TrainingPortal = lazy(() => import("./pages/farmer/TrainingPortal"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

// Auth guard component
function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();
  const { t } = useTranslation();
  if (loading || (user && !profile)) return <PageLoader text={t("common.loading_session")} />;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    if (profile.role === "farmer") return <Navigate to="/farmer/dashboard" replace />;
    if (profile.role === "shop") return <Navigate to="/shop/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}

// Redirect already-logged-in users away from /login and /register
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const { t } = useTranslation();
  if (loading) return <PageLoader text={t("common.loading_session")} />;
  if (user && profile) {
    if (profile.role === "farmer") return <Navigate to="/farmer/dashboard" replace />;
    if (profile.role === "shop") return <Navigate to="/shop/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}


function SmartChatbots() {
  const { profile } = useAuth();

  if (!profile) return null;

  if (profile.role === 'farmer') {
    return <ChatbotWidget />;
  }

  if (profile.role === 'shop' || profile.role === 'wholesale_trader') {
    return <MarketChatbot />;
  }

  return null;
}

function AppInner() {
  const { splashCursorEnabled } = useCursorEffect();
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<IndexPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/marketplace" element={<Marketplace />} />

          {/* Farmer Routes */}
          <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={["farmer"]}><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/farmer/recommend" element={<ProtectedRoute allowedRoles={["farmer"]}><CropRecommendation /></ProtectedRoute>} />
          <Route path="/farmer/alerts" element={<ProtectedRoute allowedRoles={["farmer"]}><PriceAlerts /></ProtectedRoute>} />
          <Route path="/farmer/spoilage" element={<ProtectedRoute allowedRoles={["farmer"]}><SpoilageChecker /></ProtectedRoute>} />
          <Route path="/farmer/crops" element={<ProtectedRoute allowedRoles={["farmer"]}><Marketplace /></ProtectedRoute>} />
          <Route path="/farmer/training" element={<ProtectedRoute allowedRoles={["farmer"]}><TrainingPortal /></ProtectedRoute>} />

          {/* Shop Routes */}
          <Route path="/shop/dashboard" element={<ProtectedRoute allowedRoles={["shop"]}><ShopDashboard /></ProtectedRoute>} />
          <Route path="/shop/demands" element={<ProtectedRoute allowedRoles={["shop"]}><Marketplace /></ProtectedRoute>} />
          <Route path="/shop/forecast" element={<ProtectedRoute allowedRoles={["shop"]}><ShopDashboard /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/pilot" element={<ProtectedRoute allowedRoles={["admin"]}><PilotMonitoring /></ProtectedRoute>} />
          <Route path="/admin/command" element={<ProtectedRoute allowedRoles={["admin"]}><PilotDashboard /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />

          {/* Shared */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute><FarmerFeedback /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <SmartChatbots />
        {splashCursorEnabled && <SplashCursor />}
        <TargetCursor />
      </Suspense>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CursorEffectProvider>
        <AppInner />
      </CursorEffectProvider>
    </AuthProvider>
  );
}
