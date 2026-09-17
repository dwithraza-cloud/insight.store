import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export const BenefitsRow: React.FC = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'Free Shipping',
      desc: 'On orders over PKR 2,500'
    },
    {
      icon: RotateCcw,
      title: '30-Day Returns',
      desc: 'Easy returns & refunds'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      desc: '100% verified checkout / COD'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      desc: 'We’re here to help anytime'
    }
  ];

  return (
    <section className="bg-white border-b border-slate-200/80 py-7 md:py-8 shadow-xs">
      <div className="wrap">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div 
                key={idx} 
                className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 hover:bg-blue-50/50 border border-slate-200/70 hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-white text-[#073faf] border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#073faf] group-hover:text-white group-hover:scale-105 transition-all">
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 leading-tight">
                    {b.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-snug truncate mt-0.5 font-medium">
                    {b.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
