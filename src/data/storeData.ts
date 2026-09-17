import { Department, HeroSlide, BlogPost } from '../types';

export const departmentsData: Department[] = [
  {
    id: 'kitchen-accessories',
    name: 'Kitchen Accessories',
    icon: 'CookingPot',
    image: 'https://insightstore.designerinsight.online/images/category-kitchen.webp',
    count: 3,
    description: 'Cookware, utensils, and modern prep tools'
  },
  {
    id: 'clothes',
    name: 'Ladies & Gents Clothes',
    icon: 'Shirt',
    image: 'https://insightstore.designerinsight.online/images/category-fashion.webp',
    count: 125,
    description: 'Lawn suits, cotton kurtas, and co-ords'
  },
  {
    id: 'toys',
    name: 'Toys',
    icon: 'Gamepad2',
    image: 'https://insightstore.designerinsight.online/images/category-toys.webp',
    count: 5,
    description: 'Plush toys, wooden Montessori, and RC cars'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Tv',
    image: 'https://insightstore.designerinsight.online/images/category-electronics.webp',
    count: 3,
    description: 'Frameless 4K TVs, air fryers, and microwaves'
  },
  {
    id: 'gadgets',
    name: 'Gadgets',
    icon: 'Headphones',
    image: 'https://insightstore.designerinsight.online/images/category-gadgets.webp',
    count: 9,
    description: 'ANC headphones, smartwatches, and earbuds'
  },
  {
    id: 'bedsheets',
    name: 'Bedsheets & Bedding',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=85',
    count: 18,
    description: 'Pure cotton 4-piece sets, floral & damask prints'
  },
  {
    id: 'home-decor',
    name: 'Home Decor',
    icon: 'Sparkles',
    image: 'https://insightstore.designerinsight.online/images/category-home-decor.webp',
    count: 12,
    description: 'Ceramic vases, touch lamps, and indoor plants'
  },
  {
    id: 'jewellery',
    name: 'Jewellery',
    icon: 'Gem',
    image: 'https://insightstore.designerinsight.online/images/category-jewellery.webp',
    count: 8,
    description: 'Royal zircon sets, gold bracelets, and pearl drops'
  },
  {
    id: 'home-appliances',
    name: 'Home Appliances',
    icon: 'Wind',
    image: 'https://insightstore.designerinsight.online/images/category-appliances.webp',
    count: 6,
    description: 'Smart vacuums, blenders, irons, and DC fans'
  },
  {
    id: 'digital-products',
    name: 'Digital Products',
    icon: 'Layers',
    image: 'https://insightstore.designerinsight.online/images/products/digital-canva.webp',
    count: 4,
    description: 'Verified licenses, templates, and digital assets'
  }
];

export const heroSlidesData: HeroSlide[] = [
  {
    id: 1,
    badge: 'FASHION & JEWELLERY',
    eyebrow: 'FASHION & JEWELLERY',
    title: 'Style made for every occasion',
    description: 'Discover refined ladies and gents clothing with elegant jewellery to complete the look.',
    image: '/images/banner-fashion-jewellery.webp',
    category: 'Ladies & Gents Clothes',
    ctaText: 'Shop now →',
    secondaryCtaText: 'Explore our story',
    secondaryCategory: 'Jewellery'
  },
  {
    id: 2,
    badge: 'HOME & LIVING',
    eyebrow: 'HOME & LIVING',
    title: 'Beautiful essentials for every room',
    description: 'Carefully chosen cookware, practical gadgets and decor touches that make home feel like home.',
    image: '/images/banner-home-living.webp',
    category: 'Kitchen Accessories',
    ctaText: 'Shop now →',
    secondaryCtaText: 'Explore our story',
    secondaryCategory: 'Home Decor'
  },
  {
    id: 3,
    badge: 'TOYS, TECH & GADGETS',
    eyebrow: 'TOYS, TECH & GADGETS',
    title: 'Fun meets smarter technology',
    description: 'Smartphones, gaming, sound and toys picked for performance and joy.',
    image: '/images/banner-toys-tech.webp',
    category: 'Gadgets',
    ctaText: 'Shop now →',
    secondaryCtaText: 'Explore our story',
    secondaryCategory: 'Electronics'
  }
];

