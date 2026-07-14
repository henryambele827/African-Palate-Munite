import React from "react";
import { Link } from "react-router-dom";
import { LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "./AuthProvider";

// Rendered on the platform-level routes: "/", "/register-brand", "/staff-login",
// and "/superadmin". Distinct from the per-brand Navbar in Navbar.tsx.
export default function PlatformNavbar() {
  const { user, profile, signIn, signOut } = useAuth();

  return (
    <nav className="sticky top-4 z-50 mx-4">
      <div className="max-w-7xl mx-auto bg-white rounded-[2rem] shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-black/10 bg-black flex items-center justify-center text-white font-black italic text-lg group-hover:scale-105 transition-transform">
            AP
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-sans text-xl font-black tracking-tighter italic text-brand-orange group-hover:opacity-80 transition-opacity">
              AFRICAN PALATE
            </span>
            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              Restaurant Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/register-brand"
            className="hidden sm:block text-xs font-black uppercase tracking-widest text-gray-400 hover:text-brand-orange transition-colors"
          >
            Register a Restaurant
          </Link>

          {profile?.role === "superadmin" ? (
            <div className="flex items-center gap-4">
              <Link
                to="/superadmin"
                className="flex items-center gap-1.5 bg-brand-purple/10 text-brand-purple px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
              >
                <ShieldCheck size={14} />
                Superadmin
              </Link>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 hover:opacity-70 transition-opacity"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-600 hover:opacity-70 transition-opacity"
            >
              <LogOut size={16} />
              Exit
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => signIn()}
                className="bg-brand-orange text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest italic hover:scale-105 transition-transform cursor-pointer"
              >
                Sign In
              </button>
              <Link
                to="/staff-login"
                className="bg-black text-white px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest italic hover:scale-105 transition-transform"
              >
                Staff Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
