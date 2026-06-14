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
  id: string       
  donut: Donut
}

interface StoreState {
  bundleKey: BundleKey
  slots: BoxSlot[]
  hideNuts: boolean
  hideDairy: boolean
  cartOpen: boolean
  pickupTime: string
  selectedToppings: string[] 
  selectedTopperId: string   
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
  const [bundleKey, setBundleKeyState] = useState<BundleKey>('classic-6')
  const [slots, setSlots] = useState<BoxSlot[]>([])
  const [hideNuts, setHideNuts] = useState(false)
  const [hideDairy, setHideDairy] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [pickupTime, setPickupTime] = useState('')
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [selectedTopperId, setSelectedTopperId] = useState<string>('')

  const bundle = BUNDLE_SIZES.find((b) => b.key === bundleKey)!

  // ── HYBRID PRICING CALCULATOR MATRIX ──────────────────────────────────────
  let calculatedPrice = 0

  if (bundle && 'price' in bundle && typeof bundle.price === 'number') {
    calculatedPrice = bundle.price
  } else {
    calculatedPrice = slots.reduce((total, slot) => total + slot.donut.price, 0)
  }

  const activeTopper = TOPPERS.find(t => t.id === selectedTopperId)
  if (activeTopper) {
    calculatedPrice += activeTopper.price
  }
  // ───────────────────────────────────────────────────────────────────────────

  const setBundleKey = useCallback((k: BundleKey) => {
    setBundleKeyState(k)
    setSlots([])
    setSelectedToppings([]) 
    setSelectedTopperId('')
  }, [])

  // ── UPDATED ADD DONUT RULE CHECK ──────────────────────────────────────────
  const addDonut = useCallback(
    (donut: Donut) => {
      // 1. Check if the box configuration limits are hit
      if (slots.length >= bundle.slots) return

      // 2. Enforce Classic Box restrictions
      if (bundleKey.startsWith('classic-') && donut.category !== 'classics') {
        alert("You selected a Doníssima Classic box. You can only fill it with Classic flavors!")
        return
      }

      // 3. Enforce Magic Box restrictions
      if (bundleKey.startsWith('magic-') && donut.category !== 'magic') {
        alert("You selected a Doníssima Magic box. You can only fill it with Magic flavors!")
        return
      }

      // 4. Safely append item if rules clear successfully
      setSlots((prev) => [
        ...prev, 
        { id: `${donut.id}-${Date.now()}-${Math.random()}`, donut }
      ])
    },
    [bundle?.slots, bundleKey, slots.length],
  )
  // ───────────────────────────────────────────────────────────────────────────

  const removeSlot = useCallback((id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const toggleTopping = useCallback((id: string) => {
    setSelectedToppings((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    )
  }, [])

  const setTopperId = useCallback((id: string) => {
    setSelectedTopperId((prev) => (prev === id ? '' : id)) 
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
        totalSlots: bundle?.slots || 24,
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