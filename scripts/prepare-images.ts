import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { productsData } from '../src/data/products';
import { productAsset } from '../src/seo/catalog';
const root = process.cwd();
// Emit one WebP per product. These URLs work in browsers, image search and schema.
const images = [...new Set(productsData.flatMap(p => [p.image, ...(p.images || [])]))];
for (const src of images) {
  if (!/\/product-sprites\/product-\d+\.svg$/.test(src)) continue;
  const svgPath = join(root, 'public', src);
  const svg = readFileSync(svgPath, 'utf8');
  const file = svg.match(/href="([^"]+)"/)![1];
  const left = Math.abs(Number(svg.match(/x="(-?\d+)"/)![1]));
  const top = Math.abs(Number(svg.match(/y="(-?\d+)"/)![1]));
  const target = join(root, 'public', productAsset(src)); mkdirSync(dirname(target), { recursive: true });
  await sharp(join(dirname(svgPath), file)).extract({ left, top, width: 256, height: 256 }).webp({ quality: 85 }).toFile(target);
}
console.log(`Prepared ${images.length} standalone product images.`);
