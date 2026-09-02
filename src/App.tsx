import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation, useParams } from 'react-router-dom'
import { StoryblokComponent, useStoryblok, useStoryblokApi } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import './App.css'
import { storyblokContentVersion } from './storyblok/config.ts'

type Story = {
  id: number
  name: string
  slug: string
  full_slug: string
  content: SbBlokData
}

type StoriesResponse = { stories?: Story[] }

function App() {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/post/:slug" element={<BlogPostPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
    </div>
  )
}

function SiteHeader() {
  const location = useLocation()
  const navItems = ['Carbon Credits', 'IFRS Service', 'Sustaind Consulting', 'ESG Advisory', 'Climate Risk', 'Sustainability']

  return (
    <>
      <header className="site-header page-container">
        <Link to="/" className="sustaind-logo" aria-label="Sustaind home">
          <span>sustaind</span><i aria-hidden="true" />
        </Link>
        <nav className="top-nav" aria-label="Main navigation">
          <NavLink to="/blog" className={({ isActive }) => isActive ? 'active' : ''}>All Posts</NavLink>
          {navItems.map((item) => <a href="#topics" key={item}>{item}</a>)}
        </nav>
        <button className="menu-button" type="button" aria-label="Open navigation">☰</button>
      </header>
      <div className="topic-strip page-container" id="topics">
        <NavLink to="/blog" className={location.pathname === '/blog' ? 'active' : ''}>All Posts</NavLink>
        {navItems.map((item) => <a href="#topics" key={item}>{item}</a>)}
      </div>
    </>
  )
}

function HomePage() {
  const story = useStoryblok('home', { version: storyblokContentVersion }) as Story | undefined
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    if (story) return
    const timer = window.setTimeout(() => setTimedOut(true), 8000)
    return () => window.clearTimeout(timer)
  }, [story])

  if (timedOut) return <ErrorState message="The home story is missing or unavailable in the configured Storyblok space." />
  return story ? <StoryblokComponent blok={story.content} /> : <LoadingState label="Loading Sustaind…" />
}

function BlogIndex() {
  const api = useStoryblokApi()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    api.get('cdn/stories', { version: storyblokContentVersion, starts_with: 'blog/', per_page: 24, sort_by: 'first_published_at:desc' })
      .then((response) => {
        if (!mounted) return
        const data = response.data as StoriesResponse | undefined
        setStories(data?.stories ?? [])
        setLoading(false)
      })
      .catch(() => {
        if (mounted) { setError(`We could not load the ${storyblokContentVersion} articles. Check the Storyblok delivery token.`); setLoading(false) }
      })
    return () => { mounted = false }
  }, [api])

  return (
    <section className="archive page-container">
      <div className="archive-heading">
        <span className="section-label">All posts</span>
        <h1>Ideas for a more sustainable future.</h1>
        <p>Research, guidance, and practical perspectives for carbon markets, climate risk, ESG, and sustainable growth.</p>
      </div>
      {loading && <LoadingState label={`Fetching ${storyblokContentVersion} articles…`} />}
      {error && <ErrorState message={error} />}
      {!loading && !error && stories.length === 0 && <ErrorState message={`No ${storyblokContentVersion} stories are available yet.`} />}
      <div className="post-grid">{stories.map((story) => <PostCard key={story.id} story={story} />)}</div>
    </section>
  )
}

function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  return <BlogPostRequest key={slug ?? 'missing'} slug={slug} />
}

function BlogPostRequest({ slug }: { slug?: string }) {
  const story = useStoryblok(`blog/${slug ?? ''}`, { version: storyblokContentVersion }) as Story | undefined

  if (!story) return <LoadingState label={`Loading ${storyblokContentVersion} article…`} />
  return <StoryblokComponent blok={story.content} />
}

function PostCard({ story }: { story: Story }) {
  const content = story.content as SbBlokData & { title?: string; excerpt?: string; category?: string; cover_image_url?: string; read_time?: string }
  return (
    <article className="post-card">
      <Link to={`/post/${story.slug}`} className="post-card-image"><img src={content.cover_image_url} alt="" loading="lazy" /></Link>
      <div className="post-card-copy">
        <div className="meta-row"><span>{content.category}</span><span>{content.read_time} min read</span></div>
        <h2><Link to={`/post/${story.slug}`}>{content.title ?? story.name}</Link></h2>
        <p>{content.excerpt}</p>
        <Link to={`/post/${story.slug}`} className="read-link">Read article <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container footer-inner">
        <div>
          <Link to="/" className="sustaind-logo"><span>sustaind</span><i aria-hidden="true" /></Link>
          <p>Sustainable Growth, Measurable Impact.</p>
          <div className="social-links"><a href="https://www.linkedin.com" aria-label="LinkedIn">in</a><a href="https://www.instagram.com" aria-label="Instagram">◎</a><a href="https://www.youtube.com" aria-label="YouTube">▶</a></div>
        </div>
        <div className="footer-contact"><strong>Get in touch</strong><a href="tel:+919810575613">+91-98105-75613</a><a href="mailto:summit@sustaind.in">summit@sustaind.in</a><span>ILD Trade Centre, Sohna Road,<br />Gurugram, Haryana – 122018, India</span></div>
        <div className="footer-contact"><strong>Explore</strong><Link to="/blog">Blogs</Link><a href="#topics">Services</a><a href="#topics">Privacy Policy</a></div>
      </div>
      <div className="footer-bottom page-container"><span>© 2026 Sustaind India</span><span>Sustainable Growth, Measurable Impact.</span></div>
    </footer>
  )
}

function LoadingState({ label }: { label: string }) { return <div className="state-card page-container">{label}</div> }
function ErrorState({ message }: { message: string }) { return <div className="state-card error-state page-container" role="alert"><strong>Storyblok needs a little attention.</strong><span>{message}</span></div> }
function NotFound() { return <section className="not-found page-container"><span className="section-label">404 / Not found</span><h1>This page has not been published.</h1><p>Return to the Sustaind journal to browse the available climate and sustainability insights.</p><Link className="read-link" to="/blog">Browse all posts <span aria-hidden="true">↗</span></Link></section> }

export default App
