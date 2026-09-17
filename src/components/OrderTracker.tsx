import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  Phone, 
  Copy, 
  Check, 
  RotateCw, 
  AlertCircle, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Order, TrackingDetails } from '../types';
import { fetchTrackingStatus, normalizeOrderId } from '../services/deliveryApi';

interface OrderTrackerProps {
  orders: Order[];
  initialOrderId?: string;
  onSelectOrder?: (orderId: string) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  orders,
  initialOrderId = '#IS-94021'
}) => {
  const [orderIdInput, setOrderIdInput] = useState<string>(initialOrderId);
  const [activeTracking, setActiveTracking] = useState<TrackingDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Load initial order tracking on mount
  useEffect(() => {
    if (initialOrderId) {
      handleTrack(initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrack = async (targetId: string) => {
    const clean = normalizeOrderId(targetId);
    if (!clean) {
      setErrorMessage('Please enter an Order ID to track.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await fetchTrackingStatus(clean, orders);
      setActiveTracking(result);
      setOrderIdInput(result.orderId);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to retrieve tracking details. Please verify your order ID.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleTrack(orderIdInput);
  };

  const handleCopyTrackingNumber = () => {
    if (!activeTracking?.trackingNumber) return;
    navigator.clipboard?.writeText(activeTracking.trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  // Quick suggestions based on user orders or sample courier codes
  const quickSuggestions = [
    { label: '#IS-94021 (Delivered)', id: '#IS-94021' },
    { label: '#IS-10428 (In Transit)', id: '#IS-10428' },
    { label: '#IS-10387 (Out for Delivery)', id: '#IS-10387' }
  ];

  return (
    <div className="bg-white border border-[#e7eaf0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-8" id="track-order-module">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#073faf] text-xs font-black uppercase tracking-wider mb-2">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Courier Telemetry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#101828]">
            Track Your Order
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time status integration with official courier logistics (TCS, Leopards, Trax).
          </p>
        </div>

        {activeTracking && (
          <button
            type="button"
            onClick={() => handleTrack(activeTracking.orderId)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#073faf] bg-gray-50 hover:bg-blue-50 px-3.5 py-2 rounded-xl border border-gray-200 transition-colors cursor-pointer self-start sm:self-center"
            title="Refresh current delivery status"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#073faf]' : ''}`} />
            <span>Updated {lastRefreshed}</span>
          </button>
        )}
      </div>

      {/* Input Search Form */}
      <div className="space-y-3">
        <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Enter Order ID (e.g. #IS-94021 or IS-10428)"
              className="w-full pl-11 pr-4 py-3 text-sm font-semibold rounded-2xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#073faf] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 placeholder:font-normal uppercase"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-6 sm:px-8 py-3 rounded-2xl bg-[#073faf] hover:bg-[#06328c] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer shrink-0 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Locating Package...</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                <span>Track Shipment</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Quick Examples:
          </span>
          {quickSuggestions.map((sug) => (
            <button
              key={sug.id}
              type="button"
              onClick={() => {
                setOrderIdInput(sug.id);
                handleTrack(sug.id);
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-[#073faf] transition-colors cursor-pointer"
            >
              {sug.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <div>
            <p className="font-bold">{errorMessage}</p>
            <p className="text-red-600 mt-0.5">
              Please double check the order number printed on your invoice or SMS receipt.
            </p>
          </div>
        </div>
      )}

      {/* Tracking Result View */}
      {activeTracking && !isLoading && (
        <div className="space-y-6 pt-2">
          {/* Main Status Showcase Card */}
          <div className="rounded-2xl border border-[#e7eaf0] bg-gradient-to-b from-slate-50/60 to-white p-5 sm:p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-mono font-extrabold text-gray-500">
                    ORDER ID:
                  </span>
                  <span className="text-base font-black text-[#101828]">
                    {activeTracking.orderId}
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-xs text-gray-500 font-medium">
                    Carrier: <b className="text-gray-800">{activeTracking.carrier}</b>
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span>AWB Tracking:</span>
                  <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                    {activeTracking.trackingNumber}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyTrackingNumber}
                    className="p-1 rounded text-gray-400 hover:text-gray-700 transition-colors"
                    title="Copy tracking number"
                  >
                    {copiedTracking ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Prominent Status Badge */}
              <div className="flex flex-col sm:items-end">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Current Status
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      activeTracking.statusCode === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeTracking.statusCode === 'out_for_delivery'
                        ? 'bg-amber-100 text-amber-800'
                        : activeTracking.statusCode === 'in_transit'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span 
                      className={`w-2 h-2 rounded-full ${
                        activeTracking.statusCode === 'delivered'
                          ? 'bg-emerald-600'
                          : activeTracking.statusCode === 'out_for_delivery'
                          ? 'bg-amber-600 animate-pulse'
                          : 'bg-blue-600 animate-pulse'
                      }`} 
                    />
                    {activeTracking.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium mt-1">
                  {activeTracking.estimatedDelivery}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                <span>Dispatch</span>
                <span>In Transit</span>
                <span>Out for Delivery</span>
                <span>Delivered</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-700 ease-out rounded-full ${
                    activeTracking.statusCode === 'delivered'
                      ? 'bg-emerald-500'
                      : activeTracking.statusCode === 'out_for_delivery'
                      ? 'bg-amber-500'
                      : 'bg-gradient-to-r from-[#073faf] to-[#00d7ef]'
                  }`}
                  style={{ width: `${activeTracking.progressPercent}%` }}
                />
              </div>
              <div className="text-right text-[11px] font-mono font-bold text-gray-400">
                {activeTracking.progressPercent}% Completed
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
              <div className="p-3 rounded-xl bg-white border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Origin Fulfillment
                </span>
                <span className="text-xs font-bold text-gray-800 block truncate mt-0.5">
                  Gulberg III, Lahore
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Destination City
                </span>
                <span className="text-xs font-bold text-gray-800 block truncate mt-0.5">
                  {activeTracking.recipientCity}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Payment Method
                </span>
                <span className="text-xs font-bold text-gray-800 block truncate mt-0.5">
                  {activeTracking.paymentMethod} (PKR {activeTracking.totalAmount.toLocaleString()})
                </span>
              </div>
            </div>

            {/* Courier Rider Information (if out for delivery or delivered) */}
            {activeTracking.courierRider && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#073faf] text-white flex items-center justify-center font-bold">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] uppercase font-bold block">Assigned Delivery Agent</span>
                    <span className="font-extrabold text-gray-900">{activeTracking.courierRider.name}</span>
                    <span className="text-gray-400 font-normal"> · {activeTracking.courierRider.vehicle}</span>
                  </div>
                </div>

                <a
                  href={`tel:${activeTracking.courierRider.phone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-[#073faf] font-bold hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Rider ({activeTracking.courierRider.phone})</span>
                </a>
              </div>
            )}
          </div>

          {/* Stepper Timeline & Checkpoints */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-[#101828] uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#073faf]" />
              <span>Shipment Milestones & Activity Log</span>
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:inset-y-2 before:left-[11px] sm:before:left-[15px] before:w-0.5 before:bg-gray-200">
              {activeTracking.checkpoints.map((cp, idx) => {
                const isDone = cp.completed;
                const isCurrent = cp.current;

                return (
                  <div key={cp.id} className="relative group">
                    {/* Stepper Node Indicator */}
                    <div 
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'bg-[#00d7ef] border-[#073faf] text-white ring-4 ring-cyan-100 shadow-md scale-110'
                          : isDone
                          ? 'bg-[#073faf] border-[#073faf] text-white'
                          : 'bg-white border-gray-300 text-gray-300'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[2.5]" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-gray-300" />
                      )}
                    </div>

                    {/* Step Details */}
                    <div className="bg-gray-50/70 group-hover:bg-blue-50/40 p-4 rounded-xl border border-gray-100 transition-colors">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                        <h4 className={`text-xs sm:text-sm font-extrabold ${isDone ? 'text-gray-900' : 'text-gray-400'}`}>
                          {cp.title}
                        </h4>
                        <span className="text-[11px] font-mono text-gray-400">
                          {cp.timestamp}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mb-1">
                        <MapPin className="w-3 h-3 text-[#073faf]" />
                        <span>{cp.location}</span>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed">
                        {cp.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Package Contents & Delivery Address Confirmation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block">
                Destination Recipient
              </span>
              <div className="text-xs space-y-1">
                <div className="font-bold text-gray-900">{activeTracking.recipientName}</div>
                <div className="text-gray-600">{activeTracking.recipientAddress}</div>
                <div className="text-gray-600">{activeTracking.recipientCity}, Pakistan</div>
                <div className="text-gray-400 font-mono pt-1">Contact: {activeTracking.recipientPhone}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
              <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider block">
                Official Delivery Guarantee
              </span>
              <div className="text-xs text-gray-600 leading-relaxed space-y-1.5">
                <div className="flex items-center gap-1.5 text-gray-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Inspected & Open-Box Verification Eligible</span>
                </div>
                <p>
                  You can inspect the sealed parcel and warranty credentials upon delivery. If any discrepancy occurs, our helpline is ready to assist.
                </p>
                <div className="pt-1">
                  <a href="tel:03145338340" className="text-[#073faf] font-bold hover:underline">
                    Helpdesk: 03145338340
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
