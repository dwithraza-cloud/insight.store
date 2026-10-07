import React from 'react';
import { productAsset } from '../seo/catalog';

// Product cards prefer standalone WebP crops generated at build time.
// If a generated crop is unavailable, fall back once to the original source.
export function ProductImage({
  src,
  width = 256,
  height = 256,
  decoding = 'async',
  onError,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const originalSrc = typeof src === 'string' ? src : undefined;
  const preferredSrc = originalSrc ? productAsset(originalSrc) : src;

  const handleError: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const img = event.currentTarget;
    if (originalSrc && img.src !== new URL(originalSrc, window.location.origin).href && img.dataset.fallbackApplied !== 'true') {
      img.dataset.fallbackApplied = 'true';
      img.src = originalSrc;
      return;
    }
    onError?.(event);
  };

  return (
    <img
      {...props}
      src={preferredSrc}
      width={width}
      height={height}
      decoding={decoding}
      onError={handleError}
    />
  );
}
