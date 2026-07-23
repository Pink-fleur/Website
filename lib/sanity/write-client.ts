import { createClient } from '@sanity/client'

export function getSanityWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const token = process.env.SANITY_API_TOKEN

  if (!projectId || !token) {
    throw new Error('Sanity write credentials are not configured')
  }

  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })
}
