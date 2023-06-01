import * as z from 'zod'

// forms
export const teamSchema = z.object({
  name: z.string().min(3, 'Name is too short').max(20, 'Name is too long'),
})

export const projectSchema = z.object({
  name: z.string().min(3, 'Name is too short').max(20, 'Name is too long'),
})

export const documentSchema = z.object({
  name: z.string().min(3, 'Name is too short').max(20, 'Name is too long'),
  content: z.string(),
})

export const slugSchema = z.object({
  slug: z.string().min(3, 'Name is too short').max(20, 'Slug is too long').toLowerCase(),
})

export const userSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().email().optional(),
  subscribe_to_product_updates: z.boolean().optional(),
})

// routes
export const projectRouteContextSchema = z.object({
  params: z.object({
    projectId: z.string(),
  }),
})

export const documentRouteContextSchema = z.object({
  params: z.object({
    docId: z.string().transform((value) => parseInt(value)),
  }),
})
