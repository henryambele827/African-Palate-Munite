import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  Globe2,
  Sparkles,
  Truck,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { useBrand } from '../components/BrandProvider';

const CUISINES = [
  { name: 'Uganda', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800' },
  { name: 'Somalia', image: 'https://images.unsplash.com/photo-1666176481173-4c0b1a86cf35?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U29tYWxpYSUyMGZvb2R8ZW58MHx8MHx8fDA%3D' },
  { name: 'Nigeria', image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sudan', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' },
  { name: 'DR Congo', image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?auto=format&fit=crop&q=80&w=800' },
  { name: 'Eritrea', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800' },
  { name: 'Ethiopia', image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&q=80&w=800' },
  { name: 'Kenya', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800' },
  { name: 'Tanzania', image: 'https://plus.unsplash.com/premium_photo-1664360227457-e557c4d7f0e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjl8fFRhbnphbmlhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D' },
  { name: 'Rwanda', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800' },
  { name: 'Ghana', image: 'https://images.unsplash.com/photo-1705088293220-c1a22b5d214a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2hhbmElMjBmb29kfGVufDB8fDB8fHww' },
  { name: 'Senegal', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800' },
  { name: 'Cameroon', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800' },
  { name: 'South Africa', image: 'https://images.unsplash.com/photo-1661312220526-1dffbc8ac19f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNvdXRoJTIwYWZyaWNhJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D' },
  { name: 'Morocco', image: 'https://images.unsplash.com/photo-1517314597476-e1788060b6cb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG1vcm9jY28lMjBmb29kfGVufDB8fDB8fHww' },
  { name: 'Egypt', image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800' },
  { name: 'Diverse', image: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800' },
];

const STEPS = [
  { icon: Globe2, title: 'Explore Menu', text: 'Browse our diverse collection of 36+ cross-continental dishes.' },
  { icon: Truck, title: 'Pre-Order', text: 'Confirm your meal for tomorrow to ensure fresh campus delivery.' },
  { icon: Heart, title: 'Enjoy', text: 'Receive your hot meal at your campus or hostel, prepared with love.' },
];

const PILLARS = [
  { icon: ShieldCheck, title: 'Verified Kitchens', text: 'Every brand is reviewed before going live.' },
  { icon: Sparkles, title: 'Fresh Daily', text: 'Pre-orders mean we cook what you actually ordered.' },
  { icon: Truck, title: 'Campus Delivery', text: 'Hot meals to your hostel, on time, every time.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { brand } = useBrand();

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero — alive, image-backed, full-header (image extends behind floating navbar) */}
      <section className="relative -mt-[88px] min-h-[100vh] flex items-center pt-32 pb-16 overflow-hidden text-white">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
            alt=""
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          {/* Dark overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-brand-orange/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

          {/* Floating animated blobs */}
          <motion.div
            animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-20 right-10 w-72 h-72 bg-brand-orange/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-10 left-10 w-96 h-96 bg-brand-yellow/20 rounded-full blur-3xl"
          />
        </div>

        {/* Floating "Now Cooking" status pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="hidden md:flex absolute top-28 right-12 z-10 items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-5 py-3 shadow-2xl"
        >
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-white">
            Now Cooking
          </span>
          <span className="text-xs font-black text-brand-yellow">17 orders</span>
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 ring-2 ring-white/20">
                {brand?.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-brand-orange flex items-center justify-center text-white font-black italic text-2xl">${(
                        brand?.name || '?'
                      )
                        .slice(0, 2)
                        .toUpperCase()}</div>`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-brand-orange flex items-center justify-center text-white font-black italic text-2xl">
                    {(brand?.name || '?').slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-full">
                <Sparkles size={14} className="animate-pulse text-brand-yellow" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                  The Culinary Gateway
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[12vw] md:text-[8.5vw] font-black tracking-tighter leading-[0.85] uppercase italic text-white mb-6 drop-shadow-2xl"
            >
              {brand?.name || 'Taste'} <br />
              <span className="text-brand-yellow">Heritage.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-white/80 font-medium max-w-2xl mb-10 leading-snug"
            >
              One platform, many kitchens. Every restaurant brand on African
              Palate gets its own storefront, its own menu, and its own
              dashboard — we just handle the plumbing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="menu"
                className="group bg-brand-orange text-white px-8 py-5 rounded-full font-black uppercase tracking-widest italic flex items-center gap-3 hover:bg-white hover:text-black transition-all shadow-2xl shadow-brand-orange/40 hover:scale-[1.02]"
              >
                Browse the Kitchen
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#how-it-works"
                className="group bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white px-8 py-5 rounded-full font-black uppercase tracking-widest italic flex items-center gap-3 hover:bg-white hover:text-black hover:border-white transition-all"
              >
                How Ordering Works
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pillars strip */}
      <section className="bg-black text-white py-12 border-y border-white/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PILLARS.map((p) => (
              <div key={p.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-orange/15 text-brand-orange flex items-center justify-center flex-shrink-0">
                  <p.icon size={20} />
                </div>
                <div>
                  <p className="font-black uppercase italic tracking-tighter text-base">
                    {p.title}
                  </p>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed mt-1">
                    {p.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuisines */}
      <section className="py-28 md:py-36 bg-black text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange block mb-4">
                Our Roots
              </span>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none">
                Cuisines of <br /> the Continent.
              </h2>
            </div>
            <p className="text-gray-500 max-w-md font-medium text-lg leading-snug">
              From the spicy hills of Eritrea to the smoky party rice of
              Nigeria, we bring 17+ diverse dishes to your plate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
            {CUISINES.map((cuisine, index) => (
              <motion.div
                key={cuisine.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.04 }}
                onClick={() =>
                  navigate('menu', { state: { country: cuisine.name } })
                }
                className="group cursor-pointer relative overflow-hidden rounded-[2.5rem] aspect-[4/5]"
              >
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 text-left">
                  <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter mb-2 group-hover:text-brand-orange transition-colors">
                    {cuisine.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all translate-y-3 group-hover:translate-y-0 text-white">
                    View Dishes <ChevronRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-28 md:py-36 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="text-center mb-20">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-orange block mb-4">
              Ordering in 3 steps
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-4">
              Simple ordering.
            </h2>
            <p className="text-gray-500 font-medium text-lg max-w-xl mx-auto">
              Fresh meals, delivered today or pre-ordered for tomorrow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group bg-gray-50 rounded-[2rem] p-8 md:p-10 hover:bg-black transition-all duration-500"
              >
                <div className="w-20 h-20 bg-brand-orange/10 mx-auto rounded-3xl flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all shadow-xl shadow-brand-orange/10">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-3 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed group-hover:text-gray-300 transition-colors">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="pb-28 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl bg-brand-orange rounded-[2.5rem] p-10 md:p-16 text-white relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.95] mb-4">
              Hungry already?
            </h2>
            <p className="text-white/80 font-medium text-lg mb-8 max-w-md">
              Open the kitchen and find your next meal in under a minute.
            </p>
            <Link
              to="menu"
              className="inline-flex items-center gap-3 bg-black text-white px-8 py-5 rounded-full font-black uppercase tracking-widest italic hover:bg-white hover:text-black transition-all"
            >
              Open the Menu
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
