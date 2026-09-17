import React, { useState, useEffect } from 'react';
import { productsData } from './data/products';
import { blogPostsData, testimonialsData } from './data/storeData';
import { Product, PageRoute, CartItem, Order } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { BenefitsRow } from './components/BenefitsRow';
import { DepartmentGrid } from './components/DepartmentGrid';
import { PromoBanners } from './components/PromoBanners';
import { ExperienceBanner } from './components/ExperienceBanner';
import { ProductCard } from './components/ProductCard';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { ShopScreen } from './components/ShopScreen';
import { CartScreen } from './components/CartScreen';
import { CheckoutScreen } from './components/CheckoutScreen';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { WishlistScreen } from './components/WishlistScreen';
import { CompareScreen } from './components/CompareScreen';
import { AboutScreen } from './components/AboutScreen';
import { BlogScreen } from './components/BlogScreen';
import { ContactScreen } from './components/ContactScreen';
import { AccountScreen } from './components/AccountScreen';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { ArrowRight, Star } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<PageRoute>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Initial demo cart items so user experiences immediate functionality
    const p1 = productsData.find((p) => p.id === 1) || productsData[0];
    const p2 = productsData.find((p) => p.id === 4) || productsData[1];
    return [
      { product: p1, quantity: 1 },
      { product: p2, quantity: 2 }
    ];
  });
  const [wishlist, setWishlist] = useState<number[]>([2, 5, 8]);
  const [compare, setCompare] = useState<number[]>([1, 4]);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [homeFeaturedTab, setHomeFeaturedTab] = useState<string>('All');

  // Sample order history
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#IS-94021',
      date: 'Aug 12, 2026',
      status: 'Delivered',
      items: [
        { product: productsData[0], quantity: 1 },
        { product: productsData[6], quantity: 1 }
      ],
      total: 98999,
      subtotal: 98999,
      shipping: 0,
      discount: 0,
      customer: {
        fullName: 'Muhammad Hamza',
        phone: '03145338340',
        email: 'hamza@insightstore.pk',
        address: 'House 18-B, Block C-2, Gulberg III',
        city: 'Lahore'
      },
      paymentMethod: 'cod'
    }
  ]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.title}" to cart!`);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setQuickViewProduct(null);
    setCurrentRoute('checkout');
  };

  const handleUpdateCartQuantity = (productId: number, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const handleApplyCoupon = (code: string) => {
    if (code.toUpperCase() === 'INSIGHT10') {
      setDiscountRate(0.1);
      showToast('Coupon applied: 10% discount added!', 'success');
      return true;
    }
    showToast('Invalid coupon code', 'error');
    return false;
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed "${product.title}" from wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      }
      showToast(`Saved "${product.title}" to wishlist!`, 'success');
      return [...prev, product.id];
    });
  };

  // Compare operations
  const handleToggleCompare = (product: Product) => {
    setCompare((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed from comparison`, 'info');
        return prev.filter((id) => id !== product.id);
      }
      if (prev.length >= 4) {
        showToast('You can compare up to 4 products at a time', 'info');
        return prev;
      }
      showToast(`Added "${product.title}" to compare table`, 'success');
      return [...prev, product.id];
    });
  };

  // Checkout and Order placement
  const handlePlaceOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setDiscountRate(0);
    setConfirmedOrder(newOrder);
    showToast('Order successfully placed!', 'success');
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const wishlistProducts = productsData.filter((p) => wishlist.includes(p.id));
  const compareProducts = productsData.filter((p) => compare.includes(p.id));

  // Home page featured filter
  const featuredTabs = ['All', 'Bedsheets', 'Electronics', 'Kitchen Accessories', 'Gadgets', 'Clothes', 'Toys'];
  const featuredProducts = homeFeaturedTab === 'All'
    ? productsData.slice(0, 10)
    : productsData.filter((p) => {
        const cat = p.category.toLowerCase();
        const tab = homeFeaturedTab.toLowerCase();
        return cat.includes(tab) || tab.includes(cat);
      }).slice(0, 10);

  const bestSellers = productsData.filter((p) => p.badge === 'HOT' || p.badge === 'BESTSELLER' || p.badge === 'PURE COTTON' || p.rating >= 4.8).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#101828]">
      {/* Global Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentRoute('shop');
        }}
        onSelectProduct={(p) => {
          setQuickViewProduct(p);
        }}
        allProducts={productsData}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        compareCount={compare.length}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <div className="home-view">
            {/* 1. Hero Carousel */}
            <Hero
              onShopCategory={(cat) => {
                setSelectedCategory(cat);
                setCurrentRoute('shop');
              }}
              onExploreStory={() => setCurrentRoute('about')}
            />

            {/* 2. Benefits Row */}
            <BenefitsRow />

            {/* 3. Shop by Department Grid */}
            <DepartmentGrid
              onSelectDepartment={(deptName) => {
                setSelectedCategory(deptName);
                setCurrentRoute('shop');
              }}
              onViewAll={() => {
                setSelectedCategory('all');
                setCurrentRoute('shop');
              }}
            />

            {/* 4. Trending & Featured Products Section */}
            <section className="section py-14 md:py-20 bg-white">
              <div className="wrap">
                <div className="section-head flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#073faf] text-xs font-bold uppercase tracking-wider mb-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#073faf]"></span>
                      HAND-PICKED FAVORITES
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Trending products this week
                    </h2>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {featuredTabs.map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setHomeFeaturedTab(tab)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          homeFeaturedTab === tab
                            ? 'bg-[#073faf] text-white shadow-md shadow-blue-900/20'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Grid - 5 columns on desktop matching attached screenshot */}
                <div className="product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
                  {featuredProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      onQuickView={setQuickViewProduct}
                      onToggleWishlist={handleToggleWishlist}
                      onToggleCompare={handleToggleCompare}
                      isWishlisted={wishlist.includes(prod.id)}
                      isCompared={compare.includes(prod.id)}
                    />
                  ))}
                </div>

                <div className="text-center pt-10">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentRoute('shop');
                    }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#073faf] hover:bg-[#082f87] text-white font-bold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                  >
                    <span>View all {productsData.length} products</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* 5. Themed Promo Banners (Mint, Blue, Peach) */}
            <PromoBanners
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setCurrentRoute('shop');
              }}
            />

            {/* 6. Step into the Experience Immersive Banner */}
            <ExperienceBanner
              onShopNow={() => {
                setSelectedCategory('Electronics');
                setCurrentRoute('shop');
              }}
            />

            {/* 7. Best Sellers & Verified Picks */}
            <section className="py-14 md:py-20 bg-[#f8fafc]">
              <div className="wrap">
                <div className="section-head flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="eyebrow text-xs font-black uppercase tracking-wider text-[#073faf] block mb-2">
                      BESTSELLERS
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-[#101828] tracking-tight">
                      Customer favorites with top ratings
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentRoute('shop');
                    }}
                    className="text-xs font-bold text-[#073faf] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Browse collection</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                  {bestSellers.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                      onQuickView={setQuickViewProduct}
                      onToggleWishlist={handleToggleWishlist}
                      onToggleCompare={handleToggleCompare}
                      isWishlisted={wishlist.includes(prod.id)}
                      isCompared={compare.includes(prod.id)}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* 8. Insight Editorial Journal Preview */}
            <section className="py-14 md:py-20 bg-white border-t border-gray-100">
              <div className="wrap">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="eyebrow text-xs font-black uppercase tracking-wider text-[#073faf] block mb-2">
                      INSIGHT EDITORIAL
                    </span>
                    <h2 className="text-2xl md:text-3xl font-black text-[#101828] tracking-tight">
                      Guides, tips & lifestyle stories
                    </h2>
                  </div>
                  <button
                    onClick={() => setCurrentRoute('blog')}
                    className="text-xs font-bold text-[#073faf] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Read all articles</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {blogPostsData.slice(0, 3).map((post) => (
                    <div
                      key={post.id}
                      onClick={() => setCurrentRoute('blog')}
                      className="group cursor-pointer space-y-3"
                    >
                      <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#073faf] bg-blue-50 px-2.5 py-1 rounded-full">
                        {post.tag}
                      </span>
                      <h3 className="font-bold text-base text-[#101828] group-hover:text-[#073faf] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 9. Verified Customer Reviews Carousel */}
            <section className="py-14 bg-[#f8fafc] border-t border-gray-100">
              <div className="wrap">
                <div className="text-center max-w-xl mx-auto mb-10">
                  <span className="eyebrow text-xs font-black uppercase tracking-wider text-[#073faf] block mb-1">
                    VERIFIED TESTIMONIALS
                  </span>
                  <h2 className="text-2xl font-black text-[#101828]">What our customers say</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonialsData.map((item, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                      <div className="flex text-amber-400">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                        "{item.text}"
                      </p>
                      <div className="pt-2 border-t border-gray-100">
                        <b className="text-xs text-gray-900 block font-bold">{item.name}</b>
                        <span className="text-[11px] text-gray-400">{item.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {currentRoute === 'shop' && (
          <ShopScreen
            products={productsData}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onQuickView={setQuickViewProduct}
            onToggleWishlist={handleToggleWishlist}
            onToggleCompare={handleToggleCompare}
            wishlistIds={wishlist}
            compareIds={compare}
            onNavigateHome={() => setCurrentRoute('home')}
          />
        )}

        {currentRoute === 'cart' && (
          <CartScreen
            cartItems={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onProceedToCheckout={() => setCurrentRoute('checkout')}
            onContinueShopping={() => setCurrentRoute('shop')}
            discountRate={discountRate}
            onApplyCoupon={handleApplyCoupon}
          />
        )}

        {currentRoute === 'checkout' && (
          <CheckoutScreen
            cartItems={cart}
            discountRate={discountRate}
            onPlaceOrder={handlePlaceOrder}
            onBackToCart={() => setCurrentRoute('cart')}
          />
        )}

        {currentRoute === 'wishlist' && (
          <WishlistScreen
            wishlistProducts={wishlistProducts}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onRemoveFromWishlist={(id) => setWishlist((prev) => prev.filter((i) => i !== id))}
            onClearWishlist={() => {
              setWishlist([]);
              showToast('Wishlist cleared', 'info');
            }}
            onQuickView={setQuickViewProduct}
            onExploreShop={() => setCurrentRoute('shop')}
          />
        )}

        {currentRoute === 'compare' && (
          <CompareScreen
            compareProducts={compareProducts}
            onAddToCart={(p) => handleAddToCart(p, 1)}
            onRemoveFromCompare={(id) => setCompare((prev) => prev.filter((i) => i !== id))}
            onClearCompare={() => {
              setCompare([]);
              showToast('Comparison cleared', 'info');
            }}
            onExploreShop={() => setCurrentRoute('shop')}
          />
        )}

        {currentRoute === 'about' && (
          <AboutScreen
            onExploreShop={() => setCurrentRoute('shop')}
            onContactUs={() => setCurrentRoute('contact')}
          />
        )}

        {currentRoute === 'blog' && (
          <BlogScreen onNavigateHome={() => setCurrentRoute('home')} />
        )}

        {currentRoute === 'contact' && (
          <ContactScreen onNavigateHome={() => setCurrentRoute('home')} />
        )}

        {currentRoute === 'account' && (
          <AccountScreen
            orders={orders}
            onExploreShop={() => setCurrentRoute('shop')}
            onNavigateHome={() => setCurrentRoute('home')}
          />
        )}
      </main>

      {/* Global Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onToggleWishlist={handleToggleWishlist}
        onToggleCompare={handleToggleCompare}
        isWishlisted={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        isCompared={quickViewProduct ? compare.includes(quickViewProduct.id) : false}
      />

      {/* Global Order Confirmation Modal */}
      <OrderConfirmationModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onGoToShop={() => setCurrentRoute('shop')}
        onGoToAccount={() => setCurrentRoute('account')}
      />

      {/* Global Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* Global Footer */}
      <Footer
        onNavigate={setCurrentRoute}
        onSelectDepartment={(dept) => {
          setSelectedCategory(dept);
          setCurrentRoute('shop');
        }}
      />
    </div>
  );
}
