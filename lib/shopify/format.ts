export function formatMoney(amount: string | number, currencyCode: string) {
  const value = typeof amount === 'string' ? Number(amount) : amount
  return `${currencyCode} ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`
}
