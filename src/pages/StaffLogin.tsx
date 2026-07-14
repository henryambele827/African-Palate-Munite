import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ChevronLeft, Clock, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { findRequestByApplicantUid } from "../lib/organizations";
import { BrandRequest } from "../types";

export default function StaffLogin() {
  const { user, profile, signIn, signInStaff, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<BrandRequest | null>(
    null,
  );
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Once signed in, route based on role: superadmin -> /superadmin,
  // brand_admin -> their own brand's /b/:slug/admin. Anyone else (a
  // 'customer' role, meaning their brand request hasn't been approved
  // yet) sees their request status instead.
  useEffect(() => {
    if (loading || !user || !profile) return;

    if (profile.role === "superadmin") {
      navigate("/superadmin", { replace: true });
    } else if (profile.role === "brand_admin" && profile.brandId) {
      getDoc(doc(db, "organizations", profile.brandId)).then((snap) => {
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
        err?.code === "auth/invalid-credential" ||
        err?.code === "auth/wrong-password" ||
        err?.code === "auth/user-not-found"
      ) {
        setError(
          "Incorrect email or password. Please verify your credentials. (Note: If you are the Platform Admin / Superadmin, you must sign in via Google on the home page, not here.)",
        );
      } else if (err?.code === "auth/operation-not-allowed") {
        setError(
          "The Email/Password sign-in provider is not enabled in your Firebase project. Please enable it in your Firebase Console under Authentication -> Sign-in method.",
        );
      } else {
        setError("An unexpected sign-in error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show request status instead of the form once we know it.
  if (user && profile && profile.role === "customer") {
    if (checkingStatus) {
      return (
        <div className="pt-40 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    if (pendingRequest?.status === "pending") {
      return (
        <div className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-brand-orange/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-brand-orange">
            <Clock size={40} />
          </div>
          <h2 className="text-3xl font-black text-black uppercase italic mb-4 tracking-tighter">
            Still Under Review
          </h2>
          <p className="text-gray-400 font-medium mb-8">
            Your application for{" "}
            <span className="text-black font-black">
              {pendingRequest.brandName}
            </span>{" "}
            hasn't been approved yet. Check back soon — your login will unlock
            the dashboard automatically once it is.
          </p>
          <Link
            to="/"
            className="text-brand-orange font-black uppercase text-xs tracking-widest hover:underline"
          >
            Back to Home
          </Link>
        </div>
      );
    }

    if (pendingRequest?.status === "rejected") {
      return (
        <div className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-red-500">
            <XCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-black uppercase italic mb-4 tracking-tighter">
            Application Not Approved
          </h2>
          <p className="text-gray-400 font-medium mb-8">
            Your application for{" "}
            <span className="text-black font-black">
              {pendingRequest.brandName}
            </span>{" "}
            wasn't approved this time.
            {pendingRequest.rejectionReason && (
              <>
                {" "}
                Reason:{" "}
                <span className="text-black font-bold">
                  {pendingRequest.rejectionReason}
                </span>
              </>
            )}
          </p>
          <Link
            to="/register-brand"
            className="text-brand-orange font-black uppercase text-xs tracking-widest hover:underline"
          >
            Apply Again
          </Link>
        </div>
      );
    }

    // Signed in as a plain customer with no brand request at all.
    return (
      <div className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-black text-black uppercase italic mb-4 tracking-tighter">
          No Admin Access
        </h2>
        <p className="text-gray-400 font-medium mb-8">
          This account doesn't manage any restaurant brand yet.
        </p>
        <Link
          to="/register-brand"
          className="text-brand-orange font-black uppercase text-xs tracking-widest hover:underline"
        >
          Register a Restaurant
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen max-w-md mx-auto">
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-12 text-xs font-black uppercase tracking-widest"
      >
        <ChevronLeft size={16} />
        Back
      </Link>

      <div className="flex items-center gap-2 text-brand-purple mb-4">
        <ShieldCheck size={24} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">
          Restricted Access
        </span>
      </div>
      <h1 className="text-4xl font-black text-black tracking-tighter uppercase italic leading-none mb-4">
        Staff Login
      </h1>
      <p className="text-gray-400 font-medium mb-8">
        For platform admins and restaurant brand admins. Customers should use
        "Sign In" on a restaurant's storefront instead.
      </p>

      {/* Primary Google Sign-In option for Superadmin / Platform Admins */}
      <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm mb-6">
        <button
          onClick={() => signIn()}
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-4 px-6 rounded-2xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
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
          Sign In with Google
        </button>
        <p className="text-[9px] text-gray-400 text-center font-bold uppercase tracking-widest mt-3">
          Required for Platform Admins & Superadmins
        </p>
      </div>

      <div className="relative flex py-4 items-center">
        <div className="flex-grow border-t border-gray-100"></div>
        <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
          or use staff credentials
        </span>
        <div className="flex-grow border-t border-gray-100"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-xs font-bold leading-relaxed mb-2">
            {error}
          </div>
        )}
        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-purple transition-colors">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
            Email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-lg"
          />
        </div>
        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-purple transition-colors">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">
            Password
          </label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-black py-6 rounded-[1.5rem] text-sm uppercase tracking-[0.2em] italic shadow-xl shadow-black/10 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>SIGN IN</>
          )}
        </button>
      </form>
    </div>
  );
}
