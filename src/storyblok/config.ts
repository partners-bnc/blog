export type StoryblokContentVersion = 'draft' | 'published'

export const storyblokContentVersion: StoryblokContentVersion =
  import.meta.env.VITE_STORYBLOK_CONTENT_VERSION === 'published' ? 'published' : 'draft'

