import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ChevronLeft,
  Clock,
  XCircle,
  ChefHat,
  Sparkles,
  Store,
  BarChart3,
  Smartphone,
  Lock,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { findRequestByApplicantUid } from '../lib/organizations';
import { BrandRequest } from '../types';

const STAFF_FEATURES = [
  {
    icon: Store,
    title: 'Your Storefront',
    text: 'Manage your live brand at /b/your-slug.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Money Deposits',
    text: 'Track 50% deposits on every pre-order.',
  },
  {
    icon: BarChart3,
    title: 'Live Order Control',
    text: 'Pending → confirmed → delivered in one place.',
  },
];

export default function StaffLogin() {
  const { user, profile, signIn, signInStaff, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<BrandRequest | null>(
    null,
  );
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Once signed in, route based on role: superadmin -> /superadmin,
  // brand_admin -> their own brand's /b/:slug/admin. Anyone else (a
  // 'customer' role, meaning their brand request hasn't been approved
  // yet) sees their request status instead.
  useEffect(() => {
    if (loading || !user || !profile) return;

    if (profile.role === 'superadmin') {
      navigate('/superadmin', { replace: true });
    } else if (profile.role === 'brand_admin' && profile.brandId) {
      getDoc(doc(db, 'organizations', profile.brandId)).then((snap) => {
        const slug = snap.exists() ? (snap.data() as any).slug : null;
        if (slug) navigate(`/b/${slug}/admin`, { replace: true });
      });
    } else {
      setCheckingStatus(true);
      findRequestByApplicantUid(user.uid)
        .then(setPendingRequest)
        .finally(() => setCheckingStatus(false));
    }
  }, [loading, user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPendingRequest(null);
    setError(null);
    try {
      await signInStaff(email, password);
    } catch (err: any) {
      if (
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/user-not-found'
      ) {
        setError(
          'Incorrect email or password. Please verify your credentials. (Note: If you are the Platform Admin / Superadmin, you must sign in via Google on the home page, not here.)',
        );
      } else if (err?.code === 'auth/operation-not-allowed') {
        setError(
          'The Email/Password sign-in provider is not enabled in your Firebase project. Please enable it in your Firebase Console under Authentication -> Sign-in method.',
        );
      } else {
        setError('An unexpected sign-in error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show request status instead of the form once we know it.
  if (user && profile && profile.role === 'customer') {
    if (checkingStatus) {
      return (
        <div className="pt-40 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (pendingRequest?.status === 'pending') {
      return (
        <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-lg w-full text-center">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-brand-orange/20 rounded-[2rem] blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 bg-white border-2 border-brand-orange/30 rounded-[2rem] flex items-center justify-center text-brand-orange shadow-xl">
                <Clock size={44} />
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange block mb-4">
              Under Review
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase italic tracking-tighter mb-4">
              We're cooking it up.
            </h2>
            <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
              Your application for{' '}
              <span className="text-black font-black">
                {pendingRequest.brandName}
              </span>{' '}
              is being reviewed. The moment it is approved, this same email
              and password will unlock your dashboard automatically.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-black uppercase tracking-widest italic text-xs hover:bg-brand-orange transition-colors"
            >
              <ChevronLeft size={16} />
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    if (pendingRequest?.status === 'rejected') {
      return (
        <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-lg w-full text-center">
            <div className="w-24 h-24 bg-red-50 border-2 border-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-red-500 shadow-xl">
              <XCircle size={44} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 block mb-4">
              Application Not Approved
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-black uppercase italic tracking-tighter mb-4">
              This time, no.
            </h2>
            <p className="text-gray-500 font-medium mb-4 max-w-md mx-auto leading-relaxed">
              Your application for{' '}
              <span className="text-black font-black">
                {pendingRequest.brandName}
              </span>{' '}
              wasn't approved this time.
            </p>
            {pendingRequest.rejectionReason && (
              <p className="text-sm text-gray-500 font-medium mb-10 max-w-md mx-auto">
                Reason:{' '}
                <span className="text-black font-bold">
                  {pendingRequest.rejectionReason}
                </span>
              </p>
            )}
            <Link
              to="/register-brand"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-black uppercase tracking-widest italic text-xs hover:bg-brand-orange transition-colors"
            >
              Apply Again
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      );
    }

    // Signed in as a plain customer with no brand request at all.
    return (
      <div className="pt-32 pb-20 px-4 min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-lg w-full text-center">
          <div className="w-24 h-24 bg-gray-50 border-2 border-gray-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-gray-400 shadow-xl">
            <ShieldCheck size={44} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black uppercase italic tracking-tighter mb-4">
            No Admin Access
          </h2>
          <p className="text-gray-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
            This account doesn't manage any restaurant brand yet.
          </p>
          <Link
            to="/register-brand"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-black uppercase tracking-widest italic text-xs hover:bg-brand-orange transition-colors"
          >
            Register a Restaurant
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6 pt-6 pb-12 min-h-screen flex flex-col">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 text-xs font-black uppercase tracking-widest group"
        >
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-grow items-center max-w-6xl mx-auto w-full">
          {/* Left: branded panel */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-brand-purple/10 via-brand-orange/5 to-brand-yellow/10 rounded-[3rem] blur-2xl" />
            <div className="relative bg-gradient-to-br from-brand-purple via-[#5C1484] to-black text-white rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-pop">
              {/* Decorative shapes */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-orange/30 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute top-8 right-8 opacity-10">
                <ChefHat size={120} />
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-full mb-8">
                  <Lock size={12} className="text-brand-yellow" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Restricted Access
                  </span>
                </div>

                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9] mb-6">
                  Staff <br />
                  <span className="text-brand-yellow">Login.</span>
                </h1>

                <p className="text-white/70 font-medium text-lg leading-snug max-w-md mb-10">
                  For platform admins and restaurant brand admins. Customers
                  use "Sign In" on a restaurant's storefront instead.
                </p>

                <div className="space-y-4 mb-10">
                  {STAFF_FEATURES.map((f, i) => (
                    <div key={f.title} className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-brand-yellow flex-shrink-0">
                        <f.icon size={18} />
                      </div>
                      <div>
                        <p className="font-black uppercase tracking-tight text-sm">
                          {f.title}
                        </p>
                        <p className="text-white/60 text-xs font-medium leading-relaxed mt-0.5">
                          {f.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">
                    Not on the platform yet?
                  </p>
                  <Link
                    to="/register-brand"
                    className="inline-flex items-center gap-2 bg-white text-brand-purple px-5 py-3 rounded-full font-black uppercase tracking-widest italic text-xs hover:bg-brand-yellow transition-colors group"
                  >
                    Register Your Restaurant
                    <ArrowUpRight
                      size={14}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form panel */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-pop p-8 md:p-10">
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-purple block mb-2">
                  Welcome Back
                </span>
                <h2 className="text-3xl font-black text-black uppercase tracking-tighter italic leading-none">
                  Sign in to <br />
                  <span className="text-brand-purple">your dashboard.</span>
                </h2>
              </div>

              {/* Google sign-in */}
              <button
                onClick={() => signIn()}
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:border-brand-purple hover:bg-brand-purple/5 text-gray-700 font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Continue with Google
              </button>
              <p className="text-[10px] text-gray-400 text-center font-bold uppercase tracking-widest mt-3 flex items-center justify-center gap-1.5">
                <Sparkles size={10} className="text-brand-purple" />
                Required for Platform Admins & Superadmins
              </p>

              {/* Divider */}
              <div className="relative flex py-6 items-center">
                <div className="flex-grow border-t border-gray-100" />
                <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
                  or use staff credentials
                </span>
                <div className="flex-grow border-t border-gray-100" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-xs font-bold leading-relaxed">
                    {error}
                  </div>
                )}

                <div className="group bg-gray-50 rounded-2xl p-5 border-2 border-transparent focus-within:bg-white focus-within:border-brand-purple focus-within:shadow-lg focus-within:shadow-brand-purple/10 transition-all">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block group-focus-within:text-brand-purple transition-colors">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@restaurant.com"
                    className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-base placeholder:text-gray-300 placeholder:font-medium"
                  />
                </div>

                <div className="group bg-gray-50 rounded-2xl p-5 border-2 border-transparent focus-within:bg-white focus-within:border-brand-purple focus-within:shadow-lg focus-within:shadow-brand-purple/10 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block group-focus-within:text-brand-purple transition-colors">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-purple transition-colors"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-base placeholder:text-gray-300 placeholder:font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white font-black py-5 rounded-2xl text-sm uppercase tracking-[0.2em] italic shadow-xl shadow-black/10 hover:scale-[1.02] hover:bg-brand-purple transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      Sign In
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2">
                  Protected by Firebase Authentication
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
