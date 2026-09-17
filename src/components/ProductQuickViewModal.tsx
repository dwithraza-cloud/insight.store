import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ArrowLeftRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Check, 
  RotateCcw,
  Zap,
  Info,
  ChevronRight,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  isWishlisted: boolean;
  isCompared: boolean;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  onToggleCompare,
  isWishlisted,
  isCompared
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews' | 'shipping'>('desc');
  const [isAdded, setIsAdded] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setActiveTab('desc');
      setIsAdded(false);
    }
  }, [product?.id]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const getBadgeStyle = (badge?: string) => {
    if (!badge) return null;
    const b = badge.toUpperCase();
    if (['STREAMING', 'CREATIVE', 'AI VIDEO', 'DIGITAL', 'POPULAR', 'PURE COTTON'].includes(b)) {
      return 'bg-emerald-600 text-white';
    }
    if (badge.includes('%')) return 'bg-sky-600 text-white';
    if (b === 'HOT') return 'bg-rose-600 text-white';
    if (b === 'BESTSELLER') return 'bg-[#073faf] text-white';
    return 'bg-emerald-600 text-white';
  };

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image];

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
        onClick={onClose}
        id="product-quick-view-overlay"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={product.title}
          id="product-quick-view-dialog"
        >
          {/* Top Bar Header with Close Button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-[#073faf] font-bold">{product.category}</span>
              <span>/</span>
              <span className="text-slate-700 font-bold">{product.brand}</span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="hidden sm:inline font-mono text-slate-400 text-[11px]">SKU: {product.sku}</span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {/* Main Product Showcase Section */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 p-6 sm:p-8">
              {/* Left Column: Image Gallery (5 cols on md) */}
              <div className="md:col-span-5 flex flex-col gap-3">
                {/* Main Media Container with Neutral Clean Backdrop */}
                <div className="w-full aspect-square bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-2xl p-4 sm:p-6 flex items-center justify-center border border-slate-200/80 relative overflow-hidden group">
                  <img
                    src={images[selectedImageIndex] || product.image}
                    alt={product.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.badge && (
                    <span className={`absolute top-3.5 left-3.5 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-full uppercase shadow-xs ${getBadgeStyle(product.badge)}`}>
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Thumbnail Carousel */}
                {images.length > 1 && (
                  <div className="flex items-center gap-2.5 overflow-x-auto py-1 px-0.5">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-14 h-14 rounded-xl border-2 p-1 bg-slate-50 shrink-0 overflow-hidden cursor-pointer transition-all ${
                          selectedImageIndex === idx
                            ? 'border-[#073faf] ring-2 ring-blue-100 shadow-sm'
                            : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-contain" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Details & Purchasing Actions (7 cols on md) */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-2">
                    {product.title}
                  </h2>

                  {/* Rating & Stock Status */}
                  <div className="flex items-center gap-2.5 flex-wrap mb-3.5 text-xs">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-700">
                      {product.rating.toFixed(1)} rating
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      In Stock (Fast Dispatch)
                    </span>
                  </div>

                  {/* Price Banner */}
                  <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-blue-50/80 border border-blue-100 mb-4">
                    <span className="text-2xl sm:text-3xl font-black text-[#073faf]">
                      PKR {product.price.toLocaleString()}
                    </span>
                    {product.oldPrice && (
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        PKR {product.oldPrice.toLocaleString()}
                      </span>
                    )}
                    {product.oldPrice && (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-md ml-auto">
                        Save PKR {(product.oldPrice - product.price).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3.5 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Key Feature Highlights Checklist */}
                  {product.features && product.features.length > 0 && (
                    <div className="space-y-1.5 mb-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      {product.features.slice(0, 4).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions Area */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  {/* Quantity and Primary Buy Buttons */}
                  <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-9 text-center font-black text-sm text-slate-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className={`flex-1 py-3 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                        isAdded
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-[#073faf] hover:bg-[#06328c] text-white shadow-md shadow-blue-700/20 hover:scale-[1.01] active:scale-[0.99]'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 stroke-[2.5]" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    {/* Buy Now Button */}
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="py-3 px-5 sm:px-6 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#ffae00] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-slate-900 shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer whitespace-nowrap transition-all"
                    >
                      Buy Now
                    </button>
                  </div>

                  {/* Secondary Wishlist & Compare Buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        isWishlisted
                          ? 'border-rose-300 bg-rose-50 text-rose-600'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                      <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleCompare(product)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                        isCompared
                          ? 'border-blue-300 bg-blue-50 text-[#073faf]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'In Comparison' : 'Compare'}</span>
                    </button>
                  </div>

                  {/* Assurance Badges */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#073faf]" /> Free delivery above PKR 100K
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 1-Year Official Warranty
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informational Tabs Section (Below Details) */}
            <div className="p-6 sm:p-8 bg-slate-50/60">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5 overflow-x-auto text-xs sm:text-sm font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('desc')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                    activeTab === 'desc'
                      ? 'bg-[#073faf] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Overview & Highlights
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                    activeTab === 'specs'
                      ? 'bg-[#073faf] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Technical Specifications
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                    activeTab === 'reviews'
                      ? 'bg-[#073faf] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Customer Reviews ({product.rating.toFixed(1)})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('shipping')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer shrink-0 ${
                    activeTab === 'shipping'
                      ? 'bg-[#073faf] text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  Shipping & Returns
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[100px]">
                {activeTab === 'desc' && (
                  <div className="space-y-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                    <p className="font-medium text-slate-800">{product.description}</p>
                    <p className="text-slate-600">
                      Manufactured according to international safety and quality standards, this item has passed stringent quality assurance tests before dispatch from our Lahore distribution center.
                    </p>
                    {product.features && (
                      <div className="pt-2">
                        <span className="text-xs font-bold text-slate-900 block mb-2">Package Inclusions:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {product.features.map((f, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-black block">Brand</span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{product.brand}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-black block">Category</span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{product.category}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-black block">SKU Code</span>
                      <span className="font-bold text-slate-900 font-mono text-xs sm:text-sm">{product.sku}</span>
                    </div>
                    {product.color && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">Color</span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{product.color}</span>
                      </div>
                    )}
                    {product.screen && (
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">Display Spec</span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">{product.screen}</span>
                      </div>
                    )}
                    <div className="p-3 bg-white rounded-xl border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase font-black block">Warranty</span>
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">1 Year Official Insight Cover</span>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-xs">M. Usman</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">Lahore · 2 days ago</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600">
                        "Delivered fast within 24 hours. The packaging was completely sealed and original. Excellent experience with Insight Store."
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-xs">Farhan Ali</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            Verified Purchase
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">Karachi · 5 days ago</span>
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600">
                        "Exactly as advertised in the photo. High grade materials and works seamlessly. Highly recommend."
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 space-y-3 text-xs sm:text-sm">
                    <div className="flex items-start gap-3">
                      <Truck className="w-4 h-4 text-[#073faf] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block mb-0.5">Express Dispatch Timelines:</strong>
                        <p className="text-slate-600">
                          Same-day delivery for Lahore orders placed before 2:00 PM. 2 to 3 business days delivery for Karachi, Islamabad, Rawalpindi, Peshawar, Faisalabad, and nationwide across Pakistan.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                      <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900 block mb-0.5">7-Day Replacement Guarantee:</strong>
                        <p className="text-slate-600">
                          7-day hassle-free return and replacement guarantee in case of manufacturing defect or transit damage. Cash on delivery payments supported nationwide.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
