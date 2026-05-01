'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { BUNDLE_SIZES, type BundleKey, type Donut } from './donuts'

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
  setBundleKey: (k: BundleKey) => void
  addDonut: (donut: Donut) => void
  removeSlot: (id: string) => void
  setHideNuts: (v: boolean) => void
  setHideDairy: (v: boolean) => void
  setCartOpen: (v: boolean) => void
  setPickupTime: (t: string) => void
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

  const bundle = BUNDLE_SIZES.find((b) => b.key === bundleKey)!

  const setBundleKey = useCallback((k: BundleKey) => {
    setBundleKeyState(k)
    setSlots([])
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

  return (
    <StoreContext.Provider
      value={{
        bundleKey,
        slots,
        hideNuts,
        hideDairy,
        cartOpen,
        pickupTime,
        setBundleKey,
        addDonut,
        removeSlot,
        setHideNuts,
        setHideDairy,
        setCartOpen,
        setPickupTime,
        totalSlots: bundle.slots,
        bundlePrice: bundle.price,
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
