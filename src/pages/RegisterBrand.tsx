import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, Store } from 'lucide-react';
import { submitBrandRequest } from '../lib/organizations';

export default function RegisterBrand() {
  const [form, setForm] = useState({
    brandName: '',
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    password: '',
    confirmPassword: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedSlugHint, setSubmittedSlugHint] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError('Your admin password needs to be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitBrandRequest(form);
      setSubmittedSlugHint(form.brandName);
    } catch (err: any) {
      if (err?.code === 'auth/email-already-in-use') {
        setError('An account already exists for that email. If you already applied, wait for approval, or use a different email.');
      } else {
        setError('Something went wrong submitting your request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedSlugHint) {
    return (
      <div className="pt-40 pb-20 px-4 text-center max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-100 text-brand-green rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-green-200 shadow-sm"
        >
          <CheckCircle2 size={60} />
        </motion.div>
        <h2 className="text-4xl font-black text-black uppercase italic tracking-tighter mb-4">Request Received</h2>
        <p className="text-gray-400 font-medium mb-8">
          Thanks for applying to bring <span className="text-black font-black">{submittedSlugHint}</span> onto African Palate.
          Our team will review your request. Once approved, sign in with the email and password you just set using the
          <Link to="/staff-login" className="text-brand-orange font-black hover:underline"> Staff Login</Link> page.
        </p>
        <Link to="/" className="text-brand-orange font-black uppercase text-xs tracking-widest hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen max-w-2xl mx-auto">
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-12 text-xs font-black uppercase tracking-widest"
      >
        <ChevronLeft size={16} />
        Back
      </Link>

      <div className="flex items-center gap-2 text-brand-orange mb-4">
        <Store size={24} />
        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Join The Platform</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-black tracking-tighter uppercase italic leading-none mb-4">
        Register Your Restaurant
      </h1>
      <p className="text-gray-400 font-medium mb-12">
        Tell us about your brand and set the login you'll use to manage it. Once approved, this same email and password
        get you straight into your dashboard.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-orange transition-colors">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Restaurant / Brand Name</label>
          <input
            required
            type="text"
            value={form.brandName}
            onChange={(e) => setForm({ ...form, brandName: e.target.value })}
            placeholder="e.g. Jollof House"
            className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-orange transition-colors">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Your Name</label>
            <input
              required
              type="text"
              value={form.applicantName}
              onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
              placeholder="Full name"
              className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-lg"
            />
          </div>
          <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-orange transition-colors">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
            <input
              required
              type="tel"
              value={form.applicantPhone}
              onChange={(e) => setForm({ ...form, applicantPhone: e.target.value })}
              placeholder="0700123456"
              className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-lg"
            />
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-orange transition-colors">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email (this becomes your admin login)</label>
          <input
            required
            type="email"
            value={form.applicantEmail}
            onChange={(e) => setForm({ ...form, applicantEmail: e.target.value })}
            placeholder="you@restaurant.com"
            className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-lg"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-orange transition-colors">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Create a Password</label>
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 6 characters"
              className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-lg"
            />
          </div>
          <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-orange transition-colors">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Confirm Password</label>
            <input
              required
              type="password"
              minLength={6}
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Re-enter password"
              className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-lg"
            />
          </div>
        </div>

        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm focus-within:border-brand-orange transition-colors">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Anything else? (optional)</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Tell us a bit about your food, location, or timeline..."
            className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-bold text-base resize-none h-24"
          />
        </div>

        {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black text-white font-black py-6 rounded-[1.5rem] text-sm uppercase tracking-[0.2em] italic shadow-xl shadow-black/10 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>SUBMIT FOR REVIEW</>
          )}
        </button>
      </form>
    </div>
  );
}
