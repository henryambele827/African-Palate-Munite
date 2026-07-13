import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ChevronLeft, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { findRequestByApplicantUid } from '../lib/organizations';
import { BrandRequest } from '../types';

export default function StaffLogin() {
  const { user, profile, signInStaff, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<BrandRequest | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);

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
    try {
      await signInStaff(email, password);
    } catch {
      // AuthErrorBanner surfaces the error
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
        <div className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-brand-orange/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-brand-orange">
            <Clock size={40} />
          </div>
          <h2 className="text-3xl font-black text-black uppercase italic mb-4 tracking-tighter">Still Under Review</h2>
          <p className="text-gray-400 font-medium mb-8">
            Your application for <span className="text-black font-black">{pendingRequest.brandName}</span> hasn't been approved yet.
            Check back soon — your login will unlock the dashboard automatically once it is.
          </p>
          <Link to="/" className="text-brand-orange font-black uppercase text-xs tracking-widest hover:underline">Back to Home</Link>
        </div>
      );
    }

    if (pendingRequest?.status === 'rejected') {
      return (
        <div className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-red-500">
            <XCircle size={40} />
          </div>
          <h2 className="text-3xl font-black text-black uppercase italic mb-4 tracking-tighter">Application Not Approved</h2>
          <p className="text-gray-400 font-medium mb-8">
            Your application for <span className="text-black font-black">{pendingRequest.brandName}</span> wasn't approved this time.
            {pendingRequest.rejectionReason && <> Reason: <span className="text-black font-bold">{pendingRequest.rejectionReason}</span></>}
          </p>
          <Link to="/register-brand" className="text-brand-orange font-black uppercase text-xs tracking-widest hover:underline">Apply Again</Link>
        </div>
      );
    }

    // Signed in as a plain customer with no brand request at all.
    return (
      <div className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-black text-black uppercase italic mb-4 tracking-tighter">No Admin Access</h2>
        <p className="text-gray-400 font-medium mb-8">This account doesn't manage any restaurant brand yet.</p>
        <Link to="/register-brand" className="text-brand-orange font-black uppercase text-xs tracking-widest hover:underline">Register a Restaurant</Link>
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
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Restricted Access</span>
      </div>
      <h1 className="text-4xl font-black text-black tracking-tighter uppercase italic leading-none mb-4">Staff Login</h1>
      <p className="text-gray-400 font-medium mb-12">
        For platform admins and restaurant brand admins. Customers should use "Sign In" on a restaurant's storefront instead.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-purple transition-colors">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-lg"
          />
        </div>
        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-purple transition-colors">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Password</label>
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
