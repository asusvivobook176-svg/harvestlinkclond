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
// import MyCrops from "./pages/farmer/MyCrops";
// import MarketIntelligence from "./pages/farmer/MarketIntelligence";
import MyDemands from "./pages/shop/MyDemands";
import Transactions from "./pages/shop/Transactions";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import UserManagement from "./pages/admin/UserManagement";
import SupportManagement from "./pages/admin/SupportManagement";
import PilotDashboard from "./pages/admin/PilotDashboard";
import PilotMonitoring from "./pages/admin/PilotMonitoring";
import MLMonitor from "./pages/admin/MLMonitor";

// Lazily loaded pages
const TrainingPortal = lazy(() => import("./pages/farmer/TrainingPortal"));
const MyCrops = lazy(() => import("./pages/farmer/MyCrops"));
const MarketIntelligence = lazy(() => import("./pages/farmer/MarketIntelligence"));
const WeatherIntelligence = lazy(() => import("./pages/farmer/WeatherIntelligence"));
const AITools = lazy(() => import("./pages/farmer/AITools"));
const CommunityHub = lazy(() => import("./pages/farmer/CommunityHub"));
const CropCalendar = lazy(() => import("./pages/farmer/CropCalendar"));
const SoilAnalysis = lazy(() => import("./pages/farmer/SoilAnalysis"));
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
          <Route path="/feedback" element={<ProtectedRoute allowedRoles={["farmer"]}><CommunityHub /></ProtectedRoute>} />
          <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={["farmer"]}><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/farmer/recommend" element={<ProtectedRoute allowedRoles={["farmer"]}><CropRecommendation /></ProtectedRoute>} />
          <Route path="/farmer/alerts" element={<ProtectedRoute allowedRoles={["farmer"]}><PriceAlerts /></ProtectedRoute>} />
          <Route path="/farmer/spoilage" element={<ProtectedRoute allowedRoles={["farmer"]}><SpoilageChecker /></ProtectedRoute>} />
          <Route path="/farmer/crops" element={<ProtectedRoute allowedRoles={["farmer"]}><MyCrops /></ProtectedRoute>} />
          <Route path="/farmer/intelligence" element={<ProtectedRoute allowedRoles={["farmer"]}><MarketIntelligence /></ProtectedRoute>} />
          <Route path="/farmer/weather" element={<ProtectedRoute allowedRoles={["farmer"]}><WeatherIntelligence /></ProtectedRoute>} />
          <Route path="/farmer/ai-tools" element={<ProtectedRoute allowedRoles={["farmer"]}><AITools /></ProtectedRoute>} />
          <Route path="/farmer/training" element={<ProtectedRoute allowedRoles={["farmer"]}><TrainingPortal /></ProtectedRoute>} />
          <Route path="/farmer/calendar" element={<ProtectedRoute allowedRoles={["farmer"]}><CropCalendar /></ProtectedRoute>} />
          <Route path="/farmer/soil-lab" element={<ProtectedRoute allowedRoles={["farmer"]}><SoilAnalysis /></ProtectedRoute>} />

          {/* Shop Routes */}
          <Route path="/shop/dashboard" element={<ProtectedRoute allowedRoles={["shop"]}><ShopDashboard /></ProtectedRoute>} />
          <Route path="/shop/demands" element={<ProtectedRoute allowedRoles={["shop"]}><MyDemands /></ProtectedRoute>} />
          <Route path="/shop/transactions" element={<ProtectedRoute allowedRoles={["shop"]}><Transactions /></ProtectedRoute>} />
          <Route path="/shop/forecast" element={<ProtectedRoute allowedRoles={["shop"]}><ShopDashboard /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/analytics" replace />} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAnalytics /></ProtectedRoute>} />
          <Route path="/admin/ml-monitor" element={<ProtectedRoute allowedRoles={["admin"]}><MLMonitor /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/support" element={<ProtectedRoute allowedRoles={["admin"]}><SupportManagement /></ProtectedRoute>} />
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
