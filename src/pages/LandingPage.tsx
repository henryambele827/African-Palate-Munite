import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Store, ChefHat } from 'lucide-react';
import { listenAllBrands } from '../lib/organizations';
import { Organization } from '../types';

export default function LandingPage() {
  const [brands, setBrands] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenAllBrands((all) => {
      setBrands(all.filter(b => b.status === 'active'));
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-10" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(230,81,0,0.15)_0%,transparent_70%)]"
          />
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-brand-orange mb-6"
            >
              <Sparkles className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">The Restaurant Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[12vw] md:text-[9vw] font-black tracking-tighter leading-[0.85] uppercase italic text-black mb-8"
            >
              African <br />
              <span className="text-brand-orange">Palate.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mb-12 leading-tight"
            >
              One platform, many kitchens. Every restaurant brand on African Palate gets its own storefront, its own menu, and its own dashboard — we just handle the plumbing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/register-brand"
                className="bg-black text-white px-10 py-6 rounded-[2rem] font-black uppercase tracking-widest italic flex items-center gap-3 hover:bg-brand-orange transition-colors group shadow-2xl shadow-black/10"
              >
                Register Your Restaurant
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Active Brands */}
      <section className="py-32 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange block mb-4">Live On the Platform</span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                Approved <br /> Kitchens
              </h2>
            </div>
            <p className="text-gray-500 max-w-md font-medium text-lg leading-tight">
              Each brand below has been reviewed and approved. Tap through to order.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-20 border border-white/10 rounded-[2rem]">
              <Store className="mx-auto text-gray-600 mb-4" size={40} />
              <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No restaurant brands yet. Be the first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                    className="group block relative overflow-hidden rounded-[3rem] aspect-[4/3] bg-white/5 border border-white/10 hover:border-brand-orange/40 transition-colors p-10 flex flex-col justify-end"
                  >
                    <div className="absolute top-8 left-8 w-14 h-14 rounded-2xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                      <ChefHat size={24} />
                    </div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-brand-orange transition-colors">
                      {brand.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                      Visit Storefront <ChevronRight size={14} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-4xl font-black tracking-tighter uppercase italic mb-4">How It Works</h2>
          <p className="text-gray-400 font-medium text-lg mb-20">Three steps from application to a live storefront.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: '1. Apply', text: 'Tell us about your restaurant brand and how customers can reach you.' },
              { title: '2. Get Approved', text: 'Our team reviews and approves your registration, then provisions your dashboard.' },
              { title: '3. Go Live', text: 'Share your storefront link with customers and start managing orders.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-brand-orange/5 mx-auto rounded-3xl flex items-center justify-center text-brand-orange mb-6 font-black italic text-xl">
                  {i + 1}
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
