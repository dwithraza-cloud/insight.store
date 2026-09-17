import React, { useState } from 'react';
import { Heart, Eye, ArrowLeftRight, ShoppingBag, Check, Star, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isWishlisted: boolean;
  isCompared: boolean;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  onToggleCompare,
  isWishlisted,
  isCompared,
  layout = 'grid'
}) => {
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const getBadgeStyle = (badge?: string) => {
    if (!badge) return null;
    const b = badge.toUpperCase();
    if (['STREAMING', 'CREATIVE', 'AI VIDEO', 'DIGITAL', 'POPULAR', 'PURE COTTON'].includes(b)) {
      return 'bg-[#15803d] text-white'; // Exact emerald green matching screenshot
    }
    if (badge.includes('%')) {
      return 'bg-[#0284c7] text-white';
    }
    if (b === 'HOT') {
      return 'bg-[#ef4444] text-white';
    }
    if (b === 'BESTSELLER') {
      return 'bg-[#073faf] text-white';
    }
    return 'bg-[#16a34a] text-white';
  };

  // Fallback image generator
  const getFallbackImage = () => {
    if (product.category === 'Digital Products') {
      return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=85';
    }
    if (product.category.toLowerCase().includes('bed')) {
      return 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=85';
    }
    return 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85';
  };

  if (layout === 'list') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="group bg-white border border-slate-200/80 hover:border-blue-400/80 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 relative"
      >
        {/* Left image thumbnail */}
        <div 
          onClick={() => onQuickView(product)}
          className="relative w-full sm:w-48 sm:min-w-[192px] aspect-square bg-[#0c1322] rounded-xl overflow-hidden p-2.5 flex items-center justify-center cursor-pointer group-hover:opacity-95 transition-all"
        >
          {product.badge && (
            <span className={`absolute top-2 left-2 z-10 text-[10px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase shadow-xs ${getBadgeStyle(product.badge)}`}>
              {product.badge}
            </span>
          )}

          <img
            src={imageError ? getFallbackImage() : product.image}
            alt={product.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </div>

        {/* Center content */}
        <div className="flex-1 flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                {product.category}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-slate-600">
                {product.brand}
              </span>
              {product.stock ? (
                <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock
                </span>
              ) : (
                <span className="ml-auto text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            <h3 
              onClick={() => onQuickView(product)}
              className="font-bold text-base text-slate-900 group-hover:text-[#073faf] transition-colors cursor-pointer mb-2 leading-snug"
            >
              {product.title}
            </h3>

            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3 max-w-2xl font-normal">
              {product.description}
            </p>

            {product.features && product.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {product.features.slice(0, 3).map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100/80 px-2 py-0.5 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-[#073faf]" />
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-current" />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              ({product.rating.toFixed(1)})
            </span>
          </div>
        </div>

        {/* Right price & action CTA */}
        <div className="sm:w-48 sm:min-w-[192px] sm:border-l sm:border-slate-100 sm:pl-5 flex flex-col justify-between pt-3 sm:pt-1 border-t sm:border-t-0 border-slate-100">
          <div>
            <div className="text-[11px] text-slate-400 font-medium mb-1">Instant Activation</div>
            <div className="text-xl font-black text-[#ef4444] tracking-tight">
              PKR {product.price.toLocaleString()}
            </div>
            {product.oldPrice && (
              <div className="text-xs text-slate-400 line-through font-medium">
                PKR {product.oldPrice.toLocaleString()}
              </div>
            )}
          </div>

          <div className="space-y-2 mt-4">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#073faf] hover:bg-[#063086] text-white shadow-md shadow-blue-900/10'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added to cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to cart</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 justify-center">
              <button
                type="button"
                onClick={() => onToggleWishlist(product)}
                className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => onToggleCompare(product)}
                className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
                  isCompared
                    ? 'border-blue-200 bg-blue-50 text-[#073faf]'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Compare"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="p-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                title="Quick View"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Grid layout matching the user screenshot
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
      className="group bg-white border border-slate-200/80 hover:border-blue-300/90 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/8 hover:-translate-y-1 relative"
    >
      {/* Product Image Container */}
      <div 
        onClick={() => onQuickView(product)}
        className="relative w-full aspect-square bg-[#0b1322] rounded-xl overflow-hidden mb-3 p-2.5 flex items-center justify-center cursor-pointer transition-all duration-300 group-hover:bg-[#070e1b]"
        role="button"
        tabIndex={0}
        aria-label={`View ${product.title}`}
      >
        {/* Top-Left Pill Badge matching screenshot */}
        {product.badge && (
          <span className={`absolute top-2.5 left-2.5 z-10 text-[10px] sm:text-[11px] font-extrabold tracking-wider px-2.5 py-1 rounded-full uppercase shadow-xs ${getBadgeStyle(product.badge)}`}>
            {product.badge}
          </span>
        )}

        {/* Product Image */}
        <img
          src={imageError ? getFallbackImage() : product.image}
          alt={product.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-lg group-hover:scale-106 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick Action Floating SaaS Buttons */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-[#ef4444] text-white hover:bg-red-600'
                : 'bg-white/95 backdrop-blur-xs text-slate-700 hover:bg-white hover:text-[#ef4444] border border-slate-200/60'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(product);
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer ${
              isCompared
                ? 'bg-[#073faf] text-white'
                : 'bg-white/95 backdrop-blur-xs text-slate-700 hover:bg-white hover:text-[#073faf] border border-slate-200/60'
            }`}
            title={isCompared ? 'Remove from compare' : 'Compare product'}
            aria-label="Compare"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs text-slate-700 hover:bg-[#073faf] hover:text-white border border-slate-200/60 flex items-center justify-center shadow-md transition-all cursor-pointer"
            title="Quick view details"
            aria-label="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Eyebrow / Category matching screenshot */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-400 uppercase">
              {product.category}
            </span>
            {product.stock ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                In Stock
              </span>
            ) : (
              <span className="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-sm sm:text-[15px] text-slate-900 group-hover:text-[#073faf] transition-colors line-clamp-2 leading-snug cursor-pointer mb-2 min-h-[42px]"
          >
            {product.title}
          </h3>
        </div>

        <div>
          {/* 5-Star Rating matching screenshot */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-current"
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              ({product.rating.toFixed(1)})
            </span>
          </div>

          {/* Price & Action Row */}
          <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
            <div className="flex flex-col">
              {/* Bold Red Price matching screenshot */}
              <span className="text-base sm:text-lg font-extrabold text-[#ef4444] tracking-tight leading-none">
                PKR {product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <span className="text-[11px] sm:text-xs text-slate-400 line-through font-medium mt-1">
                  PKR {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95 ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-50/80 text-[#073faf] hover:bg-[#073faf] hover:text-white border border-blue-100/60'
              }`}
              aria-label={`Add ${product.title} to cart`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
