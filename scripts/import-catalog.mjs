import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';

const [sourceArg] = process.argv.slice(2);

if (!sourceArg) {
  throw new Error('Usage: node scripts/import-catalog.mjs <extracted-nodejs-directory>');
}

const sourceRoot = resolve(sourceArg);
const targetRoot = resolve(import.meta.dirname, '..');
const databasePath = join(sourceRoot, 'storage', 'database.json');
const targetProductsDir = join(targetRoot, 'public', 'images', 'products');
const targetCatalogDir = join(targetProductsDir, 'catalog');
const categoryAssets = [
  'category-appliances.webp',
  'category-electronics.webp',
  'category-fashion.webp',
  'category-gadgets.webp',
  'category-home-decor.webp',
  'category-jewellery.webp',
  'category-kitchen.webp',
  'category-toys.webp',
];

const database = JSON.parse(readFileSync(databasePath, 'utf8'));
const sourceProducts = Array.isArray(database.products) ? database.products : [];

mkdirSync(targetProductsDir, { recursive: true });
mkdirSync(targetCatalogDir, { recursive: true });

for (const filename of categoryAssets) {
  const sourcePath = join(sourceRoot, 'public', 'images', filename);
  const targetPath = join(targetRoot, 'public', 'images', filename);

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing category image: ${sourcePath}`);
  }

  copyFileSync(sourcePath, targetPath);
}

const copiedFiles = new Set();

function copyProductImage(reference) {
  if (!reference || typeof reference !== 'string') return '';

  if (reference.startsWith('/api/media/catalog%2F')) {
    const filename = basename(decodeURIComponent(reference.replace('/api/media/catalog%2F', '')));
    const sourcePath = join(sourceRoot, 'storage', 'uploads', filename);
    const targetPath = join(targetCatalogDir, filename);

    if (!existsSync(sourcePath)) {
      throw new Error(`Missing catalog image: ${sourcePath}`);
    }

    if (!copiedFiles.has(targetPath)) {
      copyFileSync(sourcePath, targetPath);
      copiedFiles.add(targetPath);
    }

    return `/images/products/catalog/${filename}`;
  }

  if (reference.startsWith('/images/products/')) {
    const filename = basename(reference);
    const sourcePath = join(sourceRoot, 'public', 'images', 'products', filename);
    const targetPath = join(targetProductsDir, filename);

    if (!existsSync(sourcePath)) {
      throw new Error(`Missing product image: ${sourcePath}`);
    }

    if (!copiedFiles.has(targetPath)) {
      copyFileSync(sourcePath, targetPath);
      copiedFiles.add(targetPath);
    }

    return `/images/products/${filename}`;
  }

  return reference;
}

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

const products = sourceProducts.map((source, index) => {
  const image = copyProductImage(source.image);
  const gallery = Array.isArray(source.images) ? source.images : [];
  const images = [...new Set([image, ...gallery.map(copyProductImage)].filter(Boolean))];
  const oldPriceValue = source.oldPrice ?? source.old_price;
  const product = {
    id: finiteNumber(source.id, index + 1),
    title: String(source.title || `Product ${index + 1}`),
    category: String(source.category || 'Other'),
    brand: String(source.brand || 'Insight Store'),
    price: finiteNumber(source.price),
    rating: finiteNumber(source.rating, 4.8),
    stock: typeof source.stock === 'boolean'
      ? source.stock
      : finiteNumber(source.stockQuantity ?? source.stock_quantity, 0) > 0,
    image,
    images,
    badge: source.badge ? String(source.badge) : undefined,
    sku: String(source.sku || `IS-${index + 1}`),
    color: source.color ? String(source.color) : undefined,
    description: String(source.description || 'Quality product available from Insight Store.'),
  };

  const oldPrice = finiteNumber(oldPriceValue, 0);
  if (oldPrice > product.price) product.oldPrice = oldPrice;

  const videoUrl = source.videoUrl || source.video_url || source.video;
  if (videoUrl) product.videoUrl = String(videoUrl);
  if (Array.isArray(source.features) && source.features.length) {
    product.features = source.features.map(String);
  }
  if (source.specs && typeof source.specs === 'object' && !Array.isArray(source.specs)) {
    product.specs = Object.fromEntries(
      Object.entries(source.specs).map(([key, value]) => [key, String(value)])
    );
  }

  return Object.fromEntries(Object.entries(product).filter(([, value]) => value !== undefined));
});

const output = `import { Product } from '../types';\n\nexport const productsData: Product[] = ${JSON.stringify(products, null, 2)};\n`;
writeFileSync(join(targetRoot, 'src', 'data', 'products.ts'), output);

console.log(`Imported ${products.length} products, ${copiedFiles.size} product images and ${categoryAssets.length} category images.`);
