import { ProductImage } from './ProductImage';
import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  Check, 
  Loader2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail,
  Truck,
  ExternalLink
} from 'lucide-react';
import { Order } from '../types';
import { Logo } from './Logo';
import { generateInvoicePDF } from '../services/invoiceGenerator';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!order) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    setDownloadSuccess(false);
    try {
      await generateInvoicePDF(order);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Invoice generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const calculatedSubtotal = order.subtotal || order.items.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);
  const calculatedShipping = order.shipping || 0;
  const calculatedDiscount = order.discount || 0;
  const cleanId = order.id.replace('#', '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-gray-100 my-6 overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Actions Toolbar */}
        <div className="bg-slate-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Invoice Preview · {order.id}</h3>
              <p className="text-[11px] text-slate-400">Electronic Tax Invoice Document</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors cursor-pointer"
              title="Print Invoice"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#155dfc] hover:bg-[#1048c7] text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
              aria-label="Close invoice preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Viewport */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-white text-gray-900" id="printable-invoice">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-gray-200">
            <div className="space-y-2">
              <Logo variant="color" className="h-10 w-auto" />
              <p className="text-xs text-gray-500 max-w-xs leading-relaxed pt-1">
                Authorized Consumer Electronics & Living Goods.
                <br />
                Central Depot: House 18-B, Gulberg III, Lahore, Pakistan.
                <br />
                Helpline: 03145338340 · NTN: 7892401-4
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="inline-block text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                Official Tax Invoice
              </span>
              <h2 className="text-xl font-black text-gray-900 font-mono">INV-{cleanId}</h2>
              <p className="text-xs text-gray-500">Order ID: <b className="text-gray-900">{order.id}</b></p>
              <p className="text-xs text-gray-500">Date: {order.date}</p>
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  order.status === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : order.status === 'Cancelled'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-900'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  <span>{order.status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Billing & Shipment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block mb-1">
                Billed & Shipped To:
              </span>
              <p className="font-extrabold text-sm text-gray-900">{order.customer.fullName}</p>
              <p className="text-gray-600 mt-0.5">{order.customer.address}</p>
              <p className="text-gray-600">{order.customer.city}, Pakistan</p>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block mb-1">
                Recipient Contact:
              </span>
              <p className="text-gray-800 font-medium">{order.customer.phone}</p>
              <p className="text-gray-600 truncate">{order.customer.email}</p>
              <p className="text-gray-500 mt-1 flex items-center gap-1">
                <Truck className="w-3 h-3 text-blue-600" /> Insured Overnight Express
              </p>
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block mb-1">
                Payment Info:
              </span>
              <p className="text-gray-800 font-bold uppercase">
                {order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod}
              </p>
              <p className="text-gray-600">Currency: PKR (Pakistani Rupee)</p>
              <p className="text-emerald-700 font-bold mt-1">Verified Transaction</p>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#073faf] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold">#</th>
                  <th className="py-3 px-4 font-bold">Product Description</th>
                  <th className="py-3 px-4 font-bold text-center">Qty</th>
                  <th className="py-3 px-4 font-bold text-right">Unit Price</th>
                  <th className="py-3 px-4 font-bold text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="py-3 px-4 text-gray-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <ProductImage
                          src={item.product.image} 
                          alt="" 
                          className="w-9 h-9 object-contain bg-white rounded-lg border border-gray-200 p-1 shrink-0" 
                        />
                        <div>
                          <p className="font-bold text-gray-900">{item.product.title}</p>
                          <span className="text-[11px] text-gray-400">Category: {item.product.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-gray-800">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-600 font-mono">
                      PKR {item.product.price.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-gray-900 font-mono">
                      PKR {(item.product.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Notes Row */}
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-2">
            <div className="space-y-3 sm:max-w-sm">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
                <div className="font-black flex items-center gap-1.5 text-blue-800">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Authorized Check Warranty Included</span>
                </div>
                <p className="text-[11px] text-blue-700/90 leading-relaxed">
                  All hardware electronics carry 7-day checking replacement warranty. Please retain this invoice for courier claims or repairs.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Subtotal:</span>
                <span className="font-bold text-gray-900 font-mono">PKR {calculatedSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Courier Delivery:</span>
                <span className="font-bold text-emerald-700">
                  {calculatedShipping === 0 ? 'FREE' : `PKR ${calculatedShipping.toLocaleString()}`}
                </span>
              </div>
              {calculatedDiscount > 0 && (
                <div className="flex justify-between py-1 border-b border-gray-100 text-red-600">
                  <span>Discount Applied:</span>
                  <span className="font-bold font-mono">- PKR {calculatedDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-2.5 px-3 rounded-xl bg-slate-900 text-white font-black text-sm">
                <span>Grand Total:</span>
                <span className="text-[#00d7ef] font-mono">PKR {order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2">
            <span>Insight Store Pakistan · Official Customer Receipt</span>
            <span>Electronic generated invoice. No physical seal required.</span>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-500 flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Clicking "Download PDF" saves a formatted .pdf file to your device.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black transition-all shadow-sm cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#073faf] hover:bg-[#06328c] text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Invoice Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Invoice</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
