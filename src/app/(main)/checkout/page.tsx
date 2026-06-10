'use client'

import { useState }                      from 'react'
import { motion, useReducedMotion }       from 'framer-motion'
import { useForm }                        from 'react-hook-form'
import { zodResolver }                    from '@hookform/resolvers/zod'
import { z }                             from 'zod'
import { useCartStore }                  from '@/lib/store/cartStore'
import { Button }                        from '@/components/ui/button'
import { FormInput }                     from '@/components/ui/FormInput'
import { formatNaira }                   from '@/lib/utils'
import toast                             from 'react-hot-toast'

const CARD_WIDTH = 380

const chromeCard: React.CSSProperties = {
  width: CARD_WIDTH,
  background: `var(--panel-bg-dark)`,
  border: '0.5px solid color-mix(in srgb, var(--color-gold) 35%, transparent)',
  borderRadius: '16px',
  boxShadow: `
    inset 0 1px 0 color-mix(in srgb, var(--color-gold) 30%, transparent),
    inset 0 -1px 0 rgba(0,0,0,0.7),
    0 32px 80px rgba(0,0,0,0.55),
    0 4px 20px color-mix(in srgb, var(--color-gold) 8%, transparent)
  `,
  padding: '32px',
  position: 'relative',
  overflow: 'hidden',
}

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  email:     z.string().email('Invalid email'),
  phone:     z.string().min(10, 'Enter a valid phone number'),
  line1:     z.string().min(1, 'Required'),
  line2:     z.string().optional(),
  city:      z.string().min(1, 'Required'),
  state:     z.string().min(1, 'Required'),
})

type FormData = z.infer<typeof schema>

