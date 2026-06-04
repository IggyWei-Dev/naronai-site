import { HeroSection }        from '@/components/home/HeroSection'
import { FeatureStrip }       from '@/components/home/FeatureStrip'
import { BrandStoryPanel }    from '@/components/home/BrandStoryPanel'
import { CollectionsGrid }    from '@/components/home/CollectionsGrid'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { CtaSection }          from '@/components/home/CtaSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureStrip />
      <BrandStoryPanel />
      <CollectionsGrid />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
