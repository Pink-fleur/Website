import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'beneficiary',
  title: 'Beneficiary Woman',
  type: 'document',
  fields: [
    defineField({
      name: 'displayName',
      title: 'Display Name (first name only)',
      type: 'string',
      description: 'The name shown publicly on the website. First name only unless full name consent is given.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name (stored privately, not shown publicly)',
      type: 'string',
      description: 'Stored for records only. Never displayed on the website.',
    }),
    defineField({
      name: 'location',
      title: 'City',
      type: 'string',
      description: 'e.g. Kano, Abuja, Lagos',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortStory',
      title: 'Short Story (one sentence — shown on cards and search results)',
      type: 'string',
      description: 'One sentence max. This appears on listing cards and the beneficiary selector.',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'story',
      title: 'Full Story',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'The full story displayed on the beneficiary profile page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo (back-facing, wearing scarf)',
      type: 'image',
      description: 'IMPORTANT: Photo must show the woman from behind, wearing the scarf. No identifying front-facing photos.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'status',
      title: 'Support Status',
      type: 'string',
      options: {
        list: [
          { title: 'Seeking Support', value: 'seeking' },
          { title: 'Being Supported', value: 'supported' },
          { title: 'Fully Funded', value: 'funded' },
          { title: 'Withdrawn (removes from site)', value: 'withdrawn' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fundingGoal',
      title: 'Funding Goal (NGN)',
      type: 'number',
      description: 'Target amount in Nigerian Naira, set by PAGED Initiative.',
    }),
    defineField({
      name: 'fundingProgress',
      title: 'Funding Progress (NGN)',
      type: 'number',
      description: 'Current amount raised. Updated by admin.',
      initialValue: 0,
    }),
    defineField({
      name: 'linkedScarfShopifyId',
      title: 'Linked Scarf (Shopify Product GID)',
      type: 'string',
      description:
        'The Shopify product GID for the scarf linked to this woman, e.g. gid://shopify/Product/123456789. Multiple women can share the same GID — proceeds from that scarf are split evenly between everyone linked to it, automatically, with no buyer selection.',
      validation: (Rule) =>
        Rule.regex(/^gid:\/\/shopify\/Product\/\d+$/, {
          name: 'shopify product GID',
          invert: false,
        }).warning('Should look like gid://shopify/Product/123456789'),
    }),
    defineField({
      name: 'searchKeywords',
      title: 'Search Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords to help buyers find this woman via search, e.g. ["education", "disability", "Kano"]',
    }),
    defineField({
      name: 'pagedVerified',
      title: 'PAGED Verified (consent confirmed)',
      type: 'boolean',
      description: 'REQUIRED: Set to true only after PAGED Initiative has confirmed this woman\'s written consent to appear on the website. She will NOT appear publicly until this is checked.',
      initialValue: false,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
    }),
    defineField({
      name: 'fundedAt',
      title: 'Date Fully Funded',
      type: 'datetime',
      description: 'Set automatically or manually when status changes to Fully Funded.',
    }),
  ],
  preview: {
    select: {
      title: 'displayName',
      subtitle: 'location',
      media: 'photo',
      status: 'status',
      verified: 'pagedVerified',
    },
    prepare({ title, subtitle, media, status, verified }) {
      return {
        title: `${title ?? 'Unnamed'} ${verified ? '' : '⚠️ NOT VERIFIED'}`,
        subtitle: `${subtitle ?? ''} · ${status ?? 'unknown'}`,
        media,
      }
    },
  },
})
