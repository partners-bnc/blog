# BNC Global Blog — Storyblok + React Preview

This project provides the draft preview environment for the BNC Global Insights & Blog, visually matching the live BNC Global production site.

The preview and production websites share the exact same Storyblok space, schemas, and content stories.

- **Production environment**: Uses the published delivery API version.
- **Preview environment**: Uses the preview token with draft delivery API version (`VITE_STORYBLOK_CONTENT_VERSION=draft`) and Storyblok Visual Editor bridge (`useStoryblok` / `@storyblok/react`).

## Architecture

```mermaid
flowchart LR
  A[Shared Storyblok Space] --> B[Draft or Published Stories]
  B --> C[Storyblok Content Delivery API]
  C --> D[@storyblok/react SDK / CDN API]
  D --> E[BNC Global React Components]
  E --> F[Rendered BNC Insights & Blog]
```

Storyblok is headless: it stores structured content, while React and Tailwind CSS control the final layout and styling matching BNC Global branding.

## Environment setup

Create `.env.local` with:

```env
VITE_STORYBLOK_DELIVERY_API_TOKEN=your_preview_delivery_token
VITE_STORYBLOK_REGION=eu
VITE_STORYBLOK_SPACE_ID=294961171213522
VITE_STORYBLOK_CONTENT_VERSION=draft
```

`VITE_STORYBLOK_DELIVERY_API_TOKEN` should be the space's read-only Preview access token.

- Use `draft` for the preview / Netlify Visual Editor deployment.
- Use `published` for production.

Restart the dev server after changing environment variables:

```bash
npm run dev
```

## SDK connection

The SDK is connected in [`src/main.tsx`](src/main.tsx):

```tsx
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
```

## Routes

| Route | Behavior |
|---|---|
| `/` | Redirects to `/blog`. |
| `/blog` | Renders the Storyblok `home` story with BNC Hero, Featured story, and latest publications grid with search/filtering. |
| `/blog/:slug` | Renders the specific article with BNC article layout (meta bar, author, read time, ProseMirror rich text, body blocks). |
| `/post/:slug` | Compatibility redirect to `/blog/:slug`. |

## Netlify Visual Editor preview

The repository includes [`netlify.toml`](netlify.toml) with a single-page-app rewrite for React Router URLs.

Configure the Netlify site with:

```text
Build command: npm run build
Publish directory: dist
```

Add these environment variables in Netlify's site settings:

```env
VITE_STORYBLOK_DELIVERY_API_TOKEN=your_preview_delivery_token
VITE_STORYBLOK_REGION=eu
VITE_STORYBLOK_SPACE_ID=294961171213522
VITE_STORYBLOK_CONTENT_VERSION=draft
```

In Storyblok **Settings → Visual Editor**, configure the preview URL with your deployed domain. For the `home` story, set the real path to `/blog`. For articles, set the real path to `/blog/{slug}`.

## Verification

```bash
npm run build
npm run lint
```

