export type Allergen = 'nuts' | 'dairy'

export interface Donut {
  id: string
  name: string
  category: 'classics' | 'magic' | 'alternative_formats' | 'specialty' 
  description: string
  price: number
  color: string        // tailwind bg class for the icon
  ringColor: string    // tailwind ring / border class
  allergens: Allergen[]
  emoji: string
}

export const DONUTS: Donut[] = [
  // ── Classics (Per Unit Pricing) ──
  {
    id: 'classic-glazed',
    name: 'Classic Glazed',
    category: 'classics',
    description: 'Traditional handcrafted glaze over a light mini donut base.',
    price: 0.20,
    color: 'bg-yellow-100',
    ringColor: 'ring-yellow-300',
    allergens: ['dairy'],
    emoji: '🍩',
  },
  {
    id: 'condensed-milk',
    name: 'Condensed Milk',
    category: 'classics',
    description: 'Sweet, rich condensed milk glaze drizzle.',
    price: 0.20,
    color: 'bg-sky-100',
    ringColor: 'ring-sky-300',
    allergens: ['dairy'],
    emoji: '🥛',
  },

  // ── Magic / Premium Glazes (Per Unit Pricing) ──
  {
    id: 'dulce-de-leche',
    name: 'Dulce de Leche (Arequipe)',
    category: 'magic',
    description: 'Traditional smooth and creamy dulce de leche covering.',
    price: 0.25,
    color: 'bg-amber-200',
    ringColor: 'ring-amber-400',
    allergens: ['dairy'],
    emoji: '🍯',
  },
  {
    id: 'colored-glaze',
    name: 'Colored Glaze',
    category: 'magic',
    description: 'Vibrant, beautifully colored custom decorative frosting coat.',
    price: 0.25,
    color: 'bg-fuchsia-200',
    ringColor: 'ring-fuchsia-400',
    allergens: ['dairy'],
    emoji: '🎨',
  },
  {
    id: 'chocolate',
    name: 'Chocolate',
    category: 'magic',
    description: 'Deep chocolate luxury glaze couverture.',
    price: 0.25,
    color: 'bg-amber-900',
    ringColor: 'ring-amber-700',
    allergens: ['dairy'],
    emoji: '🍫',
  },

  // ── Alternative Individual Formats ──
  {
    id: 'donissima-temptation',
    name: 'Doníssima Temptation (Cup Format)',
    category: 'alternative_formats',
    description: '6 mini donuts bundled in a cup with custom coating and topping selection.',
    price: 1.50,
    color: 'bg-rose-200',
    ringColor: 'ring-rose-400',
    allergens: ['dairy'],
    emoji: '🥤',
  },
  {
    id: 'tri-donissima',
    name: 'Tri-Doníssima (On a Stick / Skewer)',
    category: 'alternative_formats',
    description: '3 delicious mini donuts skewered on a stick with custom toppings.',
    price: 1.00,
    color: 'bg-orange-200',
    ringColor: 'ring-orange-400',
    allergens: ['dairy'],
    emoji: '🍡',
  },
  {
    id: 'deli-donissima',
    name: 'Deli-Doníssima (Container Format)',
    category: 'alternative_formats',
    description: '8 mini donuts safely packaged inside a specialized catering pack with glaze and toppings.',
    price: 2.00,
    color: 'bg-teal-200',
    ringColor: 'ring-teal-400',
    allergens: ['dairy'],
    emoji: '🍱',
  },

  // ── Specialty ──
  {
    id: 'tower-of-the-moment',
    name: 'The Tower of the Moment',
    category: 'specialty',
    description: 'Mini doughnuts stacked like a sweet work of art.',
    price: 200.0,
    color: 'bg-indigo-400',
    ringColor: 'ring-indigo-500',
    allergens: ['dairy'],
    emoji: '🌌',
  },
]

export const TOPPINGS = [
  { id: 'sprinkles-colored', name: 'Rainbow Sprinkles' },
  { id: 'sprinkles-chocolate', name: 'Chocolate Sprinkles' }
]

// FIXED NAME FROM TOPTERS -> TOPPERS
export const TOPPERS = [
  { id: 'topper-simple', name: 'Simple Topper', price: 1.50 },
  { id: 'topper-custom', name: 'Custom Topper', price: 3.00 },
  { id: 'topper-vip', name: 'VIP Custom Topper', price: 5.00 }
]

export const CATEGORIES = [
  { key: 'classics', label: 'Classics Base (Minis)' },
  { key: 'magic', label: 'Magic Base (Minis)' },
  { key: 'alternative_formats', label: 'Individual Formats' },
  { key: 'specialty', label: 'Specialty Designs' }
] as const

export const BUNDLE_SIZES = [
  { key: 'small', label: 'Small Box', slots: 6 },
  { key: 'party', label: 'Party Box', slots: 12 },
  { key: 'mega1', label: 'Mega Box', slots: 24 },
  
  { key: 'classic-24', label: 'Doníssima Classic (24 Minis)', slots: 24, price: 10.00 },
  { key: 'classic-48', label: 'Doníssima Classic Tower (48 Minis)', slots: 48, price: 20.00 },
  { key: 'classic-60', label: 'Doníssima Classic Tower (60 Minis)', slots: 60, price: 30.00 },
  
  { key: 'magic-24', label: 'Doníssima Magic (24 Minis)', slots: 24, price: 15.00 },
  { key: 'magic-48', label: 'Doníssima Magic Tower (48 Minis)', slots: 48, price: 30.00 },
  { key: 'magic-60', label: 'Doníssima Magic Tower (60 Minis)', slots: 60, price: 45.00 }
] as const

export type BundleKey = typeof BUNDLE_SIZES[number]['key']

export const PICKUP_TIMES = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM'
]

export const ORDER_POLICY = {
  advanceDaysRequired: 3,
  downPaymentPercentage: 50,
  noticeText: 'Orders must be placed with at least 3 days advance notice. A 50% down payment is required to confirm your order slot.'
}