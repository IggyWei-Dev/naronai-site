// Paystack helpers — server-side only (uses secret key)

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!
const BASE_URL = 'https://api.paystack.co'

export async function initializeTransaction({
  email,
  amountKobo,
  reference,
  callbackUrl,
  metadata,
}: {
  email:       string
  amountKobo:  number
  reference:   string
  callbackUrl: string
  metadata?:   Record<string, unknown>
}) {
  const res = await fetch(`${BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount:       amountKobo,
      reference,
      callback_url: callbackUrl,
      currency:     'NGN',
      metadata,
    }),
  })

  if (!res.ok) throw new Error('Failed to initialize Paystack transaction')
  const data = await res.json()
  return data.data as { authorization_url: string; access_code: string; reference: string }
}

export async function verifyTransaction(reference: string) {
  const res = await fetch(`${BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  })
  if (!res.ok) throw new Error('Failed to verify Paystack transaction')
  const data = await res.json()
  return data.data as {
    status:    string    // 'success' | 'failed' | 'abandoned'
    amount:    number
    reference: string
    customer:  { email: string }
    metadata:  Record<string, unknown>
  }
}

export function generateReference(prefix = 'NRN') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
}
