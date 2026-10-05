import { productsData } from '../data/products';
import { departmentsData, blogPostsData } from '../data/storeData';
import type { PageRoute, Product, BlogPost } from '../types';

export const SITE_URL = 'https://insightstore.designerinsight.online';
export const slugify = (text: string) => text.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const productPath = (p: Product) => `/products/${slugify(p.title)}-${p.id}/`;
export const articlePath = (p: BlogPost) => `/blog/${slugify(p.title)}/`;
export const activeDepartments = departmentsData.filter(d => d.count > 0);
export const categoryPath = (name: string) => name.toLowerCase() === 'all' ? '/shop/' : `/categories/${slugify(name)}/`;
export const routePath = (route: PageRoute) => route === 'home' ? '/' : route === 'not-found' ? '/404/' : `/${route}/`;
export const productAsset = (src: string) => src.replace(/^\/images\/product-sprites\/(product-\d+)\.svg$/, '/images/products/$1.webp');
export interface LocationState { path: string; route: PageRoute; category: string; product?: Product; article?: BlogPost }
export function resolveLocation(input: string): LocationState {
  const raw = input.split(/[?#]/)[0];
  const path = raw === '/' ? '/' : `/${raw.split('/').filter(Boolean).join('/')}/`;
  const base = { path, category: 'all' };
  if (path === '/') return { ...base, route: 'home' };
  const product = productsData.find(p => productPath(p) === path);
  if (product) return { ...base, route: 'product', category: product.category, product };
  const department = activeDepartments.find(d => categoryPath(d.name) === path);
  if (department) return { ...base, route: 'shop', category: department.name };
  const article = blogPostsData.find(p => articlePath(p) === path);
  if (article) return { ...base, route: 'article', article };
  const routes: PageRoute[] = ['shop', 'about', 'blog', 'contact', 'help', 'cart', 'checkout', 'wishlist', 'compare', 'account'];
  const route = routes.find(r => routePath(r) === path);
  return { ...base, route: route || 'not-found' };
}
export const categoryIntro: Record<string, string> = {
  'Digital Products': 'Browse streaming subscriptions, creative software and AI tools with prices in PKR. Compare the plan and subscription duration, and confirm activation requirements before ordering.',
  'Bedsheets': 'Shop cotton bedsheets, single and king-size sets in Pakistan. Compare the listed material, size and included pieces to choose bedding that fits your room.',
  'Ladies & Gents Clothes': 'Explore ladies and gents clothing, lawn collections and embroidered suits. Check each listing for fabric, colour, stitching status and included pieces before choosing your outfit.',
  'Bags & Accessories': 'Browse bags, pouches and everyday accessories. Compare the listed dimensions and product details to find an option that suits your routine.',
  'Kitchen': 'Browse kitchen cookware and everyday cooking essentials. Check the size, material and included pieces on each product listing.',
};
export function categoryDescription(name: string) {
  return categoryIntro[name] || `Browse ${name.toLowerCase()} at Insight Store in Pakistan. Compare current PKR prices, availability and product details before ordering.`;
}
export const publicPaths = ['/', '/shop/', '/about/', '/contact/', '/blog/', '/help/', ...activeDepartments.map(d => categoryPath(d.name)), ...productsData.map(productPath), ...blogPostsData.map(articlePath)];
