import React, { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, Banknote, Building2, CheckCircle2, ChevronLeft } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutScreenProps {
  cartItems: CartItem[];
  discountRate: number;
  onPlaceOrder: (orderData: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
  cartItems,
  discountRate,
  onPlaceOrder,
  onBackToCart
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'card'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 100000 || subtotal === 0 ? 0 : 500;
  const discount = Math.round(subtotal * discountRate);
  const grandTotal = Math.max(0, subtotal - discount + shipping);

  const pakistanCities = [
    'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Sukkur'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert('Please fill in your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newOrder: Order = {
        id: `#IS-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Processing',
        items: [...cartItems],
        total: grandTotal,
        subtotal,
        shipping,
        discount,
        customer: {
          fullName,
          phone,
          email: email || 'customer@insightstore.pk',
          address,
          city,
          notes
        },
        paymentMethod
      };
      setIsSubmitting(false);
      onPlaceOrder(newOrder);
    }, 800);
  };

  return (
    <div className="wrap page py-10 md:py-14">
      {/* Back button */}
      <button
        onClick={onBackToCart}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#073faf] hover:underline mb-6 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Return to Shopping Cart</span>
      </button>

      <h1 className="page-title text-2xl sm:text-3xl font-black text-[#101828] mb-8">
        Secure Checkout
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Delivery Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* Shipping Address Card */}
          <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
            <h3 className="text-lg font-black text-[#101828] flex items-center gap-2 pb-3 border-b border-gray-100">
              <Truck className="w-5 h-5 text-[#073faf]" />
              <span>1. Delivery Destination (Pakistan)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-gray-700">Full Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Muhammad Raza"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Mobile Phone (WhatsApp / SMS) *</label>
                <input
                  required
                  type="tel"
                  placeholder="0300-1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="raza@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-gray-700">Street Address / House / Plaza *</label>
                <input
                  required
                  type="text"
                  placeholder="House # 14-B, Street 5, Sector / Phase / Block"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">City *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf] bg-white cursor-pointer"
                >
                  {pakistanCities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Order Delivery Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Call before arrival or landmark"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-[#073faf]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Card */}
          <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
            <h3 className="text-lg font-black text-[#101828] flex items-center gap-2 pb-3 border-b border-gray-100">
              <Banknote className="w-5 h-5 text-[#073faf]" />
              <span>2. Select Payment Method</span>
            </h3>

            <div className="space-y-3">
              {/* Option 1: Cash on Delivery */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-[#073faf] bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#073faf] mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">Cash on Delivery (COD)</span>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      POPULAR
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Pay securely in cash directly to the courier agent upon parcel delivery at your doorstep.
                  </p>
                </div>
              </label>

              {/* Option 2: Bank Transfer / Easypaisa */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'bank'
                    ? 'border-[#073faf] bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="accent-[#073faf] mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">Direct Bank Transfer / Easypaisa</span>
                    <Building2 className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Transfer directly to Insight Store corporate account (Meezan Bank / Bank Alfalah) or Easypaisa wallet.
                  </p>
                  {paymentMethod === 'bank' && (
                    <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 text-xs text-gray-700 space-y-1 font-mono">
                      <div>Bank: <b>Meezan Bank Ltd</b></div>
                      <div>Account Title: <b>Insight Store Pakistan</b></div>
                      <div>IBAN: <b>PK36MEZN00010834012019</b></div>
                      <div>Easypaisa Hotline: <b>03145338340</b></div>
                    </div>
                  )}
                </div>
              </label>

              {/* Option 3: Card */}
              <label
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#073faf] bg-blue-50/50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="accent-[#073faf] mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-900">Visa / Mastercard / UnionPay</span>
                    <CreditCard className="w-4 h-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Fast and encrypted online card checkout. 3D Secure verified OTP authentication.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Place Order */}
        <aside className="lg:col-span-5 bg-white border border-[#e7eaf0] rounded-2xl p-6 sm:p-8 space-y-6 sticky top-28 shadow-sm">
          <h3 className="text-lg font-black text-[#101828] pb-3 border-b border-gray-100">
            Order Review ({cartItems.length} items)
          </h3>

          {/* Items Mini List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-2">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center gap-3 pt-2">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 rounded-lg bg-gray-50 object-contain p-1 border border-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-gray-800 truncate">{product.title}</h4>
                  <div className="text-[11px] text-gray-500 font-medium">Qty: {quantity}</div>
                </div>
                <div className="text-xs font-black text-gray-900 shrink-0">
                  PKR {(product.price * quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-gray-100 pt-4 space-y-2.5 text-xs sm:text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-gray-900">PKR {subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="font-bold">- PKR {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping to {city}</span>
              {shipping === 0 ? (
                <span className="text-emerald-600 font-bold">Free</span>
              ) : (
                <span className="font-bold text-gray-900">PKR {shipping.toLocaleString()}</span>
              )}
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-black text-[#101828]">
              <span>Grand Total</span>
              <span className="text-xl text-[#073faf]">PKR {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Place Order CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#073faf] to-[#082f87] hover:from-[#082f87] hover:to-[#051f5c] text-white font-extrabold text-base shadow-xl shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Placing Order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm & Place Order</span>
              </>
            )}
          </button>

          <div className="p-3 bg-gray-50 rounded-xl text-[11px] text-gray-500 space-y-1">
            <p>• Inspection before payment is permitted on delivery.</p>
            <p>• You will receive SMS & WhatsApp confirmation with real-time tracking.</p>
          </div>
        </aside>
      </form>
    </div>
  );
};
