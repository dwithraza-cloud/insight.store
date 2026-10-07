import React from 'react';
import { renderToString } from 'react-dom/server';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import App from '../src/App';
import { productsData } from '../src/data/products';
import { SITE_URL, publicPaths, productAsset } from '../src/seo/catalog';
import { metadataFor } from '../src/seo/metadata';

const root = process.cwd();
const dist = join(root, 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');
const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Emit one WebP per product. These URLs work in browsers, image search and schema.
const images = [...new Set(productsData.flatMap(p => [p.image, ...(p.images || [])]))];
for (const src of images) {
  if (!/\/product-sprites\/product-\d+\.svg$/.test(src)) continue;
  const svgPath = join(root, 'public', src);
  const svg = readFileSync(svgPath, 'utf8');
  const file = svg.match(/href="([^"]+)"/)![1];
  const left = Math.abs(Number(svg.match(/x="(-?\d+)"/)![1]));
  const top = Math.abs(Number(svg.match(/y="(-?\d+)"/)![1]));
  const target = join(dist, productAsset(src)); mkdirSync(dirname(target), { recursive: true });
  await sharp(join(dirname(svgPath), file)).extract({ left, top, width: 256, height: 256 }).webp({ quality: 85 }).toFile(target);
}
const privatePaths = ['/cart/', '/checkout/', '/wishlist/', '/compare/', '/account/', '/account/login/', '/account/signup/', '/account/reset-password/'];
const paths = [...publicPaths, ...privatePaths, '/404/'];
for (const path of paths) {
  const m = metadataFor(path);
  const template = html.replace(/<title>[\s\S]*?<\/title>/, '').replace(/<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/g, '').replace(/<link\s+rel="canonical"[^>]*>/g, '');
  const metadata = `<title>${escape(m.title)}</title>\n<meta name="description" content="${escape(m.description)}" />\n<meta name="robots" content="${m.robots}" />\n<link rel="canonical" href="${escape(m.canonical)}" />\n` + Object.entries({ title: m.title, description: m.description, url: m.canonical, image: m.image, type: m.type, site_name: 'Insight Store', locale: 'en_PK' }).map(([key, val]) => `<meta property="og:${key}" content="${escape(val)}" />`).join('\n') + '\n' + Object.entries({ card: 'summary_large_image', title: m.title, description: m.description, image: m.image }).map(([key, val]) => `<meta name="twitter:${key}" content="${escape(val)}" />`).join('\n') + `\n<script id="seo-schema" type="application/ld+json">${JSON.stringify(m.schema).replace(/</g, '\\u003c')}</script>`;
  // Private customer screens hydrate client-side and never enter the sitemap.
  const body = privatePaths.includes(path) ? '' : renderToString(<App initialPath={path} />);
  const output = template.replace('</head>', `${metadata}\n</head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const target = path === '/404/' ? join(dist, '404.html') : join(dist, path, 'index.html');
  mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, output);
}
const urls = publicPaths.map(path => `<url><loc>${SITE_URL}${path}</loc></url>`).join('\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
// Keep private screens crawlable so Google can see their noindex directive.
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
console.log(`Prerendered ${publicPaths.length} public pages and generated ${images.length} product images, sitemap and robots.txt.`);
