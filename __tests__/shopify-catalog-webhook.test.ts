/**
 * @jest-environment node
 */
import crypto from 'crypto'
import { NextRequest } from 'next/server'

const revalidateTag = jest.fn()
jest.mock('next/cache', () => ({ revalidateTag: (...args: unknown[]) => revalidateTag(...args) }))

const SECRET = 'test-webhook-secret'

function sign(body: string, secret = SECRET) {
  return crypto.createHmac('sha256', secret).update(body, 'utf8').digest('base64')
}

function webhook(topic: string, body = '{"id":1}', hmac = sign(body)) {
  return new NextRequest('http://localhost/api/shopify/catalog', {
    method: 'POST',
    body,
    headers: { 'x-shopify-topic': topic, 'x-shopify-hmac-sha256': hmac },
  })
}

describe('Shopify catalog webhook', () => {
  let POST: (req: NextRequest) => Promise<Response>

  beforeAll(async () => {
    process.env.SHOPIFY_WEBHOOK_SECRET = SECRET
    ;({ POST } = await import('@/app/api/shopify/catalog/route'))
  })

  beforeEach(() => revalidateTag.mockClear())

  it.each(['collections/create', 'collections/update', 'collections/delete', 'products/update'])(
    'refreshes Shopify data on %s',
    async (topic) => {
      const res = await POST(webhook(topic))
      expect(res.status).toBe(200)
      expect(revalidateTag).toHaveBeenCalledWith('shopify', { expire: 0 })
    }
  )

  it('rejects a request with a bad signature', async () => {
    const res = await POST(webhook('collections/create', '{"id":1}', sign('{"id":1}', 'wrong-secret')))
    expect(res.status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('rejects a request with no signature', async () => {
    const req = new NextRequest('http://localhost/api/shopify/catalog', {
      method: 'POST',
      body: '{}',
      headers: { 'x-shopify-topic': 'collections/create' },
    })
    expect((await POST(req)).status).toBe(401)
    expect(revalidateTag).not.toHaveBeenCalled()
  })

  it('ignores unrelated topics', async () => {
    const res = await POST(webhook('orders/paid'))
    expect(await res.json()).toMatchObject({ skipped: true })
    expect(revalidateTag).not.toHaveBeenCalled()
  })
})
