import React from 'react';
import { ArrowRight } from 'lucide-react';
import { promoBannersData } from '../data/storeData';

interface PromoBannersProps {
  onSelectCategory: (category: string) => void;
}

export const PromoBanners: React.FC<PromoBannersProps> = ({ onSelectCategory }) => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="wrap">
        <div className="promo-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {promoBannersData.map((promo) => {
            const isMint = promo.theme === 'mint';
            const isBlue = promo.theme === 'blue';
            const isPeach = promo.theme === 'peach';

            const bgClass = isMint
              ? 'bg-gradient-to-br from-[#e8faf5] via-[#d7f5ed] to-[#c2f0e4] border-emerald-200/60'
              : isBlue
              ? 'bg-gradient-to-br from-[#ebf3ff] via-[#dfedff] to-[#cbe2ff] border-blue-200/60'
              : 'bg-gradient-to-br from-[#fff2ea] via-[#ffe5d6] to-[#ffd7bf] border-orange-200/60';

            const tagColor = isMint
              ? 'text-emerald-800 bg-emerald-100/80 border-emerald-300/40'
              : isBlue
              ? 'text-blue-800 bg-blue-100/80 border-blue-300/40'
              : 'text-orange-900 bg-orange-100/80 border-orange-300/40';

            const btnClass = isMint
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : isBlue
              ? 'bg-[#073faf] hover:bg-[#082f87] text-white'
              : 'bg-[#ea580c] hover:bg-[#c2410c] text-white';

            return (
              <div
                key={promo.id}
                className={`promo rounded-2xl p-7 md:p-8 border flex flex-col justify-between relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300 ${bgClass}`}
              >
                {/* Decorative Background Product Image */}
                <div className="absolute -right-8 -bottom-6 w-44 h-44 rounded-full overflow-hidden opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 pointer-events-none">
                  <img
                    src={promo.image}
                    alt={promo.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="relative z-10 max-w-[85%]">
                  <span className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-3 ${tagColor}`}>
                    {promo.tag}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-[#101828] leading-tight mb-2">
                    {promo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed mb-6">
                    {promo.text}
                  </p>
                </div>

                <div className="relative z-10">
                  <button
                    onClick={() => onSelectCategory(promo.category)}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all transform group-hover:translate-x-1 cursor-pointer shadow-sm ${btnClass}`}
                  >
                    <span>{promo.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
