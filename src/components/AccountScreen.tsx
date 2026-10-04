import React, { useState, useRef } from 'react';
import { 
  User, 
  Package, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ChevronRight, 
  ShoppingBag,
  Truck,
  ArrowRight,
  ExternalLink,
  Phone,
  RotateCcw,
  Check,
  Download,
  FileText,
  Loader2,
  Search,
  X
} from 'lucide-react';
import { Order } from '../types';
import { OrderTracker } from './OrderTracker';
import { Logo } from './Logo';
import { InvoiceModal } from './InvoiceModal';
import { generateInvoicePDF } from '../services/invoiceGenerator';

interface AccountScreenProps {
  orders: Order[];
  onExploreShop: () => void;
  onNavigateHome: () => void;
  onReorder?: (order: Order) => void;
}

export interface StatusConfig {
  label: string;
  pillClasses: string;
  dotColor: string;
  pulseDot: boolean;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

export const getOrderStatusConfig = (status: Order['status']): StatusConfig => {
  switch (status) {
    case 'Delivered':
      return {
        label: 'Delivered',
        pillClasses: 'bg-emerald-100/90 text-emerald-900 border-emerald-300 ring-1 ring-emerald-500/20 shadow-xs',
        dotColor: 'bg-emerald-600',
        pulseDot: false,
        icon: CheckCircle2,
        description: 'Package handed over to recipient'
      };
    case 'Processing':
      return {
        label: 'Processing',
        pillClasses: 'bg-amber-100/90 text-amber-950 border-amber-300 ring-1 ring-amber-500/20 shadow-xs',
        dotColor: 'bg-amber-500',
        pulseDot: true,
        icon: Clock,
        description: 'Order confirmed & being prepared in warehouse'
      };
    case 'Cancelled':
      return {
        label: 'Cancelled',
        pillClasses: 'bg-red-100/90 text-red-900 border-red-300 ring-1 ring-red-500/20 shadow-xs',
        dotColor: 'bg-red-600',
        pulseDot: false,
        icon: XCircle,
        description: 'Order voided & payment refund processed'
      };
    case 'Shipped':
      return {
        label: 'Shipped',
        pillClasses: 'bg-blue-100/90 text-blue-900 border-blue-300 ring-1 ring-blue-500/20 shadow-xs',
        dotColor: 'bg-blue-600',
        pulseDot: true,
        icon: Truck,
        description: 'In transit with courier partner'
      };
    case 'Pending Verification':
      return {
        label: 'Pending Verification',
        pillClasses: 'bg-orange-100/90 text-orange-950 border-orange-300 ring-1 ring-orange-500/20 shadow-xs',
        dotColor: 'bg-orange-500',
        pulseDot: true,
        icon: AlertCircle,
        description: 'Awaiting phone confirmation from customer care'
      };
    default:
      return {
        label: status || 'Confirmed',
        pillClasses: 'bg-slate-100 text-slate-800 border-slate-300 shadow-xs',
        dotColor: 'bg-slate-500',
        pulseDot: false,
        icon: Package,
        description: 'Order logged in store registry'
      };
  }
};

export const AccountScreen: React.FC<AccountScreenProps> = ({
  orders,
  onExploreShop,
  onNavigateHome,
  onReorder
}) => {
  const [activeTab, setActiveTab] = useState<'track' | 'orders' | 'addresses'>('track');
  const [orderFilter, setOrderFilter] = useState<'all' | 'Delivered' | 'Processing' | 'Cancelled' | 'Shipped'>('all');
  const [trackingTargetId, setTrackingTargetId] = useState<string>(
    orders.length > 0 ? orders[0].id : '#IS-94021'
  );

  const [generatingInvoiceId, setGeneratingInvoiceId] = useState<string | null>(null);
  const [downloadedInvoiceId, setDownloadedInvoiceId] = useState<string | null>(null);
  const [previewInvoiceOrder, setPreviewInvoiceOrder] = useState<Order | null>(null);
  const [reorderingId, setReorderingId] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  const trackerRef = useRef<HTMLDivElement | null>(null);

  const handleTrackSpecificOrder = (orderId: string) => {
    setTrackingTargetId(orderId);
    setActiveTab('track');
    setTimeout(() => {
      trackerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleReorderOrder = (order: Order) => {
    if (!onReorder) return;
    setReorderingId(order.id);
    onReorder(order);
  };

  const handleDownloadInvoice = async (order: Order) => {
    setGeneratingInvoiceId(order.id);
    try {
      await generateInvoicePDF(order);
      setDownloadedInvoiceId(order.id);
      setTimeout(() => {
        setDownloadedInvoiceId(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to generate invoice PDF:', err);
    } finally {
      setGeneratingInvoiceId(null);
    }
  };

  // Filtered orders list by status and search query (order ID or product name)
  const filteredOrders = orders.filter((o) => {
    // 1. Status Filter
    if (orderFilter !== 'all' && o.status !== orderFilter) {
      return false;
    }

    // 2. Search Query Filter (Order ID or Product Name)
    if (!orderSearchQuery.trim()) {
      return true;
    }

    const query = orderSearchQuery.toLowerCase().trim();
    const cleanQuery = query.replace(/^#/, '');

    // Match Order ID (e.g. #IS-94021 or 94021 or IS-94021)
    const orderIdLower = o.id.toLowerCase();
    const cleanOrderId = orderIdLower.replace(/^#/, '');
    const matchesOrderId = orderIdLower.includes(query) || cleanOrderId.includes(cleanQuery);
    if (matchesOrderId) return true;

    // Match Product Name or Category in items
    const matchesProduct = o.items.some((item) => {
      const title = item.product.title.toLowerCase();
      const category = item.product.category?.toLowerCase() || '';
      const brand = item.product.brand?.toLowerCase() || '';
      return title.includes(query) || category.includes(query) || brand.includes(query);
    });
    if (matchesProduct) return true;

    return false;
  });

  // Status counts for filter chips
  const deliveredCount = orders.filter((o) => o.status === 'Delivered').length;
  const processingCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Pending Verification').length;
  const cancelledCount = orders.filter((o) => o.status === 'Cancelled').length;
  const shippedCount = orders.filter((o) => o.status === 'Shipped').length;

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
          <div className="w-18 h-18 rounded-2xl bg-white border border-[#e7eaf0] p-3 flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0">
            <Logo variant="icon" className="w-full h-full object-contain" />
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
        <div className="flex items-center gap-4 sm:gap-6 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-8 text-center flex-wrap sm:flex-nowrap justify-center">
          <div className="px-2">
            <span className="text-2xl font-black text-[#073faf] block leading-none">
              {orders.length}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">Total Orders</span>
          </div>
          <div className="px-2">
            <span className="text-2xl font-black text-amber-500 block leading-none">
              {processingCount}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">Processing</span>
          </div>
          <div className="px-2">
            <span className="text-2xl font-black text-emerald-600 block leading-none">
              {deliveredCount}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">Delivered</span>
          </div>
          {cancelledCount > 0 && (
            <div className="px-2">
              <span className="text-2xl font-black text-rose-500 block leading-none">
                {cancelledCount}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">Cancelled</span>
            </div>
          )}
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
            onReorder={onReorder}
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
                  You have {orders.length} order(s) in your history. You can filter and track any of them with one click.
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-[#101828] flex items-center gap-2">
                <Package className="w-5 h-5 text-[#073faf]" />
                <span>My Orders</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Monitor status updates with dynamic color-coded tracking badges.
              </p>
            </div>

            <button
              onClick={onExploreShop}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 transition-colors cursor-pointer self-start sm:self-auto"
            >
              Shop More
            </button>
          </div>

          {/* Search Input Bar for Orders */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search by order ID (e.g. #IS-94021) or product name..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-gray-50/80 hover:bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#073faf] focus:ring-3 focus:ring-blue-500/10 text-xs text-gray-900 placeholder-gray-400 transition-all outline-hidden"
              />
              {orderSearchQuery && (
                <button
                  type="button"
                  onClick={() => setOrderSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer rounded-full hover:bg-gray-200"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Match Counter & Quick Reset */}
            {orderSearchQuery.trim() && (
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs font-bold text-[#073faf] bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl shadow-2xs">
                  {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
                </span>
                <button
                  type="button"
                  onClick={() => setOrderSearchQuery('')}
                  className="text-xs font-bold text-gray-500 hover:text-gray-800 underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0 mr-1">
              Filter by Status:
            </span>
            <button
              type="button"
              onClick={() => setOrderFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                orderFilter === 'all'
                  ? 'bg-gray-900 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({orders.length})
            </button>

            <button
              type="button"
              onClick={() => setOrderFilter('Delivered')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                orderFilter === 'Delivered'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${orderFilter === 'Delivered' ? 'bg-white' : 'bg-emerald-500'}`} />
              <span>Delivered ({deliveredCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setOrderFilter('Processing')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                orderFilter === 'Processing'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${orderFilter === 'Processing' ? 'bg-white' : 'bg-amber-500 animate-pulse'}`} />
              <span>Processing ({processingCount})</span>
            </button>

            {shippedCount > 0 && (
              <button
                type="button"
                onClick={() => setOrderFilter('Shipped')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  orderFilter === 'Shipped'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${orderFilter === 'Shipped' ? 'bg-white' : 'bg-blue-500 animate-pulse'}`} />
                <span>Shipped ({shippedCount})</span>
              </button>
            )}

            {cancelledCount > 0 && (
              <button
                type="button"
                onClick={() => setOrderFilter('Cancelled')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                  orderFilter === 'Cancelled'
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${orderFilter === 'Cancelled' ? 'bg-white' : 'bg-red-500'}`} />
                <span>Cancelled ({cancelledCount})</span>
              </button>
            )}
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
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-gray-50 rounded-2xl border border-gray-100 p-6">
              <Search className="w-9 h-9 text-gray-400 mx-auto" />
              <h3 className="text-sm font-bold text-gray-800">
                {orderSearchQuery.trim()
                  ? `No orders matching "${orderSearchQuery}"`
                  : `No orders found with status "${orderFilter}"`}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                {orderSearchQuery.trim()
                  ? 'We couldn\'t find any orders matching this order ID or product name. Try checking the spelling or resetting the search filter.'
                  : `There are currently no orders in your history tagged with status "${orderFilter}".`}
              </p>
              <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
                {orderSearchQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => setOrderSearchQuery('')}
                    className="px-4 py-2 rounded-xl bg-[#073faf] text-white text-xs font-bold hover:bg-[#06328c] cursor-pointer shadow-xs"
                  >
                    Clear Search
                  </button>
                )}
                {orderFilter !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setOrderFilter('all')}
                    className="px-4 py-2 rounded-xl bg-gray-200 text-gray-800 text-xs font-bold hover:bg-gray-300 cursor-pointer"
                  >
                    Show All Statuses
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => {
                const statusCfg = getOrderStatusConfig(ord.status);
                const StatusIcon = statusCfg.icon;

                return (
                  <div
                    key={ord.id}
                    className="border border-[#e7eaf0] rounded-2xl p-5 space-y-4 hover:border-blue-300 transition-all bg-white"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 text-xs">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-extrabold text-[#101828] text-sm">{ord.id}</span>
                        <span className="text-gray-400">· Placed on {ord.date}</span>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                        {/* Dynamic Status Pill */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${statusCfg.pillClasses}`}
                            title={statusCfg.description}
                          >
                            <span 
                              className={`w-2 h-2 rounded-full shrink-0 ${statusCfg.dotColor} ${statusCfg.pulseDot ? 'animate-pulse' : ''}`} 
                            />
                            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                            <span>{statusCfg.label}</span>
                          </span>
                        </div>

                        {/* Download Invoice Button */}
                        <button
                          type="button"
                          onClick={() => handleDownloadInvoice(ord)}
                          disabled={generatingInvoiceId === ord.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer shadow-2xs ${
                            downloadedInvoiceId === ord.id
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : generatingInvoiceId === ord.id
                              ? 'bg-blue-50 text-[#073faf] border-blue-200 cursor-wait'
                              : 'bg-white hover:bg-blue-50 text-[#073faf] hover:text-[#06328c] border-blue-200 hover:border-blue-300'
                          }`}
                          title="Generate and download official PDF tax invoice"
                        >
                          {generatingInvoiceId === ord.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#073faf]" />
                              <span>Generating PDF...</span>
                            </>
                          ) : downloadedInvoiceId === ord.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">PDF Saved!</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-3.5 h-3.5 text-[#073faf]" />
                              <span>Download Invoice</span>
                            </>
                          )}
                        </button>

                        {/* Quick Invoice Preview */}
                        <button
                          type="button"
                          onClick={() => setPreviewInvoiceOrder(ord)}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-[#073faf] border border-gray-200 hover:border-blue-200 transition-colors cursor-pointer"
                          title="Preview invoice document"
                          aria-label="Preview invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Action tracking button */}
                        <button
                          type="button"
                          onClick={() => handleTrackSpecificOrder(ord.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold shadow-xs transition-all cursor-pointer ${
                            ord.status === 'Cancelled'
                              ? 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                              : ord.status === 'Processing'
                              ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                              : ord.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                              : 'bg-[#073faf] hover:bg-[#06328c] text-white'
                          }`}
                        >
                          {ord.status === 'Cancelled' ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          ) : ord.status === 'Processing' ? (
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                          ) : ord.status === 'Delivered' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Truck className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {ord.status === 'Cancelled'
                              ? 'View Status'
                              : ord.status === 'Processing'
                              ? 'Track Progress'
                              : ord.status === 'Delivered'
                              ? 'View Delivery'
                              : 'Track Shipment'}
                          </span>
                        </button>

                        {/* Reorder Button for Completed Orders */}
                        {ord.status === 'Delivered' && (
                          <button
                            type="button"
                            onClick={() => handleReorderOrder(ord)}
                            disabled={reorderingId === ord.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold bg-[#073faf] hover:bg-[#06328c] text-white shadow-xs hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            title="Reorder all items from this order and go to cart"
                          >
                            {reorderingId === ord.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Reordering...</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reorder</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      {ord.items.map((item, idx) => {
                        const trimmedQuery = orderSearchQuery.toLowerCase().trim();
                        const isMatchedItem = trimmedQuery.length > 0 && (
                          item.product.title.toLowerCase().includes(trimmedQuery) ||
                          (item.product.category && item.product.category.toLowerCase().includes(trimmedQuery)) ||
                          (item.product.brand && item.product.brand.toLowerCase().includes(trimmedQuery))
                        );

                        return (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-3 text-xs p-1.5 rounded-xl transition-all ${
                              isMatchedItem 
                                ? 'bg-blue-50/80 border border-blue-200/90 shadow-2xs' 
                                : ''
                            }`}
                          >
                            <img
                              src={item.product.image}
                              alt=""
                              className="w-12 h-12 object-contain rounded-xl bg-gray-50 p-1.5 border border-gray-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-bold text-gray-900 truncate">{item.product.title}</h4>
                                {isMatchedItem && (
                                  <span className="text-[10px] font-black uppercase tracking-wider text-[#073faf] bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
                                    Search Match
                                  </span>
                                )}
                              </div>
                              <span className="text-gray-400">Quantity: {item.quantity}</span>
                            </div>
                            <div className="font-bold text-gray-900">
                              PKR {(item.product.price * item.quantity).toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500">
                          Payment Mode: <b className="text-gray-800 uppercase">{ord.paymentMethod}</b>
                        </span>
                        <span className="text-gray-300">·</span>
                        <span className="text-gray-500 hidden sm:inline">
                          Status note: <span className="text-gray-700 font-medium">{statusCfg.description}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-black text-[#073faf]">
                          Total: PKR {ord.total.toLocaleString()}
                        </div>

                        {ord.status === 'Delivered' && (
                          <button
                            type="button"
                            onClick={() => handleReorderOrder(ord)}
                            disabled={reorderingId === ord.id}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#073faf] to-[#155dfc] hover:from-[#06328c] hover:to-[#073faf] text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                            title="Reorder all items from this purchase and go to Cart"
                          >
                            {reorderingId === ord.id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Adding to Cart...</span>
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Reorder Items</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
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

      {/* Invoice Modal Preview */}
      <InvoiceModal 
        order={previewInvoiceOrder} 
        onClose={() => setPreviewInvoiceOrder(null)} 
      />
    </div>
  );
};
