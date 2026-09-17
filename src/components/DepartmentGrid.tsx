import React, { useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  Utensils, 
  Sparkles, 
  Gamepad2, 
  Tv, 
  Smartphone, 
  Layers, 
  Gem, 
  Wind,
  CookingPot,
  Bed
} from 'lucide-react';
import { motion } from 'motion/react';
import { departmentsData } from '../data/storeData';

interface DepartmentGridProps {
  onSelectDepartment: (deptName: string) => void;
  onViewAll: () => void;
}

export const DepartmentGrid: React.FC<DepartmentGridProps> = ({
  onSelectDepartment,
  onViewAll
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'kitchen-accessories':
        return <Utensils className="w-4 h-4" />;
      case 'clothes':
        return <Sparkles className="w-4 h-4" />;
      case 'toys':
        return <Gamepad2 className="w-4 h-4" />;
      case 'electronics':
        return <Tv className="w-4 h-4" />;
      case 'gadgets':
        return <Smartphone className="w-4 h-4" />;
      case 'bedsheets':
        return <Bed className="w-4 h-4" />;
      case 'jewellery':
        return <Gem className="w-4 h-4" />;
      case 'home-appliances':
        return <Wind className="w-4 h-4" />;
      default:
        return <CookingPot className="w-4 h-4" />;
    }
  };

  return (
    <section className="py-10 md:py-14 bg-white relative">
      <div className="wrap px-4 sm:px-6 lg:px-8 max-w-[1370px] mx-auto">
        {/* Section Header matching attached image */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Shop by Category
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#073faf] hover:text-[#0088cc] transition-colors cursor-pointer group"
          >
            <span>View all products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Carousel Container with Left/Right circular navigation buttons */}
        <div className="relative group/carousel">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-lg shadow-slate-900/10 text-slate-700 hover:text-[#073faf] hover:border-[#073faf]/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200/90 shadow-lg shadow-slate-900/10 text-slate-700 hover:text-[#073faf] hover:border-[#073faf]/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer opacity-90 hover:opacity-100"
            aria-label="Next categories"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Horizontal scroll track matching the exact attached card design */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 px-1 no-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {departmentsData.map((dept, idx) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => onSelectDepartment(dept.name)}
                className="flex-shrink-0 w-[180px] sm:w-[210px] md:w-[224px] lg:w-[242px] bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col group cursor-pointer snap-start relative hover:-translate-y-1"
              >
                {/* Category Image Container */}
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-b from-[#eaf2fc] to-[#f4f8fe] flex items-center justify-center p-2.5">
                  {/* Floating Circular Blue/Cyan Badge with Icon */}
                  <div className="absolute top-2.5 left-2.5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#00d7ef] text-white flex items-center justify-center shadow-md z-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    {getCategoryIcon(dept.id)}
                  </div>

                  {/* Category Image */}
                  <img
                    src={dept.image}
                    alt={dept.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-sm"
                    loading="lazy"
                  />
                </div>

                {/* Category Name & Product Count */}
                <div className="pt-3 pb-1 text-center flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#073faf] transition-colors line-clamp-1">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    {dept.count} {dept.count === 1 ? 'product' : 'products'}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
