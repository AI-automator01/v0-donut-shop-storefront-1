export type Allergen = 'nuts' | 'dairy'

export interface Donut {
  id: string
  name: string
  category: 'classics' | 'artisans' | 'kids'
  description: string
  price: number
  color: string        // tailwind bg class for the icon
  ringColor: string    // tailwind ring / border class
  allergens: Allergen[]
  emoji: string
}

export const DONUTS: Donut[] = [
  // ── Classics ──────────────────────────────────────────────────────────────
  {
    id: 'glazed',
    name: 'Classic Glazed',
    category: 'classics',
    description: 'Our original 5cm ring, hand-dipped in silky vanilla glaze. Simple perfection.',
    price: 1.5,
    color: 'bg-yellow-100',
    ringColor: 'ring-yellow-300',
    allergens: ['dairy'],
    emoji: '🍩',
  },
  {
    id: 'choc-sprinkles',
    name: 'Chocolate Sprinkles',
    category: 'classics',
    description: 'Rich chocolate ganache topped with a rainbow of sprinkles on a 5cm base.',
    price: 1.75,
    color: 'bg-amber-800',
    ringColor: 'ring-amber-600',
    allergens: ['dairy'],
    emoji: '🍩',
  },

  // ── Artisans ───────────────────────────────────────────────────────────────
  {
    id: 'lemon-lavender',
    name: 'Lemon Lavender',
    category: 'artisans',
    description: 'Zesty lemon curd glaze kissed with dried lavender on a fluffy 5cm ring.',
    price: 2.25,
    color: 'bg-purple-200',
    ringColor: 'ring-purple-300',
    allergens: ['dairy'],
    emoji: '💜',
  },
  {
    id: 'maple-bacon',
    name: 'Maple Bacon',
    category: 'artisans',
    description: 'Vermont maple glaze crowned with candied bacon crumbles. Our 5cm showstopper.',
    price: 2.5,
    color: 'bg-orange-300',
    ringColor: 'ring-orange-400',
    allergens: [],
    emoji: '🥓',
  },
  {
    id: 'matcha-bliss',
    name: 'Matcha Bliss',
    category: 'artisans',
    description: 'Stone-ground ceremonial matcha glaze with white sesame. Dairy-free 5cm bliss.',
    price: 2.25,
    color: 'bg-green-300',
    ringColor: 'ring-green-400',
    allergens: [],
    emoji: '🍵',
  },

  // ── Kids' Zone ────────────────────────────────────────────────────────────
  {
    id: 'galaxy-swirl',
    name: 'Galaxy Swirl',
    category: 'kids',
    description: 'Cosmic blue-purple frosting with edible silver stars on a 5cm wonder.',
    price: 2.0,
    color: 'bg-indigo-400',
    ringColor: 'ring-indigo-500',
    allergens: ['dairy'],
    emoji: '🌌',
  },
  {
    id: 'cookie-monster',
    name: 'Cookie Monster',
    category: 'kids',
    description: 'Electric blue frosting loaded with cookie crumbs. 5cm of pure joy.',
    price: 2.0,
    color: 'bg-blue-400',
    ringColor: 'ring-blue-500',
    allergens: ['dairy'],
    emoji: '🍪',
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    category: 'kids',
    description: 'Fluffy pink-and-blue swirl frosting that tastes like the fairground — 5cm fun.',
    price: 2.0,
    color: 'bg-pink-300',
    ringColor: 'ring-pink-400',
    allergens: ['dairy'],
    emoji: '🎀',
  },
]

export const CATEGORIES = [
  { key: 'classics', label: 'The Classics' },
  { key: 'artisans', label: 'The Artisans' },
  { key: 'kids',     label: "The Kids' Zone" },
] as const

export const BUNDLE_SIZES = [
  { key: 'small',  label: 'Small Box',  slots: 6,  price: 9.5  },
  { key: 'party',  label: 'Party Box',  slots: 12, price: 18.0 },
  { key: 'mega',   label: 'Mega Box',   slots: 24, price: 34.0 },
] as const

export type BundleKey = typeof BUNDLE_SIZES[number]['key']

export const PICKUP_TIMES = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM',  '1:00 PM',  '1:30 PM',
   '2:00 PM',  '2:30 PM',  '3:00 PM',  '3:30 PM',
   '4:00 PM',  '4:30 PM',  '5:00 PM',
]
