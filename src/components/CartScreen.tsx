import React, { useState } from 'react';
import { Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag, Plus, Minus } from 'lucide-react';
import { CartItem } from '../types';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  discountRate: number;
  onApplyCoupon: (code: string) => boolean;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping,
  discountRate,
  onApplyCoupon
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 100000 || subtotal === 0 ? 0 : 500;
  const discountAmount = Math.round(subtotal * discountRate);
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const success = onApplyCoupon(couponCode.trim());
    if (success) {
      setCouponMessage({ text: 'Coupon INSIGHT10 applied! 10% discount', isError: false });
    } else {
      setCouponMessage({ text: 'Invalid coupon. Try INSIGHT10', isError: true });
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="wrap page py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-200 p-10 space-y-5 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-[#073faf] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-[#101828]">Your cart is empty</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Great products and genuine smart tech are only a click away. Start browsing our curated departments.
          </p>
          <button
            onClick={onContinueShopping}
            className="w-full py-3.5 px-6 rounded-xl bg-[#073faf] hover:bg-[#082f87] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            Explore the shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="breadcrumb text-xs text-gray-400 font-medium mb-4 flex items-center gap-2">
        <button onClick={onContinueShopping} className="hover:text-[#073faf] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Shopping Cart</span>
      </nav>

      <h1 className="page-title text-2xl sm:text-3xl font-black text-[#101828] mb-8">
        Your Shopping Cart ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="cart-layout grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-[#e7eaf0] divide-y divide-gray-100 overflow-hidden shadow-sm">
            {cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="cart-item p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50/50"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl p-2 shrink-0 border border-gray-100 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold text-gray-400 uppercase block">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-[#101828] truncate mb-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#073faf]">
                        PKR {product.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        ({product.sku})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                    <button
                      onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center text-xs font-extrabold text-gray-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Line item total */}
                  <div className="text-right min-w-[100px]">
                    <span className="text-sm sm:text-base font-black text-[#101828] block">
                      PKR {(product.price * quantity).toLocaleString()}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(product.id)}
                    className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onContinueShopping}
              className="text-xs sm:text-sm font-bold text-[#073faf] hover:underline cursor-pointer"
            >
              ← Continue Shopping
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary Box */}
        <aside className="lg:col-span-4 bg-white border border-[#e7eaf0] rounded-2xl p-6 space-y-6 sticky top-28 shadow-sm">
          <h3 className="text-lg font-black text-[#101828] pb-3 border-b border-gray-100">
            Order Summary
          </h3>

          {/* Coupon Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Coupon (e.g. INSIGHT10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#073faf] uppercase font-semibold"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <p className={`text-xs font-medium ${couponMessage.isError ? 'text-red-500' : 'text-emerald-600'}`}>
                {couponMessage.text}
              </p>
            )}
          </form>

          {/* Price breakdown */}
          <div className="space-y-3 text-xs sm:text-sm text-gray-600 border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between">
              <span>Items Subtotal</span>
              <b className="text-gray-900 font-bold">PKR {subtotal.toLocaleString()}</b>
            </div>

            {discountAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-600">
                <span>Promo Discount (10%)</span>
                <b className="font-bold">- PKR {discountAmount.toLocaleString()}</b>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span>Standard Shipping</span>
              {shipping === 0 ? (
                <span className="text-emerald-600 font-bold uppercase text-xs">Free (Order &gt; 100K)</span>
              ) : (
                <b className="text-gray-900 font-bold">PKR {shipping.toLocaleString()}</b>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-200 text-base font-black text-[#101828]">
              <span>Grand Total</span>
              <span className="text-xl text-[#073faf]">PKR {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <button
            onClick={onProceedToCheckout}
            className="w-full py-4 rounded-xl bg-[#073faf] hover:bg-[#082f87] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Trust Guarantees */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100/80 space-y-2 text-[11px] text-gray-600">
            <div className="flex items-center gap-2 font-semibold text-[#073faf]">
              <ShieldCheck className="w-4 h-4 text-[#073faf]" />
              <span>Safe & Secure Transactions</span>
            </div>
            <p className="text-gray-500 leading-snug">
              Cash on delivery, bank transfer, and credit cards accepted. 7-day inspection guarantee.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
