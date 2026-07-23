'use client'

import { useRouter } from 'next/navigation'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="font-body text-xs tracking-widest uppercase text-[#E79489] hover:underline mb-8 text-left"
    >
      ← Back
    </button>
  )
}
