import { Department, HeroSlide, BlogPost } from '../types';
import { productsData } from './products';

const DEPARTMENT_META: Array<Omit<Department, 'count' | 'image'> & { image?: string }> = [
  { id: 'digital-products', name: 'Digital Products', icon: 'Layers', description: 'Subscriptions, creative tools, streaming and AI access' },
  { id: 'bedsheets', name: 'Bedsheets', icon: 'Bed', description: 'Pure cotton single and king-size collections' },
  { id: 'clothes', name: 'Ladies & Gents Clothes', icon: 'Shirt', image: '/images/category-fashion.webp', description: 'Lawn collections and premium embroidered suits' },
  { id: 'bags-accessories', name: 'Bags & Accessories', icon: 'ShoppingBag', description: 'Everyday bags, pouches and useful accessories' },
  { id: 'kitchen', name: 'Kitchen', icon: 'CookingPot', description: 'Practical cookware for everyday use' },
  { id: 'kitchen-accessories', name: 'Kitchen Accessories', icon: 'Utensils', image: '/images/category-kitchen.webp', description: 'Cookware, utensils and modern prep tools' },
  { id: 'toys', name: 'Toys', icon: 'Gamepad2', image: '/images/category-toys.webp', description: 'Fun toys, activity products and gifts' },
  { id: 'personal-care', name: 'Personal Care', icon: 'HeartPulse', description: 'Useful personal care and grooming essentials' },
  { id: 'gadgets', name: 'Gadgets', icon: 'Smartphone', image: '/images/category-gadgets.webp', description: 'Power banks, earbuds, lights and accessories' },
  { id: 'mobile', name: 'Mobile', icon: 'Smartphone', description: 'Smartphones and mobile essentials' },
  { id: 'computers', name: 'Computers', icon: 'Laptop', description: 'Laptops and computing products' },
  { id: 'audio', name: 'Audio', icon: 'Headphones', description: 'Headphones, speakers and personal audio' },
  { id: 'wearables', name: 'Wearables', icon: 'Watch', description: 'Smart watches and connected accessories' },
  { id: 'television', name: 'Television', icon: 'Tv', description: 'Smart TVs and home entertainment' },
  { id: 'electronics', name: 'Electronics', icon: 'Tv', image: '/images/category-electronics.webp', description: 'Useful electronics for modern homes' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2', description: 'Controllers and gaming accessories' },
  { id: 'camera', name: 'Camera', icon: 'Camera', description: 'Cameras and visual creation gear' },
  { id: 'networking', name: 'Networking', icon: 'Wifi', description: 'Routers and reliable connectivity' },
  { id: 'home-appliances', name: 'Home Appliances', icon: 'Wind', image: '/images/category-appliances.webp', description: 'Smart appliances for easier everyday living' },
  { id: 'home-decor', name: 'Home Decor', icon: 'Sparkles', image: '/images/category-home-decor.webp', description: 'Decor accents, lamps, vases and plants' },
  { id: 'jewellery', name: 'Jewellery', icon: 'Gem', image: '/images/category-jewellery.webp', description: 'Elegant necklaces, bracelets and earrings' },
];

export const departmentsData: Department[] = DEPARTMENT_META.map((department) => {
  const categoryProducts = productsData.filter((product) => product.category === department.name);

  return {
    ...department,
    count: categoryProducts.length,
    image: department.image || categoryProducts[0]?.image || '/images/category-gadgets.webp',
  };
});

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
  "id": "guide-bedsheets",
  "tag": "Bedsheets",
  "author": "Insight Editorial",
  "title": "How to choose cotton bedsheets in Pakistan",
  "excerpt": "Measure your mattress and compare fabric, set contents and care instructions before choosing single or king-size cotton bedsheets.",
  "content": "Start with the mattress, not the label. Measure its width, length and depth, then compare those measurements with the dimensions on the product listing. A flat sheet needs enough extra fabric to tuck in, while a fitted sheet needs a pocket that can accommodate the mattress depth. Single, double and king-size labels can vary between sellers.\n\nNext, check what comes in the set. A photograph may show a complete styled bed, but the listing should tell you whether pillowcases, a flat sheet, a fitted sheet or other pieces are included. Compare the price for the actual listed set rather than assuming every item in the photograph is supplied.\n\nRead the fabric description carefully. Pure cotton, cotton blends and synthetic fabrics are different products. If the listing only says cotton without giving composition, ask the store to confirm it. Weave, thickness and finish can affect how a sheet feels; a large thread-count number alone does not describe the whole fabric.\n\nCheck care instructions before purchasing. Ask whether the fabric needs a gentle wash, whether dark colours should be washed separately and whether tumble drying is suitable. Follow the supplied label and allow for any shrinkage guidance given by the seller.\n\nFinally, compare the current price in PKR, delivery charges and return conditions. Confirm the exact colour, print and size before ordering. Browse the Bedsheets collection to compare the details of the available sets.",
  "image": "/images/banner-home-living.webp",
  "date": "October 5, 2026",
  "readTime": "3 min read"
},
{
  "id": "guide-clothing",
  "tag": "Clothing",
  "author": "Insight Editorial",
  "title": "What to check before buying lawn suits online",
  "excerpt": "Compare stitched versus unstitched suits, fabric details and included pieces so the outfit you order matches what you need.",
  "content": "First, establish whether the suit is stitched, ready to wear or unstitched. An unstitched suit supplies fabric and may require separate tailoring. A ready-to-wear outfit should provide size measurements rather than only a small, medium or large label.\n\nFor an unstitched suit, check the length of each fabric piece. Ask what is supplied for the shirt, trousers and dupatta. A three-piece label usually refers to three components, but their materials and lengths should be confirmed from the listing.\n\nRead how the design is made. Printed, embroidered and embellished suits can have different care requirements. Look for clear photographs of the actual fabric and ask whether any lining, lace or accessories shown are included. Screen settings and lighting can affect the appearance of colours.\n\nFor a stitched outfit, compare the listed chest, shoulder, sleeve and length measurements with a similar outfit that already fits you. If a measurement is missing, confirm it before payment rather than relying only on the model photograph.\n\nCheck the current price, delivery estimate and exchange eligibility before placing your order. If you need an outfit for a particular occasion, allow time for delivery and any tailoring. Explore the Ladies & Gents Clothes collection and compare the information on each product page.",
  "image": "/images/category-fashion.webp",
  "date": "October 5, 2026",
  "readTime": "3 min read"
},
{
  "id": "guide-digital",
  "tag": "Digital Products",
  "author": "Insight Editorial",
  "title": "Digital subscriptions: what to confirm before ordering",
  "excerpt": "Check the plan, duration, account requirements and activation details before buying streaming, creative software or AI subscriptions.",
  "content": "A subscription title is only the starting point. Confirm the exact plan, how long access lasts and which features are included. Product names such as Premium or Pro can refer to different plans, so compare the stated features with your intended use.\n\nAsk how activation works. Confirm whether the subscription is applied to your own account or supplied through another access arrangement. Check supported regions, device limits, simultaneous usage limits and any restrictions relevant to your work or household.\n\nUnderstand when the subscription period begins: at payment, activation or first use. Ask how long activation is expected to take and what information is required. For creative software and AI tools, confirm any usage credits or limits that apply to the plan.\n\nCheck renewal and cancellation terms. Do not assume that an advertised monthly duration automatically renews or can be paused. Confirm the available support and the refund or replacement conditions, especially once access has been activated.\n\nCompare the final price in PKR and verify the order details before payment. Browse the Digital Products collection for listed plans and durations, and contact the store whenever an important requirement is unclear.",
  "image": "/images/category-gadgets.webp",
  "date": "October 5, 2026",
  "readTime": "3 min read"
},
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
