import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

import AppNavbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public pages
import HomePage from './pages/public/HomePage';
import ExplorePage from './pages/public/ExplorePage';
import CityPage from './pages/public/CityPage';
import HiddenGemsPage from './pages/public/HiddenGemsPage';
import LeaderboardPage from './pages/public/LeaderboardPage';
import BlogListPage from './pages/public/BlogListPage';
import BlogDetailPage from './pages/public/BlogDetailPage';
import { NotFoundPage, AboutPage, FAQPage, TermsPage, PrivacyPage } from './pages/public/StaticPages';
import HotelPage from "./pages/public/HotelPage";
import PlacePage from "./pages/public/PlacePage";
import BudgetPage from './pages/public/BudgetPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// User pages
import DashboardPage from './pages/user/DashboardPage';
import TripPlannerPage from './pages/user/TripPlannerPage';
import MyTripsPage from './pages/user/MyTripsPage';
import TripDetailPage from './pages/user/TripDetailPage';
import MyBookingsPage from './pages/user/MyBookingsPage';
import WishlistPage from './pages/user/WishlistPage';
import TravelHistoryPage from './pages/user/TravelHistoryPage';
import ProfilePage from './pages/user/ProfilePage';
import SettingsPage from './pages/user/SettingsPage';
import SupportPage from './pages/user/SupportPage';
import BlogWritePage from './pages/user/BlogWritePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminRefunds from './pages/admin/AdminRefunds';
import AdminSupport from './pages/admin/AdminSupport';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminBlogs from './pages/admin/AdminBlogs';
import { AdminCities, AdminPlaces, AdminHotels, AdminHiddenGems, AdminFoodShops, AdminEvents } from './pages/admin/AdminContent';

// Layout wrapper for public pages
const PublicLayout = ({ children }) => (
  <>
    <AppNavbar />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* ─── PUBLIC ROUTES ────────────────────────────── */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/explore" element={<PublicLayout><ExplorePage /></PublicLayout>} />
            <Route path="/city/:id" element={<CityPage />} />
            <Route path="/hotel/:id" element={<PublicLayout><HotelPage /></PublicLayout>} />
<Route path="/place/:id" element={<PublicLayout><PlacePage /></PublicLayout>} />
            <Route path="/hidden-gems" element={<HiddenGemsPage />} />
            <Route
  path="/budget"
  element={
    <PublicLayout>
      <BudgetPage />
    </PublicLayout>
  }
/>
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/blogs" element={<BlogListPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/faq" element={<PublicLayout><FAQPage /></PublicLayout>} />
            <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />
            <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />

            {/* ─── AUTH ROUTES ──────────────────────────────── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* ─── USER ROUTES (protected) ──────────────────── */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/plan-trip" element={<ProtectedRoute><TripPlannerPage /></ProtectedRoute>} />
            <Route path="/my-trips" element={<ProtectedRoute><MyTripsPage /></ProtectedRoute>} />
            <Route path="/my-trips/:id" element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><TravelHistoryPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
            <Route path="/blogs/write" element={<ProtectedRoute><BlogWritePage /></ProtectedRoute>} />
            <Route path="/blogs/edit/:id" element={<ProtectedRoute><BlogWritePage /></ProtectedRoute>} />

            {/* ─── ADMIN ROUTES (admin only) ────────────────── */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/cities" element={<AdminRoute><AdminCities /></AdminRoute>} />
            <Route path="/admin/places" element={<AdminRoute><AdminPlaces /></AdminRoute>} />
            <Route path="/admin/hotels" element={<AdminRoute><AdminHotels /></AdminRoute>} />
            <Route path="/admin/hidden-gems" element={<AdminRoute><AdminHiddenGems /></AdminRoute>} />
            <Route path="/admin/food-shops" element={<AdminRoute><AdminFoodShops /></AdminRoute>} />
            <Route path="/admin/events" element={<AdminRoute><AdminEvents /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><MyBookingsPage /></AdminRoute>} />
            <Route path="/admin/refunds" element={<AdminRoute><AdminRefunds /></AdminRoute>} />
            <Route path="/admin/blogs" element={<AdminRoute><AdminBlogs /></AdminRoute>} />
            <Route path="/admin/support" element={<AdminRoute><AdminSupport /></AdminRoute>} />
            <Route path="/admin/announcements" element={<AdminRoute><AdminAnnouncements /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />

            {/* ─── 404 ──────────────────────────────────────── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
