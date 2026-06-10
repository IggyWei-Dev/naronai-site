// Run once: npx tsx scripts/seed-products.ts
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(process.cwd(), '.env.local') })

import { PRODUCTS } from '../src/lib/data/products'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function seed() {
  console.log(`Seeding ${PRODUCTS.length} products…`)

  for (const p of PRODUCTS) {
    const { error } = await supabase.from('products').upsert({
      slug:        p.slug,
      name:        p.name,
      description: p.description,
      price:       p.price,           // already in kobo in products.ts
      images:      p.images,
      tier:        p.tier ?? null,
      in_stock:    p.inStock,
      is_new:      p.isNew ?? false,
      hair_type:   p.hairType  ?? null,
      density:     p.density   ?? null,
      cap_type:    p.capType   ?? null,
      origin:      p.origin    ?? null,
      category:    p.category  ?? null,
      colors:      p.colors    ?? [],
      lengths:     p.lengths   ?? [],
      created_at:  p.createdAt,
    }, { onConflict: 'slug' })

    if (error) {
      console.error(`  ✗ ${p.name}: ${error.message}`)
    } else {
      console.log(`  ✓ ${p.name}`)
    }
  }

  console.log('Done.')
}

seed()
