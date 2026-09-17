import React from 'react';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';

interface WishlistScreenProps {
  wishlistProducts: Product[];
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: number) => void;
  onClearWishlist: () => void;
  onQuickView: (product: Product) => void;
  onExploreShop: () => void;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  wishlistProducts,
  onAddToCart,
  onRemoveFromWishlist,
  onClearWishlist,
  onQuickView,
  onExploreShop
}) => {
  if (wishlistProducts.length === 0) {
    return (
      <div className="wrap page py-16 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-200 p-10 space-y-5 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-[#101828]">Your wishlist is empty</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Save tech gear, kitchen essentials, and style favorites by clicking the heart icon on any product.
          </p>
          <button
            onClick={onExploreShop}
            className="w-full py-3.5 px-6 rounded-xl bg-[#073faf] hover:bg-[#082f87] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
          >
            Explore products
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
        <span className="text-gray-700 font-semibold">Wishlist</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title text-2xl sm:text-3xl font-black text-[#101828]">
            My Wishlist ({wishlistProducts.length})
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Products you have saved for later. Prices and stock are kept updated in real-time.
          </p>
        </div>

        <button
          onClick={onClearWishlist}
          className="text-xs font-bold text-red-600 hover:text-red-700 self-start sm:self-auto cursor-pointer"
        >
          Clear all items
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-[#e7eaf0] rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all"
          >
            <div>
              {/* Product Thumbnail */}
              <div
                onClick={() => onQuickView(product)}
                className="aspect-square bg-gray-50 rounded-xl p-4 flex items-center justify-center relative cursor-pointer group mb-3"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white text-gray-400 hover:text-red-500 shadow-sm flex items-center justify-center cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Information */}
              <span className="text-[11px] font-semibold text-gray-400 uppercase block">
                {product.category}
              </span>
              <h3
                onClick={() => onQuickView(product)}
                className="font-bold text-sm text-[#101828] hover:text-[#073faf] cursor-pointer line-clamp-2 mt-1 mb-2"
              >
                {product.title}
              </h3>
              <div className="text-base font-extrabold text-[#073faf] mb-4">
                PKR {product.price.toLocaleString()}
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-[#073faf] text-[#073faf] hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
