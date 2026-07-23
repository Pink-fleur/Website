import type { Beneficiary } from '@/lib/sanity/types'

type FundingFields = Pick<Beneficiary, 'fundingGoal' | 'fundingProgress' | 'status'>

export function getFundingProgressPercent(beneficiary: FundingFields) {
  if (beneficiary.fundingGoal <= 0) return 0
  return Math.min(Math.round((beneficiary.fundingProgress / beneficiary.fundingGoal) * 100), 100)
}

export function isBeneficiaryFullyFunded(beneficiary: FundingFields) {
  return beneficiary.fundingGoal > 0 && beneficiary.fundingProgress >= beneficiary.fundingGoal
}

export function getBeneficiaryStatusLabel(beneficiary: FundingFields) {
  if (isBeneficiaryFullyFunded(beneficiary)) return 'Fully funded'

  const progress = getFundingProgressPercent(beneficiary)
  if (progress > 0) return `${progress}% funded`

  if (beneficiary.status === 'supported' || beneficiary.status === 'funded') {
    return 'Being supported'
  }

  return 'Seeking support'
}
