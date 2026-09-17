import React from 'react';
import { Award, ShieldCheck, Truck, Headphones, CheckCircle2, Users, Star, ArrowRight } from 'lucide-react';
import { testimonialsData } from '../data/storeData';

interface AboutScreenProps {
  onExploreShop: () => void;
  onContactUs: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onExploreShop, onContactUs }) => {
  return (
    <div className="about-page">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-[#083498] to-[#073faf] text-white py-16 md:py-24">
        <div className="wrap">
          <div className="max-w-2xl">
            <span className="inline-block text-xs font-black uppercase tracking-widest text-[#00d7ef] bg-white/10 px-3 py-1 rounded-full mb-4">
              OUR HERITAGE & MISSION
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight mb-6">
              12 years of delivering trusted technology & lifestyle essentials.
            </h1>
            <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
              Founded with the belief that authentic products and transparent shopping should be accessible to everyone across Pakistan, Insight Store brings together curated global hardware, dependable warranty service, and swift doorstep fulfillment.
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-[#073faf] mb-1">50K+</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Happy Customers</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-[#073faf] mb-1">100%</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Genuine & Sealed</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-[#073faf] mb-1">99.8%</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Satisfaction Rate</div>
            </div>
            <div className="p-4">
              <div className="text-3xl sm:text-4xl font-black text-[#073faf] mb-1">24/7</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Support Helpline</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 md:py-20 bg-[#f8fafc]">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#073faf] block mb-2">
              WHY CHOOSE INSIGHT STORE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101828]">
              Built on transparency, authenticity, and nationwide care
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-[#e7eaf0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#073faf] flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#101828] mb-3">Guaranteed Authenticity</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every single item in our inventory is sourced directly from authorized regional distributors and official brand importers. Zero counterfeit tolerance, 100% sealed original boxes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[#e7eaf0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#101828] mb-3">Swift Doorstep Dispatch</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Orders placed in Lahore before 2 PM enjoy same-day delivery. Customers in Karachi, Islamabad, Rawalpindi, and across Pakistan receive their orders within 2 business days via insured express couriers.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-[#e7eaf0] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#101828] mb-3">Direct Phone & WhatsApp Support</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our support team is based in Gulberg III, Lahore. We do not use automated runarounds; reach an actual product specialist directly at 03145338340 any day of the week.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 md:py-20 bg-white">
        <div className="wrap">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-widest text-[#073faf] block mb-2">
              REAL CUSTOMER VOICES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#101828]">
              Trusted by shoppers across Pakistan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((t, idx) => (
              <div key={idx} className="bg-[#f8fafc] rounded-2xl p-7 border border-[#e7eaf0] space-y-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "{t.text}"
                </p>
                <div className="pt-2 border-t border-gray-200">
                  <b className="text-sm font-bold text-gray-900 block">{t.name}</b>
                  <span className="text-xs text-gray-500">{t.location} · {t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="py-16 bg-[#073faf] text-white">
        <div className="wrap text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Ready to upgrade your home & technology?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Browse our full catalog or reach out to our team for custom corporate procurement and bulk gift inquiries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onExploreShop}
              className="px-8 py-3.5 rounded-full bg-[#00d7ef] hover:bg-[#1fe0f5] text-[#082f87] font-extrabold text-sm shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Start Shopping Now
            </button>
            <button
              onClick={onContactUs}
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-sm cursor-pointer transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
