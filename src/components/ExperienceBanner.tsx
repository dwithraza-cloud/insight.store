import React from 'react';
import { ShieldCheck, Truck, Headphones, CheckCircle2, ArrowRight } from 'lucide-react';

interface ExperienceBannerProps {
  onShopNow: () => void;
}

export const ExperienceBanner: React.FC<ExperienceBannerProps> = ({ onShopNow }) => {
  return (
    <section className="experience py-16 md:py-24 bg-gradient-to-br from-[#082f87] via-[#073faf] to-[#05266d] text-white relative overflow-hidden">
      {/* Background Subtle Glow & Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#00d7ef_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="wrap relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column Copy */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d7ef]/20 border border-[#00d7ef]/40 text-[#00d7ef] text-xs font-extrabold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00d7ef]"></span>
              SMARTER LIVING, TRUSTED HARDWARE
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Step into the experience of smarter technology.
            </h2>

            <p className="text-base sm:text-lg text-blue-100 font-normal leading-relaxed max-w-xl">
              From high-performance laptops and flagship smartphones to intelligent robotic appliances, Insight Store brings you authentic, factory-sealed electronics with nationwide reliability.
            </p>

            {/* Value checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00d7ef] shrink-0" />
                <span className="text-sm font-semibold text-white">100% Genuine & Sealed Stock</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#00d7ef] shrink-0" />
                <span className="text-sm font-semibold text-white">Same-Day Lahore Express</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#00d7ef] shrink-0" />
                <span className="text-sm font-semibold text-white">Official Brand Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <Headphones className="w-5 h-5 text-[#00d7ef] shrink-0" />
                <span className="text-sm font-semibold text-white">24/7 Expert Phone Support</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onShopNow}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-[#00d7ef] to-[#1481ef] hover:from-[#1fe0f5] hover:to-[#2290fc] text-[#082f87] font-black text-sm sm:text-base inline-flex items-center gap-3 shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Browse the collection</span>
                <ArrowRight className="w-4 h-4 text-[#082f87]" />
              </button>
            </div>
          </div>

          {/* Right Column Showcase Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-4">
              <img
                src="https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=85"
                alt="4K Smart Display"
                className="w-full h-auto rounded-2xl object-cover"
              />
              <div className="mt-4 p-4 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#00d7ef] font-bold uppercase tracking-wider">Featured Flagship</div>
                  <div className="text-sm font-bold text-white">Vision 55" Quantum Smart TV</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-300 line-through">PKR 189,999</div>
                  <div className="text-sm font-extrabold text-[#00d7ef]">PKR 164,999</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
