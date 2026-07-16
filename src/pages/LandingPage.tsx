import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Sparkles,
  Store,
  ChefHat,
  ShieldCheck,
  Smartphone,
  Truck,
  Globe2,
  Wallet,
  BarChart3,
  ArrowUpRight,
  Quote,
  CheckCircle2,
  Mail,
} from 'lucide-react';
import { listenAllBrands } from '../lib/organizations';
import { Organization } from '../types';

const VALUE_PROPS = [
  {
    icon: Store,
    title: 'Your own storefront',
    text: 'Every approved brand gets a clean, shareable link at /b/your-slug — your menu, your branding, your customers.',
  },
  {
    icon: Smartphone,
    title: 'Pre-order by Mobile Money',
    text: 'Built for African payments. Customers pre-order with a 50% deposit via MTN, Airtel, or any mobile wallet.',
  },
  {
    icon: BarChart3,
    title: 'A dashboard that runs the kitchen',
    text: 'Manage dishes, prices, and availability. Track every order from pending to delivered without leaving the platform.',
  },
  {
    icon: ShieldCheck,
    title: 'Approved, not anonymous',
    text: 'Brands are reviewed before they go live, so customers always know the food they are ordering is real and traceable.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Apply',
    text: 'Tell us about your brand — your menu, your story, and how customers can reach you on the ground.',
  },
  {
    n: '02',
    title: 'Get Approved',
    text: 'Our team reviews every application. Once approved, we provision your admin account and seed your menu.',
  },
  {
    n: '03',
    title: 'Go Live',
    text: 'Share your storefront link with your customers. Start taking pre-orders the same day.',
  },
];

const STATS = [
  { value: '17+', label: 'Cuisines supported' },
  { value: '50%', label: 'Deposit on every order' },
  { value: '<24h', label: 'From sign-up to live' },
  { value: '1', label: 'Dashboard for everything' },
];

const TESTIMONIAL = {
  quote:
    'African Palate gave our kitchen a real front door online. We stopped juggling WhatsApp screenshots and started seeing orders in one place — and the deposit system means we never cook for free.',
  name: 'Achieng',
  role: 'Owner, Lagos Kitchen',
};

