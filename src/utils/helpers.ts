export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    'http://localhost:3000/'
  url = url.includes('http') ? url : `https://${url}`
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
  return url
}

export const teamSegments = [
  {
    slug: '',
    name: 'Overview',
  },
  {
    slug: 'settings',
    name: 'Settings',
  },
]

export const teamSettingsSegments = [
  {
    slug: '',
    name: 'General',
  },
  {
    slug: 'billing',
    name: 'Billing',
  },
  {
    slug: 'people',
    name: 'People',
  },
]

export const projectSegments = [
  {
    slug: '',
    name: 'Project',
  },
  {
    slug: 'settings',
    name: 'Settings',
  },
]

export const projectSettingsSegments = [
  {
    slug: '',
    name: 'General',
  },
]

export const timeSince = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)

  let interval = seconds / 31536000

  if (interval > 1) {
    return Math.floor(interval) + ' years ago'
  }
  interval = seconds / 2592000
  if (interval > 1) {
    return Math.floor(interval) + ' months ago'
  }
  interval = seconds / 86400
  if (interval > 1) {
    return Math.floor(interval) + ' days ago'
  }
  interval = seconds / 3600
  if (interval > 1) {
    return Math.floor(interval) + ' hours ago'
  }
  interval = seconds / 60
  if (interval > 1) {
    return Math.floor(interval) + ' minutes ago'
  }
  return Math.floor(seconds) + ' seconds ago'
}
