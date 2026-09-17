import React, { useState } from 'react';
import { Clock, Calendar, User, ArrowRight, X } from 'lucide-react';
import { blogPostsData } from '../data/storeData';
import { BlogPost } from '../types';

interface BlogScreenProps {
  onNavigateHome: () => void;
}

export const BlogScreen: React.FC<BlogScreenProps> = ({ onNavigateHome }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(null);

  const tags = ['All', 'Future-ready tech', 'Mobile', 'Workspace', 'Gaming', 'Audio', 'Smart Home'];

  const filteredPosts = selectedTag === 'All'
    ? blogPostsData
    : blogPostsData.filter((p) => p.tag.toLowerCase() === selectedTag.toLowerCase());

  return (
    <div className="wrap page py-10 md:py-14">
      {/* Breadcrumb */}
      <nav className="breadcrumb text-xs text-gray-400 font-medium mb-4 flex items-center gap-2">
        <button onClick={onNavigateHome} className="hover:text-[#073faf] cursor-pointer">
          Home
        </button>
        <span>/</span>
        <span className="text-gray-700 font-semibold">Insight Editorial</span>
      </nav>

      {/* Header */}
      <div className="max-w-2xl mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-[#073faf] block mb-2">
          INSIGHT JOURNAL
        </span>
        <h1 className="page-title text-3xl sm:text-4xl font-black text-[#101828] mb-3">
          Stories, buying guides & hardware breakdowns
        </h1>
        <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
          Deep dives into modern hardware trends, practical setups for your desk and kitchen, and clear advice on choosing technology that lasts.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedTag === tag
                ? 'bg-[#073faf] text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group bg-white border border-[#e7eaf0] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div 
                onClick={() => setActiveArticle(post)}
                className="w-full aspect-[16/10] overflow-hidden cursor-pointer bg-gray-100 relative"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#073faf] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                  {post.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h2 
                  onClick={() => setActiveArticle(post)}
                  className="font-black text-lg text-[#101828] group-hover:text-[#073faf] transition-colors leading-snug cursor-pointer line-clamp-2"
                >
                  {post.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Read button */}
            <div className="p-6 pt-0 border-t border-gray-100/50 mt-2">
              <button
                onClick={() => setActiveArticle(post)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#073faf] hover:text-[#082f87] transition-colors cursor-pointer mt-4"
              >
                <span>Read complete story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-10 my-8 border border-gray-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-[#073faf] bg-blue-50 px-3 py-1 rounded-full mb-3">
              {activeArticle.tag}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#101828] leading-tight mb-4">
              {activeArticle.title}
            </h1>

            <div className="flex items-center gap-4 text-xs text-gray-400 pb-4 border-b border-gray-100 mb-6">
              <span className="font-semibold text-gray-700">{activeArticle.author}</span>
              <span>•</span>
              <span>{activeArticle.date}</span>
              <span>•</span>
              <span>{activeArticle.readTime}</span>
            </div>

            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-6">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-4">
              <p className="font-medium text-gray-900 leading-relaxed text-base">
                {activeArticle.excerpt}
              </p>
              <p>{activeArticle.content}</p>
              <p>
                At Insight Store, we verify and test appliances and hardware in practical everyday environments before stocking them. When choosing tech products in Pakistan, verify the official distributor warranty stamp on the retail box and ensure consistent post-purchase customer service.
              </p>
            </div>

            <div className="pt-8 border-t border-gray-100 mt-8 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 rounded-xl bg-[#073faf] text-white text-xs font-bold hover:bg-[#082f87]"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
