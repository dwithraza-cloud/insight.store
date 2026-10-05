import { productsData } from '../data/products';
import { SITE_URL, resolveLocation, categoryDescription, productPath, productAsset, categoryPath, activeDepartments } from './catalog';
const absolute = (path: string) => new URL(path, SITE_URL).href;
const clean = (text: string, limit = 160) => text.replace(/\s+/g, ' ').trim().slice(0, limit);
export function metadataFor(path: string) {
  const l = resolveLocation(path);
  let title = 'Insight Store Pakistan | Bedsheets, Clothing & Digital Products';
  let description = 'Shop bedsheets, ladies and gents clothing, digital subscriptions, kitchen essentials and gadgets at Insight Store. Compare product details and prices in PKR.';
  let image = absolute('/images/banner-fashion-jewellery.webp');
  let type = 'website';
  const noindex = ['cart', 'checkout', 'account', 'wishlist', 'compare', 'not-found'].includes(l.route);
  const graph: Record<string, unknown>[] = [{ '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Insight Store', url: SITE_URL, logo: absolute('/images/insight-store-logo.svg') }, { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, name: 'Insight Store', url: SITE_URL, publisher: { '@id': `${SITE_URL}/#organization` } }];
  let crumbs = [{ name: 'Home', item: absolute('/') }];
  if (l.product) {
    const p = l.product;
    title = `${p.title} in Pakistan | Insight Store`;
    description = clean(`${p.title} — PKR ${p.price.toLocaleString('en-PK')}. ${p.description}`);
    image = absolute(productAsset(p.image));
    type = 'product';
    graph.push({ '@type': 'Product', '@id': `${absolute(l.path)}#product`, name: p.title, description: p.description, image: [image], sku: p.sku, brand: { '@type': 'Brand', name: p.brand }, offers: { '@type': 'Offer', url: absolute(l.path), priceCurrency: 'PKR', price: p.price, availability: p.stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock', seller: { '@id': `${SITE_URL}/#organization` } } });
    crumbs.push({ name: p.category, item: absolute(categoryPath(p.category)) }, { name: p.title, item: absolute(l.path) });
  } else if (l.route === 'shop') {
    title = l.category === 'all' ? 'Shop All Products in Pakistan | Insight Store' : `${l.category} Online in Pakistan | Insight Store`;
    description = l.category === 'all' ? `Browse ${productsData.length} products: bedsheets, clothing, digital subscriptions, kitchen essentials and more. Compare prices in PKR at Insight Store Pakistan.` : clean(categoryDescription(l.category));
    const d = activeDepartments.find(d => d.name === l.category);
    if (d) image = absolute(productAsset(d.image));
    const items = productsData.filter(p => l.category === 'all' || p.category === l.category);
    graph.push({ '@type': 'CollectionPage', name: title, url: absolute(l.path), mainEntity: { '@type': 'ItemList', numberOfItems: items.length, itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absolute(productPath(p)), name: p.title })) } });
    crumbs.push({ name: l.category === 'all' ? 'Shop' : l.category, item: absolute(l.path) });
  } else if (l.article) {
    title = `${l.article.title} | Insight Store`;
    description = clean(l.article.excerpt);
    image = absolute(l.article.image);
    type = 'article';
    graph.push({ '@type': 'Article', headline: l.article.title, description, image, author: { '@type': 'Organization', name: 'Insight Editorial' }, publisher: { '@id': `${SITE_URL}/#organization` }, mainEntityOfPage: absolute(l.path) });
    crumbs.push({ name: 'Buying Guides', item: absolute('/blog/') }, { name: l.article.title, item: absolute(l.path) });
  } else if (l.route !== 'home') {
    const pages: Record<string, [string, string]> = {
      about: ['About Insight Store | Online Shopping in Pakistan', 'Learn about Insight Store and explore our collection of home, fashion, digital and everyday products for shoppers in Pakistan.'],
      contact: ['Contact Insight Store | Shopping & Order Support', 'Contact Insight Store for questions about product details, stock, payment, delivery and digital subscription activation before you order.'],
      blog: ['Buying Guides for Pakistan | Insight Store', 'Practical guides to choosing bedsheets, clothing, digital subscriptions and everyday tech. Compare the details that matter before you shop.'],
      help: ['Shopping & Delivery Help | Insight Store Pakistan', 'Check what to confirm before ordering: product specifications, delivery charges, payment details, digital activation and return eligibility.'],
    };
    [title, description] = pages[l.route] || [l.route === 'not-found' ? 'Page Not Found | Insight Store' : `${l.route.charAt(0).toUpperCase() + l.route.slice(1)} | Insight Store`, 'Manage your shopping at Insight Store.'];
    crumbs.push({ name: title.split(' | ')[0], item: absolute(l.path) });
  }
  if (crumbs.length > 1 && !noindex) graph.push({ '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })) });
  return { title, description, image, type, canonical: absolute(l.path), robots: noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large', schema: { '@context': 'https://schema.org', '@graph': noindex ? [] : graph } };
}
export function updateMetadata(path: string) {
  const m = metadataFor(path); document.title = m.title;
  const meta = (attr: 'name' | 'property', key: string, value: string) => {
    let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.append(el); }
    el.content = value;
  };
  meta('name', 'description', m.description); meta('name', 'robots', m.robots);
  for (const [key, value] of Object.entries({ title: m.title, description: m.description, image: m.image, url: m.canonical, type: m.type, site_name: 'Insight Store', locale: 'en_PK' })) meta('property', `og:${key}`, value);
  for (const [key, value] of Object.entries({ card: 'summary_large_image', title: m.title, description: m.description, image: m.image })) meta('name', `twitter:${key}`, value);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.append(link); } link.href = m.canonical;
  let script = document.getElementById('seo-schema'); if (!script) { script = document.createElement('script'); script.id = 'seo-schema'; script.setAttribute('type', 'application/ld+json'); document.head.append(script); } script.textContent = JSON.stringify(m.schema);
}
