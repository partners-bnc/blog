import { Link } from 'react-router-dom'
import { StoryblokComponent, StoryblokRichText, storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'

type Block = SbBlokData & Record<string, unknown>
const value = (blok: Block, key: string) => { const field = blok[key]; return typeof field === 'string' || typeof field === 'number' ? String(field) : '' }
const nested = (blok: Block, key: string) => { const field = blok[key]; return Array.isArray(field) ? field as SbBlokData[] : [] }

function ActionLink({ label, href, className = 'button' }: { label: string; href: string; className?: string }) {
  if (!label || !href) return null
  return href.startsWith('/') ? <Link className={className} to={href}>{label} <span aria-hidden="true">↗</span></Link> : <a className={className} href={href}>{label} <span aria-hidden="true">↗</span></a>
}

export function Page({ blok }: { blok: SbBlokData }) {
  const page = blok as Block
  return <div {...storyblokEditable(blok)}>{nested(page, 'body').map((child) => <StoryblokComponent blok={child} key={child._uid} />)}</div>
}

export function BlogPost({ blok }: { blok: SbBlokData }) {
  const post = blok as Block
  const date = value(post, 'date')
  return <article className="article page-container" {...storyblokEditable(blok)}>
    <Link className="back-link" to="/blog">← All posts</Link>
    <header className="article-header">
      <span className="section-label">{value(post, 'category')}</span>
      <h1>{value(post, 'title')}</h1>
      <p className="article-excerpt">{value(post, 'excerpt')}</p>
      <div className="article-meta"><span>By {value(post, 'author')}</span><span>{date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span><span>{value(post, 'read_time')} min read</span></div>
    </header>
    <img className="article-cover" src={value(post, 'cover_image_url')} alt="" />
    <div className="article-layout"><div className="article-body">{nested(post, 'body').map((child) => <StoryblokComponent blok={child} key={child._uid} />)}</div></div>
  </article>
}

export function Hero({ blok }: { blok: SbBlokData }) {
  const hero = blok as Block
  return <section className="home-hero page-container" {...storyblokEditable(blok)}><div><span className="section-label">{value(hero, 'eyebrow')}</span><h1>{value(hero, 'headline')}</h1><p>{value(hero, 'body')}</p><ActionLink label={value(hero, 'cta_label')} href={value(hero, 'cta_url')} /></div><div className="hero-note"><span>{value(hero, 'stat_label')}</span><strong>{value(hero, 'stat_value')}</strong><div className="hero-line" /></div></section>
}

export function FeaturedPost({ blok }: { blok: SbBlokData }) {
  const feature = blok as Block
  const href = value(feature, 'href')
  return <section className="featured-section page-container" {...storyblokEditable(blok)}><div className="featured-copy"><span className="section-label">{value(feature, 'eyebrow')}</span><h2>{value(feature, 'title')}</h2><p>{value(feature, 'summary')}</p><div className="meta-row"><span>{value(feature, 'category')}</span><ActionLink label="Read story" href={href} className="read-link" /></div></div><Link to={href || '/blog'} className="featured-image"><img src={value(feature, 'image_url')} alt="" /></Link></section>
}

export function RichText({ blok }: { blok: SbBlokData }) { const content = (blok as Block).content; return <div className="rich-text" {...storyblokEditable(blok)}>{content ? <StoryblokRichText document={content as Parameters<typeof StoryblokRichText>[0]['document']} /> : null}</div> }

export function ComparisonBlock({ blok }: { blok: SbBlokData }) { const comparison = blok as Block; return <figure className="comparison-block" {...storyblokEditable(blok)}><span className="section-label">{value(comparison, 'eyebrow')}</span><h2>{value(comparison, 'heading')}</h2><p>{value(comparison, 'summary')}</p><img src={value(comparison, 'image_url')} alt={value(comparison, 'alt')} /><figcaption>{value(comparison, 'caption')}</figcaption></figure> }

export function ImageBlock({ blok }: { blok: SbBlokData }) { const image = blok as Block; return <figure className="article-image" {...storyblokEditable(blok)}><img src={value(image, 'image_url')} alt={value(image, 'alt')} loading="lazy" />{value(image, 'caption') && <figcaption>{value(image, 'caption')}</figcaption>}</figure> }

export function RelatedPost({ blok }: { blok: SbBlokData }) { const related = blok as Block; const href = value(related, 'href'); return <section className="related-section" {...storyblokEditable(blok)}><span className="section-label">{value(related, 'eyebrow')}</span><h2>Related Posts</h2><Link className="related-card" to={href || '/blog'}><img src={value(related, 'image_url')} alt="" /><div><span>{value(related, 'category')}</span><h3>{value(related, 'title')}</h3><p>{value(related, 'summary')}</p><strong>Read article ↗</strong></div></Link></section> }

export function CtaBanner({ blok }: { blok: SbBlokData }) { const cta = blok as Block; return <section className="cta-banner" {...storyblokEditable(blok)}><span className="section-label">{value(cta, 'eyebrow')}</span><h2>{value(cta, 'heading')}</h2><p>{value(cta, 'body')}</p><ActionLink label={value(cta, 'button_label')} href={value(cta, 'button_url')} className="button button-light" /></section> }
