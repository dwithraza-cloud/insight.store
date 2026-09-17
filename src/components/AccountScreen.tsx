import React, { useState, useRef } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ShoppingBag,
  Truck,
  ArrowRight,
  ExternalLink,
  Phone
} from 'lucide-react';
import { Order } from '../types';
import { OrderTracker } from './OrderTracker';

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
  const [activeTab, setActiveTab] = useState<'track' | 'orders' | 'addresses'>('track');
  const [trackingTargetId, setTrackingTargetId] = useState<string>(
    orders.length > 0 ? orders[0].id : '#IS-94021'
  );

  const trackerRef = useRef<HTMLDivElement | null>(null);

  const handleTrackSpecificOrder = (orderId: string) => {
    setTrackingTargetId(orderId);
    setActiveTab('track');
    setTimeout(() => {
      trackerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <div className="wrap page py-10 md:py-14 space-y-8">
      {/* Breadcrumb */}
      <nav className="breadcrumb text-xs text-gray-400 font-medium flex items-center gap-2">
        <button onClick={onNavigateHome} className="hover:text-[#073faf] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="text-gray-700 font-semibold">My Account</span>
        {activeTab === 'track' && (
          <>
            <span>/</span>
            <span className="text-[#073faf] font-bold">Track Shipment</span>
          </>
        )}
      </nav>

      {/* Header Profile Badge */}
      <div className="bg-white border border-[#e7eaf0] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-[#083498] to-[#00d7ef] text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/10 shrink-0">
            IS
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-[#101828]">Muhammad Hamza</h1>
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Verified Account
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              hamza.customer@insightstore.pk · Member since 2024 · Lahore
            </p>
          </div>
        </div>

        {/* Account Quick Stats */}
        <div className="flex items-center gap-6 sm:gap-8 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-8 text-center">
          <div>
            <span className="text-2xl font-black text-[#073faf] block leading-none">
              {orders.length}
            </span>
            <span className="text-xs text-gray-400 font-medium">Total Orders</span>
          </div>
          <div>
            <span className="text-2xl font-black text-[#00d7ef] block leading-none">
              1
            </span>
            <span className="text-xs text-gray-400 font-medium">In Transit</span>
          </div>
          <div>
            <span className="text-2xl font-black text-emerald-600 block leading-none">
              100%
            </span>
            <span className="text-xs text-gray-400 font-medium">Fulfillment</span>
          </div>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('track')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === 'track'
              ? 'bg-[#073faf] text-white shadow-md shadow-blue-700/20'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Track Order (Live Telemetry)</span>
          <span className="w-2 h-2 rounded-full bg-[#00d7ef] animate-pulse" />
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === 'orders'
              ? 'bg-[#073faf] text-white shadow-md shadow-blue-700/20'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('addresses')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shrink-0 ${
            activeTab === 'addresses'
              ? 'bg-[#073faf] text-white shadow-md shadow-blue-700/20'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses & Care</span>
        </button>
      </div>

      {/* Tab 1: Live Order Tracker */}
      {activeTab === 'track' && (
        <div ref={trackerRef} className="space-y-6">
          <OrderTracker 
            orders={orders} 
            initialOrderId={trackingTargetId}
            onSelectOrder={(id) => setTrackingTargetId(id)}
          />

          {/* Quick links to orders underneath tracker */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[#073faf] shrink-0" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                  Looking for past orders or invoices?
                </h4>
                <p className="text-xs text-gray-500">
                  You have {orders.length} order(s) in your history. You can track any of them with one click.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className="text-xs font-bold text-[#073faf] hover:text-[#082f87] flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>View All Past Orders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Order History List */}
      {activeTab === 'orders' && (
        <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-[#101828] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#073faf]" />
                <span>My Orders</span>
              </h2>
              <p className="text-xs text-gray-500">
                Click "Track Shipment" on any order to see live courier milestones.
              </p>
            </div>

            <button
              onClick={onExploreShop}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition-colors cursor-pointer"
            >
              Shop More
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm font-semibold text-gray-600">You haven't placed any orders yet.</p>
              <button
                onClick={onExploreShop}
                className="px-6 py-2.5 rounded-xl bg-[#073faf] text-white text-xs font-bold hover:bg-[#082f87] cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="border border-[#e7eaf0] rounded-2xl p-5 space-y-4 hover:border-blue-300 transition-all bg-white"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 text-xs">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-extrabold text-[#101828] text-sm">{ord.id}</span>
                      <span className="text-gray-400">· Placed on {ord.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ord.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleTrackSpecificOrder(ord.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#073faf] hover:bg-[#06328c] text-white text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track Shipment</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.product.image}
                          alt=""
                          className="w-12 h-12 object-contain rounded-xl bg-gray-50 p-1.5 border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 truncate">{item.product.title}</h4>
                          <span className="text-gray-400">Quantity: {item.quantity}</span>
                        </div>
                        <div className="font-bold text-gray-900">
                          PKR {(item.product.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-gray-500">
                      Payment Mode: <b className="text-gray-800 uppercase">{ord.paymentMethod}</b>
                    </span>
                    <div className="text-sm font-black text-[#073faf]">
                      Total: PKR {ord.total.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses & Customer Care */}
      {activeTab === 'addresses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-[#e7eaf0] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-black text-[#101828] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#073faf]" />
                <span>Primary Shipping Address</span>
              </h3>

              <div className="text-xs text-gray-600 leading-relaxed space-y-1.5 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="font-extrabold text-sm text-gray-900">Muhammad Hamza</div>
                <div>House 18-B, Block C-2, Gulberg III</div>
                <div>Lahore, Punjab, 54000</div>
                <div>Pakistan</div>
                <div className="text-gray-700 pt-1 font-mono font-semibold">Mobile: 03145338340</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Address verified for express same-day dispatch in Lahore.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-black text-[#073faf] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#073faf]" />
                <span>Customer Care & Warranty Registry</span>
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                All electronics and appliances purchased through Insight Store carry official manufacturer warranties. For delivery inquiries or warranty claims, contact our team:
              </p>
              
              <div className="pt-2">
                <a
                  href="tel:03145338340"
                  className="inline-flex items-center gap-2 text-xs font-black text-white bg-[#073faf] hover:bg-[#082f87] px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Helpline: 03145338340</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
