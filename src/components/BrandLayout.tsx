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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <AuthErrorBanner />
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-brand-black border-t border-white/5 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-serif text-2xl font-bold text-primary-gold mb-4">{brand?.name}</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Pre-order your meals for a convenient and cultural dining experience.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="menu" className="hover:text-primary-gold transition-colors">Today's Menu</Link></li>
              <li><Link to="orders" className="hover:text-primary-gold transition-colors">Track Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Contact</h4>
            {brand?.contactPhone && <p className="text-sm text-slate-400 mb-2">Mobile Money: {brand.contactPhone}</p>}
            <p className="text-sm text-slate-400">Powered by African Palate</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-12 pt-8 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} {brand?.name}. All rights reserved.
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
