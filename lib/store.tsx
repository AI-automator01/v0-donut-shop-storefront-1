'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { BUNDLE_SIZES, TOPPERS, type BundleKey, type Donut } from './donuts'

export interface BoxSlot {
  id: string       // unique per slot instance
  donut: Donut
}

interface StoreState {
  bundleKey: BundleKey
  slots: BoxSlot[]
  hideNuts: boolean
  hideDairy: boolean
  cartOpen: boolean
  pickupTime: string
  selectedToppings: string[] // Array of selected topping IDs
  selectedTopperId: string   // ID of selected premium topper
  setBundleKey: (k: BundleKey) => void
  addDonut: (donut: Donut) => void
  removeSlot: (id: string) => void
  setHideNuts: (v: boolean) => void
  setHideDairy: (v: boolean) => void
  setCartOpen: (v: boolean) => void
  setPickupTime: (t: string) => void
  toggleTopping: (id: string) => void
  setTopperId: (id: string) => void
  totalSlots: number
  bundlePrice: number
}

const StoreContext = createContext<StoreState | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bundleKey, setBundleKeyState] = useState<BundleKey>('small')
  const [slots, setSlots] = useState<BoxSlot[]>([])
  const [hideNuts, setHideNuts] = useState(false)
  const [hideDairy, setHideDairy] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [pickupTime, setPickupTime] = useState('')
  
  // Custom Customization Add-On States
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [selectedTopperId, setSelectedTopperId] = useState<string>('')

  const bundle = BUNDLE_SIZES.find((b) => b.key === bundleKey)!

  // ── DYNAMIC SYSTEM PRICE CALCULATION ──────────────────────────────────────
  let calculatedPrice = 0

  if ('price' in bundle && typeof bundle.price === 'number') {
    // For Doníssima Classic / Magic tiers, use the structural matrix flat pricing
    calculatedPrice = bundle.price
  } else {
    // Fallback default calculation: total of each added element's native price value
    calculatedPrice = slots.reduce((total, slot) => total + slot.donut.price, 0)
  }

  // Inject any premium topper selection price into the final box layout total
  const activeTopper = TOPPERS.find(t => t.id === selectedTopperId)
  if (activeTopper) {
    calculatedPrice += activeTopper.price
  }
  // ───────────────────────────────────────────────────────────────────────────

  const setBundleKey = useCallback((k: BundleKey) => {
    setBundleKeyState(k)
    setSlots([])
    setSelectedToppings([]) // Reset customizations when size swaps
    setSelectedTopperId('')
  }, [])

  const addDonut = useCallback(
    (donut: Donut) => {
      setSlots((prev) => {
        if (prev.length >= bundle.slots) return prev
        return [...prev, { id: `${donut.id}-${Date.now()}-${Math.random()}`, donut }]
      })
    },
    [bundle.slots],
  )

  const removeSlot = useCallback((id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const toggleTopping = useCallback((id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    )
  }, [])

  const setTopperId = useCallback((id: string) => {
    setSelectedTopperId((prev) => (prev === id ? '' : id)) // Click again to remove toggle
  }, [])

  return (
    <StoreContext.Provider
      value={{
        bundleKey,
        slots,
        hideNuts,
        hideDairy,
        cartOpen,
        pickupTime,
        selectedToppings,
        selectedTopperId,
        setBundleKey,
        addDonut,
        removeSlot,
        setHideNuts,
        setHideDairy,
        setCartOpen,
        setPickupTime,
        toggleTopping,
        setTopperId,
        totalSlots: bundle.slots,
        bundlePrice: calculatedPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}