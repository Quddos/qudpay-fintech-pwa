// Exchange rate calculation based on the document
export const EXCHANGE_RATES = {
  GBP_TO_INR: 116.4,
  INR_TO_NGN_MARKET: 17.89,
  GBP_TO_NGN: 2120,
  INR_TO_NGN_QUDPAY: 18.21, // Our rate with 1.79% profit margin
}

export function calculateExchange(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  customRate?: number,
): {
  convertedAmount: number
  rate: number
  platformFee: number
  netAmount: number
} {
  let rate = customRate || EXCHANGE_RATES.INR_TO_NGN_QUDPAY

  if (fromCurrency === "NGN" && toCurrency === "INR") {
    rate = 1 / EXCHANGE_RATES.INR_TO_NGN_QUDPAY
  }

  const convertedAmount = amount * rate
  const platformFee = convertedAmount * 0.045 // 4.5% platform fee
  const netAmount = convertedAmount - platformFee

  return {
    convertedAmount,
    rate,
    platformFee,
    netAmount,
  }
}

export function formatCurrency(amount: number, currency: string): string {
  const symbols = {
    NGN: "₦",
    INR: "₹",
    GBP: "£",
  }

  return `${symbols[currency as keyof typeof symbols] || ""}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