export const promoBannersData = [
  {
    id: 'promo-1',
    theme: 'mint',
    tag: 'NEW DROP',
    title: 'Sound that moves with you',
    text: 'Headphones and speakers built for work, travel and pure focus.',
    cta: 'Explore sound',
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'promo-2',
    theme: 'blue',
    tag: 'SMART LIVING',
    title: 'Smarter spaces, simpler days',
    text: 'Connected home devices and practical tools that save you time.',
    cta: 'See smart home',
    category: 'Home Appliances',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'promo-3',
    theme: 'peach',
    tag: 'GAMING & TECH',
    title: 'Gear up your game',
    text: 'Controllers, displays and accessories tuned for every play session.',
    cta: 'Shop gaming',
    category: 'Gaming',
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80'
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: 'blog-1',
    tag: 'Future-ready tech',
    author: 'Insight Editorial',
    title: 'How AI devices are changing the way we live',
    excerpt: 'From proactive energy scheduling to ambient sound cancellation, everyday hardware is evolving faster than ever.',
    content: 'Smart home and mobile technologies are transitioning from passive responders to active everyday assistants. Through low-power on-device neural processing, our homes anticipate lighting temperatures, robotic cleaners map obstacles dynamically, and communication tools filter chaotic background audio with unprecedented precision.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=900&q=80',
    date: 'August 14, 2026',
    readTime: '5 min read'
  },
  {
    id: 'blog-2',
    tag: 'Mobile',
    author: 'Insight Editorial',
    title: 'A practical guide to choosing your next smartphone',
    excerpt: 'Cut through marketing buzzwords and learn which display, chipset, and battery specs truly matter for everyday reliability.',
    content: 'When evaluating smartphones in 2026, raw processor benchmark scores take a back seat to battery endurance and thermal throttling efficiency. Look for LTPO adaptive refresh rates to conserve power during reading, UFS 3.1 or higher storage for snappy app switches, and minimum 4 years of guaranteed OS security updates.',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80',
    date: 'August 10, 2026',
    readTime: '4 min read'
  },
  {
    id: 'blog-3',
    tag: 'Workspace',
    author: 'Insight Editorial',
    title: 'Build a faster and calmer home office setup',
    excerpt: 'Transform your work nook into an uncluttered haven with ergonomic lighting, whisper-quiet fans, and cable management essentials.',
    content: 'A thoughtful workspace relies on balanced illumination and ergonomic discipline. Pairing an anti-glare monitor with warm ambient bias lighting reduces eye fatigue significantly over long workdays. Keep desktop cables tucked into channels and invest in natural materials like acacia wood or wool desk pads.',
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
    date: 'August 06, 2026',
    readTime: '6 min read'
  },
  {
    id: 'blog-4',
    tag: 'Gaming',
    author: 'Insight Editorial',
    title: 'What really matters in a modern gaming setup',
    excerpt: 'Why hall-effect sensor sticks, high polling rates, and true HDR displays make the greatest difference to your competitive flow.',
    content: 'Stick drift has plagued controllers for years. Hall effect electromagnetic sensors eliminate physical potentiometer friction, delivering millimeter-precise tracking that lasts for millions of actuations without calibration loss. Coupled with 2.4GHz low latency wireless protocols, wireless freedom no longer compromises competitive performance.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
    date: 'August 01, 2026',
    readTime: '5 min read'
  },
  {
    id: 'blog-5',
    tag: 'Audio',
    author: 'Insight Editorial',
    title: 'Find the right headphones for work and travel',
    excerpt: 'Comparing active acoustic isolation, battery endurance, and long-session ear cup comfort across modern wireless headphones.',
    content: 'Hybrid noise cancellation relies on both feedforward and feedback microphones to counter both low-frequency engine rumbles and human conversation frequencies. If you commute regularly across Lahore or travel frequently, prioritizing memory foam ear cup breathability and multi-point Bluetooth pairing ensures effortless device switching.',
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80',
    date: 'July 28, 2026',
    readTime: '4 min read'
  },
  {
    id: 'blog-6',
    tag: 'Smart Home',
    author: 'Insight Editorial',
    title: 'Simple upgrades that make a home feel smarter',
    excerpt: 'Subtle automations that give you back hours every week without requiring complicated technical setups or rewiring.',
    content: 'Smart homes are most delightful when they operate quietly in the background. Automated robotic vacuums scheduled to run during commute hours, smart plug timers for morning espresso makers, and Wi-Fi 6 mesh routers that eliminate dead zones across multi-story homes represent practical upgrades with high return on convenience.',
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=900&q=80',
    date: 'July 22, 2026',
    readTime: '7 min read'
  }
];

export const testimonialsData = [
  {
    name: 'Hamza Farooq',
    location: 'Lahore, Punjab',
    rating: 5,
    text: 'Ordered the Nova X12 Pro and received it in Gulberg the very same afternoon. Genuine product, sealed box, and the customer support verified my warranty card right away.',
    role: 'Verified Buyer'
  },
  {
    name: 'Ayesha Siddiqui',
    location: 'Islamabad',
    rating: 5,
    text: 'The granite cookware set and acacia utensil set are stunning. Outstanding quality and packaged with extreme care. Insight Store is now my go-to for home and lifestyle gear.',
    role: 'Verified Buyer'
  },
  {
    name: 'Zainab Malik',
    location: 'Karachi, Sindh',
    rating: 5,
    text: 'Bought the Pulse Max headphones for remote work. The noise cancellation makes Karachi traffic disappear completely. Fast courier shipping and Cash on Delivery was seamless.',
    role: 'Verified Buyer'
  }
];
