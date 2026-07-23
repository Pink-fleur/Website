import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-sanity-webhook-secret')

  if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { _type?: string; _id?: string; linkedScarfShopifyId?: string }
  try {
    body = (await req.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const paths = new Set<string>()

  if (body._type === 'beneficiary') {
    paths.add('/1ms')
    paths.add('/1ms/impact')
    paths.add('/1ms/scarves')
    paths.add('/1ms/scarves/[handle]')
  }

  for (const path of paths) {
    if (path.includes('[')) {
      revalidatePath(path, 'page')
    } else {
      revalidatePath(path)
    }
  }

  return NextResponse.json({ revalidated: true, paths: Array.from(paths) })
}