export default function CheckoutPage() {
  const { items, total } = useCartStore()
  const [loading, setLoading] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const reduced = !!shouldReduceMotion

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const subtotal    = total()
  const shippingFee = subtotal >= 150_000 ? 0 : 3_000
  const orderTotal  = subtotal + shippingFee

  const onSubmit = async (data: FormData) => {
    if (!items.length) return
    setLoading(true)
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          email:           data.email,
          shippingAddress: { ...data, country: 'Nigeria' },
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      window.location.href = json.url
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  /* Entrance animation helper */
  const up = (delay: number) => ({
    initial:    { opacity: 0, y: reduced ? 0 : 28 },
    animate:    { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : 0.6,
      delay:    reduced ? 0 : delay,
      ease:     [0.22, 1, 0.36, 1] as const,
    },
  })

  return (
    <>
      <style>{`
        @keyframes chrome-sheen {
          0%   { left: -60%; }
          50%  { left: 120%; }
          100% { left: 120%; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes chrome-sheen { 0%, 100% { left: -60%; } }
        }
      `}</style>

      {/* Two-column grid — form left, spacer right */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '140px 64px 96px',
        display: 'grid',
        gridTemplateColumns: `1fr ${CARD_WIDTH}px`,
        gap: '64px',
        alignItems: 'start',
      }}>

        {/* ── Left: checkout form ───────────────────────────── */}
        <div>
          <motion.h1 {...up(0)} className="text-h1" style={{ marginBottom: '40px' }}>
            Checkout
          </motion.h1>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            <motion.section {...up(0.1)}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent-gold)', marginBottom: '16px' }}>
                Contact Information
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormInput label="First Name" id="firstName" error={errors.firstName?.message} {...register('firstName')} />
                <FormInput label="Last Name"  id="lastName"  error={errors.lastName?.message}  {...register('lastName')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '16px' }}>
                <FormInput label="Email"  id="email" type="email" error={errors.email?.message} {...register('email')} />
                <FormInput label="Phone"  id="phone" type="tel"   error={errors.phone?.message} {...register('phone')} />
              </div>
            </motion.section>

            <motion.section {...up(0.18)} style={{ marginTop: '8px' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-accent-gold)', marginBottom: '16px' }}>
                Shipping Address
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <FormInput label="Address Line 1" id="line1" error={errors.line1?.message} {...register('line1')} />
                <FormInput label="Address Line 2 (optional)" id="line2" {...register('line2')} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormInput label="City"  id="city"  error={errors.city?.message}  {...register('city')} />
                  <FormInput label="State" id="state" error={errors.state?.message} {...register('state')} />
                </div>
              </div>
            </motion.section>

            <motion.div
              {...up(0.26)}
              whileTap={reduced ? undefined : { scale: 0.97, transition: { duration: 0.1 } }}
              style={{ marginTop: '16px' }}
            >
              <Button type="submit" loading={loading} size="lg" style={{ width: '100%' }}>
                Pay {formatNaira(orderTotal)} with Paystack
              </Button>
            </motion.div>

          </form>
        </div>

        {/* Spacer — keeps form column the correct width */}
        <div aria-hidden="true" />
      </div>

      {/* ── Chrome summary card — fixed, vertically centred ── */}
      {/* Outer div handles position; inner motion.div handles entrance */}
      <div
        className="hidden lg:block"
        style={{
          position: 'fixed',
          top: '50%',
          right: 'max(64px, calc((100vw - 1440px) / 2 + 64px))',
          transform: 'translateY(-50%)',
          zIndex: 20,
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: reduced ? 0 : 48 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div style={chromeCard}>
            {/* Animated sheen */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-60%',
              width: '40%',
              height: '100%',
              background: 'linear-gradient(105deg, transparent 0%, color-mix(in srgb, var(--color-gold) 8%, transparent) 50%, transparent 100%)',
              pointerEvents: 'none',
              animation: 'chrome-sheen 7s ease-in-out infinite',
            }} />

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--color-on-dark)',
              margin: '0 0 20px',
            }}>
              Order summary
            </h2>

            {/* Line items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {items.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'color-mix(in srgb, var(--color-on-dark) 60%, transparent)', flex: 1 }}>
                    {item.product.name} ×{item.quantity}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'color-mix(in srgb, var(--color-on-dark) 75%, transparent)', whiteSpace: 'nowrap' }}>
                    {formatNaira(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: '0.5px', background: 'color-mix(in srgb, var(--color-gold) 20%, transparent)', marginBottom: '16px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              <ChromeRow label="Subtotal" value={formatNaira(subtotal)} />
              <ChromeRow label="Shipping" value={shippingFee === 0 ? 'Free' : formatNaira(shippingFee)} />
            </div>

            <div style={{ height: '0.5px', background: 'color-mix(in srgb, var(--color-gold) 25%, transparent)', marginBottom: '20px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-on-dark) 40%, transparent)' }}>
                Total
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--color-gold)', letterSpacing: '-0.01em' }}>
                {formatNaira(orderTotal)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Mobile summary — inline above submit ─────────── */}
      <motion.div
        {...up(0.35)}
        className="lg:hidden"
        style={{ padding: '0 24px 16px' }}
      >
        <div style={{ background: 'var(--color-bg-card)', border: '0.5px solid var(--color-border)', borderRadius: '8px', padding: '24px', marginBottom: '8px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 300, color: 'var(--color-text)', margin: '0 0 16px' }}>
            Order summary
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {items.map((item) => (
              <div key={`${item.product.id}-${item.selectedColor}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-sub)', flex: 1 }}>
                  {item.product.name} ×{item.quantity}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                  {formatNaira(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div style={{ height: '0.5px', background: 'var(--color-border)', margin: '0 0 12px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Total</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-accent-gold)' }}>{formatNaira(orderTotal)}</span>
          </div>
        </div>
      </motion.div>
    </>
  )
}

function ChromeRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ fontFamily: 'var(--font-ui)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'color-mix(in srgb, var(--color-on-dark) 40%, transparent)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'color-mix(in srgb, var(--color-on-dark) 75%, transparent)' }}>{value}</span>
    </div>
  )
}
