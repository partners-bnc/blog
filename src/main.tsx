import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { apiPlugin, storyblokInit } from '@storyblok/react'
import './index.css'
import App from './App.tsx'
import { BlogPost, ComparisonBlock, CtaBanner, FeaturedPost, Hero, ImageBlock, Page, RelatedPost, RichText } from './storyblok/blocks.tsx'

storyblokInit({
  accessToken: import.meta.env.VITE_STORYBLOK_DELIVERY_API_TOKEN || import.meta.env.VITE_STORYBLOK_ACCESS_TOKEN,
  use: [apiPlugin],
  components: {
    page: Page,
    blog_post: BlogPost,
    hero: Hero,
    featured_post: FeaturedPost,
    rich_text: RichText,
    comparison_block: ComparisonBlock,
    image_block: ImageBlock,
    related_post: RelatedPost,
    cta_banner: CtaBanner,
  },
  apiOptions: { region: import.meta.env.VITE_STORYBLOK_REGION || 'eu' },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter><App /></BrowserRouter>
  </StrictMode>,
)
