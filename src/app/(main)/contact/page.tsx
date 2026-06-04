'use client'

import { useState }        from 'react'
import { motion }          from 'framer-motion'
import { useForm }         from 'react-hook-form'
import { zodResolver }     from '@hookform/resolvers/zod'
import { z }               from 'zod'
import { FormInput }       from '@/components/ui/FormInput'
import { FormTextarea }    from '@/components/ui/FormInput'
import { CheckCircle }     from 'lucide-react'

const REASONS = [
  'General Inquiry',
  'Order Support',
  'Custom Order',
  'Book a Consultation',
  'Media & Press',
  'Partnership',
] as const

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName:  z.string().min(1, 'Required'),
  email:     z.string().email('Invalid email'),
  reason:    z.string().min(1, 'Please select a reason'),
  message:   z.string().min(10, 'Please tell us a bit more'),
})

type FormData = z.infer<typeof schema>

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { reason: '' },
  })

  const selectedReason = watch('reason')

  const onSubmit = async (_data: FormData) => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <>
      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .contact-grid { grid-template-columns: 1fr; gap: 48px; }
        }
      `}</style>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(120px, 14vw, 160px) clamp(24px, 5vw, 80px) 96px',
      }}>
        <div className="contact-grid">

          {/* ── Left: brand copy + contact info ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <p style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-gold)',
              marginBottom: '20px',
            }}>
              Get in Touch
            </p>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 54px)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'var(--color-text)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0 0 24px',
            }}>
              We'd love to hear from you.
            </h1>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '15px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.75,
              maxWidth: '400px',
              margin: '0 0 48px',
            }}>
              Whether you have a question about your order, want to book a private consultation, or are curious about a custom piece — reach out and a member of the Naronai team will be in touch within 24 hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <ContactDetail label="Email" value="hello@naronai.com" href="mailto:hello@naronai.com" />
              <ContactDetail label="WhatsApp" value="+234 800 000 0000" href="https://wa.me/2348000000000" />
              <ContactDetail label="Instagram" value="@naronai" href="https://instagram.com/naronai" />
            </div>

            <div style={{
              marginTop: '48px',
              padding: '24px',
              background: 'rgba(195,160,91,0.05)',
              border: '0.5px solid rgba(195,160,91,0.15)',
              borderRadius: 'var(--radius-md)',
            }}>
              <p style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '9px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--color-accent-gold)',
                marginBottom: '10px',
              }}>
                Hours
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0 }}>
                Monday – Friday, 9 am – 6 pm WAT<br />
                Saturday, 10 am – 3 pm WAT
              </p>
            </div>
          </motion.div>

          {/* ── Right: form or success ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {submitted ? (
              <SuccessState />
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormInput label="First Name" id="firstName" error={errors.firstName?.message} {...register('firstName')} />
                  <FormInput label="Last Name"  id="lastName"  error={errors.lastName?.message}  {...register('lastName')} />
                </div>

                <FormInput label="Email" id="email" type="email" error={errors.email?.message} {...register('email')} />

                {/* Reason selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-secondary)',
                  }}>
                    Reason
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {REASONS.map(r => {
                      const active = selectedReason === r
                      return (
                        <label key={r} style={{ cursor: 'pointer' }}>
                          <input
                            type="radio"
                            value={r}
                            {...register('reason')}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                          />
                          <span style={{
                            display: 'inline-block',
                            fontFamily: 'var(--font-ui)',
                            fontSize: '10px',
                            letterSpacing: '0.06em',
                            padding: '7px 14px',
                            borderRadius: '20px',
                            border: `0.5px solid ${active ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                            background: active ? 'var(--color-accent-primary)' : 'transparent',
                            color: active ? '#F4ECE5' : 'var(--color-text-muted)',
                            transition: 'all 150ms ease',
                            userSelect: 'none',
                          }}>
                            {r}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.reason && (
                    <motion.span
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18 }}
                      style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#e57373' }}
                    >
                      {errors.reason.message}
                    </motion.span>
                  )}
                </div>

                <FormTextarea
                  label="Message"
                  id="message"
                  placeholder="Tell us what's on your mind…"
                  error={errors.message?.message}
                  {...register('message')}
                  style={{ minHeight: '140px' }}
                />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={loading ? undefined : { scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                  style={{
                    marginTop: '4px',
                    padding: '16px',
                    background: loading ? 'var(--color-border)' : '#7A2F4B',
                    color: '#F4ECE5',
                    border: 'none',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 200ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {loading && (
                    <span style={{
                      width: '12px', height: '12px',
                      border: '1.5px solid rgba(244,236,229,0.4)',
                      borderTopColor: '#F4ECE5',
                      borderRadius: '50%',
                      display: 'inline-block',
                      animation: 'spin 0.8s linear infinite',
                    }} />
                  )}
                  {loading ? 'Sending…' : 'Send Message'}
                </motion.button>

              </form>
            )}
          </motion.div>

        </div>
      </div>
    </>
  )
}

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 32px',
        gap: '20px',
        background: 'rgba(195,160,91,0.04)',
        border: '0.5px solid rgba(195,160,91,0.15)',
        borderRadius: 'var(--radius-lg)',
        minHeight: '360px',
      }}
    >
      <CheckCircle size={40} style={{ color: 'var(--color-accent-gold)' }} />
      <div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '26px',
          fontWeight: 300,
          color: 'var(--color-text)',
          margin: '0 0 10px',
        }}>
          Message received ✦
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.65,
          maxWidth: '300px',
          margin: '0 auto',
        }}>
          A member of the Naronai team will be in touch within 24 hours.
        </p>
      </div>
    </motion.div>
  )
}

function ContactDetail({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <span style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '9px',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
      }}>
        {label}
      </span>
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text)',
          textDecoration: 'none',
          transition: 'color 150ms ease',
        }}
      >
        {value}
      </a>
    </div>
  )
}
