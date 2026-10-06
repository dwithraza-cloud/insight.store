import React, { useState } from 'react';
import { productAsset } from '../seo/catalog';

// Build-time crops give every product a crawlable, standalone image URL.
export function ProductImage({ src, width = 256, height = 256, decoding = 'async', onError, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const resolvedSrc = typeof src === 'string' ? productAsset(src) : undefined;
  const [failedSrc, setFailedSrc] = useState<string>();
  const failed = !resolvedSrc || failedSrc === resolvedSrc;
  return <img {...props} src={failed ? '/images/image-unavailable.svg' : resolvedSrc} width={width} height={height} decoding={decoding}
    onError={(event) => {
      if (failed) return;
      setFailedSrc(resolvedSrc);
      onError?.(event);
    }} />;
}
