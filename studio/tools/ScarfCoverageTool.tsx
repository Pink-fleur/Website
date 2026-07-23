'use client'

import { useEffect, useMemo, useState } from 'react'
import { useClient } from 'sanity'
import { IntentLink } from 'sanity/router'
import { Badge, Box, Button, Card, Container, Flex, Heading, Spinner, Stack, Text } from '@sanity/ui'

interface BeneficiaryRow {
  _id: string
  displayName: string
  status: string
  linkedScarfShopifyId?: string
}

interface ScarfRow {
  id: string
  handle: string
  title: string
  image?: string
}

const BENEFICIARIES_QUERY = `*[_type == "beneficiary"]{_id, displayName, status, linkedScarfShopifyId}`
const ROW_GRID_COLUMNS = '48px minmax(0, 1.6fr) minmax(0, 1.4fr) auto'

export default function ScarfCoverageTool() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [scarves, setScarves] = useState<ScarfRow[]>([])
  const [beneficiaries, setBeneficiaries] = useState<BeneficiaryRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUnlinkedOnly, setShowUnlinkedOnly] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    Promise.all([
      fetch('/api/studio/scarf-coverage').then(async (res) => {
        const body = await res.json()
        if (!res.ok) throw new Error(body.error || 'Failed to load scarves from Shopify')
        return body as { scarves: ScarfRow[] }
      }),
      client.fetch<BeneficiaryRow[]>(BENEFICIARIES_QUERY),
    ])
      .then(([scarfData, beneficiaryData]) => {
        if (cancelled) return
        setScarves(scarfData.scarves)
        setBeneficiaries(beneficiaryData)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Something went wrong')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [client])

  const beneficiariesByScarfId = useMemo(() => {
    const map: Record<string, BeneficiaryRow[]> = {}
    for (const b of beneficiaries) {
      if (!b.linkedScarfShopifyId) continue
      map[b.linkedScarfShopifyId] = [...(map[b.linkedScarfShopifyId] ?? []), b]
    }
    return map
  }, [beneficiaries])

  const danglingBeneficiaries = useMemo(
    () =>
      beneficiaries.filter(
        (b) => b.linkedScarfShopifyId && !scarves.some((s) => s.id === b.linkedScarfShopifyId)
      ),
    [beneficiaries, scarves]
  )

  const unlinkedCount = useMemo(
    () => scarves.filter((s) => !beneficiariesByScarfId[s.id]?.length).length,
    [scarves, beneficiariesByScarfId]
  )

  const rows = useMemo(
    () => (showUnlinkedOnly ? scarves.filter((s) => !beneficiariesByScarfId[s.id]?.length) : scarves),
    [scarves, beneficiariesByScarfId, showUnlinkedOnly]
  )

  if (loading) {
    return (
      <Flex align="center" justify="center" height="fill" padding={4}>
        <Spinner muted />
      </Flex>
    )
  }

  if (error) {
    return (
      <Box padding={4}>
        <Card padding={4} tone="critical" radius={2} border>
          <Text>{error}</Text>
        </Card>
      </Box>
    )
  }

  return (
    <Container width={4}>
      <Stack space={4} padding={4}>
        <Stack space={2}>
          <Heading size={2}>Scarf &rarr; Beneficiary Coverage</Heading>
          <Text muted size={1}>
            {scarves.length} scarves tagged &quot;1ms&quot; in Shopify &middot; {unlinkedCount} without a linked
            beneficiary
            {danglingBeneficiaries.length > 0 &&
              ` · ${danglingBeneficiaries.length} beneficiaries linked to a scarf not in this collection`}
          </Text>
        </Stack>

        <Flex gap={2}>
          <Button
            text={showUnlinkedOnly ? 'Show all scarves' : 'Show unlinked only'}
            tone={showUnlinkedOnly ? 'primary' : 'default'}
            mode={showUnlinkedOnly ? 'default' : 'ghost'}
            onClick={() => setShowUnlinkedOnly((v) => !v)}
          />
        </Flex>

        <Card border radius={2}>
          <Stack>
            {rows.length > 0 && (
              <Box padding={3} paddingBottom={2}>
                <Box style={{ display: 'grid', gridTemplateColumns: ROW_GRID_COLUMNS, gap: '16px' }}>
                  <Box />
                  <Text size={1} muted weight="semibold">
                    Scarf
                  </Text>
                  <Text size={1} muted weight="semibold">
                    Linked to
                  </Text>
                  <Box />
                </Box>
              </Box>
            )}
            {rows.length === 0 && (
              <Box padding={4}>
                <Text muted>No scarves match this filter.</Text>
              </Box>
            )}
            {rows.map((scarf, index) => {
              const linked = beneficiariesByScarfId[scarf.id] ?? []
              const isUnlinked = linked.length === 0
              return (
                <Card
                  key={scarf.id}
                  padding={3}
                  borderTop={index > 0}
                  tone={isUnlinked ? 'caution' : undefined}
                >
                  <Box
                    style={{
                      display: 'grid',
                      gridTemplateColumns: ROW_GRID_COLUMNS,
                      gap: '16px',
                      alignItems: 'center',
                    }}
                  >
                    <Box
                      style={{
                        width: 48,
                        height: 48,
                        flexShrink: 0,
                        background: 'var(--card-code-bg-color, #eee)',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      {scarf.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={scarf.image}
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      )}
                    </Box>
                    <Stack space={2} style={{ minWidth: 0 }}>
                      <Text weight="semibold" textOverflow="ellipsis">
                        {scarf.title}
                      </Text>
                      <Text size={1} muted textOverflow="ellipsis">
                        {scarf.handle}
                      </Text>
                    </Stack>
                    <Box style={{ minWidth: 0 }}>
                      {isUnlinked ? (
                        <Badge tone="caution">No beneficiary linked</Badge>
                      ) : (
                        <Flex gap={2} wrap="wrap">
                          {linked.map((b) => (
                            <Badge key={b._id} tone="positive">
                              {b.displayName}
                            </Badge>
                          ))}
                        </Flex>
                      )}
                    </Box>
                    <Box style={{ justifySelf: 'end' }}>
                      {isUnlinked && (
                        <Button
                          as={IntentLink}
                          intent="create"
                          params={{ type: 'beneficiary', template: 'beneficiary-for-scarf', scarfId: scarf.id }}
                          text="+ Add beneficiary"
                          tone="primary"
                          mode="ghost"
                        />
                      )}
                    </Box>
                  </Box>
                </Card>
              )
            })}
          </Stack>
        </Card>

        {danglingBeneficiaries.length > 0 && (
          <Card border radius={2} tone="critical" padding={3}>
            <Stack space={2}>
              <Text weight="semibold">Beneficiaries linked to a scarf not found in the 1MS collection</Text>
              <Text size={1} muted>
                Their linked scarf ID doesn&apos;t match any product currently tagged &quot;1ms&quot; in Shopify
                &mdash; check for a typo, an untagged product, or a deleted product.
              </Text>
              <Flex gap={2} wrap="wrap">
                {danglingBeneficiaries.map((b) => (
                  <Badge key={b._id} tone="critical">
                    {b.displayName}
                  </Badge>
                ))}
              </Flex>
            </Stack>
          </Card>
        )}
      </Stack>
    </Container>
  )
}
