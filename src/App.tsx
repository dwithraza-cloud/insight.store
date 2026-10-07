import React, { useState, useEffect, useMemo } from 'react';
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
import { AuthScreen } from './components/AuthScreen';
import { CustomerAccountScreen } from './components/CustomerAccountScreen';
import { AuthSession, getStoredSession, hydrateOAuthSessionFromUrl, signOut } from './services/authService';
import { Footer } from './components/Footer';
import { Toast, ToastMessage } from './components/Toast';
import { ArrowRight, Star } from 'lucide-react';
import { resolveLocation, routePath, categoryPath, articlePath } from './seo/catalog';
import { updateMetadata } from './seo/metadata';
import { ProductScreen } from './components/ProductScreen';
import { ArticleScreen } from './components/ArticleScreen';
import { ShoppingHelp } from './components/ShoppingHelp';
import { mixProductsByCategory } from './utils/productOrder';

export default function App({ initialPath }: { initialPath?: string } = {}) {
  const [location, setLocation] = useState(() => resolveLocation(initialPath ?? (typeof window === 'undefined' ? '/' : window.location.pathname)));
  // Match prerendered HTML first, then choose one fresh order per page load.
  const [shuffleSeed, setShuffleSeed] = useState(0);
  useEffect(() => { setShuffleSeed(Math.floor(Math.random() * 4294967296)); }, []);
  const mixedProducts = useMemo(() => mixProductsByCategory(productsData, shuffleSeed), [shuffleSeed]);
  const currentRoute = location.route;
  const selectedCategory = location.category;
  const navigate = (path: string) => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
    setLocation(resolveLocation(path));
    setQuickViewProduct(null);
  };
  const setCurrentRoute = (route: PageRoute) => navigate(routePath(route));
  const setSelectedCategory = (category: string) => navigate(categoryPath(category));
  useEffect(() => {
    const pop = () => { setLocation(resolveLocation(window.location.pathname)); setQuickViewProduct(null); };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  useEffect(() => { updateMetadata(location.path); window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.path]);
  const handleLink = (e: React.MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element).closest<HTMLAnchorElement>('a[data-store-link]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return;
    e.preventDefault(); navigate(url.pathname);
  };
  const [session, setSession] = useState<AuthSession | null>(() => getStoredSession());
  const [authReady, setAuthReady] = useState(false);
  const [shoppingReady, setShoppingReady] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);
  const [discountRate, setDiscountRate] = useState<number>(0);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [homeFeaturedTab, setHomeFeaturedTab] = useState<string>('All');
  const [orders, setOrders] = useState<Order[]>([]);

  const shoppingKey = (scope: string) => `insight.shopping.v2.${scope}`;
  const shoppingScope = session?.user?.id ? `user.${session.user.id}` : 'guest';

  const readShoppingState = (scope: string) => {
    if (typeof window === 'undefined') return { cart: [] as CartItem[], wishlist: [] as number[], compare: [] as number[], orders: [] as Order[] };
    try {
      const raw = localStorage.getItem(shoppingKey(scope));
      if (!raw) return { cart: [] as CartItem[], wishlist: [] as number[], compare: [] as number[], orders: [] as Order[] };
      const parsed = JSON.parse(raw);
      const restoredCart: CartItem[] = Array.isArray(parsed.cart)
        ? parsed.cart.map((item: any): CartItem | null => {
            const product = productsData.find((p) => p.id === Number(item.productId));
            return product ? { product, quantity: Math.max(1, Number(item.quantity) || 1) } : null;
          }).filter((item: CartItem | null): item is CartItem => Boolean(item))
        : [];
      const validIds = new Set(productsData.map((p) => p.id));
      const restoredWishlist = Array.isArray(parsed.wishlist) ? parsed.wishlist.map(Number).filter((id: number) => validIds.has(id)) : [];
      const restoredCompare = Array.isArray(parsed.compare) ? parsed.compare.map(Number).filter((id: number) => validIds.has(id)).slice(0, 4) : [];
      const restoredOrders = Array.isArray(parsed.orders) ? parsed.orders : [];
      return { cart: restoredCart, wishlist: restoredWishlist, compare: restoredCompare, orders: restoredOrders };
    } catch {
      return { cart: [] as CartItem[], wishlist: [] as number[], compare: [] as number[], orders: [] as Order[] };
    }
  };

  const writeShoppingState = (scope: string, state: { cart: CartItem[]; wishlist: number[]; compare: number[]; orders: Order[] }) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(shoppingKey(scope), JSON.stringify({
      cart: state.cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      wishlist: state.wishlist,
      compare: state.compare,
      orders: state.orders,
    }));
  };

  useEffect(() => {
    let active = true;
    hydrateOAuthSessionFromUrl()
      .then((next) => { if (active && next) setSession(next); })
      .finally(() => { if (active) setAuthReady(true); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!authReady) return;
    setShoppingReady(false);
    const restored = readShoppingState(shoppingScope);
    setCart(restored.cart);
    setWishlist(restored.wishlist);
    setCompare(restored.compare);
    setOrders(restored.orders);
    setShoppingReady(true);
  }, [authReady, shoppingScope]);

  useEffect(() => {
    if (!authReady || !shoppingReady) return;
    writeShoppingState(shoppingScope, { cart, wishlist, compare, orders });
  }, [authReady, shoppingReady, shoppingScope, cart, wishlist, compare, orders]);

  const handleAuthenticated = (nextSession: AuthSession) => {
    const guest = readShoppingState('guest');
    const userScope = `user.${nextSession.user.id}`;
    const existing = readShoppingState(userScope);

    const mergedCart = [...existing.cart];
    guest.cart.forEach((guestItem) => {
      const index = mergedCart.findIndex((item) => item.product.id === guestItem.product.id);
      if (index >= 0) mergedCart[index] = { ...mergedCart[index], quantity: mergedCart[index].quantity + guestItem.quantity };
      else mergedCart.push(guestItem);
    });
    const mergedWishlist = Array.from(new Set([...existing.wishlist, ...guest.wishlist]));
    const mergedCompare = Array.from(new Set([...existing.compare, ...guest.compare])).slice(0, 4);
    const mergedOrders = [...existing.orders, ...guest.orders.filter((go) => !existing.orders.some((eo) => eo.id === go.id))];

    writeShoppingState(userScope, { cart: mergedCart, wishlist: mergedWishlist, compare: mergedCompare, orders: mergedOrders });
    localStorage.removeItem(shoppingKey('guest'));
    setSession(nextSession);
    setCart(mergedCart);
    setWishlist(mergedWishlist);
    setCompare(mergedCompare);
    setOrders(mergedOrders);
    setShoppingReady(true);
    navigate('/account/');
  };

  const handleLogout = async () => {
    await signOut(session);
    setSession(null);
    setShoppingReady(false);
    navigate('/account/login/');
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
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

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) {
      showToast('This order has no items to reorder', 'error');
      return;
    }

    setCart((prev) => {
      let updatedCart = [...prev];
      order.items.forEach((orderItem) => {
        const existingIndex = updatedCart.findIndex(
          (cartItem) => cartItem.product.id === orderItem.product.id
        );
        if (existingIndex > -1) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: updatedCart[existingIndex].quantity + orderItem.quantity
          };
        } else {
          updatedCart.push({
            product: orderItem.product,
            quantity: orderItem.quantity
          });
        }
      });
      return updatedCart;
    });

    const totalCount = order.items.reduce((acc, i) => acc + i.quantity, 0);
    showToast(
      `Reordered ${totalCount} item${totalCount > 1 ? 's' : ''} from order ${order.id}!`,
      'success'
    );
    setCurrentRoute('cart');
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
    ? mixedProducts.slice(0, 10)
    : productsData.filter((p) => {
        const cat = p.category.toLowerCase();
        const tab = homeFeaturedTab.toLowerCase();
        return cat.includes(tab) || tab.includes(cat);
      }).slice(0, 10);

  const bestSellers = productsData.filter((p) => p.badge === 'HOT' || p.badge === 'BESTSELLER' || p.badge === 'PURE COTTON' || p.rating >= 4.8).slice(0, 4);

  return (
    <div onClick={handleLink} className="min-h-screen flex flex-col bg-white text-[#101828]">
      {/* Global Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={setCurrentRoute}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
        }}
        onSelectProduct={(p) => {
          setQuickViewProduct(p);
        }}
        allProducts={productsData}
        cartCount={cartCount}
        cartTotal={cartTotal}
        wishlistCount={wishlist.length}
        compareCount={compare.length}
        isAuthenticated={Boolean(session?.user?.id)}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentRoute === 'product' && location.product && <ProductScreen key={location.product.id} product={location.product} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />}
        {currentRoute === 'article' && location.article && <ArticleScreen article={location.article} />}
        {currentRoute === 'help' && <ShoppingHelp />}
        {currentRoute === 'not-found' && <div className="wrap py-20"><h1 className="text-3xl font-bold mb-4">Page not found</h1><p className="text-slate-600 mb-6">This product or page could not be found.</p><a data-store-link href="/shop/" className="text-blue-700 underline">Browse the catalog</a></div>}

        {currentRoute === 'home' && (
          <div className="home-view">
            <section className="wrap pt-7 pb-5"><h1 className="text-2xl md:text-3xl font-extrabold">Online shopping in Pakistan with Insight Store</h1><p className="text-sm text-slate-600 mt-2">Browse bedsheets, ladies and gents clothing, digital subscriptions, kitchen essentials and everyday gadgets.</p></section>
            {/* 1. Hero Carousel */}
            <Hero
              onShopCategory={(cat) => {
                setSelectedCategory(cat);
              }}
              onExploreStory={() => setCurrentRoute('about')}
            />

            {/* 2. Benefits Row */}
            <BenefitsRow />

            {/* 3. Shop by Department Grid */}
            <DepartmentGrid
              onSelectDepartment={(deptName) => {
                setSelectedCategory(deptName);
              }}
              onViewAll={() => {
                setSelectedCategory('all');
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
              }}
            />

            {/* 6. Step into the Experience Immersive Banner */}
            <ExperienceBanner
              onShopNow={() => {
                setSelectedCategory('Electronics');
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
                      onClick={(e) => { if (!(e.target as Element).closest('a')) navigate(articlePath(post)); }}
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
                        <a data-store-link href={articlePath(post)}>{post.title}</a>
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
            shuffleSeed={shuffleSeed}
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

        {(currentRoute === 'login' || currentRoute === 'signup' || currentRoute === 'reset-password') && (
          <AuthScreen
            mode={currentRoute === 'signup' ? 'signup' : currentRoute === 'reset-password' ? 'reset' : 'login'}
            onAuthenticated={handleAuthenticated}
            onNavigateMode={(mode) => navigate(mode === 'signup' ? '/account/signup/' : mode === 'reset' ? '/account/reset-password/' : '/account/login/')}
            onBackHome={() => setCurrentRoute('home')}
            nextPath={new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search).get('next') || '/account/'}
          />
        )}

        {currentRoute === 'account' && (
          session?.user?.id ? (
            <CustomerAccountScreen
              user={session.user}
              orders={orders}
              cartCount={cartCount}
              wishlistCount={wishlist.length}
              onLogout={handleLogout}
              onExploreShop={() => setCurrentRoute('shop')}
            />
          ) : (
            <AuthScreen
              mode="login"
              onAuthenticated={handleAuthenticated}
              onNavigateMode={(mode) => navigate(mode === 'signup' ? '/account/signup/' : mode === 'reset' ? '/account/reset-password/' : '/account/login/')}
              onBackHome={() => setCurrentRoute('home')}
              nextPath="/account/"
            />
          )
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
        }}
      />
    </div>
  );
}
