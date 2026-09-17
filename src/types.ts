export type PageRoute = 
  | 'home'
  | 'shop'
  | 'about'
  | 'blog'
  | 'contact'
  | 'cart'
  | 'checkout'
  | 'compare'
  | 'wishlist'
  | 'account';

export interface Product {
  id: number;
  title: string;
  category: string;
  brand: string;
  price: number;
  oldPrice?: number;
  rating: number;
  stock: boolean;
  image: string;
  images?: string[];
  videoUrl?: string;
  badge?: string;
  sku: string;
  color?: string;
  screen?: string;
  description: string;
  features?: string[];
  specs?: Record<string, string>;
}

export interface Department {
  id: string;
  name: string;
  icon: string;
  image: string;
  count: number;
  description?: string;
}

export interface HeroSlide {
  id: number;
  badge: string;
  eyebrow?: string;
  title: string;
  titleHighlight?: string;
  description: string;
  image: string;
  category: string;
  ctaText: string;
  secondaryCtaText?: string;
  secondaryCategory?: string;
  stats?: { label: string; value: string }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Pending Verification';
  items: CartItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    notes?: string;
  };
  paymentMethod: 'cod' | 'bank' | 'card';
}

export type ShippingStatusCode = 'processing' | 'in_transit' | 'out_for_delivery' | 'delivered';

export interface TrackingCheckpoint {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  description: string;
}

export interface TrackingDetails {
  orderId: string;
  carrier: string;
  trackingNumber: string;
  status: 'Order Confirmed' | 'Processing' | 'In Transit' | 'Out for Delivery' | 'Delivered';
  statusCode: ShippingStatusCode;
  progressPercent: number;
  estimatedDelivery: string;
  origin: string;
  destination: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientCity: string;
  checkpoints: TrackingCheckpoint[];
  courierRider?: {
    name: string;
    phone: string;
    vehicle: string;
  };
  totalAmount: number;
  paymentMethod: string;
  itemsSummary: {
    title: string;
    quantity: number;
    image: string;
  }[];
}

export interface BlogPost {
  id: string;
  tag: string;
  author: string;
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  date: string;
  readTime: string;
}
