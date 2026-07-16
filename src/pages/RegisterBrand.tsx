import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ChevronLeft,
  Store,
  ChefHat,
  Sparkles,
  Smartphone,
  Globe2,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Eye,
  EyeOff,
  Wallet,
  BarChart3,
} from 'lucide-react';
import { submitBrandRequest } from '../lib/organizations';

const PERKS = [
  {
    icon: Globe2,
    title: 'Your own URL',
    text: 'Get a clean storefront at /b/your-slug you can share anywhere.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Money ready',
    text: 'Customers pre-order with a 50% deposit via MTN, Airtel, or any wallet.',
  },
  {
    icon: BarChart3,
    title: 'Run the kitchen',
    text: 'Manage dishes, prices, and orders from a single dashboard.',
  },
];

const STEPS = [
  { n: '01', text: 'Fill in your brand details below.' },
  { n: '02', text: 'We review your application within 24 hours.' },
  { n: '03', text: 'You sign in with the same email & password.' },
];

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
  const [showPassword, setShowPassword] = useState(false);

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
        setError(
          'An account already exists for that email. If you already applied, wait for approval, or use a different email.',
        );
      } else {
        setError('Something went wrong submitting your request. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = Math.min(
    100,
    Math.round(
      (Object.values(form).filter((v) => (typeof v === 'string' ? v.trim() : v))
        .length /
        Object.keys(form).length) *
        100,
    ),
  );

  if (submittedSlugHint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center"
        >
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-brand-green/20 rounded-[2rem] blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 bg-white border-2 border-brand-green/30 rounded-[2rem] flex items-center justify-center text-brand-green shadow-xl">
              <CheckCircle2 size={44} />
            </div>
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-green block mb-4">
            Request Received
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-black uppercase italic tracking-tighter leading-[0.9] mb-6">
            You're on <br />
            <span className="text-brand-green">the list.</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg mb-10 max-w-md mx-auto leading-relaxed">
            Thanks for applying to bring{' '}
            <span className="text-black font-black">{submittedSlugHint}</span>{' '}
            onto African Palate. Our team will review your request and email
            you the moment it is approved.
          </p>

          <div className="bg-black text-white rounded-[2rem] p-8 mb-8 text-left shadow-pop">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-3">
              What happens next
            </p>
            <ol className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-brand-yellow font-black">01</span>
                <span className="text-white/80 font-medium">
                  We review your application within 24 hours.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-yellow font-black">02</span>
                <span className="text-white/80 font-medium">
                  Once approved, sign in with the email & password you just set.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-yellow font-black">03</span>
                <span className="text-white/80 font-medium">
                  Your dashboard unlocks automatically — share your storefront link and start cooking.
                </span>
              </li>
            </ol>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/staff-login"
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-black uppercase tracking-widest italic text-xs hover:bg-brand-orange transition-colors"
            >
              Staff Login
              <ArrowUpRight size={14} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-white text-black border-2 border-gray-100 px-6 py-3 rounded-full font-black uppercase tracking-widest italic text-xs hover:border-brand-orange transition-colors"
            >
              <ChevronLeft size={14} />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      <div className="container mx-auto px-4 md:px-6 pt-6 pb-16 min-h-screen flex flex-col">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-8 text-xs font-black uppercase tracking-widest group w-fit"
        >
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-grow items-start max-w-6xl mx-auto w-full">
          {/* Left: branded panel */}
          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-orange/20 via-brand-yellow/10 to-brand-orange/10 rounded-[3rem] blur-2xl" />
              <div className="relative bg-gradient-to-br from-brand-orange via-[#BF360C] to-black text-white rounded-[2.5rem] p-8 md:p-10 overflow-hidden shadow-pop">
                {/* Decorative shapes */}
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-brand-yellow/20 rounded-full blur-3xl" />
                <div className="absolute top-8 right-8 opacity-10">
                  <ChefHat size={120} />
                </div>

                <div className="relative">
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-full mb-8">
                    <Store size={12} className="text-brand-yellow" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                      Join the Platform
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.9] mb-6">
                    Register <br />
                    <span className="text-brand-yellow">Your Brand.</span>
                  </h1>

                  <p className="text-white/70 font-medium text-base leading-snug max-w-md mb-10">
                    Apply once, get approved, and run your African restaurant
                    from a real digital storefront. Same email and password
                    become your admin login — no extra accounts.
                  </p>

                  <div className="space-y-4 mb-10">
                    {PERKS.map((p) => (
                      <div key={p.title} className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-brand-yellow flex-shrink-0">
                          <p.icon size={18} />
                        </div>
                        <div>
                          <p className="font-black uppercase tracking-tight text-sm">
                            {p.title}
                          </p>
                          <p className="text-white/60 text-xs font-medium leading-relaxed mt-0.5">
                            {p.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-4">
                      How it works
                    </p>
                    <ol className="space-y-3">
                      {STEPS.map((s) => (
                        <li key={s.n} className="flex items-start gap-3">
                          <span className="text-[10px] font-black text-brand-yellow bg-white/10 rounded-lg px-2 py-1 leading-none">
                            {s.n}
                          </span>
                          <span className="text-sm text-white/80 font-medium leading-relaxed">
                            {s.text}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="border-t border-white/10 pt-6 mt-6 flex items-center gap-3 text-xs text-white/60 font-medium">
                    <ShieldCheck size={14} className="text-brand-yellow" />
                    Reviewed by humans. No automated rejections.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form panel */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-pop p-8 md:p-10">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-orange block mb-1">
                      Application Form
                    </span>
                    <h2 className="text-2xl font-black text-black uppercase tracking-tighter italic leading-none">
                      Tell us about your kitchen.
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Progress
                    </p>
                    <p className="text-xl font-black text-brand-orange tracking-tighter">
                      {progress}%
                    </p>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-brand-orange to-brand-yellow rounded-full"
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="group bg-gray-50 rounded-2xl p-5 border-2 border-transparent focus-within:bg-white focus-within:border-brand-orange focus-within:shadow-lg focus-within:shadow-brand-orange/10 transition-all">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block group-focus-within:text-brand-orange transition-colors">
                    Restaurant / Brand Name
                  </label>
                  <input
                    required
                    type="text"
                    value={form.brandName}
                    onChange={(e) =>
                      setForm({ ...form, brandName: e.target.value })
                    }
                    placeholder="e.g. Jollof House"
                    className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-base placeholder:text-gray-300 placeholder:font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group bg-gray-50 rounded-2xl p-5 border-2 border-transparent focus-within:bg-white focus-within:border-brand-orange focus-within:shadow-lg focus-within:shadow-brand-orange/10 transition-all">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block group-focus-within:text-brand-orange transition-colors">
                      Your Name
                    </label>
                    <input
                      required
                      type="text"
                      value={form.applicantName}
                      onChange={(e) =>
                        setForm({ ...form, applicantName: e.target.value })
                      }
                      placeholder="Full name"
                      className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-base placeholder:text-gray-300 placeholder:font-medium"
                    />
                  </div>
                  <div className="group bg-gray-50 rounded-2xl p-5 border-2 border-transparent focus-within:bg-white focus-within:border-brand-orange focus-within:shadow-lg focus-within:shadow-brand-orange/10 transition-all">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block group-focus-within:text-brand-orange transition-colors">
                      Phone Number
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.applicantPhone}
                      onChange={(e) =>
                        setForm({ ...form, applicantPhone: e.target.value })
                      }
                      placeholder="0700123456"
                      className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-base placeholder:text-gray-300 placeholder:font-medium"
                    />
                  </div>
                </div>

                <div className="group bg-gray-50 rounded-2xl p-5 border-2 border-transparent focus-within:bg-white focus-within:border-brand-orange focus-within:shadow-lg focus-within:shadow-brand-orange/10 transition-all">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block group-focus-within:text-brand-orange transition-colors">
                    Email <span className="text-gray-300 normal-case font-medium">(this becomes your admin login)</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={form.applicantEmail}
                    onChange={(e) =>
                      setForm({ ...form, applicantEmail: e.target.value })
                    }
                    placeholder="you@restaurant.com"
                    className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-base placeholder:text-gray-300 placeholder:font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group bg-gray-50 rounded-2xl p-5 border-2 border-transparent focus-within:bg-white focus-within:border-brand-orange focus-within:shadow-lg focus-within:shadow-brand-orange/10 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block group-focus-within:text-brand-orange transition-colors">
                        Create a Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-1"
                      >
                        {showPassword ? <EyeOff size={10} /> : <Eye size={10} />}
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      minLength={6}
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      placeholder="At least 6 characters"
                      className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-base placeholder:text-gray-300 placeholder:font-medium"
                    />
                  </div>
                  <div className="group bg-gray-50 rounded-2xl p-5 border-2 border-transparent focus-within:bg-white focus-within:border-brand-orange focus-within:shadow-lg focus-within:shadow-brand-orange/10 transition-all">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block group-focus-within:text-brand-orange transition-colors">
                      Confirm Password
                    </label>
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      minLength={6}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({ ...form, confirmPassword: e.target.value })
                      }
                      placeholder="Re-enter password"
                      className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-black text-base placeholder:text-gray-300 placeholder:font-medium"
                    />
                  </div>
                </div>

                <div className="group bg-gray-50 rounded-2xl p-5 border-2 border-transparent focus-within:bg-white focus-within:border-brand-orange focus-within:shadow-lg focus-within:shadow-brand-orange/10 transition-all">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5 block group-focus-within:text-brand-orange transition-colors">
                    Anything else? <span className="text-gray-300 normal-case font-medium">(optional)</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell us a bit about your food, location, or timeline..."
                    className="w-full bg-transparent border-none p-0 focus:outline-none text-black font-bold text-sm resize-none h-24 placeholder:text-gray-300"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-xs font-bold leading-relaxed">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white font-black py-5 rounded-2xl text-sm uppercase tracking-[0.2em] italic shadow-xl shadow-black/10 hover:scale-[1.02] hover:bg-brand-orange transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Submit for Review
                      <ArrowUpRight size={16} />
                    </>
                  )}
                </button>

                <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-2">
                  <Sparkles size={10} className="inline mr-1 text-brand-orange" />
                  Reviewed by humans within 24 hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
