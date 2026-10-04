import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const productsFile = join(root, 'src/data/products.ts');
const outputDir = join(root, 'public/images/product-sprites');
const cell = 256;
const columns = 4;
const rows = 8;
const perSprite = columns * rows;

let source = readFileSync(productsFile, 'utf8');
let imagePaths = [...new Set([...source.matchAll(/"image":\s*"(\/images\/products\/[^"]+\.webp)"/g)].map((match) => match[1]))];

if (imagePaths.length === 0) {
  source = execFileSync('git', ['show', 'HEAD:src/data/products.ts'], { encoding: 'utf8' });
  imagePaths = [...new Set([...source.matchAll(/"image":\s*"(\/images\/products\/[^"]+\.webp)"/g)].map((match) => match[1]))];
}

rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

for (let spriteIndex = 0; spriteIndex < Math.ceil(imagePaths.length / perSprite); spriteIndex += 1) {
  const group = imagePaths.slice(spriteIndex * perSprite, (spriteIndex + 1) * perSprite);
  const tileDir = join(outputDir, `.tiles-${spriteIndex}`);
  mkdirSync(tileDir, { recursive: true });

  const tiles = group.map((publicPath, index) => {
    const sourcePath = join(root, 'public', publicPath.replace(/^\//, ''));
    const tilePath = join(tileDir, `${String(index).padStart(2, '0')}.png`);
    execFileSync('convert', [
      sourcePath,
      '-auto-orient',
      '-resize', `${cell - 16}x${cell - 16}`,
      '-gravity', 'center',
      '-background', '#ffffff',
      '-extent', `${cell}x${cell}`,
      tilePath,
    ]);
    return tilePath;
  });

  const spritePath = join(outputDir, `products-${spriteIndex + 1}.webp`);
  execFileSync('montage', [
    ...tiles,
    '-tile', `${columns}x${rows}`,
    '-geometry', `${cell}x${cell}+0+0`,
    '-background', '#ffffff',
    '-quality', '70',
    spritePath,
  ]);
  rmSync(tileDir, { recursive: true, force: true });

  group.forEach((publicPath, localIndex) => {
    const globalIndex = spriteIndex * perSprite + localIndex;
    const row = Math.floor(localIndex / columns);
    const column = localIndex % columns;
    const wrapperName = `product-${String(globalIndex + 1).padStart(3, '0')}.svg`;
    const spriteWidth = columns * cell;
    const spriteHeight = rows * cell;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cell} ${cell}"><image href="products-${spriteIndex + 1}.webp" x="-${column * cell}" y="-${row * cell}" width="${spriteWidth}" height="${spriteHeight}"/></svg>\n`;
    writeFileSync(join(outputDir, wrapperName), svg);
    source = source.split(publicPath).join(`/images/product-sprites/${wrapperName}`);
  });
}

writeFileSync(productsFile, source);
console.log(`Built ${Math.ceil(imagePaths.length / perSprite)} sprites and ${imagePaths.length} wrappers.`);
