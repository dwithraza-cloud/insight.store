import type { Product } from '../types';

// Shuffle within categories, then alternate categories so large groups cannot
// occupy the whole first page. A fixed seed keeps pagination/re-renders stable.
export function mixProductsByCategory(products: Product[], seed: number): Product[] {
  let state = seed >>> 0;
  const random = () => {
    state += 0x6D2B79F5;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const shuffle = <T,>(items: T[]): T[] => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const groups = new Map<string, Product[]>();
  for (const product of products) {
    const key = product.category.toLowerCase();
    const group = groups.get(key);
    if (group) group.push(product);
    else groups.set(key, [product]);
  }
  const categories = shuffle([...groups.values()].map(shuffle));
  const result: Product[] = [];
  for (let round = 0; result.length < products.length; round++) {
    for (const category of categories) {
      if (round < category.length) result.push(category[round]);
    }
  }
  return result;
}
