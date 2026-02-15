import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import Contact from './pages/support/Contact';
import CookiePolicy from './pages/support/CookiePolicy';
import HelpCenter from './pages/support/HelpCenter';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LocationProvider } from './context/LocationContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Home from './pages/Home';
import RestaurantList from './pages/RestaurantList';
import RestaurantDetails from './pages/RestaurantDetails';
import Login from './pages/Login';
import LoginTest from './pages/LoginTest';
import DebugLogin from './pages/DebugLogin';
import ComprehensiveDebug from './pages/ComprehensiveDebug';
import SimpleLoginTest from './pages/SimpleLoginTest';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import FAQ from './pages/support/FAQ';
import BecomePartner from './pages/support/BecomePartner';
import Terms from './pages/support/Terms';
import Privacy from './pages/support/Privacy';
import PremiumService from './pages/PremiumService';
import AboutUs from './pages/AboutUs';
import CustomerDashboard from './pages/CustomerDashboard';
import RiderDashboard from './pages/RiderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import RestaurantDashboard from './pages/RestaurantDashboard';
import GlobalMapView from './components/GlobalMapView';
import Footer from './components/Footer';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to role-specific dashboard
  switch (user.role) {
    case 'admin':
      return <Navigate to="/dashboard/admin" replace />;
    case 'rider':
      return <Navigate to="/dashboard/rider" replace />;
    case 'restaurant':
      return <Navigate to="/dashboard/restaurant" replace />;
    default:
      return <Navigate to="/dashboard/customer" replace />;
  }
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ScrollToTop />
        <LocationProvider>
          <NotificationProvider>
            <SocketProvider>
              <CartProvider>
                <div className="app">
                  <Navbar />
                  <FloatingWhatsApp phoneNumber="+923211234567" />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/restaurants" element={<RestaurantList />} />
                    <Route
                      path="/restaurant/:id"
                      element={<RestaurantDetails />}
                    />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login-test" element={<LoginTest />} />
                    <Route path="/debug-login" element={<DebugLogin />} />
                    <Route
                      path="/comprehensive-debug"
                      element={<ComprehensiveDebug />}
                    />
                    <Route path="/simple-test" element={<SimpleLoginTest />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/help" element={<HelpCenter />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/become-partner" element={<BecomePartner />} />

                    <Route path="/premium" element={<PremiumService />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/map" element={<GlobalMapView />} />

                    {/* Dashboard Routes */}
                    <Route path="/dashboard" element={<DashboardRedirect />} />
                    <Route
                      path="/dashboard/customer"
                      element={
                        <ProtectedRoute allowedRoles={['customer']}>
                          <CustomerDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/rider"
                      element={
                        <ProtectedRoute allowedRoles={['rider']}>
                          <RiderDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/admin"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/dashboard/restaurant"
                      element={
                        <ProtectedRoute allowedRoles={['restaurant']}>
                          <RestaurantDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/cookies" element={<CookiePolicy />} />
                  </Routes>
                  <Footer />
                </div>
                <CookieBanner />
                <Toaster position="top-right" />
              </CartProvider>
            </SocketProvider>
          </NotificationProvider>
        </LocationProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
