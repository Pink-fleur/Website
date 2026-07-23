import type { PortableTextBlock } from '@portabletext/react'

export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; width: number; height: number }
}

export type BeneficiaryStatus = 'seeking' | 'supported' | 'funded' | 'withdrawn'

export interface Beneficiary {
  _id: string
  displayName: string
  location: string
  country: string
  shortStory: string
  story: PortableTextBlock[]
  photo: SanityImage
  status: BeneficiaryStatus
  fundingGoal: number
  fundingProgress: number
  linkedScarfShopifyId: string
  pagedVerified: boolean
  searchKeywords: string[]
  publishedAt: string
  fundedAt?: string
}
