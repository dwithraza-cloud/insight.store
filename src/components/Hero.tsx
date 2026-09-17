import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { heroSlidesData } from '../data/storeData';

interface HeroProps {
  onShopCategory: (category: string) => void;
  onExploreStory?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopCategory, onExploreStory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const SLIDE_DURATION = 6000; // 6 seconds auto-slide
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlidesData.length);
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleSelectSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlidesData.length);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlidesData.length - 1 : prev - 1));
  };

  const slide = heroSlidesData[currentSlide];

  return (
    <section 
      id="hero-section"
      className="relative overflow-hidden text-white min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Insight Store Hero Showcase"
    >
      {/* Background Banner Slides with exact gradient matching user screenshot */}
      {heroSlidesData.map((s, idx) => {
        const isActive = idx === currentSlide;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none -z-10'
            }`}
          >
            {/* High-res panoramic image background */}
            <div
              className="absolute inset-0 w-full h-full bg-no-repeat bg-cover bg-center md:bg-right transition-transform duration-1000 ease-out"
              style={{
                backgroundImage: `linear-gradient(90deg, rgba(0, 19, 58, 0.93) 0%, rgba(0, 31, 86, 0.55) 45%, rgba(0, 0, 0, 0.08) 100%), url(${s.image})`,
              }}
            />
          </div>
        );
      })}

      {/* Main Content Area */}
      <div className="wrap relative z-10 w-full py-14 sm:py-18 lg:py-22">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              {/* Eyebrow Label matching screenshot: cyan, uppercase, bold tracking */}
              <span className="text-[#00d7ef] text-xs sm:text-[13px] font-extrabold tracking-[0.2em] uppercase mb-3 sm:mb-4 block">
                {slide.eyebrow}
              </span>

              {/* Main Headline matching screenshot: clean bold white typography */}
              <h1 className="text-white font-extrabold text-3xl sm:text-5xl lg:text-[56px] leading-[1.12] tracking-tight mb-4 drop-shadow-sm">
                {slide.title}
              </h1>

              {/* Subtitle Description */}
              <p className="text-slate-200/90 text-sm sm:text-base leading-relaxed font-normal max-w-xl mb-8">
                {slide.description}
              </p>

              {/* CTA Action Buttons matching screenshot */}
              <div className="flex flex-wrap items-center gap-3.5">
                {/* Primary Cyan Pill Button: "Shop now →" */}
                <button
                  id="hero-primary-cta"
                  type="button"
                  onClick={() => onShopCategory(slide.category)}
                  className="px-7 py-3 rounded-full bg-[#00a2e8] hover:bg-[#0090d0] text-white font-bold text-sm sm:text-[15px] flex items-center justify-center shadow-lg shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  {slide.ctaText}
                </button>

                {/* Secondary Pill Button: "Explore our story" */}
                <button
                  id="hero-secondary-cta"
                  type="button"
                  onClick={() => {
                    if (onExploreStory) {
                      onExploreStory();
                    } else if (slide.secondaryCategory) {
                      onShopCategory(slide.secondaryCategory);
                    }
                  }}
                  className="px-6 py-3 rounded-full border border-white/40 hover:border-white text-white font-semibold text-sm sm:text-[15px] hover:bg-white/10 transition-all cursor-pointer"
                >
                  {slide.secondaryCtaText || 'Explore our story'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Vertical Pill / Dot Carousel Indicators on Far-Right matching screenshot */}
      <div 
        className="absolute right-4 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-2.5 py-2 px-1"
        aria-label="Slide navigation"
      >
        {heroSlidesData.map((_, idx) => {
          const isActive = idx === currentSlide;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSlide(idx)}
              className={`transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-2 h-6 rounded-full bg-[#00d7ef] shadow-md shadow-cyan-400/60'
                  : 'w-2 h-2 rounded-full border border-white/60 hover:border-white hover:scale-125'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          );
        })}
      </div>

      {/* Subtle Navigation Arrows for Easy Browsing on Desktop */}
      <button
        type="button"
        onClick={handlePrev}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/20 hover:bg-black/50 text-white/75 hover:text-white items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="hidden md:flex absolute right-16 sm:right-20 lg:right-24 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/20 hover:bg-black/50 text-white/75 hover:text-white items-center justify-center backdrop-blur-xs transition-all cursor-pointer"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
};
