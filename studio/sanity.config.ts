'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemas'
import ScarfCoverageTool from './tools/ScarfCoverageTool'

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: 'beneficiary-for-scarf',
        title: 'New Beneficiary (scarf pre-linked)',
        schemaType: 'beneficiary',
        parameters: [{ name: 'scarfId', type: 'string' }],
        value: (params: { scarfId: string }) => ({
          linkedScarfShopifyId: params.scarfId,
        }),
      },
    ],
  },
  tools: (prev) => [
    ...prev,
    {
      name: 'scarf-coverage',
      title: 'Scarf Coverage',
      component: ScarfCoverageTool,
    },
  ],
})
