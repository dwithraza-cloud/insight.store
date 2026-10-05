import React from 'react';

const transparentTile = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="256" height="256"/%3E';

// SVG images used as <img> cannot fetch an external sheet. Render its tile as a
// CSS background instead, retaining the same sizing, alt text and hover styles.
export function ProductImage({ src, style, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const match = typeof src === 'string' && src.match(/^\/images\/product-sprites\/product-(\d+)\.svg$/);
  if (!match) return <img {...props} src={src} style={style} />;
  const index = Number(match[1]) - 1;
  const sheet = Math.floor(index / 32) + 1;
  const tile = index % 32;
  const column = tile % 4;
  const row = Math.floor(tile / 4);
  return <img {...props} src={transparentTile} style={{
    ...style,
    backgroundImage: `url("/images/product-sprites/products-${sheet}.webp")`,
    backgroundSize: '400% 800%',
    backgroundPosition: `${column * 100 / 3}% ${row * 100 / 7}%`,
    backgroundRepeat: 'no-repeat',
    backgroundOrigin: 'content-box',
    backgroundClip: 'content-box',
  }} />;
}
