import React, { useState } from 'react';
import { Product } from '../types';
import { productsData } from '../data/products';
import { categoryPath, productPath } from '../seo/catalog';
import { ProductImage } from './ProductImage';

export function ProductScreen({ product, onAddToCart, onBuyNow }: { product: Product; onAddToCart: (p: Product, quantity: number) => void; onBuyNow: (p: Product, quantity: number) => void }) {
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const images = product.images?.length ? product.images : [product.image];
  const related = productsData.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  return <div className="wrap py-8 md:py-12">
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500 flex flex-wrap gap-2 mb-6"><a data-store-link href="/">Home</a><span>/</span><a data-store-link href={categoryPath(product.category)}>{product.category}</a><span>/</span><span>{product.title}</span></nav>
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
      <div><div className="aspect-square bg-slate-50 rounded-3xl border border-slate-200 p-5"><ProductImage src={images[imageIndex]} alt={product.title} width={512} height={512} loading="eager" fetchPriority="high" className="w-full h-full object-contain" /></div>
        {images.length > 1 && <div className="flex gap-2 mt-3">{images.map((src, i) => <button key={src} aria-label={`View image ${i + 1} of ${product.title}`} onClick={() => setImageIndex(i)} className={`w-16 h-16 border rounded-lg p-1 ${imageIndex === i ? 'border-blue-700' : 'border-slate-200'}`}><ProductImage src={src} alt="" width={64} height={64} loading="lazy" className="w-full h-full object-contain" /></button>)}</div>}
      </div>
      <div className="space-y-5"><a data-store-link href={categoryPath(product.category)} className="text-xs font-bold uppercase tracking-wider text-blue-700">{product.category}</a>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">{product.title}</h1>
        <p className="text-sm text-slate-500">{product.brand} · SKU: {product.sku}</p>
        <div className="text-3xl font-extrabold text-[#073faf]">PKR {product.price.toLocaleString('en-PK')}{product.oldPrice && <span className="ml-3 text-base text-slate-400 line-through">PKR {product.oldPrice.toLocaleString('en-PK')}</span>}</div>
        <p className={`text-sm font-semibold ${product.stock ? 'text-emerald-700' : 'text-red-600'}`}>{product.stock ? 'In stock' : 'Out of stock'}</p>
        <p className="text-slate-600 leading-relaxed">{product.description}</p>
        {product.features?.length && <ul className="list-disc pl-5 text-sm text-slate-600 space-y-2">{product.features.map(f => <li key={f}>{f}</li>)}</ul>}
        <label className="flex gap-3 items-center text-sm font-semibold">Quantity<input type="number" min={1} max={99} value={quantity} onChange={e => setQuantity(Math.max(1, Math.min(99, Number(e.target.value) || 1)))} className="w-20 rounded-lg border border-slate-300 p-2" /></label>
        <div className="flex flex-wrap gap-3"><button disabled={!product.stock} onClick={() => onAddToCart(product, quantity)} className="bg-[#073faf] text-white rounded-xl px-6 py-3 font-bold disabled:opacity-40">Add to cart</button><button disabled={!product.stock} onClick={() => onBuyNow(product, quantity)} className="border border-[#073faf] text-[#073faf] rounded-xl px-6 py-3 font-bold disabled:opacity-40">Buy now</button></div>
        <p className="text-xs text-slate-500 leading-relaxed">{product.category === 'Digital Products' ? 'Confirm the plan, duration, account requirements and activation process before payment.' : 'Confirm the listed size, material, delivery charges and return eligibility before ordering.'} <a data-store-link href="/help/" className="underline text-blue-700">Shopping help</a></p>
      </div>
    </div>
    {product.specs && <section className="mt-10 max-w-3xl"><h2 className="text-2xl font-bold mb-4">Product specifications</h2><dl className="divide-y border border-slate-200 rounded-xl">{Object.entries(product.specs).map(([key, value]) => <div key={key} className="grid grid-cols-2 p-3 text-sm"><dt className="font-semibold">{key}</dt><dd className="text-slate-600">{value}</dd></div>)}</dl></section>}
    {related.length > 0 && <section className="mt-12"><h2 className="text-2xl font-bold mb-5">More in {product.category}</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{related.map(p => <a key={p.id} data-store-link href={productPath(p)} className="border border-slate-200 rounded-2xl p-4 hover:border-blue-400"><ProductImage src={p.image} alt={p.title} width={256} height={256} loading="lazy" className="aspect-square w-full object-contain mb-3" /><h3 className="font-semibold text-sm">{p.title}</h3><p className="text-blue-700 font-bold mt-2">PKR {p.price.toLocaleString('en-PK')}</p></a>)}</div></section>}
  </div>;
}
