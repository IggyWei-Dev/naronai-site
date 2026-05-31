export const metadata = { title: 'About Us' }
export default function AboutPage() {
  return (
    <div style={{ padding: '96px 64px', maxWidth: '1440px', margin: '0 auto' }}>
      <h1 className="text-display" style={{ marginBottom: '40px' }}>Our Story</h1>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.75, maxWidth: '720px', color: 'var(--color-text-secondary)' }}>
        Naronai was born from a vision of luxury that feels personal — wigs crafted for the woman who refuses to go unnoticed. Every piece is a statement. Every customer, a muse.
      </p>
    </div>
  )
}
