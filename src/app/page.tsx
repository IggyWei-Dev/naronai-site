import { HeroSection }        from '@/components/home/HeroSection'
import { FeatureStrip }       from '@/components/home/FeatureStrip'
import { BrandStoryPanel }    from '@/components/home/BrandStoryPanel'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { NewsletterSection }  from '@/components/home/NewsletterSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureStrip />
      <BrandStoryPanel />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  )
}
