import React, { useState, useMemo, useEffect } from 'react';
import { 
  Filter, 
  X, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Grid3X3, 
  LayoutGrid, 
  List, 
  Sparkles,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ShopScreenProps {
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onToggleCompare: (product: Product) => void;
  wishlistIds: number[];
  compareIds: number[];
  onNavigateHome: () => void;
}

// Categories exactly matching the uploaded screenshot list
const SHOP_CATEGORIES = [
  'All',
  'Digital Products',
  'Bedsheets',
  'Ladies & Gents Clothes',
  'Bags & Accessories',
  'Kitchen',
  'Toys',
  'Personal Care',
  'Gadgets',
  'Mobile',
  'Computers',
  'Audio',
  'Wearables',
  'Television',
  'Gaming',
  'Camera',
  'Networking',
  'Home Appliances',
  'Kitchen Accessories',
  'Electronics',
  'Home Decor',
  'Jewellery'
];

export const ShopScreen: React.FC<ShopScreenProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  onAddToCart,
  onQuickView,
  onToggleWishlist,
  onToggleCompare,
  wishlistIds,
  compareIds,
  onNavigateHome
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(250000);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popular' | 'low' | 'high' | 'rated' | 'newest'>('popular');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'4col' | '3col' | 'list'>('4col');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  // Exactly 15 items per page matching the screenshot: "Showing 1–15 of 204 products"
  const itemsPerPage = 15;

  // Extract all unique brands dynamically
  const availableBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return ['All', ...Array.from(brandsSet).sort()];
  }, [products]);

  // Category matcher helper
  const isCategoryMatch = (productCat: string, targetCat: string) => {
    if (!targetCat || targetCat === 'All' || targetCat.toLowerCase() === 'all') return true;
    const p = productCat.toLowerCase();
    const t = targetCat.toLowerCase();
    if (p === t) return true;
    if (t === 'digital products' && p.includes('digital')) return true;
    if (t === 'bedsheets' && (p.includes('bed') || p.includes('sheet'))) return true;
    if (t.includes('cloth') && p.includes('cloth')) return true;
    if (t.includes('kitchen') && p.includes('kitchen')) return true;
    if (t === 'gadgets' && p.includes('gadget')) return true;
    if (t === 'mobile' && (p.includes('mobile') || p.includes('phone'))) return true;
    if (t === 'audio' && (p.includes('audio') || p.includes('headphone') || p.includes('sound'))) return true;
    if (t === 'computers' && (p.includes('computer') || p.includes('laptop'))) return true;
    if (t === 'home appliances' && p.includes('appliance')) return true;
    if (t === 'home decor' && p.includes('decor')) return true;
    if (t === 'jewellery' && p.includes('jewel')) return true;
    return p.includes(t) || t.includes(p);
  };

  // Filtered & Sorted list
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'All') {
        if (!isCategoryMatch(p.category, selectedCategory)) {
          return false;
        }
      }

      // Search keyword
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matches = 
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Max price filter
      if (p.price > maxPrice) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'All') {
        if (p.brand.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
      }

      // In-stock filter
      if (inStockOnly && !p.stock) {
        return false;
      }

      // On-sale filter
      if (onSaleOnly && (!p.oldPrice || p.oldPrice <= p.price)) {
        return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'low') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'high') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rated') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => b.id - a.id);
    }

    return result;
  }, [products, selectedCategory, searchFilter, maxPrice, selectedBrand, inStockOnly, onSaleOnly, sortBy]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchFilter, maxPrice, selectedBrand, inStockOnly, onSaleOnly, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleResetFilters = () => {
    onSelectCategory('All');
    setSearchFilter('');
    setMaxPrice(250000);
    setSelectedBrand('All');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('popular');
    setCurrentPage(1);
  };

  const hasActiveFilters = 
    (selectedCategory !== 'all' && selectedCategory !== 'All') ||
    searchFilter.trim() !== '' ||
    maxPrice < 250000 ||
    selectedBrand !== 'All' ||
    inStockOnly ||
    onSaleOnly;

  // Calculate start and end count for display
  const startItemNumber = filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItemNumber = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 pb-20">
      {/* Top Banner / Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200/80 sticky top-[72px] z-20 backdrop-blur-md bg-white/95">
        <div className="wrap py-3.5 flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button 
              onClick={onNavigateHome} 
              className="hover:text-[#073faf] transition-colors cursor-pointer"
            >
              Home
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-bold">Shop</span>
            {selectedCategory && selectedCategory !== 'all' && selectedCategory !== 'All' && (
              <>
                <span className="text-slate-300">/</span>
                <span className="text-[#073faf] font-bold">{selectedCategory}</span>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              title={showSidebar ? 'Hide filter sidebar' : 'Show filter sidebar'}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#073faf]" />
              <span>{showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="wrap py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================================================
              LEFT SIDEBAR (Matches User's Screenshot Exactly)
          ========================================================================= */}
          {showSidebar && (
            <motion.aside 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="hidden lg:block lg:col-span-3 bg-white border border-slate-200/90 rounded-2xl p-5 space-y-6 shadow-xs sticky top-36"
            >
              {/* Header: Filter products */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Filter products
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-[#073faf] hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* 1. Search products Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-3.5 pr-8 py-2 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#073faf] focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                />
                {searchFilter ? (
                  <button 
                    onClick={() => setSearchFilter('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>

              {/* 2. Price Section */}
              <div className="space-y-2.5">
                <span className="text-xs text-slate-500 font-medium block">
                  Price up to
                </span>
                <div className="text-sm font-extrabold text-slate-900 tracking-tight">
                  PKR {maxPrice.toLocaleString()}
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="250"
                    max="250000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#073faf]"
                  />
                  <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-1.5">
                    <span>PKR 250</span>
                    <span>PKR 250,000</span>
                  </div>
                </div>
              </div>

              {/* 3. Categories Radio List */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-3">
                  Categories
                </h4>
                <div className="space-y-1 max-h-80 overflow-y-auto pr-1 no-scrollbar">
                  {SHOP_CATEGORIES.map((cat) => {
                    const isSelected = 
                      (cat === 'All' && (selectedCategory === 'All' || selectedCategory === 'all' || !selectedCategory)) ||
                      selectedCategory.toLowerCase() === cat.toLowerCase();

                    return (
                      <label
                        key={cat}
                        onClick={() => onSelectCategory(cat)}
                        className={`flex items-center gap-2.5 py-1 px-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors group ${
                          isSelected
                            ? 'text-[#073faf] font-bold bg-blue-50/60'
                            : 'text-slate-700 hover:text-[#073faf] hover:bg-slate-50'
                        }`}
                      >
                        {/* Custom Round Radio matching screenshot */}
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected 
                            ? 'border-[#073faf] bg-white' 
                            : 'border-slate-300 group-hover:border-slate-400 bg-white'
                        }`}>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#073faf]" />
                          )}
                        </span>
                        <span className="truncate">{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 4. Brands Dropdown */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-2">
                  Brands
                </h4>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full py-2 px-3 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#073faf] focus:ring-2 focus:ring-blue-100 cursor-pointer transition-all"
                  >
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 5. Availability Checkboxes */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-2.5">
                  Availability
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded border-slate-300 text-[#073faf] focus:ring-0 w-3.5 h-3.5 accent-[#073faf]"
                    />
                    <span>In stock</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={(e) => setOnSaleOnly(e.target.checked)}
                      className="rounded border-slate-300 text-[#073faf] focus:ring-0 w-3.5 h-3.5 accent-[#073faf]"
                    />
                    <span>On sale</span>
                  </label>
                </div>
              </div>

              {/* 6. Clear filters button matching screenshot pill */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="w-full py-2.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-2xs"
                >
                  Clear filters
                </button>
              </div>
            </motion.aside>
          )}

          {/* =========================================================================
              MAIN PRODUCTS AREA
          ========================================================================= */}
          <main className={`${showSidebar ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-5`}>
            {/* Top Toolbar matching screenshot */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              {/* Left: Showing 1–15 of 204 products + Filter trigger */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-xs sm:text-[13px] font-medium text-slate-700">
                  Showing <strong className="font-extrabold text-slate-900">{startItemNumber}–{endItemNumber}</strong> of <strong className="font-extrabold text-slate-900">{filteredProducts.length}</strong> products
                </span>

                {/* Mobile Filter Trigger Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#073faf]" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Right: Layout Switcher & Sort Selector */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                {/* SaaS Layout Toggle (4-grid / 3-grid / list) */}
                <div className="hidden sm:flex items-center p-1 bg-slate-100 rounded-xl gap-0.5">
                  <button
                    onClick={() => setViewMode('4col')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === '4col' ? 'bg-white text-[#073faf] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="4 Column Grid"
                  >
                    <Grid3X3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('3col')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === '3col' ? 'bg-white text-[#073faf] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="3 Column Grid"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                      viewMode === 'list' ? 'bg-white text-[#073faf] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="List View"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Sort Dropdown matching screenshot */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="appearance-none pl-3 pr-8 py-2 text-xs font-bold text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl outline-none focus:border-[#073faf] cursor-pointer transition-all"
                  >
                    <option value="popular">Most popular</option>
                    <option value="low">Price: Low to High</option>
                    <option value="high">Price: High to Low</option>
                    <option value="rated">Customer Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filter Chips / SaaS Tags Bar */}
            {hasActiveFilters && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 flex-wrap text-xs pt-1"
              >
                <span className="text-slate-400 font-medium">Applied filters:</span>

                {selectedCategory !== 'All' && selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#073faf] font-bold">
                    Category: {selectedCategory}
                    <button onClick={() => onSelectCategory('All')} className="hover:text-blue-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {searchFilter && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-medium">
                    Search: "{searchFilter}"
                    <button onClick={() => setSearchFilter('')} className="hover:text-black cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {maxPrice < 250000 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-medium">
                    Max: PKR {maxPrice.toLocaleString()}
                    <button onClick={() => setMaxPrice(250000)} className="hover:text-black cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {selectedBrand !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 font-medium">
                    Brand: {selectedBrand}
                    <button onClick={() => setSelectedBrand('All')} className="hover:text-black cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                    In Stock Only
                    <button onClick={() => setInStockOnly(false)} className="hover:text-emerald-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {onSaleOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 font-medium">
                    On Sale
                    <button onClick={() => setOnSaleOnly(false)} className="hover:text-red-900 cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-[#073faf] hover:underline cursor-pointer ml-1"
                >
                  Clear all
                </button>
              </motion.div>
            )}

            {/* Products Grid / List View */}
            {paginatedProducts.length > 0 ? (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentPage}-${selectedCategory}-${sortBy}-${viewMode}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={
                    viewMode === 'list'
                      ? 'space-y-4'
                      : viewMode === '3col'
                      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                      : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                  }
                >
                  {paginatedProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={onAddToCart}
                      onQuickView={onQuickView}
                      onToggleWishlist={onToggleWishlist}
                      onToggleCompare={onToggleCompare}
                      isWishlisted={wishlistIds.includes(prod.id)}
                      isCompared={compareIds.includes(prod.id)}
                      layout={viewMode === 'list' ? 'list' : 'grid'}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#073faf] flex items-center justify-center mx-auto text-2xl font-bold">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-900">No products match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your price range, searching for another keyword, or resetting your filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-[#073faf] text-white font-bold text-xs hover:bg-[#063086] transition-colors cursor-pointer shadow-md shadow-blue-900/10"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}

            {/* Pagination Controls matching screenshot exactly */}
            {totalPages > 1 && (
              <div className="pagination flex items-center justify-center gap-1.5 sm:gap-2 pt-8 pb-4 flex-wrap">
                {/* Previous Button */}
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Numbered Page Buttons matching screenshot: 1, 2, 3 ... 14 */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        window.scrollTo({ top: 120, behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center ${
                        isActive
                          ? 'bg-[#073faf] text-white shadow-md shadow-blue-900/20 scale-105'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 cursor-pointer transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* =========================================================================
          MOBILE FILTERS SLIDE-OVER DRAWER
      ========================================================================= */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            {/* Slide-in Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-4/5 max-w-sm bg-white h-full p-5 overflow-y-auto space-y-5 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <b className="text-base font-bold text-slate-900">Filter products</b>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1.5 block">Search</label>
                <input
                  type="text"
                  placeholder="Search products"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-[#073faf]"
                />
              </div>

              {/* Price */}
              <div>
                <span className="text-xs text-slate-500 block mb-1">Price up to</span>
                <div className="text-sm font-bold text-slate-900 mb-2">
                  PKR {maxPrice.toLocaleString()}
                </div>
                <input
                  type="range"
                  min="250"
                  max="250000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#073faf]"
                />
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Categories</h4>
                <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
                  {SHOP_CATEGORIES.map((cat) => (
                    <label
                      key={cat}
                      onClick={() => onSelectCategory(cat)}
                      className={`flex items-center gap-2 py-1.5 px-2 rounded-lg text-xs font-medium cursor-pointer ${
                        selectedCategory.toLowerCase() === cat.toLowerCase()
                          ? 'text-[#073faf] font-bold bg-blue-50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                        selectedCategory.toLowerCase() === cat.toLowerCase() ? 'border-[#073faf]' : 'border-slate-300'
                      }`}>
                        {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#073faf]" />
                        )}
                      </span>
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1.5">Brand</h4>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-200 rounded-xl outline-none"
                >
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => {
                    handleResetFilters();
                    setIsMobileFilterOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#073faf] text-white text-xs font-bold cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
