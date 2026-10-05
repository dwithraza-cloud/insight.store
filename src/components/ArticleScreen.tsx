import React from 'react';
import type { BlogPost } from '../types';
import { activeDepartments, categoryPath } from '../seo/catalog';
export function ArticleScreen({ article }: { article: BlogPost }) {
  return <article className="wrap py-10 md:py-14"><div className="max-w-3xl mx-auto">
    <nav aria-label="Breadcrumb" className="text-xs text-slate-500 mb-6"><a data-store-link href="/">Home</a> / <a data-store-link href="/blog/">Buying guides</a></nav>
    <p className="text-xs text-blue-700 font-bold uppercase mb-3">{article.tag}</p>
    <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{article.title}</h1>
    <p className="text-sm text-slate-500 mb-6">{article.author}</p>
    <img src={article.image} alt={article.title} width={900} height={563} loading="eager" className="w-full aspect-[16/10] object-cover rounded-2xl mb-8" />
    <p className="text-lg text-slate-700 leading-relaxed mb-6">{article.excerpt}</p>
    <div className="space-y-5 text-slate-600 leading-relaxed">{(article.content || '').split('\n\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}</div>
    <section className="mt-10 border-t pt-6"><h2 className="text-xl font-bold mb-4">Explore the collection</h2><div className="flex flex-wrap gap-3">{activeDepartments.slice(0, 6).map(d => <a key={d.id} data-store-link href={categoryPath(d.name)} className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-700">{d.name}</a>)}</div><p className="mt-5 text-sm">Need a product detail confirmed? <a data-store-link href="/contact/" className="underline text-blue-700">Contact Insight Store</a>.</p></section>
  </div></article>;
}
