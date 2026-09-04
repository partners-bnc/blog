import { Link } from 'react-router-dom'
import { StoryblokComponent, storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'
import { ArrowRight, ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react'
import type { ReactNode } from 'react'

type Block = SbBlokData & Record<string, unknown>

const value = (blok: Block, key: string) => {
  const field = blok[key]
  return typeof field === 'string' || typeof field === 'number' ? String(field) : ''
}

const imageUrl = (blok: Block, ...keys: string[]) => {
  for (const key of keys) {
    const field = blok[key]
    if (typeof field === 'string' && field) return field
    if (typeof field === 'object' && field !== null) {
      if ('filename' in field && typeof (field as { filename?: unknown }).filename === 'string' && (field as { filename: string }).filename) {
        return (field as { filename: string }).filename
      }
      if ('url' in field && typeof (field as { url?: unknown }).url === 'string' && (field as { url: string }).url) {
        return (field as { url: string }).url
      }
    }
  }
  return ''
}

const imageAlt = (blok: Block, defaultAlt: string, ...keys: string[]) => {
  for (const key of keys) {
    const field = blok[key]
    if (typeof field === 'object' && field !== null && 'alt' in field && typeof (field as { alt?: unknown }).alt === 'string' && (field as { alt: string }).alt) {
      return (field as { alt: string }).alt
    }
  }
  return value(blok, 'alt') || defaultAlt
}

function normalizeHref(href: string) {
  if (!href) return '/blog'
  if (href.startsWith('/post/')) return href.replace('/post/', '/blog/')
  if (href.startsWith('post/')) return href.replace('post/', '/blog/')
  return href
}

function resolveImageUrl(image: unknown): string {
  if (!image) return ''
  const url = typeof image === 'object' && image !== null
    ? (image as Record<string, unknown>).filename as string || (image as Record<string, unknown>).url as string || ''
    : typeof image === 'string' ? image : ''
  if (typeof url !== 'string' || !url.trim()) return ''
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//')) return url
  return url.startsWith('/') ? url : `/${url}`
}

const nested = (blok: Block, key: string) => {
  const field = blok[key]
  return Array.isArray(field) ? (field as SbBlokData[]) : []
}

/* =========================================================================
   Page – renders body blocks
   ========================================================================= */
export function Page({ blok }: { blok: SbBlokData }) {
  const page = blok as Block
  return (
    <div {...storyblokEditable(blok)}>
      {nested(page, 'body').map((child) => (
        <StoryblokComponent blok={child} key={child._uid} />
      ))}
    </div>
  )
}

/* =========================================================================
   BlogPost – full article layout (BNC production styling)
   ========================================================================= */
export function BlogPost({ blok }: { blok: SbBlokData }) {
  const post = blok as Block
  const title = value(post, 'title')
  const excerpt = value(post, 'excerpt')
  const category = value(post, 'category')
  const author = value(post, 'author')
  const date = value(post, 'date')
  const readTime = value(post, 'read_time')
  const cover = imageUrl(post, 'cover_image_url', 'cover_image', 'image_url', 'image')

  return (
    <div className="min-h-screen bg-white" {...storyblokEditable(blok)}>
      {/* Article Header */}
      <header className="bg-slate-50 border-b border-slate-200/80 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Insights
          </Link>

          {/* Category Badge */}
          {category && (
            <div className="mb-4">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 border border-teal-200 px-3 py-1 rounded-full">
                {category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight font-display mb-6 leading-[1.2]">
            {title}
          </h1>

          {/* Excerpt / Lead */}
          {excerpt && (
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-sans mb-8">
              {excerpt}
            </p>
          )}

          {/* Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 text-xs sm:text-sm text-slate-600">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              {author && (
                <div className="flex items-center gap-2 font-medium text-slate-900">
                  <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs font-bold">
                    {author.charAt(0)}
                  </div>
                  {author}
                </div>
              )}
              {date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
              )}
              {readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {readTime} min read
                </div>
              )}
            </div>

            <ShareButton />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Cover Image */}
        {cover && (
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 mb-12 shadow-sm bg-slate-100">
            <img
              src={resolveImageUrl(cover)}
              alt={imageAlt(post, title, 'cover_image_url', 'cover_image')}
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        {/* Dynamic Storyblok Blocks */}
        <div className="article-body">
          {nested(post, 'body').map((child) => (
            <StoryblokComponent blok={child} key={child._uid} />
          ))}
        </div>
      </main>
    </div>
  )
}

function ShareButton() {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: document.title, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }
  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 transition-all text-xs font-semibold shadow-sm active:scale-95 cursor-pointer"
    >
      <Share2 className="w-3.5 h-3.5" />
      Share
    </button>
  )
}

/* =========================================================================
   Hero – dark teal/blue gradient (BNC production styling)
   ========================================================================= */
export function Hero({ blok }: { blok: SbBlokData }) {
  const hero = blok as Block
  const linkUrl = normalizeHref(value(hero, 'cta_url'))
  const isExternal = linkUrl.startsWith('http') || linkUrl.startsWith('mailto:')

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0F2830] via-[#163842] to-[#0A1E24] text-white p-8 sm:p-12 lg:p-16 mb-12 shadow-2xl border border-teal-900/40" {...storyblokEditable(blok)}>
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {value(hero, 'eyebrow') && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-400/30 text-teal-300 text-xs font-semibold tracking-wider uppercase mb-6">
            {value(hero, 'eyebrow')}
          </div>
        )}

        {value(hero, 'headline') && (
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 font-display leading-[1.15]">
            {value(hero, 'headline')}
          </h1>
        )}

        {value(hero, 'body') && (
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl font-sans font-normal">
            {value(hero, 'body')}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-6">
          {value(hero, 'cta_label') && (
            isExternal ? (
              <a href={linkUrl} className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold transition-all shadow-lg hover:shadow-teal-500/25 active:scale-95">
                {value(hero, 'cta_label')}
                <ArrowRight className="w-4 h-4" />
              </a>
            ) : (
              <Link to={linkUrl} className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold transition-all shadow-lg hover:shadow-teal-500/25 active:scale-95">
                {value(hero, 'cta_label')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )
          )}

          {(value(hero, 'stat_label') || value(hero, 'stat_value')) && (
            <div className="border-l border-teal-800/80 pl-6 py-1">
              {value(hero, 'stat_value') && (
                <div className="text-sm sm:text-base font-bold text-teal-300 tracking-wider uppercase">
                  {value(hero, 'stat_value')}
                </div>
              )}
              {value(hero, 'stat_label') && (
                <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
                  {value(hero, 'stat_label')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   FeaturedPost – large rounded card (BNC production styling)
   ========================================================================= */
export function FeaturedPost({ blok }: { blok: SbBlokData }) {
  const feature = blok as Block
  const href = normalizeHref(value(feature, 'href') || (value(feature, 'slug') ? `/blog/${value(feature, 'slug')}` : '/blog'))
  const img = imageUrl(feature, 'image_url', 'image', 'cover_image_url')
  const isExternal = href.startsWith('http')

  const content = (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0 group-hover:border-teal-500/50" {...storyblokEditable(blok)}>
      <div className="lg:col-span-7 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {value(feature, 'eyebrow') && (
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full">
                {value(feature, 'eyebrow')}
              </span>
            )}
            {value(feature, 'category') && (
              <span className="text-xs font-medium text-slate-500">
                {value(feature, 'category')}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors font-display mb-4 leading-snug">
            {value(feature, 'title')}
          </h2>

          {value(feature, 'summary') && (
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 line-clamp-3">
              {value(feature, 'summary')}
            </p>
          )}
        </div>

        <div className="inline-flex items-center gap-2 text-teal-600 font-semibold group-hover:text-teal-700 transition-colors">
          Read article
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>

      <div className="lg:col-span-5 relative min-h-[260px] bg-slate-100 overflow-hidden flex items-center justify-center">
        {img ? (
          <img
            src={resolveImageUrl(img)}
            alt={imageAlt(feature, value(feature, 'title'), 'image_url', 'image')}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-teal-800 to-slate-900 flex items-center justify-center p-8">
            <span className="text-teal-200/50 font-display text-2xl font-bold">BNC Insights</span>
          </div>
        )}
      </div>
    </div>
  )

  return isExternal ? (
    <a href={href} className="block group mb-12" target="_blank" rel="noopener noreferrer">{content}</a>
  ) : (
    <Link to={href} className="block group mb-12">{content}</Link>
  )
}

/* =========================================================================
   RichText – ProseMirror rich text renderer (BNC production styling)
   ========================================================================= */

interface RichTextNode {
  type: string
  content?: RichTextNode[]
  text?: string
  marks?: { type: string; attrs?: Record<string, unknown> }[]
  attrs?: Record<string, unknown>
}

function renderNode(node: RichTextNode, index: number): ReactNode {
  if (!node) return null

  switch (node.type) {
    case 'heading': {
      const level = (node.attrs?.level as number) || 2
      const text = renderChildNodes(node.content)
      const headingClasses: Record<number, string> = {
        1: 'text-3xl sm:text-4xl font-bold text-slate-900 mt-10 mb-5 font-display tracking-tight',
        2: 'text-2xl sm:text-3xl font-bold text-slate-900 mt-8 mb-4 font-display tracking-tight',
        3: 'text-xl sm:text-2xl font-semibold text-slate-900 mt-6 mb-3 font-display',
        4: 'text-lg sm:text-xl font-semibold text-slate-900 mt-5 mb-2 font-display',
        5: 'text-base sm:text-lg font-semibold text-slate-900 mt-4 mb-2 font-display',
        6: 'text-sm sm:text-base font-semibold text-slate-900 mt-3 mb-1 font-display',
      }
      const cls = headingClasses[level] || headingClasses[2]
      if (level === 1) return <h1 key={index} className={cls}>{text}</h1>
      if (level === 3) return <h3 key={index} className={cls}>{text}</h3>
      if (level === 4) return <h4 key={index} className={cls}>{text}</h4>
      if (level === 5) return <h5 key={index} className={cls}>{text}</h5>
      if (level === 6) return <h6 key={index} className={cls}>{text}</h6>
      return <h2 key={index} className={cls}>{text}</h2>
    }
    case 'paragraph':
      return <p key={index} className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6 font-sans">{renderChildNodes(node.content)}</p>
    case 'bullet_list':
      return (
        <ul key={index} className="list-disc pl-6 space-y-2 mb-6 text-base sm:text-lg text-slate-700">
          {node.content?.map((item, i) => <li key={i} className="leading-relaxed">{renderChildNodes(item.content)}</li>)}
        </ul>
      )
    case 'ordered_list':
      return (
        <ol key={index} className="list-decimal pl-6 space-y-2 mb-6 text-base sm:text-lg text-slate-700">
          {node.content?.map((item, i) => <li key={i} className="leading-relaxed">{renderChildNodes(item.content)}</li>)}
        </ol>
      )
    case 'list_item':
      return <span key={index}>{renderChildNodes(node.content)}</span>
    case 'blockquote':
      return <blockquote key={index} className="border-l-4 border-teal-600 pl-4 py-2 my-6 italic text-slate-800 bg-slate-50/70 rounded-r-lg">{renderChildNodes(node.content)}</blockquote>
    case 'code_block':
      return <pre key={index} className="bg-slate-900 text-slate-100 p-4 rounded-xl my-6 overflow-x-auto text-sm font-mono"><code>{renderChildNodes(node.content)}</code></pre>
    case 'horizontal_rule':
      return <hr key={index} className="my-8 border-slate-200" />
    default:
      if (node.content) return <div key={index}>{renderChildNodes(node.content)}</div>
      return null
  }
}

function renderChildNodes(children?: RichTextNode[]): ReactNode {
  if (!children || !Array.isArray(children)) return null
  return children.map((child, index) => {
    if (child.type === 'text') {
      let element: ReactNode = <span key={index}>{child.text}</span>
      if (child.marks && Array.isArray(child.marks)) {
        child.marks.forEach((mark) => {
          if (mark.type === 'bold') element = <strong key={index} className="font-semibold text-slate-900">{element}</strong>
          else if (mark.type === 'italic') element = <em key={index} className="italic">{element}</em>
          else if (mark.type === 'underline') element = <u key={index} className="underline">{element}</u>
          else if (mark.type === 'strike') element = <s key={index} className="line-through">{element}</s>
          else if (mark.type === 'code') element = <code key={index} className="bg-slate-100 text-teal-700 px-1.5 py-0.5 rounded text-sm font-mono">{element}</code>
          else if (mark.type === 'link') {
            const href = (mark.attrs?.href as string) || '#'
            const isExt = href.startsWith('http')
            element = (
              <a key={index} href={href} target={isExt ? '_blank' : undefined} rel={isExt ? 'noopener noreferrer' : undefined} className="text-teal-600 hover:text-teal-800 underline underline-offset-2 transition-colors font-medium">
                {element}
              </a>
            )
          }
        })
      }
      return element
    }
    return renderNode(child, index)
  })
}

export function RichText({ blok }: { blok: SbBlokData }) {
  const content = (blok as Block).content as RichTextNode | string | undefined

  if (!content) return null

  // If content is a ProseMirror JSON doc, render it manually
  if (typeof content === 'object' && content.type === 'doc' && Array.isArray(content.content)) {
    return (
      <div className="prose max-w-none text-slate-700 leading-relaxed" {...storyblokEditable(blok)}>
        {content.content.map((node, index) => renderNode(node, index))}
      </div>
    )
  }

  // If content is an HTML string
  if (typeof content === 'string') {
    return <div {...storyblokEditable(blok)} dangerouslySetInnerHTML={{ __html: content }} />
  }

  return null
}

/* =========================================================================
   ComparisonBlock (BNC production styling)
   ========================================================================= */
export function ComparisonBlock({ blok }: { blok: SbBlokData }) {
  const comparison = blok as Block
  const img = imageUrl(comparison, 'image_url', 'image')
  return (
    <div className="my-10 p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm" {...storyblokEditable(blok)}>
      {value(comparison, 'eyebrow') && (
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/60 px-2.5 py-1 rounded-md mb-3 inline-block">
          {value(comparison, 'eyebrow')}
        </span>
      )}
      {value(comparison, 'heading') && (
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mb-3">
          {value(comparison, 'heading')}
        </h3>
      )}
      {value(comparison, 'summary') && (
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
          {value(comparison, 'summary')}
        </p>
      )}
      {img && (
        <div className="rounded-xl overflow-hidden border border-slate-200 bg-white mb-3">
          <img src={resolveImageUrl(img)} alt={imageAlt(comparison, '', 'image_url', 'image')} className="w-full h-auto object-contain max-h-[500px]" />
        </div>
      )}
      {value(comparison, 'caption') && (
        <p className="text-xs sm:text-sm text-slate-500 italic mt-2 text-center">
          {value(comparison, 'caption')}
        </p>
      )}
    </div>
  )
}

/* =========================================================================
   ImageBlock (BNC production styling)
   ========================================================================= */
export function ImageBlock({ blok }: { blok: SbBlokData }) {
  const image = blok as Block
  const img = imageUrl(image, 'image_url', 'image')
  if (!img) return null
  return (
    <figure className="my-10" {...storyblokEditable(blok)}>
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm">
        <img src={resolveImageUrl(img)} alt={imageAlt(image, 'Article visual', 'image_url', 'image')} className="w-full h-auto object-cover max-h-[600px]" loading="lazy" />
      </div>
      {value(image, 'caption') && (
        <figcaption className="text-xs sm:text-sm text-slate-500 italic mt-3 text-center">
          {value(image, 'caption')}
        </figcaption>
      )}
    </figure>
  )
}

/* =========================================================================
   RelatedPost (BNC production styling)
   ========================================================================= */
export function RelatedPost({ blok }: { blok: SbBlokData }) {
  const related = blok as Block
  const href = normalizeHref(value(related, 'href') || (value(related, 'slug') ? `/blog/${value(related, 'slug')}` : '/blog'))
  const isExternal = href.startsWith('http')

  const content = (
    <div className="p-6 sm:p-7 rounded-2xl bg-teal-50/50 border border-teal-200/80 hover:border-teal-400 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col sm:flex-row gap-6 items-start justify-between" {...storyblokEditable(blok)}>
      <div className="flex-1">
        {value(related, 'eyebrow') && (
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2 block">
            {value(related, 'eyebrow')}
          </span>
        )}
        <h4 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors font-display mb-2">
          {value(related, 'title')}
        </h4>
        {value(related, 'summary') && (
          <p className="text-sm sm:text-base text-slate-600 line-clamp-2">
            {value(related, 'summary')}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-teal-700 font-semibold text-sm shrink-0 self-end sm:self-center">
        Read post
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  )

  return isExternal ? (
    <a href={href} className="block my-8 group" target="_blank" rel="noopener noreferrer">{content}</a>
  ) : (
    <Link to={href} className="block my-8 group">{content}</Link>
  )
}

/* =========================================================================
   CtaBanner (BNC production styling)
   ========================================================================= */
export function CtaBanner({ blok }: { blok: SbBlokData }) {
  const cta = blok as Block
  const linkUrl = normalizeHref(value(cta, 'button_url'))
  const isExternal = linkUrl.startsWith('http') || linkUrl.startsWith('mailto:')

  return (
    <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 lg:p-14 my-12 relative overflow-hidden border border-slate-800 shadow-xl" {...storyblokEditable(blok)}>
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        {value(cta, 'eyebrow') && (
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 block">
            {value(cta, 'eyebrow')}
          </span>
        )}
        {value(cta, 'heading') && (
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-display mb-4 leading-tight">
            {value(cta, 'heading')}
          </h3>
        )}
        {value(cta, 'body') && (
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
            {value(cta, 'body')}
          </p>
        )}
        {value(cta, 'button_label') && (
          isExternal ? (
            <a href={linkUrl} className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold transition-all shadow-md active:scale-95">
              {value(cta, 'button_label')}
              <ArrowRight className="w-4 h-4" />
            </a>
          ) : (
            <Link to={linkUrl} className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold transition-all shadow-md active:scale-95">
              {value(cta, 'button_label')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )
        )}
      </div>
    </div>
  )
}
