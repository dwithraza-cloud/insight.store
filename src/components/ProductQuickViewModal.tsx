import React, { useState } from 'react';
import { X, Star, Heart, ArrowLeftRight, ShoppingBag, Shield, Truck, Check, Play } from 'lucide-react';
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

  if (!product) return null;

  const getBadgeStyle = (badge?: string) => {
    if (!badge) return null;
    const b = badge.toUpperCase();
    if (['STREAMING', 'CREATIVE', 'AI VIDEO', 'DIGITAL', 'POPULAR', 'PURE COTTON'].includes(b)) {
      return 'bg-[#15803d] text-white';
    }
    if (badge.includes('%')) return 'bg-[#0284c7] text-white';
    if (b === 'HOT') return 'bg-[#ef4444] text-white';
    if (b === 'BESTSELLER') return 'bg-[#073faf] text-white';
    return 'bg-[#16a34a] text-white';
  };

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image, product.image];

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-gray-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 md:p-10">
          {/* Left Column: Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Media Preview */}
            <div className="w-full aspect-square bg-[#0b1322] rounded-2xl p-6 flex items-center justify-center border border-[#e7eaf0] relative overflow-hidden">
              <img
                src={images[selectedImageIndex] || product.image}
                alt={product.title}
                className="w-full h-full object-contain"
              />
              {product.badge && (
                <span className={`absolute top-4 left-4 text-xs font-black px-3 py-1 rounded-full uppercase shadow-xs ${getBadgeStyle(product.badge)}`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl border-2 p-1 bg-white shrink-0 overflow-hidden cursor-pointer transition-all ${
                      selectedImageIndex === idx
                        ? 'border-[#073faf] shadow-md scale-105'
                        : 'border-gray-200 hover:border-gray-400 opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Copy & Actions */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Brand */}
              <div className="flex items-center justify-between text-xs text-gray-500 font-semibold tracking-wide uppercase mb-1">
                <span>{product.category} · {product.brand}</span>
                <span className="text-[11px] text-gray-400 font-mono">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-[#101828] leading-tight mb-2">
                {product.title}
              </h2>

              {/* Rating & In-Stock Status */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-bold text-gray-700">
                  {product.rating.toFixed(1)} verified rating
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  In Stock (Fast Delivery)
                </span>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 mb-4">
                <span className="text-2xl sm:text-3xl font-black text-[#073faf]">
                  PKR {product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className="text-sm font-semibold text-gray-400 line-through">
                    PKR {product.oldPrice.toLocaleString()}
                  </span>
                )}
                {product.oldPrice && (
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md ml-auto">
                    Save PKR {(product.oldPrice - product.price).toLocaleString()}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Bullet Features */}
              {product.features && (
                <div className="space-y-1.5 mb-5">
                  {product.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quantity Selector & Buy Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                {/* Quantity Buttons */}
                <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-extrabold text-sm text-[#101828]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#073faf] hover:bg-[#082f87] text-white shadow-lg shadow-blue-600/20'
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

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-[#ffae00] to-[#f59e0b] hover:from-[#f59e0b] hover:to-[#d97706] text-gray-900 shadow-md cursor-pointer whitespace-nowrap"
                >
                  Buy Now
                </button>
              </div>

              {/* Secondary Wishlist & Compare Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    isWishlisted
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                </button>

                <button
                  onClick={() => onToggleCompare(product)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                    isCompared
                      ? 'border-blue-300 bg-blue-50 text-[#073faf]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium pt-3 border-t border-gray-100">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" /> Free delivery over PKR 100K
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" /> 1-Year Official Warranty
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Tabs: Description, Specs, Reviews, Shipping */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-6 sm:p-8">
          <div className="flex items-center gap-4 border-b border-gray-200 pb-3 mb-4 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'desc'
                  ? 'text-[#073faf] border-b-2 border-[#073faf]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Overview & Highlights
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'specs'
                  ? 'text-[#073faf] border-b-2 border-[#073faf]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'text-[#073faf] border-b-2 border-[#073faf]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Customer Reviews ({product.rating.toFixed(1)})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 transition-colors cursor-pointer ${
                activeTab === 'shipping'
                  ? 'text-[#073faf] border-b-2 border-[#073faf]'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed min-h-[80px]">
            {activeTab === 'desc' && (
              <div className="space-y-2">
                <p>{product.description}</p>
                <p>
                  Manufactured according to international safety and quality standards, this item has passed stringent quality assurance tests before dispatch from our Lahore distribution center.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold block">Brand</span>
                  <span className="font-bold text-gray-900">{product.brand}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold block">Category</span>
                  <span className="font-bold text-gray-900">{product.category}</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold block">SKU Code</span>
                  <span className="font-bold text-gray-900 font-mono">{product.sku}</span>
                </div>
                {product.color && (
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold block">Color</span>
                    <span className="font-bold text-gray-900">{product.color}</span>
                  </div>
                )}
                {product.screen && (
                  <div className="p-3 bg-white rounded-lg border border-gray-200">
                    <span className="text-[11px] text-gray-400 uppercase font-semibold block">Display Spec</span>
                    <span className="font-bold text-gray-900">{product.screen}</span>
                  </div>
                )}
                <div className="p-3 bg-white rounded-lg border border-gray-200">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold block">Warranty</span>
                  <span className="font-bold text-gray-900">1 Year Official Insight Cover</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <b className="text-gray-900 text-xs">M. Usman (Verified Buyer)</b>
                    <span className="text-[11px] text-gray-400">Lahore</span>
                  </div>
                  <div className="flex items-center text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    "Delivered fast within 24 hours. The packaging was completely sealed and original. Excellent experience with Insight Store."
                  </p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <b className="text-gray-900 text-xs">Farhan Ali (Verified Buyer)</b>
                    <span className="text-[11px] text-gray-400">Karachi</span>
                  </div>
                  <div className="flex items-center text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    "Exactly as advertised in the photo. High grade materials and works seamlessly. Highly recommend."
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <p>
                  <strong>Delivery Timelines:</strong> Same-day delivery for Lahore orders placed before 2:00 PM. 2 to 3 business days delivery for Karachi, Islamabad, Rawalpindi, Peshawar, Faisalabad, and nationwide across Pakistan.
                </p>
                <p>
                  <strong>Return Policy:</strong> 7-day hassle-free return and replacement guarantee in case of manufacturing defect or transit damage. Cash on delivery payments supported nationwide.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
