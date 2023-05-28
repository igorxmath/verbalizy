import { MetadataRoute } from 'next'
import { getURL } from '@/utils/helpers'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard/',
    },
    sitemap: `${getURL()}/sitemap.xml`,
  }
}
