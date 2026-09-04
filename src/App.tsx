import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom'
import { StoryblokComponent, useStoryblok } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { ArrowLeft, ArrowRight, Calendar, Clock, User, Search, BookOpen, AlertCircle } from 'lucide-react'
import './App.css'
import { storyblokContentVersion } from './storyblok/config.ts'
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'

type Story = {
  id: number
  uuid?: string
  name: string
  slug: string
  full_slug: string
  content: SbBlokData & Record<string, unknown>
  first_published_at?: string
  is_folder?: boolean
}

const STORYBLOK_TOKEN = import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN || import.meta.env.VITE_STORYBLOK_ACCESS_TOKEN
const API_BASE = 'https://api.storyblok.com/v2/cdn'

function resolveImageUrl(image: unknown): string {
  if (!image) return ''
  const url = typeof image === 'object' && image !== null
    ? (image as Record<string, unknown>).filename as string || (image as Record<string, unknown>).url as string || ''
    : typeof image === 'string' ? image : ''
  if (typeof url !== 'string' || !url.trim()) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url
  return url.startsWith('/') ? url : `/${url}`
}

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 antialiased font-sans selection:bg-[#1D67CD] selection:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-grow outline-none">
        <Routes>
          <Route path="/" element={<Navigate to="/blog" replace />} />
          <Route path="/blog" element={<BlogHomePage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/post/:slug" element={<PostRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function PostRedirect() {
  const { slug } = useParams<{ slug: string }>()
  return <Navigate to={`/blog/${slug ?? ''}`} replace />
}

/* =========================================================================
   Blog Home Page – Storyblok home story + article listing
   ========================================================================= */
function BlogHomePage() {
  const story = useStoryblok('home', { version: storyblokContentVersion }) as Story | undefined
  const [posts, setPosts] = useState<Story[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (story) return
    const timer = window.setTimeout(() => setTimedOut(true), 8000)
    return () => window.clearTimeout(timer)
  }, [story])

  useEffect(() => {
    async function loadPosts() {
      setPostsLoading(true)
      try {
        const params = new URLSearchParams({
          token: STORYBLOK_TOKEN,
          version: storyblokContentVersion,
          starts_with: 'blog/',
          per_page: '100',
          cv: Date.now().toString(),
        })
        const res = await fetch(`${API_BASE}/stories?${params.toString()}`)
        if (!res.ok) throw new Error(`Failed to fetch stories: ${res.status}`)
        const data = await res.json()
        const validPosts = (data.stories || []).filter(
          (s: Story) => !s.is_folder && s.content && s.content.component === 'blog_post'
        )
        setPosts(validPosts)
      } catch (err) {
        console.error('Error loading blog posts:', err)
      } finally {
        setPostsLoading(false)
      }
    }
    loadPosts()
  }, [])

  if (timedOut) return <ErrorState message="The home story is missing or unavailable in the configured Storyblok space." />

  const categories = ['All', ...new Set(posts.map((p) => p.content?.category as string).filter(Boolean))]
  const filteredPosts = posts.filter((post) => {
    const title = (post.content?.title as string) || post.name || ''
    const excerpt = (post.content?.excerpt as string) || ''
    const category = (post.content?.category as string) || ''
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Home story body blocks (Hero, Featured, CTA, etc.) */}
        {!story ? (
          <div className="space-y-8 animate-pulse">
            <div className="h-96 bg-slate-200 rounded-3xl" />
          </div>
        ) : (
          <StoryblokComponent blok={story.content} />
        )}

        {/* All Publications Section */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-2 block">
                All Publications
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-display">
                Latest Insights & Articles
              </h2>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>

              {categories.length > 1 && (
                <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        selectedCategory === category
                          ? 'bg-white text-teal-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Blog Post Grid */}
          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-80 bg-slate-200 rounded-2xl" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-slate-800 mb-1">No articles found</h3>
              <p className="text-sm text-slate-500">
                {searchQuery ? 'Try clearing your search filters.' : 'New articles will be published soon.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => {
                const content = post.content || {}
                const title = (content.title as string) || post.name
                const excerpt = (content.excerpt as string) || ''
                const category = content.category as string
                const author = content.author as string
                const readTime = content.read_time as string
                const date = (content.date as string) || post.first_published_at
                const slug = post.slug
                const coverImageUrl = content.cover_image_url as string

                return (
                  <article
                    key={post.uuid || post.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-teal-500/50"
                  >
                    {coverImageUrl && (
                      <Link to={`/blog/${slug}`} className="block relative h-48 overflow-hidden bg-slate-100">
                        <img
                          src={resolveImageUrl(coverImageUrl)}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </Link>
                    )}

                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          {category && (
                            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-1 rounded-md">
                              {category}
                            </span>
                          )}
                          {readTime && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {readTime} min read
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors font-display mb-3 leading-snug line-clamp-2">
                          <Link to={`/blog/${slug}`}>{title}</Link>
                        </h3>

                        {excerpt && (
                          <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                            {excerpt}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          {author && (
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <User className="w-3.5 h-3.5 text-slate-400" /> {author}
                            </span>
                          )}
                          {date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/blog/${slug}`}
                          className="text-teal-600 group-hover:text-teal-700 font-semibold inline-flex items-center gap-1"
                        >
                          Read <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   Blog Post Page
   ========================================================================= */
function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  return <BlogPostRequest key={slug ?? 'missing'} slug={slug} />
}

function BlogPostRequest({ slug }: { slug?: string }) {
  const story = useStoryblok(`blog/${slug ?? ''}`, { version: storyblokContentVersion }) as Story | undefined

  if (!story) return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-12 w-3/4 bg-slate-200 rounded-lg" />
          <div className="h-6 w-1/2 bg-slate-200 rounded" />
          <div className="h-80 bg-slate-200 rounded-2xl" />
          <div className="space-y-4 pt-8">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-4 bg-slate-200 rounded w-4/6" />
          </div>
        </div>
      </div>
    </div>
  )
  return <StoryblokComponent blok={story.content} />
}

/* =========================================================================
   Utility Components
   ========================================================================= */
function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg">
        <AlertCircle className="w-14 h-14 text-teal-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 font-display mb-2">Content Unavailable</h1>
        <p className="text-slate-600 text-sm mb-6">{message}</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all shadow-md text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Insights
        </Link>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg">
        <AlertCircle className="w-14 h-14 text-teal-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 font-display mb-2">Page Not Found</h1>
        <p className="text-slate-600 text-sm mb-6">This page has not been published or does not exist.</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold transition-all shadow-md text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse All Insights
        </Link>
      </div>
    </div>
  )
}

export default App
