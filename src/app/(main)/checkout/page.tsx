'use client'

import { useState }         from 'react'
import { useForm }          from 'react-hook-form'
import { zodResolver }      from '@hookform/resolvers/zod'
import { z }                from 'zod'
import { useRouter }        from 'next/navigation'
import { useCartStore }     from '@/lib/store/cartStore'
import { Button }           from '@/components/ui/Button'
import { FormInput }        from '@/components/ui/FormInput'
import { formatNaira }      from '@/lib/utils'
import toast                from 'react-hot-toast'

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
  const router    = useRouter()
  const { items, total } = useCartStore()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const subtotal    = total()
  const shippingFee = subtotal >= 15_000_000 ? 0 : 300_000
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
      // Redirect to Paystack payment page
      window.location.href = json.url
    } catch (err: any) {
      toast.error(err.message ?? 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 64px 96px', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '64px', alignItems: 'start' }}>

      {/* Form */}
      <div>
        <h1 className="text-h1" style={{ marginBottom: '40px' }}>Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <section>
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
          </section>

          <section style={{ marginTop: '8px' }}>
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
          </section>

          <Button type="submit" loading={loading} size="lg" style={{ marginTop: '16px' }}>
            Pay {formatNaira(orderTotal)} with Paystack
          </Button>
        </form>
      </div>

      {/* Summary */}
      <div style={{ background: 'var(--color-bg-card)', border: '0.5px solid var(--color-border-medium)', borderRadius: 'var(--radius-xl)', padding: '32px', position: 'sticky', top: '100px' }}>
        <h2 className="text-h3" style={{ marginBottom: '20px' }}>Summary</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {items.map((item) => (
            <div key={`${item.product.id}-${item.selectedColor}`} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-secondary)', flex: 1 }}>
                {item.product.name} ×{item.quantity}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                {formatNaira(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '0.5px solid var(--color-border-subtle)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-accent-gold)' }}>{formatNaira(orderTotal)}</span>
        </div>
      </div>
    </div>
  )
}
