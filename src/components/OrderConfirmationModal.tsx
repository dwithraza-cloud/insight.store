import React from 'react';
import { CheckCircle, Package, Truck, Phone, ArrowRight } from 'lucide-react';
import { Order } from '../types';

interface OrderConfirmationModalProps {
  order: Order | null;
  onClose: () => void;
  onGoToShop: () => void;
  onGoToAccount: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onGoToShop,
  onGoToAccount
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-100 my-8 text-center"
        role="dialog"
        aria-modal="true"
      >
        {/* Animated Checkmark Badge */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle className="w-12 h-12" />
        </div>

        <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
          Order Successfully Confirmed
        </span>

        <h2 className="text-2xl sm:text-3xl font-black text-[#101828] mt-3 mb-2">
          Thank you, {order.customer.fullName}!
        </h2>

        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed mb-6">
          Your order <strong className="text-[#073faf]">{order.id}</strong> has been received and is now being prepared for dispatch from our Lahore warehouse.
        </p>

        {/* Order Details Card */}
        <div className="bg-[#f8fafc] border border-[#e7eaf0] rounded-2xl p-5 text-left space-y-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Tracking Order ID</span>
              <span className="font-extrabold text-[#101828] text-sm">{order.id}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Payment Mode</span>
              <span className="font-bold text-gray-800 uppercase">
                {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Total Amount</span>
              <span className="font-black text-[#073faf] text-base">PKR {order.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 block font-medium mb-0.5">Shipping Destination</span>
              <p className="font-semibold text-gray-800 leading-snug">
                {order.customer.address}, {order.customer.city}
              </p>
              <p className="text-gray-500 mt-1 flex items-center gap-1 font-mono">
                <Phone className="w-3 h-3 text-gray-400" /> {order.customer.phone}
              </p>
            </div>

            <div>
              <span className="text-gray-400 block font-medium mb-0.5">Estimated Dispatch</span>
              <p className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                1–2 Business Days ({order.customer.city})
              </p>
              <p className="text-gray-400 text-[11px] mt-1">
                You will receive a tracking SMS before the delivery courier arrives.
              </p>
            </div>
          </div>

          {/* Items Preview */}
          <div className="pt-3 border-t border-gray-200">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Purchased Items ({order.items.length})
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 shrink-0 text-xs"
                >
                  <img src={item.product.image} alt="" className="w-6 h-6 object-contain" />
                  <span className="font-semibold text-gray-800 max-w-[140px] truncate">{item.product.title}</span>
                  <span className="font-bold text-[#073faf]">x{item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              onClose();
              onGoToAccount();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 font-bold text-xs text-gray-700 cursor-pointer"
          >
            View in My Orders
          </button>

          <button
            onClick={() => {
              onClose();
              onGoToShop();
            }}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#073faf] hover:bg-[#082f87] font-bold text-xs text-white flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
