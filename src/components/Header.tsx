import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  PhoneCall, 
  Menu, 
  X, 
  ChevronDown, 
  Heart, 
  ArrowLeftRight, 
  ShoppingBag, 
  User,
  Sparkles,
  CookingPot,
  Shirt,
  Gamepad2,
  Tv,
  Headphones,
  Gem,
  Wind,
  Layers
} from 'lucide-react';
import { PageRoute, Product, Department } from '../types';
import { departmentsData } from '../data/storeData';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onSelectCategory: (cat: string) => void;
  onSelectProduct: (product: Product) => void;
  allProducts: Product[];
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  compareCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  onSelectCategory,
  onSelectProduct,
  allProducts,
  cartCount,
  cartTotal,
  wishlistCount,
  compareCount
}) => {
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search suggestions
  const suggestions = searchQuery.trim().length > 1
    ? allProducts.filter((p) => {
        const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = searchCategory === 'all' || p.category.toLowerCase() === searchCategory.toLowerCase();
        return matchesQuery && matchesCat;
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      onNavigate('shop');
    }
  };

  const getDepartmentIcon = (id: string) => {
    switch (id) {
      case 'kitchen-accessories': return <CookingPot className="w-4 h-4 text-[#073faf]" />;
      case 'clothes': return <Shirt className="w-4 h-4 text-[#073faf]" />;
      case 'toys': return <Gamepad2 className="w-4 h-4 text-[#073faf]" />;
      case 'electronics': return <Tv className="w-4 h-4 text-[#073faf]" />;
      case 'gadgets': return <Headphones className="w-4 h-4 text-[#073faf]" />;
      case 'home-decor': return <Sparkles className="w-4 h-4 text-[#073faf]" />;
      case 'jewellery': return <Gem className="w-4 h-4 text-[#073faf]" />;
      case 'home-appliances': return <Wind className="w-4 h-4 text-[#073faf]" />;
      default: return <Layers className="w-4 h-4 text-[#073faf]" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top Banner & Search Bar */}
      <div className="topbar">
        <div className="wrap">
          <div className="header-main flex items-center justify-between gap-4 h-[86px]">
            {/* Logo */}
            <button 
              onClick={() => onNavigate('home')}
              className="logo-btn flex items-center text-left focus:outline-none cursor-pointer"
              aria-label="Insight Store Home"
            >
              <img
                src="https://insightstore.designerinsight.online/insight-store-logo.webp"
                alt="Insight Store"
                className="h-11 w-auto object-contain brightness-0 invert"
                onError={(e) => {
                  // Fallback if asset is blocked
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.parentElement?.querySelector('.logo-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }}
              />
              <div className="logo-fallback hidden items-center gap-2 text-white">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00d7ef] to-white flex items-center justify-center font-bold text-[#083498] text-xl">
                  IS
                </div>
                <div>
                  <span className="font-bold text-xl tracking-tight text-white block leading-none">Insight</span>
                  <span className="text-xs text-[#00d7ef] tracking-wider uppercase font-semibold">Store</span>
                </div>
              </div>
            </button>

            {/* Live Search Form */}
            <div ref={searchRef} className="search-wrap hidden md:flex items-center flex-1 max-w-[690px] h-[46px] bg-white rounded-full relative px-1 shadow-md">
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="bg-transparent border-0 border-r border-gray-200 text-xs font-semibold text-gray-700 px-4 h-full outline-none cursor-pointer"
              >
                <option value="all">All Departments</option>
                {departmentsData.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))}
              </select>

              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center h-full">
                <input
                  type="text"
                  placeholder="Search products, brands and tech..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full h-full px-4 text-sm text-gray-800 outline-none border-0 bg-transparent placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="w-[42px] h-[38px] rounded-full bg-gradient-to-r from-[#00d7ef] to-[#073faf] text-white flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Autocomplete Suggestions Box */}
              {isSearchFocused && suggestions.length > 0 && (
                <div className="suggestions absolute top-[52px] left-0 right-0 bg-white border border-[#e7eaf0] rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="p-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium px-3">
                    <span>Products matching "{searchQuery}"</span>
                    <span>{suggestions.length} items found</span>
                  </div>
                  {suggestions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onSelectProduct(item);
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left p-2.5 px-3 flex items-center gap-3 hover:bg-[#f4f8ff] transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 object-contain rounded bg-white p-0.5 border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-gray-500 font-medium truncate">{item.category}</div>
                        <div className="text-sm font-semibold text-gray-900 truncate">{item.title}</div>
                      </div>
                      <div className="text-sm font-bold text-[#073faf] shrink-0">
                        PKR {item.price.toLocaleString()}
                      </div>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchFocused(false);
                      onNavigate('shop');
                    }}
                    className="w-full text-center py-2 text-xs font-semibold text-[#073faf] bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    View all results in Shop →
                  </button>
                </div>
              )}
            </div>

            {/* Hotline & Mobile Controls */}
            <div className="flex items-center gap-4">
              <a 
                href="tel:03145338340" 
                className="hotline hidden lg:flex items-center gap-3 text-white no-underline hover:opacity-95"
              >
                <span className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#00d7ef]">
                  <PhoneCall className="w-5 h-5" />
                </span>
                <div>
                  <b className="text-sm font-bold block text-white leading-tight">03145338340</b>
                  <small className="text-[11px] text-blue-100 block">Expert help, 24/7</small>
                </div>
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 rounded-lg hover:bg-white/10"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Row */}
      <div className="navrow bg-white border-b border-[#e7eaf0] relative">
        <div className="wrap">
          <div className="nav-inner flex items-center justify-between h-16">
            {/* All Categories Dropdown Button */}
            <div ref={categoryMenuRef} className="all-cats relative h-full">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className="h-full px-5 flex items-center gap-3 font-bold text-sm text-[#101828] border-x border-[#e7eaf0] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Menu className="w-4 h-4 text-[#073faf]" />
                <span>All Categories</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isCategoryMenuOpen && (
                <div className="absolute top-16 left-0 w-72 bg-white border border-[#e7eaf0] rounded-b-xl shadow-2xl py-2 z-50">
                  {departmentsData.map((dept) => (
                    <button
                      key={dept.id}
                      onClick={() => {
                        onSelectCategory(dept.name);
                        setIsCategoryMenuOpen(false);
                        onNavigate('shop');
                      }}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-[#f4f8ff] text-sm text-gray-800 transition-colors border-b border-gray-50 last:border-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        {getDepartmentIcon(dept.id)}
                        <span className="font-medium text-xs text-gray-800">{dept.name}</span>
                      </div>
                      <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {dept.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 mx-auto">
              <button
                onClick={() => onNavigate('home')}
                className={`font-semibold text-sm transition-colors cursor-pointer py-1 ${
                  currentRoute === 'home' ? 'text-[#073faf] border-b-2 border-[#073faf]' : 'text-gray-700 hover:text-[#073faf]'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className={`font-semibold text-sm transition-colors cursor-pointer py-1 ${
                  currentRoute === 'shop' ? 'text-[#073faf] border-b-2 border-[#073faf]' : 'text-gray-700 hover:text-[#073faf]'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => onNavigate('about')}
                className={`font-semibold text-sm transition-colors cursor-pointer py-1 ${
                  currentRoute === 'about' ? 'text-[#073faf] border-b-2 border-[#073faf]' : 'text-gray-700 hover:text-[#073faf]'
                }`}
              >
                About
              </button>
              <button
                onClick={() => onNavigate('blog')}
                className={`font-semibold text-sm transition-colors cursor-pointer py-1 ${
                  currentRoute === 'blog' ? 'text-[#073faf] border-b-2 border-[#073faf]' : 'text-gray-700 hover:text-[#073faf]'
                }`}
              >
                Blog
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className={`font-semibold text-sm transition-colors cursor-pointer py-1 ${
                  currentRoute === 'contact' ? 'text-[#073faf] border-b-2 border-[#073faf]' : 'text-gray-700 hover:text-[#073faf]'
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Quick Action Badges */}
            <div className="nav-actions flex items-center gap-4">
              {/* Compare */}
              <button
                onClick={() => onNavigate('compare')}
                className="relative p-2 text-gray-700 hover:text-[#073faf] transition-colors cursor-pointer"
                title="Compare Products"
                aria-label="Compare Products"
              >
                <ArrowLeftRight className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#073faf] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {compareCount}
                  </span>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => onNavigate('wishlist')}
                className="relative p-2 text-gray-700 hover:text-[#073faf] transition-colors cursor-pointer"
                title="Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#ef4444] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => onNavigate('cart')}
                className="relative flex items-center gap-2 p-2 px-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 text-gray-800 transition-colors cursor-pointer"
                title="Shopping Cart"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-[#073faf]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#ffae00] text-gray-900 font-extrabold text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden xl:block text-left">
                  <div className="text-[10px] uppercase font-bold text-gray-400 leading-none">Cart</div>
                  <div className="text-xs font-bold text-gray-900 leading-tight">
                    PKR {cartTotal.toLocaleString()}
                  </div>
                </div>
              </button>

              {/* Account */}
              <button
                onClick={() => onNavigate('account')}
                className="p-2 text-gray-700 hover:text-[#073faf] transition-colors cursor-pointer"
                title="My Account"
                aria-label="My Account"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
            {/* Mobile Search Input */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 mb-3">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none"
              />
              <button
                type="submit"
                className="bg-[#073faf] text-white px-3 py-2 rounded-lg text-sm font-semibold"
              >
                Search
              </button>
            </form>

            <div className="flex flex-col space-y-1">
              <button
                onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 font-semibold text-gray-800 hover:text-[#073faf]"
              >
                Home
              </button>
              <button
                onClick={() => { onNavigate('shop'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 font-semibold text-gray-800 hover:text-[#073faf]"
              >
                Shop Catalog
              </button>
              <button
                onClick={() => { onNavigate('about'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 font-semibold text-gray-800 hover:text-[#073faf]"
              >
                About Us
              </button>
              <button
                onClick={() => { onNavigate('blog'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 font-semibold text-gray-800 hover:text-[#073faf]"
              >
                Blog & Guides
              </button>
              <button
                onClick={() => { onNavigate('contact'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 font-semibold text-gray-800 hover:text-[#073faf]"
              >
                Contact Us
              </button>
              <button
                onClick={() => { onNavigate('account'); setIsMobileMenuOpen(false); }}
                className="text-left py-2 font-semibold text-gray-800 hover:text-[#073faf]"
              >
                My Account
              </button>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Departments</div>
              <div className="grid grid-cols-2 gap-2">
                {departmentsData.map((dept) => (
                  <button
                    key={dept.id}
                    onClick={() => {
                      onSelectCategory(dept.name);
                      setIsMobileMenuOpen(false);
                      onNavigate('shop');
                    }}
                    className="text-left text-xs text-gray-700 py-1 hover:text-[#073faf] truncate"
                  >
                    {dept.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
