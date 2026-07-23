import { NextStudio } from 'next-sanity/studio'

import config from '@/studio/sanity.config'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
