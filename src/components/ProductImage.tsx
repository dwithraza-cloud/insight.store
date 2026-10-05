import React from 'react';
import { productAsset } from '../seo/catalog';

// Build-time crops give every product a crawlable, standalone image URL.
export function ProductImage({ src, width = 256, height = 256, decoding = 'async', ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img {...props} src={typeof src === 'string' ? productAsset(src) : src} width={width} height={height} decoding={decoding} />;
}
