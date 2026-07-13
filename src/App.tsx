import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import { AuthErrorBanner } from './components/AuthErrorBanner';
import PlatformNavbar from './components/PlatformNavbar';
import BrandLayout from './components/BrandLayout';
import { useBrand } from './components/BrandProvider';
import LandingPage from './pages/LandingPage';
import RegisterBrand from './pages/RegisterBrand';
import StaffLogin from './pages/StaffLogin';
import SuperAdmin from './pages/SuperAdmin';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import Cart from './pages/Cart';

// --- Platform-level protected route (superadmin only) ---
function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user || profile?.role !== 'superadmin') return <Navigate to="/staff-login" />;

  return <>{children}</>;
}

// --- Brand-scoped protected routes ---
function CustomerRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { slug } = useBrand();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to={`/b/${slug}`} />;

  return <>{children}</>;
}

function BrandAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const { brandId, slug } = useBrand();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-black">
      <div className="w-12 h-12 border-4 border-primary-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user || profile?.role !== 'brand_admin' || profile.brandId !== brandId) {
    return <Navigate to={`/b/${slug}`} />;
  }

  return <>{children}</>;
}

// --- Platform-level layout (landing, register, staff login, superadmin) ---
function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PlatformNavbar />
      <AuthErrorBanner />
      <main className="flex-grow">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Platform-level routes */}
          <Route path="/" element={<PlatformLayout><LandingPage /></PlatformLayout>} />
          <Route path="/register-brand" element={<PlatformLayout><RegisterBrand /></PlatformLayout>} />
          <Route path="/staff-login" element={<PlatformLayout><StaffLogin /></PlatformLayout>} />
          <Route path="/superadmin" element={<PlatformLayout><SuperAdminRoute><SuperAdmin /></SuperAdminRoute></PlatformLayout>} />

          {/* Brand storefront routes, scoped by :slug */}
          <Route path="/b/:slug" element={<BrandLayout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="cart" element={<CustomerRoute><Cart /></CustomerRoute>} />
            <Route path="orders" element={<CustomerRoute><Orders /></CustomerRoute>} />
            <Route path="admin" element={<BrandAdminRoute><Admin /></BrandAdminRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
