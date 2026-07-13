import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Store, Copy, ExternalLink, X } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { listenPendingRequests, listenAllBrands, approveBrandRequest, rejectBrandRequest, ApprovalResult } from '../lib/organizations';
import { BrandRequest, Organization } from '../types';
import { cn } from '../lib/utils';

export default function SuperAdmin() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<BrandRequest[]>([]);
  const [brands, setBrands] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [result, setResult] = useState<ApprovalResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub1 = listenPendingRequests((r) => { setRequests(r); setLoading(false); });
    const unsub2 = listenAllBrands(setBrands);
    return () => { unsub1(); unsub2(); };
  }, []);

  const handleApprove = async (request: BrandRequest) => {
    if (!profile) return;
    setProcessingId(request.id);
    setErrorMsg(null);
    try {
      const res = await approveBrandRequest(request, profile);
      setResult(res);
    } catch (e) {
      console.error(e);
      setErrorMsg('Approval failed. Check the console for details — this can happen if the applicant email is already registered.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!profile) return;
    setProcessingId(requestId);
    try {
      await rejectBrandRequest(requestId, profile.uid);
    } finally {
      setProcessingId(null);
      setRejectingId(null);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen max-w-6xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase italic leading-none">Platform Control</h1>
        <p className="text-gray-400 font-medium mt-2">Review restaurant applications and manage live brands.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bento-card bg-white">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Pending Requests</p>
          <p className="text-2xl font-black text-black tracking-tighter">{requests.length}</p>
        </div>
        <div className="bento-card bg-white">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Active Brands</p>
          <p className="text-2xl font-black text-black tracking-tighter">{brands.filter(b => b.status === 'active').length}</p>
        </div>
        <div className="bento-card bg-white">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Total Brands</p>
          <p className="text-2xl font-black text-black tracking-tighter">{brands.length}</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold p-4 rounded-2xl mb-8">{errorMsg}</div>
      )}

      {/* Pending Requests */}
      <section className="mb-16">
        <h2 className="text-xl font-black text-black uppercase tracking-tighter italic mb-4">Pending Applications</h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : requests.length === 0 ? (
          <div className="bento-card py-16 text-center">
            <Clock className="mx-auto text-gray-300 mb-4" size={32} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No pending requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map((req) => (
              <div key={req.id} className="bento-card bg-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-xl font-black text-black uppercase tracking-tighter">{req.brandName}</h3>
                  <p className="text-xs text-gray-400 font-bold mt-1">/b/{req.slug}</p>
                  <div className="text-xs text-gray-500 font-medium mt-3 space-y-1">
                    <p>{req.applicantName} &middot; {req.applicantEmail}</p>
                    <p>{req.applicantPhone}</p>
                    {req.message && <p className="italic text-gray-400 mt-2 max-w-md">"{req.message}"</p>}
                  </div>
                </div>
                <div className="flex gap-3 shrink-0">
                  <button
                    onClick={() => setRejectingId(req.id)}
                    disabled={processingId === req.id}
                    className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-red-500 border-2 border-red-100 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={processingId === req.id}
                    className="px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-black text-white hover:bg-brand-green transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {processingId === req.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All Brands */}
      <section>
        <h2 className="text-xl font-black text-black uppercase tracking-tighter italic mb-4">All Brands</h2>
        {brands.length === 0 ? (
          <div className="bento-card py-16 text-center">
            <Store className="mx-auto text-gray-300 mb-4" size={32} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No brands yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map((brand) => (
              <div key={brand.id} className="bento-card bg-white">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-black text-black uppercase tracking-tighter">{brand.name}</h3>
                  <span className={cn(
                    "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest",
                    brand.status === 'active' ? "bg-green-100 text-brand-green" : "bg-red-100 text-red-500"
                  )}>
                    {brand.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-bold mb-1">{brand.ownerEmail}</p>
                <p className="text-xs text-gray-400 font-bold mb-4">{brand.contactPhone}</p>
                <Link
                  to={`/b/${brand.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-2 text-brand-orange font-black uppercase text-[10px] tracking-widest hover:underline"
                >
                  Visit Storefront <ExternalLink size={12} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reject confirmation */}
      <AnimatePresence>
        {rejectingId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRejectingId(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl p-8 text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={40} />
              </div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-4">Reject Application?</h2>
              <p className="text-gray-400 font-medium mb-8">The applicant will not be notified automatically — you'll need to let them know.</p>
              <div className="flex gap-4">
                <button onClick={() => setRejectingId(null)} className="flex-1 py-4 rounded-2xl text-gray-400 font-black uppercase tracking-widest italic hover:bg-gray-50 transition-colors">Cancel</button>
                <button onClick={() => handleReject(rejectingId)} className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest italic shadow-xl shadow-red-500/20 active:scale-95 transition-transform">Reject</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Approval result: credentials to relay to the brand owner */}
      <AnimatePresence>
        {result && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-8">
              <button onClick={() => setResult(null)} className="absolute top-6 right-6 text-gray-400 hover:text-black"><X size={24} /></button>
              <div className="w-16 h-16 bg-green-100 text-brand-green rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic mb-2">Brand Approved!</h2>
              <p className="text-gray-400 font-medium mb-6 text-sm">
                They can now sign in with the email and password they set at registration.
              </p>
              <div className="bg-black text-white rounded-[1.5rem] p-6 space-y-4 text-left">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Storefront</p>
                  <p className="text-sm font-black break-all">/b/{result.slug}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Login Email</p>
                  <p className="text-sm font-black break-all">{result.loginEmail}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Storefront: ${window.location.origin}/b/${result.slug}\nAdmin login: ${window.location.origin}/staff-login\nEmail: ${result.loginEmail}`
                  );
                }}
                className="w-full mt-6 bg-gray-100 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <Copy size={14} /> Copy Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
