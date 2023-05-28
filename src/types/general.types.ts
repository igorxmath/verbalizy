import type { Database } from '@/types/database.types'

export type Team = Database['public']['Tables']['teams']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type User = Database['public']['Tables']['users']['Row']

export type DocumentStatus = Database['public']['Enums']['status_type']
