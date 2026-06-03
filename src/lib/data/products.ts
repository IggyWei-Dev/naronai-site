import type { Product } from '@/types'

const I = [
  '/assets/images/collections/shop-luxury-wigs.png',       // 0
  '/assets/images/brand-story-portrait.png',                // 1
  '/assets/images/collections/membership-vip.png',          // 2
  '/assets/images/hero/Gemini_Generated_Image_n11mf5n11mf5n11m.png', // 3
  '/assets/images/collections/experiences-beauty.png',      // 4
  '/assets/images/collections/impact-story.png',            // 5
]

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'the-adanna',
    name: 'The Adanna',
    description:
      'A body wave lace front crafted from unprocessed Virgin Malaysian hair. The Adanna moves with intention — full, unhurried, and entirely yours.',
    price: 89000,
    images: [I[0]],
    tier: 'Signature',
    inStock: true,
    isNew: false,
    lengths: ['18"', '20"', '22"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Dark Brown', hex: '#3d2314' },
    ],
    category: 'Lace Front',
    createdAt: '2024-09-10',
  },
  {
    id: 'p2',
    slug: 'the-chioma',
    name: 'The Chioma',
    description:
      'Bone straight perfection on a 13×4 HD lace front. The Chioma is the wig women describe as the one that changed how they walk.',
    price: 105000,
    images: [I[1]],
    tier: 'Signature',
    inStock: true,
    isNew: false,
    lengths: ['16"', '18"', '20"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Dark Auburn', hex: '#5c1f1a' },
    ],
    category: 'Lace Front',
    createdAt: '2024-08-22',
  },
  {
    id: 'p3',
    slug: 'the-amara',
    name: 'The Amara',
    description:
      'Deep wave 360 lace on Brazilian virgin hair. Volume and movement in equal measure. The Amara arrives and announces itself.',
    price: 98000,
    images: [I[2]],
    tier: 'Signature',
    inStock: true,
    isNew: false,
    lengths: ['20"', '22"', '24"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Dark Brown', hex: '#3d2314' },
      { name: 'Honey Blonde', hex: '#c8943a' },
    ],
    category: '360 Lace',
    createdAt: '2024-07-14',
  },
  {
    id: 'p4',
    slug: 'the-kemi',
    name: 'The Kemi',
    description:
      'A curly bob glueless wig on Peruvian virgin hair. Short, deliberate, effortless. The Kemi is for the woman who needs no more than 14 inches to own a room.',
    price: 115000,
    images: [I[3]],
    tier: 'Signature',
    inStock: true,
    isNew: true,
    lengths: ['12"', '14"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Dark Brown', hex: '#3d2314' },
    ],
    category: 'Glueless',
    createdAt: '2024-10-28',
  },
  {
    id: 'p5',
    slug: 'the-ngozi',
    name: 'The Ngozi',
    description:
      'Full lace bone straight on Vietnamese virgin hair, pre-plucked and bleached knots. The Ngozi offers a finish so natural it requires an explanation.',
    price: 158000,
    images: [I[4]],
    tier: 'Couture',
    inStock: true,
    isNew: false,
    lengths: ['18"', '20"', '22"', '24"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Dark Brown', hex: '#3d2314' },
    ],
    category: 'Full Lace',
    createdAt: '2024-06-05',
  },
  {
    id: 'p6',
    slug: 'the-ifeoma',
    name: 'The Ifeoma',
    description:
      'Water wave full lace with invisible HD film. The Ifeoma is the one that changes the question from "where did you do your hair?" to "is that your real hair?"',
    price: 175000,
    images: [I[5]],
    tier: 'Couture',
    inStock: true,
    isNew: false,
    lengths: ['20"', '22"', '24"', '26"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Burgundy', hex: '#6b1a2a' },
    ],
    category: 'Full Lace',
    createdAt: '2024-05-18',
  },
  {
    id: 'p7',
    slug: 'the-nnenna',
    name: 'The Nnenna',
    description:
      'Kinky coily 13×6 lace front on afro-textured virgin hair. The Nnenna is the statement that needs no translation.',
    price: 148000,
    images: [I[0]],
    tier: 'Couture',
    inStock: true,
    isNew: false,
    lengths: ['14"', '16"', '18"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Dark Brown', hex: '#3d2314' },
    ],
    category: 'Lace Front',
    createdAt: '2024-09-02',
  },
  {
    id: 'p8',
    slug: 'the-funmi',
    name: 'The Funmi',
    description:
      'Highlighted loose deep wave on Brazilian Remy. Golden notes woven through deep cocoa. The Funmi is for days that deserve something extra.',
    price: 185000,
    images: [I[1]],
    tier: 'Couture',
    inStock: false,
    isNew: false,
    lengths: ['22"', '24"', '26"'],
    colors: [
      { name: 'Honey Blonde', hex: '#c8943a' },
      { name: 'Dark Auburn', hex: '#5c1f1a' },
    ],
    category: 'Full Lace',
    createdAt: '2024-04-12',
  },
  {
    id: 'p9',
    slug: 'the-adaeze',
    name: 'The Adaeze',
    description:
      'Silk straight full lace on raw Vietnamese hair with a silk top base. Custom-ventilated, pre-plucked hairline, bleached knots. The Adaeze is built for permanence.',
    price: 248000,
    images: [I[2]],
    tier: 'Bespoke',
    inStock: true,
    isNew: true,
    lengths: ['20"', '22"', '24"', '26"', '28"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Dark Brown', hex: '#3d2314' },
      { name: 'Dark Auburn', hex: '#5c1f1a' },
    ],
    category: 'Full Lace',
    createdAt: '2024-10-30',
  },
  {
    id: 'p10',
    slug: 'the-zara',
    name: 'The Zara',
    description:
      'Burgundy-toned body wave on raw Indian hair, hand-sewn full lace, custom density to specification. The Zara enters a room and makes colour mean something.',
    price: 295000,
    images: [I[3]],
    tier: 'Bespoke',
    inStock: true,
    isNew: false,
    lengths: ['22"', '24"', '26"', '28"'],
    colors: [
      { name: 'Burgundy', hex: '#6b1a2a' },
      { name: 'Dark Auburn', hex: '#5c1f1a' },
    ],
    category: 'Full Lace',
    createdAt: '2024-07-30',
  },
  {
    id: 'p11',
    slug: 'the-oluwaseun',
    name: 'The Oluwaseun',
    description:
      'Loose wave 360 lace with custom parting space and single-donor raw hair. Every unit is signed off by a consultant before it leaves. The Oluwaseun is not rushed.',
    price: 320000,
    images: [I[4]],
    tier: 'Bespoke',
    inStock: true,
    isNew: false,
    lengths: ['24"', '26"', '28"', '30"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Dark Brown', hex: '#3d2314' },
    ],
    category: '360 Lace',
    createdAt: '2024-03-20',
  },
  {
    id: 'p12',
    slug: 'the-tobechukwu',
    name: 'The Tobechukwu',
    description:
      'Bone straight silk top full lace, raw Vietnamese single-donor hair, custom cap construction per head measurement. The Tobechukwu is the highest expression of the collection.',
    price: 375000,
    images: [I[5]],
    tier: 'Bespoke',
    inStock: false,
    isNew: false,
    lengths: ['20"', '22"', '24"', '26"', '28"', '30"'],
    colors: [
      { name: 'Natural Black', hex: '#1a1a1a' },
      { name: 'Dark Brown', hex: '#3d2314' },
    ],
    category: 'Full Lace',
    createdAt: '2024-02-08',
  },
]

export const ALL_LENGTHS = ['12"', '14"', '16"', '18"', '20"', '22"', '24"', '26"', '28"', '30"']
export const ALL_COLORS  = ['Natural Black', 'Dark Brown', 'Honey Blonde', 'Dark Auburn', 'Burgundy']
