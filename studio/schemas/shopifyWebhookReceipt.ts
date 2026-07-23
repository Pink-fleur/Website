import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shopifyWebhookReceipt',
  title: 'Shopify Webhook Receipt',
  type: 'document',
  fields: [
    defineField({
      name: 'webhookId',
      title: 'Webhook ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'topic',
      title: 'Topic',
      type: 'string',
    }),
    defineField({
      name: 'shop',
      title: 'Shop',
      type: 'string',
    }),
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
    }),
    defineField({
      name: 'receivedAt',
      title: 'Received At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'allocations',
      title: 'Funding Allocations',
      description: 'Audit trail of how this order’s value was split across beneficiaries.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'beneficiaryId', title: 'Beneficiary ID', type: 'string' }),
            defineField({ name: 'beneficiaryName', title: 'Beneficiary Name', type: 'string' }),
            defineField({ name: 'amount', title: 'Amount', type: 'number' }),
          ],
          preview: {
            select: { title: 'beneficiaryName', subtitle: 'amount' },
          },
        },
      ],
    }),
  ],
})
