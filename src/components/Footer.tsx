import React, { useState } from 'react';
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { PageRoute } from '../types';
import { departmentsData } from '../data/storeData';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
  onSelectDepartment: (dept: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectDepartment }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setIsSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="footer bg-[#082f87] text-white pt-16 pb-8 border-t border-[#0a389f]">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <button
              onClick={() => onNavigate('home')}
              className="text-left cursor-pointer focus:outline-none"
            >
              <img
                src="https://insightstore.designerinsight.online/insight-store-logo.webp"
                alt="Insight Store"
                className="h-10 w-auto brightness-0 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.parentElement?.querySelector('.footer-logo-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="footer-logo-fallback hidden items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-lg bg-[#00d7ef] flex items-center justify-center font-bold text-[#083498] text-lg">
                  IS
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">Insight Store</span>
              </div>
            </button>

            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed max-w-sm">
              Delivering authentic technology, modern kitchenware, toys, electronics, and lifestyle essentials to homes across Pakistan with nationwide insured courier shipping.
            </p>

            <div className="space-y-2 text-xs text-blue-100">
              <a href="tel:03145338340" className="flex items-center gap-2.5 hover:text-[#00d7ef] transition-colors">
                <Phone className="w-4 h-4 text-[#00d7ef]" />
                <span className="font-bold">03145338340 (Helpline)</span>
              </a>
              <a href="mailto:hello@insightstore.pk" className="flex items-center gap-2.5 hover:text-[#00d7ef] transition-colors">
                <Mail className="w-4 h-4 text-[#00d7ef]" />
                <span>hello@insightstore.pk</span>
              </a>
              <div className="flex items-center gap-2.5 text-blue-200">
                <MapPin className="w-4 h-4 text-[#00d7ef]" />
                <span>Gulberg III, Lahore, Punjab, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#00d7ef]">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-blue-100/90 font-medium">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-white transition-colors cursor-pointer">
                  Shop Catalog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors cursor-pointer">
                  Insight Editorial
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-white transition-colors cursor-pointer">
                  My Account
                </button>
              </li>
            </ul>
          </div>

          {/* Top Departments */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#00d7ef]">
              Departments
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs text-blue-100/90 font-medium">
              {departmentsData.slice(0, 6).map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => {
                    onSelectDepartment(dept.name);
                    onNavigate('shop');
                  }}
                  className="text-left hover:text-white transition-colors cursor-pointer truncate"
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter Subscribe */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-[#00d7ef]">
              Stay in the loop
            </h4>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              Subscribe to get exclusive discount codes, flash sales, and new drops directly in your inbox.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-300 font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex rounded-xl overflow-hidden bg-white/10 p-1 border border-white/20">
                  <input
                    type="email"
                    required
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-transparent text-white placeholder:text-blue-200/60 outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#00d7ef] hover:bg-[#1fe0f5] text-[#082f87] font-bold rounded-lg text-xs transition-colors cursor-pointer shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[10px] text-blue-200/60">
                  Zero spam. You can unsubscribe anytime with one click.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-200/70">
          <div>
            © 2026 Insight Store. All rights reserved. Designed for Pakistani households & tech enthusiasts.
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-blue-200/60">Accepted Payments:</span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-bold text-[10px]">COD</span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-bold text-[10px]">Bank Transfer</span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-bold text-[10px]">Visa / MC</span>
            <span className="px-2 py-1 rounded bg-white/10 text-white font-bold text-[10px]">Easypaisa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
