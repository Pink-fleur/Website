#!/usr/bin/env ts-node
/**
 * Prevents server-only secrets from leaking into client bundles.
 * Run this in CI: npx ts-node scripts/check-env-exposure.ts
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const FORBIDDEN_PATTERNS = [
  /SANITY_API_TOKEN/,
  /SANITY_WEBHOOK_SECRET/,
  /SHOPIFY_ADMIN_API_TOKEN/,
]

const IGNORED_PATHS = [
  'node_modules',
  '.next',
  '.git',
  '.env',
  'check-env-exposure',
]

function scanDir(dir: string): string[] {
  const entries = readdirSync(dir)
  const files: string[] = []

  for (const entry of entries) {
    const full = join(dir, entry)
    if (IGNORED_PATHS.some((ig) => full.includes(ig))) continue

    const stat = statSync(full)
    if (stat.isDirectory()) {
      files.push(...scanDir(full))
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) {
      files.push(full)
    }
  }

  return files
}

const root = process.cwd()
const files = scanDir(root)
const violations: Array<{ file: string; line: number; pattern: string }> = []

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n')
  for (let i = 0; i < lines.length; i++) {
    for (const pattern of FORBIDDEN_PATTERNS) {
      if (pattern.test(lines[i]!) && lines[i]!.includes('NEXT_PUBLIC_')) {
        violations.push({ file, line: i + 1, pattern: pattern.toString() })
      }
    }
  }
}

if (violations.length > 0) {
  console.error('\n🚨 ENV EXPOSURE VIOLATIONS DETECTED:\n')
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line} — matched ${v.pattern}`)
  }
  process.exit(1)
} else {
  console.log('✅ No server-only environment variable exposure detected.')
}
