import React from 'react';
import { ArrowLeftRight, ShoppingBag, Trash2, Star, CheckCircle, XCircle } from 'lucide-react';
import { Product } from '../types';

interface CompareScreenProps {
  compareProducts: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromCompare: (productId: number) => void;
  onClearCompare: () => void;
  onExploreShop: () => void;
}

export const CompareScreen: React.FC<CompareScreenProps> = ({
  compareProducts,
  onAddToCart,
  onRemoveFromCompare,
  onClearCompare,
  onExploreShop
}) => {
  if (compareProducts.length === 0) {
    return (
      <div className="wrap page py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-200 p-10 space-y-5 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-blue-50 text-[#073faf] flex items-center justify-center mx-auto">
            <ArrowLeftRight className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-[#101828]">No items to compare</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Select the compare icon on multiple products to see side-by-side price, specifications, and performance differences.
          </p>
          <button
            onClick={onExploreShop}
            className="w-full py-3.5 px-6 rounded-xl bg-[#073faf] hover:bg-[#082f87] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            Explore products to compare
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap page py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="breadcrumb text-xs text-gray-400 font-medium mb-4 flex items-center gap-2">
        <button onClick={onExploreShop} className="hover:text-[#073faf] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Compare Products</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title text-2xl sm:text-3xl font-black text-[#101828]">
            Product Comparison ({compareProducts.length})
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Compare features, pricing, and hardware specs to make an informed decision.
          </p>
        </div>

        <button
          onClick={onClearCompare}
          className="text-xs font-bold text-red-600 hover:text-red-700 self-start sm:self-auto cursor-pointer"
        >
          Clear comparison
        </button>
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-[#e7eaf0] rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <tbody>
            {/* Row 1: Product Overview */}
            <tr className="border-b border-gray-200">
              <td className="p-4 bg-gray-50/70 font-bold text-xs text-gray-500 w-48">Product</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="p-4 align-top w-64">
                  <div className="relative mb-3">
                    <button
                      onClick={() => onRemoveFromCompare(p.id)}
                      className="absolute top-0 right-0 text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-24 h-24 bg-gray-50 rounded-xl p-2 mx-auto flex items-center justify-center">
                      <img src={p.image} alt={p.title} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                  </div>
                  <h4 className="font-bold text-sm text-[#101828] mb-1 line-clamp-2 text-center">{p.title}</h4>
                  <div className="text-center text-base font-black text-[#073faf] mb-3">
                    PKR {p.price.toLocaleString()}
                  </div>
                  <button
                    onClick={() => onAddToCart(p)}
                    className="w-full py-2 px-3 bg-[#073faf] hover:bg-[#082f87] text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </td>
              ))}
            </tr>

            {/* Row 2: Brand & Category */}
            <tr className="border-b border-gray-100">
              <td className="p-4 bg-gray-50/70 font-bold text-xs text-gray-500">Brand & Category</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="p-4 text-xs font-semibold text-gray-800">
                  <div>Brand: <b>{p.brand}</b></div>
                  <div className="text-gray-500 text-[11px] mt-0.5">{p.category}</div>
                </td>
              ))}
            </tr>

            {/* Row 3: Rating */}
            <tr className="border-b border-gray-100">
              <td className="p-4 bg-gray-50/70 font-bold text-xs text-gray-500">Rating</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="p-4 text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-gray-900">{p.rating.toFixed(1)} / 5.0</span>
                  </div>
                </td>
              ))}
            </tr>

            {/* Row 4: Stock */}
            <tr className="border-b border-gray-100">
              <td className="p-4 bg-gray-50/70 font-bold text-xs text-gray-500">Availability</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="p-4 text-xs font-semibold">
                  {p.stock ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="w-3.5 h-3.5" /> In Stock (Same Day Dispatch)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-red-500">
                      <XCircle className="w-3.5 h-3.5" /> Out of stock
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Row 5: SKU Code */}
            <tr className="border-b border-gray-100">
              <td className="p-4 bg-gray-50/70 font-bold text-xs text-gray-500">Item SKU</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="p-4 text-xs font-mono font-bold text-gray-700">
                  {p.sku}
                </td>
              ))}
            </tr>

            {/* Row 6: Description */}
            <tr>
              <td className="p-4 bg-gray-50/70 font-bold text-xs text-gray-500">Description</td>
              {compareProducts.map((p) => (
                <td key={p.id} className="p-4 text-xs text-gray-600 leading-relaxed">
                  {p.description}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
