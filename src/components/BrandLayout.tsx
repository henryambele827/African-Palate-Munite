import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BrandProvider, useBrand } from './BrandProvider';
import { AuthErrorBanner } from './AuthErrorBanner';
import Navbar from './Navbar';
import { ChefHat } from 'lucide-react';

function BrandLayoutInner() {
  const { brand, loading, notFound } = useBrand();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-6 border border-gray-100 text-gray-300">
          <ChefHat size={40} />
        </div>
        <h1 className="text-3xl font-black text-black uppercase italic tracking-tighter mb-3">Brand Not Found</h1>
        <p className="text-gray-400 font-medium max-w-sm mb-8">
          This restaurant link isn't active. It may not exist, or its registration is still pending approval.
        </p>
        <Link
          to="/"
          className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest italic text-xs hover:bg-brand-orange transition-colors"
        >
          Back to African Palate
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <AuthErrorBanner />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-black border-t border-white/5 py-16 px-4 mt-20 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-brand-orange flex items-center justify-center text-white font-black italic">
                {(brand?.name || '?').slice(0, 2).toUpperCase()}
              </div>
              <h3 className="font-serif text-2xl font-bold text-brand-orange">
                {brand?.name}
              </h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Pre-order your meals for a convenient, culturally rooted dining
              experience. Powered by African Palate — one platform, many
              kitchens.
            </p>
          </div>
          <div className="md:col-span-3">
            <h4 className="font-black text-white text-[10px] uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  to="menu"
                  className="hover:text-brand-orange transition-colors inline-flex items-center gap-1"
                >
                  Today's Menu
                </Link>
              </li>
              <li>
                <Link
                  to="orders"
                  className="hover:text-brand-orange transition-colors inline-flex items-center gap-1"
                >
                  Track Orders
                </Link>
              </li>
              <li>
                <Link
                  to="."
                  className="hover:text-brand-orange transition-colors inline-flex items-center gap-1"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div className="md:col-span-4">
            <h4 className="font-black text-white text-[10px] uppercase tracking-widest mb-4">
              Contact
            </h4>
            {brand?.contactPhone && (
              <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
                <span className="text-brand-orange font-black">Mobile Money:</span>
                {brand.contactPhone}
              </p>
            )}
            <p className="text-sm text-slate-400">
              Powered by{' '}
              <Link
                to="/"
                className="text-brand-orange font-black hover:underline"
              >
                African Palate
              </Link>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-black">
          <p>
            © {new Date().getFullYear()} {brand?.name}. All rights reserved.
          </p>
          <p>One platform, many kitchens.</p>
        </div>
      </footer>
    </div>
  );
}

export default function BrandLayout() {
  return (
    <BrandProvider>
      <BrandLayoutInner />
    </BrandProvider>
  );
}
