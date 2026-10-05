import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { publicPaths, SITE_URL, productPath, categoryPath, activeDepartments, productAsset, resolveLocation } from '../src/seo/catalog';
import { productsData } from '../src/data/products';
import { metadataFor } from '../src/seo/metadata';
const titles = new Set<string>();
for (const path of publicPaths) {
  const html = readFileSync(join('dist', path, 'index.html'), 'utf8');
  const m = metadataFor(path);
  assert.equal((html.match(/<title>/g) || []).length, 1, path);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `One H1: ${path}`);
  assert(html.includes(`href="${SITE_URL}${path}"`), `Canonical: ${path}`);
  assert(html.includes('google-site-verification'), `Verification: ${path}`);
  assert(!html.includes('content="noindex'), `Public page is indexable: ${path}`);
  assert(!titles.has(m.title), `Unique title: ${m.title}`); titles.add(m.title);
  const schema = JSON.parse(html.match(/<script id="seo-schema" type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
  assert(!JSON.stringify(schema).includes('aggregateRating'), 'No unverified ratings');
  assert(!JSON.stringify(schema).includes('Gulberg'), 'No unverified address');
  for (const [, href] of html.matchAll(/<a[^>]*href="(\/[^"?#]*)"/g)) {
    const resolved = resolveLocation(href);
    assert.notEqual(resolved.route, 'not-found', `Broken internal link ${href} on ${path}`);
    assert(existsSync(join('dist', href, 'index.html')), `Missing page ${href}`);
  }
}
for (const product of productsData) {
  assert(existsSync(join('dist', productAsset(product.image))), product.title);
  const graph = metadataFor(productPath(product)).schema['@graph'];
  const schema = graph.find((g: any) => g['@type'] === 'Product') as any;
  assert.equal(schema.offers.price, product.price); assert.equal(schema.offers.priceCurrency, 'PKR');
  assert.equal(schema.offers.availability.endsWith('InStock'), product.stock);
}
const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, publicPaths.length);
for (const path of ['/cart/', '/checkout/', '/account/', '/compare/', '/wishlist/']) {
  assert(!sitemap.includes(`<loc>${SITE_URL}${path}</loc>`));
  assert(readFileSync(join('dist', path, 'index.html'), 'utf8').includes('noindex,follow'));
}
assert(metadataFor('/does-not-exist/').robots.startsWith('noindex'));
for (const department of activeDepartments) assert(sitemap.includes(SITE_URL + categoryPath(department.name)));
console.log(`SEO validation passed: ${publicPaths.length} unique, linked, indexable pages; ${productsData.length} valid product schemas and images; private screens excluded.`);