export default function LandingPage() {
  const [brands, setBrands] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenAllBrands((all) => {
      setBrands(all.filter((b) => b.status === 'active'));
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* ---------------- HERO ---------------- */}
      <section className="relative min-h-[88vh] flex items-center pt-28 pb-24 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.10, 0.18, 0.10] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(230,81,0,0.18)_0%,transparent_70%)]"
          />
          <div className="absolute top-32 right-10 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-4 py-2 rounded-full mb-8"
              >
                <Sparkles size={14} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  A Platform for African Kitchens
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="text-[12vw] md:text-[7.5vw] font-black tracking-tighter leading-[0.85] uppercase italic text-black mb-6"
              >
                African <br />
                <span className="text-brand-orange">Palate.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl md:text-2xl text-gray-500 font-medium max-w-xl mb-10 leading-snug"
              >
                One platform, many kitchens. Every restaurant brand on African
                Palate gets its own storefront, its own menu, and its own
                dashboard — we just handle the plumbing.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <Link
                  to="/register-brand"
                  className="group bg-black text-white px-8 py-5 rounded-full font-black uppercase tracking-widest italic flex items-center gap-3 hover:bg-brand-orange transition-all shadow-xl shadow-black/10 hover:shadow-brand-orange/30 hover:scale-[1.02]"
                >
                  Register Your Restaurant
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="group bg-white text-black border-2 border-gray-100 px-8 py-5 rounded-full font-black uppercase tracking-widest italic flex items-center gap-3 hover:border-brand-orange transition-all"
                >
                  See How It Works
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-x-8 gap-y-3 text-[10px] font-black uppercase tracking-widest text-gray-400"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-green" />
                  No setup fees
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-green" />
                  Mobile Money deposits
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-brand-green" />
                  Approval in 24h
                </span>
              </motion.div>
            </div>

            {/* Hero side card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-brand-orange/20 to-brand-yellow/20 rounded-[3rem] blur-2xl" />
                <div className="relative bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-pop">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white font-black italic">
                        AP
                      </div>
                      <div>
                        <p className="font-black text-sm text-black leading-none">
                          Today's Pre-Orders
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">
                          Live brand view
                        </p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                  </div>

                  <div className="space-y-3 mb-6">
                    {[
                      { meal: 'Jollof Rice + Chicken', price: 'UGX 12,000', tag: 'Confirmed' },
                      { meal: 'Rolex + Tea', price: 'UGX 5,000', tag: 'Pending' },
                      { meal: 'Matooke + Groundnut', price: 'UGX 10,000', tag: 'Delivered' },
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-2xl bg-gray-50"
                      >
                        <div>
                          <p className="font-black text-sm text-black">{row.meal}</p>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                            {row.tag}
                          </p>
                        </div>
                        <p className="font-black text-sm text-brand-orange">{row.price}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-black text-white">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1">
                        Today
                      </p>
                      <p className="text-2xl font-black tracking-tighter">37</p>
                      <p className="text-[10px] text-brand-yellow font-black uppercase tracking-widest mt-1">
                        Orders
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-brand-orange text-white">
                      <p className="text-[10px] text-white/70 uppercase tracking-widest font-black mb-1">
                        Pending
                      </p>
                      <p className="text-2xl font-black tracking-tighter">9</p>
                      <p className="text-[10px] text-white/80 font-black uppercase tracking-widest mt-1">
                        To confirm
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS STRIP ---------------- */}
      <section className="bg-black text-white py-12 border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center md:text-left"
              >
                <p className="text-3xl md:text-5xl font-black tracking-tighter italic text-brand-orange leading-none">
                  {s.value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- VALUE PROPS ---------------- */}
      <section className="py-28 md:py-36 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange block mb-4">
              What you get
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-[0.95] text-black">
              Everything an African <br className="hidden md:block" />
              restaurant needs to <span className="text-brand-orange">go digital</span>.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUE_PROPS.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-gray-50 hover:bg-black rounded-[2rem] p-8 md:p-10 transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 group-hover:bg-brand-orange flex items-center justify-center text-brand-orange group-hover:text-white transition-colors mb-6">
                  <v.icon size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-black group-hover:text-white mb-3 transition-colors">
                  {v.title}
                </h3>
                <p className="text-gray-500 group-hover:text-gray-300 font-medium leading-relaxed transition-colors">
                  {v.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ACTIVE BRANDS ---------------- */}
      <section className="py-28 md:py-36 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange block mb-4">
                Live on the platform
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                Approved <br /> Kitchens.
              </h2>
            </div>
            <p className="text-gray-500 max-w-md font-medium text-lg leading-snug">
              Each brand below has been reviewed and approved. Tap through to
              see their menu, place a pre-order, and pay by Mobile Money.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-20 border border-white/10 rounded-[2rem]">
              <Store className="mx-auto text-gray-600 mb-4" size={40} />
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm">
                No restaurant brands yet. Be the first.
              </p>
              <Link
                to="/register-brand"
                className="inline-flex items-center gap-2 mt-6 text-brand-orange font-black uppercase tracking-widest text-xs hover:underline"
              >
                Register a Restaurant
                <ArrowUpRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={`/b/${brand.slug}`}
                    className="group block relative overflow-hidden rounded-[2.5rem] aspect-[4/3] bg-white/5 border border-white/10 hover:border-brand-orange/50 transition-all p-8 flex flex-col justify-end"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/0 via-transparent to-brand-orange/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange mb-auto">
                      <ChefHat size={24} />
                    </div>
                    <div className="relative">
                      <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-brand-orange transition-colors">
                        {brand.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                        Visit Storefront
                        <ChevronRight
                          size={14}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section id="how-it-works" className="py-28 md:py-36 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange block mb-4">
              Three steps
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-4 text-black">
              How it <span className="text-brand-orange">works</span>.
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-2xl mx-auto">
              From application to a live storefront in under 24 hours. No tech
              team required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white rounded-[2rem] p-8 md:p-10 border border-gray-100"
              >
                <div className="w-14 h-14 bg-black text-brand-orange rounded-2xl flex items-center justify-center font-black italic text-lg mb-6 relative z-10">
                  {s.n}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-3 text-black">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  {s.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIAL ---------------- */}
      <section className="py-28 md:py-36 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-brand-orange to-[#BF360C] text-white rounded-[2.5rem] p-10 md:p-16 overflow-hidden"
          >
            <Quote
              size={120}
              className="absolute -top-6 -left-6 text-white/10"
            />
            <div className="relative">
              <p className="text-xl md:text-3xl font-medium leading-snug mb-8 italic">
                "{TESTIMONIAL.quote}"
              </p>
              <div>
                <p className="font-black text-base">{TESTIMONIAL.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/70 font-black mt-1">
                  {TESTIMONIAL.role}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-28 md:py-36 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange block mb-6">
            Ready when you are
          </span>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] mb-8 max-w-4xl mx-auto">
            Bring your kitchen <br className="hidden md:block" />
            <span className="text-brand-orange">online this week.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto font-medium text-lg mb-12">
            One application, one storefront, one dashboard. We review every
            brand personally, so you stay focused on the food.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/register-brand"
              className="group bg-brand-orange text-white px-10 py-6 rounded-full font-black uppercase tracking-widest italic flex items-center gap-3 hover:bg-white hover:text-black transition-all shadow-xl shadow-brand-orange/30"
            >
              Start Your Application
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="mailto:partners@africanpalate.app"
              className="bg-white/10 backdrop-blur text-white border border-white/20 px-10 py-6 rounded-full font-black uppercase tracking-widest italic flex items-center gap-3 hover:bg-white/20 transition-all"
            >
              <Mail size={18} />
              Talk to a Partner
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-black text-white border-t border-white/10 py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-brand-orange flex items-center justify-center text-white font-black italic">
                  AP
                </div>
                <div>
                  <p className="font-black text-lg italic">AFRICAN PALATE</p>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black">
                    Restaurant Platform
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-400 font-medium max-w-sm leading-relaxed">
                A multi-tenant storefront and ordering platform built for
                African restaurants. From Jollof in Lagos to Matooke in
                Kampala — every kitchen deserves a real front door online.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                Platform
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    to="/register-brand"
                    className="text-gray-300 hover:text-brand-orange transition-colors"
                  >
                    Register a Restaurant
                  </Link>
                </li>
                <li>
                  <Link
                    to="/staff-login"
                    className="text-gray-300 hover:text-brand-orange transition-colors"
                  >
                    Staff Login
                  </Link>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-gray-300 hover:text-brand-orange transition-colors"
                  >
                    How it Works
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
                Contact
              </p>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <Mail size={14} className="mt-1 text-brand-orange" />
                  partners@africanpalate.app
                </li>
                <li className="flex items-start gap-2">
                  <Wallet size={14} className="mt-1 text-brand-orange" />
                  Mobile Money supported
                </li>
                <li className="flex items-start gap-2">
                  <Globe2 size={14} className="mt-1 text-brand-orange" />
                  Pan-African, built in Africa
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between gap-4 text-[10px] text-gray-500 uppercase tracking-widest font-black">
            <p>© {new Date().getFullYear()} African Palate. All rights reserved.</p>
            <p>Built for kitchens that feed the continent.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
