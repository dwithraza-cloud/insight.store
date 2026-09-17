import React from 'react';
import { User, Package, MapPin, ShieldCheck, Clock, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { Order } from '../types';

interface AccountScreenProps {
  orders: Order[];
  onExploreShop: () => void;
  onNavigateHome: () => void;
}

export const AccountScreen: React.FC<AccountScreenProps> = ({
  orders,
  onExploreShop,
  onNavigateHome
}) => {
  return (
    <div className="wrap page py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="breadcrumb text-xs text-gray-400 font-medium mb-4 flex items-center gap-2">
        <button onClick={onNavigateHome} className="hover:text-[#073faf] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="text-gray-700 font-semibold">My Account</span>
      </nav>

      {/* Header Profile Badge */}
      <div className="bg-white border border-[#e7eaf0] rounded-3xl p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-[#083498] to-[#00d7ef] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/10">
            IS
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-xl sm:text-2xl font-black text-[#101828]">Muhammad Hamza</h1>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Verified Account
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              hamza.customer@insightstore.pk · Member since 2024
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-8 text-center">
          <div>
            <span className="text-2xl font-black text-[#073faf] block leading-none">
              {orders.length}
            </span>
            <span className="text-xs text-gray-400 font-medium">Orders Placed</span>
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-600 block leading-none">
              100%
            </span>
            <span className="text-xs text-gray-400 font-medium">Fulfillment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Orders history */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#101828] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#073faf]" />
              <span>Order History ({orders.length})</span>
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <p className="text-sm text-gray-500">You haven't placed any orders yet.</p>
                <button
                  onClick={onExploreShop}
                  className="px-6 py-2.5 rounded-xl bg-[#073faf] text-white text-xs font-bold hover:bg-[#082f87]"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="border border-[#e7eaf0] rounded-xl p-4 sm:p-5 space-y-3 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-[#101828] text-sm">{ord.id}</span>
                        <span className="text-gray-400">· {ord.date}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs">
                          <img
                            src={item.product.image}
                            alt=""
                            className="w-10 h-10 object-contain rounded bg-gray-50 p-1 border border-gray-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-800 truncate">{item.product.title}</h4>
                            <span className="text-gray-400">Qty: {item.quantity}</span>
                          </div>
                          <div className="font-bold text-gray-900">
                            PKR {(item.product.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500">Payment: <b className="text-gray-700 uppercase">{ord.paymentMethod}</b></span>
                      <div className="text-sm font-black text-[#073faf]">
                        Total: PKR {ord.total.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Default Saved Address & Support */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 shadow-sm space-y-3">
            <h3 className="text-base font-black text-[#101828] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#073faf]" />
              <span>Primary Shipping Address</span>
            </h3>
            <div className="text-xs text-gray-600 leading-relaxed space-y-1 bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <div className="font-bold text-gray-900">Muhammad Hamza</div>
              <div>House 18-B, Block C-2, Gulberg III</div>
              <div>Lahore, Punjab, 54000</div>
              <div>Pakistan</div>
              <div className="text-gray-500 pt-1 font-mono">Mobile: 03145338340</div>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-black text-[#073faf] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#073faf]" />
              <span>Customer Care & Warranty</span>
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              All electronics purchased through Insight Store are registered with official manufacturer warranties. For service requests, please contact our helpline:
            </p>
            <a
              href="tel:03145338340"
              className="inline-block text-xs font-black text-white bg-[#073faf] hover:bg-[#082f87] px-4 py-2 rounded-xl transition-colors"
            >
              Call 03145338340
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
