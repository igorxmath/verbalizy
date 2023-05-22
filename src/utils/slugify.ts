import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { supabaseRoute } from '@/lib/supabaseHandler'
import type { Team, Project } from '@/types/general.types'
import { teamSegments, projectSegments } from '@/utils/helpers'
import slugify from '@sindresorhus/slugify'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import type { Config } from 'unique-names-generator'

const slugGeneratorConfig: Config = {
  dictionaries: [adjectives, animals, colors],
  separator: '-',
  length: 3,
}

export const generateRandomSlug = (): string => {
  return uniqueNamesGenerator(slugGeneratorConfig)
}

export const slugFromEmail = (email: string) => {
  return slugify(email.split('@')[0])
}

export const slugFromName = (name: string) => {
  return slugify(name)
}

export { slugify }

const RESERVED_SLUGS = [
  'settings',
  'legal',
  'docs',
  'api',
  'app',
  ...teamSegments.map((segment) => segment.slug),
  ...projectSegments.map((segment) => segment.slug),
]

export const isTeamSlugAvailable = async (slug: string) => {
  if (RESERVED_SLUGS.includes(slug)) {
    return false
  }
  const { count } = await supabaseAdmin
    .from('teams')
    .select('slug', { count: 'exact' })
    .eq('slug', slug)
  return count === 0
}

export const getAvailableTeamSlug = async (baseSlug: string) => {
  let candidateSlug = baseSlug
  let attempt = 0
  let isAvailable = await isTeamSlugAvailable(candidateSlug)
  while (!isAvailable) {
    isAvailable = await isTeamSlugAvailable(candidateSlug)
    attempt++
    candidateSlug = `${baseSlug}-${attempt}`
  }
  return candidateSlug
}

export const isProjectSlugAvailable = async (teamId: Team['id'], slug: string) => {
  const supabase = supabaseRoute()

  if (RESERVED_SLUGS.includes(slug)) {
    return false
  }
  const { count } = await supabase
    .from('projects')
    .select('slug', { count: 'exact' })
    .match({ team_id: teamId, slug: slug })
  return count === 0
}

export const getAvailableProjectSlug = async (teamId: Team['id'], name: Project['name']) => {
  let baseSlug: string
  if (name && name.length > 0) {
    baseSlug = slugFromName(name)
  } else {
    baseSlug = generateRandomSlug()
  }

  let candidateSlug = baseSlug
  let isAvailable = await isProjectSlugAvailable(teamId, candidateSlug)

  let attempt = 0
  while (!isAvailable) {
    isAvailable = await isProjectSlugAvailable(teamId, candidateSlug)
    attempt++
    candidateSlug = `${baseSlug}-${attempt}`
  }

  return candidateSlug
}
