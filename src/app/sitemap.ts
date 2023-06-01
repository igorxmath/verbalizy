import { getURL } from '@/utils/helpers'
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getURL(),
      lastModified: new Date(),
    },
  ]
}
