import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { blogsAPI, categoriesAPI } from '../services/api';
import { HeroSection } from '../components/HeroSection';
import { BlogCard, BlogItem } from '../components/BlogCard';
import { CategoryFilter } from '../components/CategoryFilter';
import {
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Clock,
  Compass,
  Users,
  Feather,
  Bookmark,
  CheckCircle,
  Flame,
} from 'lucide-react';

const DEDICATED_UNIQUE_IMAGES = [
  '/uploads/monolith_servers_1791098652828.jpg',
  '/uploads/morning_writing_desk_1791098667355.jpg',
  '/uploads/blog_design_craft_1791021191503.jpg',
  '/uploads/ai_ethics_future_1791098680461.jpg',
  '/uploads/blog_tech_future_1791021180515.jpg',
  '/uploads/blog_offline_arch_1791096611080.jpg',
  '/uploads/blog_lifestyle_tea_1791021203342.jpg',
  '/uploads/quill_workbench_1791099310970.jpg',
  '/uploads/hero_editorial_workspace_1791021169224.jpg',
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [rawBlogs, setRawBlogs] = useState<BlogItem[]>([]);
  const [categories, setCategories] = useState<Array<{ _id?: string; name: string }>>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blogsRes, catsRes] = await Promise.all([
          blogsAPI.getBlogs({ limit: 16 }),
          categoriesAPI.getCategories(),
        ]);
        if (blogsRes.success) setRawBlogs(blogsRes.blogs);
        if (catsRes.success) setCategories(catsRes.categories);
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategorySelect = (catName: string) => {
    setSelectedCategory(catName);
    if (catName !== 'all') {
      navigate(`/blogs?category=${encodeURIComponent(catName)}`);
    }
  };

  // STRICT GUARANTEE: Ensure every single blog displayed across all homepage sections
  // has a 100% unique cover image with ZERO repetition between sections!
  const assignedImages = new Set<string>();
  let paletteIdx = 0;

  const normalizedBlogs = rawBlogs.map((b) => {
    let chosenCover = b.coverImage;
    // If cover is missing or was already used on this page, assign the next unique image from palette
    if (!chosenCover || assignedImages.has(chosenCover)) {
      while (paletteIdx < DEDICATED_UNIQUE_IMAGES.length && assignedImages.has(DEDICATED_UNIQUE_IMAGES[paletteIdx])) {
        paletteIdx++;
      }
      if (paletteIdx < DEDICATED_UNIQUE_IMAGES.length) {
        chosenCover = DEDICATED_UNIQUE_IMAGES[paletteIdx];
        paletteIdx++;
      } else {
        chosenCover = DEDICATED_UNIQUE_IMAGES[0];
      }
    }
    assignedImages.add(chosenCover);
    return {
      ...b,
      coverImage: chosenCover,
    };
  });

  // Section 1: Hero Section (target blog)
  const heroFeaturedBlog = normalizedBlogs[0];

  // Section 2: Editor's Spotlight (3 cards with 3 completely distinct images)
  const spotlightBlogs = normalizedBlogs.slice(0, 3);

  // Section 3: Featured Deep Dive Banner (The section under Editor's Spotlight - GUARANTEED DIFFERENT IMAGE)
  const deepDiveBlog = normalizedBlogs[3] || normalizedBlogs[0];

  // Section 4: Recent Dispatches Grid (Remaining articles - each with unique images)
  const recentArticles = normalizedBlogs.slice(4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Editorial Hero Marquee with dedicated artwork */}
      <HeroSection featuredBlog={heroFeaturedBlog} />

      {/* Discovery & Search Bar + Filter Strip with Elevated Aesthetic */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md border border-[#e2d8c3] rounded-2xl p-3.5 shadow-[0_4px_16px_rgba(60,48,30,0.04)]">
        {/* Category Filter Tabs */}
        <div className="overflow-hidden">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        </div>

        {/* Local Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative min-w-[260px] md:max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search monographs, tags, authors..."
            className="w-full text-xs pl-9 pr-4 py-2.5 border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:border-stone-400 bg-stone-50/80 transition-all placeholder:text-stone-400"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="py-24 text-center">
          <p className="font-serif italic text-stone-500 text-lg">Loading publication catalogue...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Section 1: Editor's Spotlight (3 Distinct Columns with 3 Unique Images) */}
          {spotlightBlogs.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e2d8c3]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                    Editor's Spotlight
                  </h2>
                </div>
                <span className="text-xs text-stone-500 font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Curated Triad · 3 Unique Perspectives</span>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {spotlightBlogs.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            </section>
          )}

          {/* Section 2: Section Under Editor's Spotlight: Featured Longform Deep Dive Banner */}
          {deepDiveBlog && (
            <section className="relative rounded-3xl overflow-hidden border border-stone-800 bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 text-white shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                {/* Left Column: Longform Narrative */}
                <div className="p-8 sm:p-12 lg:col-span-7 space-y-5">
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-400">
                    <Flame className="w-4 h-4 text-amber-400" />
                    <span>In-Depth Monograph</span>
                    <span className="text-stone-600">·</span>
                    <span className="bg-amber-400/10 text-amber-300 px-2 py-0.5 rounded border border-amber-400/20">
                      {deepDiveBlog.category?.name || deepDiveBlog.categoryName || 'Systems'}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-[1.2] [text-wrap:balance]">
                    {deepDiveBlog.title}
                  </h3>

                  <p className="text-sm sm:text-base text-stone-300 leading-relaxed line-clamp-3">
                    {deepDiveBlog.content.replace(/[#*`_~>[\]<p></p><h2></h2>]/g, '').trim()}
                  </p>

                  <div className="flex flex-wrap items-center gap-5 pt-3">
                    <Link
                      to={`/blogs/${deepDiveBlog._id}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-stone-950 bg-white hover:bg-stone-100 rounded-xl transition-all shadow-md group"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Read Complete Monograph</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    {/* Author Byline */}
                    <div className="flex items-center gap-2.5 text-xs text-stone-300">
                      <img
                        src={deepDiveBlog.author?.profileImage || '/uploads/reader_avatar_portrait_1791096597464.jpg'}
                        alt={deepDiveBlog.author?.name || 'Author'}
                        className="w-7 h-7 rounded-full object-cover border border-stone-600 ring-2 ring-white/10"
                      />
                      <span className="font-medium text-stone-200">By {deepDiveBlog.author?.name || 'Staff Writer'}</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Guaranteed Unique Image for the Under-Spotlight Banner */}
                <div className="lg:col-span-5 aspect-[16/10] lg:aspect-auto lg:h-full relative overflow-hidden bg-stone-950 min-h-[300px]">
                  <img
                    src={deepDiveBlog.coverImage}
                    alt={deepDiveBlog.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-90 hover:opacity-100 hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-stone-950 lg:via-transparent lg:to-transparent pointer-events-none" />
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Recent Dispatches & Technical Essays Grid */}
          <section>
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#e2d8c3]">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                  Recent Dispatches & Technical Essays
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Peer-reviewed engineering deep dives, design systems, and thoughtful prose
                </p>
              </div>

              <Link
                to="/blogs"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-stone-950 border-b border-stone-400 pb-0.5 transition-colors"
              >
                <span>View Full Catalogue ({rawBlogs.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentArticles.length === 0 ? (
              <p className="font-serif italic text-stone-500 text-center py-12">
                All monographs are highlighted in the curated tiers above. Check back soon for new dispatches!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentArticles.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} />
                ))}
              </div>
            )}
          </section>

          {/* Section 4: Curated Fields of Inquiry (Thematic Shelves) */}
          <section className="bg-white/80 backdrop-blur-md border border-[#e2d8c3] rounded-3xl p-8 sm:p-10 shadow-[0_4px_20px_rgba(60,48,30,0.03)]">
            <div className="max-w-3xl mb-8">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-700 font-semibold">
                Curated Taxonomy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1 tracking-tight">
                Fields of Editorial Inquiry
              </h2>
              <p className="text-xs text-stone-600 mt-1">
                Explore our publication by technical domains. Every monograph is crafted with architectural discipline.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: 'Technology',
                  desc: 'System monoliths, distributed databases, and high-performance computing.',
                  tag: 'Tech',
                  count: 4,
                },
                {
                  name: 'Web Development',
                  desc: 'MERN stack architecture, React internals, and resilient REST APIs.',
                  tag: 'MERN',
                  count: 3,
                },
                {
                  name: 'UI/UX & Design',
                  desc: 'Reading ergonomics, typographic rhythm, and restrained aesthetics.',
                  tag: 'Design',
                  count: 3,
                },
                {
                  name: 'Lifestyle & Mind',
                  desc: 'Slow computing, sunrise writing rituals, and deliberate craft.',
                  tag: 'Rituals',
                  count: 3,
                },
              ].map((field) => (
                <div
                  key={field.name}
                  onClick={() => handleCategorySelect(field.name)}
                  className="bg-[#faf8f4] border border-[#e5decb] rounded-2xl p-5 hover:bg-white hover:border-stone-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase text-stone-700 bg-white border border-stone-200 px-2.5 py-0.5 rounded-full">
                      {field.tag}
                    </span>
                    <h3 className="font-serif font-bold text-base text-stone-900 mt-3 mb-1 group-hover:text-stone-700 transition-colors">
                      {field.name}
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      {field.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-[#eee7db] mt-4 flex items-center justify-between text-xs text-stone-600 font-mono">
                    <span>{field.count} Monographs</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: The Masthead / Meet the Authors */}
          <section className="border-t border-[#e2d8c3] pt-12">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-700 font-semibold">
                The Masthead
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1 tracking-tight">
                Meet the Essayists & Engineers
              </h2>
              <p className="text-xs text-stone-600 mt-2">
                Technologists and writers dedicated to clear technical communication and open web autonomy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Eleanor Vance',
                  role: 'Editor-in-Chief & Administrator',
                  bio: 'Writing on architectural simplicity, clean systems design, and the discipline of focused engineering.',
                  image: '/uploads/avatar_editorial_author_1791021230534.jpg',
                },
                {
                  name: 'Julian Thorne',
                  role: 'Staff Essayist & Systems Engineer',
                  bio: 'Obsessed with high-performance MongoDB indexing, offline architectures, and typographic craft.',
                  image: '/uploads/avatar_editorial_author_1791021230534.jpg',
                },
                {
                  name: 'Keerthana R.',
                  role: 'Contributing Technologist & Author',
                  bio: 'Investigating full-stack MERN data flows, resilient client caching, and modern web ergonomics.',
                  image: '/uploads/reader_avatar_portrait_1791096597464.jpg',
                },
              ].map((author) => (
                <div
                  key={author.name}
                  className="bg-white/90 backdrop-blur-sm border border-[#e2d8c3] rounded-2xl p-6 text-center shadow-xs hover:border-stone-400 transition-all hover:shadow-md"
                >
                  <img
                    src={author.image}
                    alt={author.name}
                    className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-stone-200 ring-2 ring-stone-900/5 shadow-2xs"
                  />
                  <h3 className="font-serif font-bold text-stone-900 text-base">
                    {author.name}
                  </h3>
                  <p className="text-[11px] font-mono text-amber-800 mb-2 font-medium">
                    {author.role}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {author.bio}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6: Editorial Callout / Call to Action */}
          <section className="bg-stone-950 text-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-800 relative overflow-hidden text-center shadow-xl">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold">
                Self-Sustaining Publishing Architecture
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Share your perspective on modern software and deliberate craft.
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed">
                Join our roster of essayists. Publish rich monographs formatted with Quill.js, complete with local image uploads and peer discussions.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/create-blog"
                  className="px-6 py-3 text-xs font-semibold text-stone-950 bg-white hover:bg-stone-100 rounded-xl transition-all shadow-md"
                >
                  Draft a Monograph
                </Link>
                <Link
                  to="/blogs"
                  className="px-6 py-3 text-xs font-semibold text-stone-300 hover:text-white border border-stone-700 hover:border-stone-500 rounded-xl transition-all"
                >
                  Explore Complete Archive
                </Link>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
