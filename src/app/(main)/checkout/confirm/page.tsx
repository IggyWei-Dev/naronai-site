'use client'

import { useEffect, useState } from 'react'
import { useSearchParams }      from 'next/navigation'
import Link                     from 'next/link'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button }               from '@/components/ui/button'
import { useCartStore }         from '@/lib/store/cartStore'

export default function CheckoutConfirmPage() {
  const searchParams = useSearchParams()
  const reference    = searchParams.get('reference') ?? searchParams.get('ref')
  const clearCart    = useCartStore((s) => s.clearCart)
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!reference) { setStatus('failed'); return }
    fetch(`/api/paystack/verify?reference=${reference}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setOrderId(data.orderId)
          setStatus('success')
          clearCart()
        } else {
          setStatus('failed')
        }
      })
      .catch(() => setStatus('failed'))
  }, [reference, clearCart])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid var(--color-accent-gold)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
            Confirming your payment…
          </p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '96px 24px', textAlign: 'center' }}>
        <CheckCircle size={48} style={{ color: 'var(--color-accent-gold)' }} />
        <div>
          <h1 className="text-h1" style={{ marginBottom: '12px' }}>We'll be in touch shortly ✦</h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-text-secondary)', maxWidth: '440px' }}>
            Your order has been confirmed and a confirmation email is on its way. Thank you for choosing Naronai.
          </p>
        </div>
        {orderId && (
          <div style={{ background: 'var(--color-bg-card)', border: '0.5px solid var(--color-border-medium)', borderRadius: 'var(--radius-lg)', padding: '20px 32px', marginTop: '8px' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Order Reference</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-accent-primary)' }}>#{orderId.slice(0, 8).toUpperCase()}</p>
          </div>
        )}
        <div style={{ display: 'flex', gap: '16px' }}>
          <Button variant="primary">
            <Link href="/shop" style={{ textDecoration: 'none', color: 'inherit' }}>Continue Shopping</Link>
          </Button>
          <Button variant="ghost">
            <Link href="/account/orders" style={{ textDecoration: 'none', color: 'inherit' }}>View Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '96px 24px', textAlign: 'center' }}>
      <XCircle size={48} style={{ color: 'var(--color-error)' }} />
      <div>
        <h1 className="text-h1" style={{ marginBottom: '12px' }}>Payment not confirmed</h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-text-secondary)', maxWidth: '440px' }}>
          Your payment could not be verified. If you were charged, please contact us with your reference: <strong>{reference}</strong>
        </p>
      </div>
      <Button variant="ghost">
        <Link href="/cart" style={{ textDecoration: 'none', color: 'inherit' }}>Return to Cart</Link>
      </Button>
    </div>
  )
}
