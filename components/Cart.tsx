'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, Calendar, AlertTriangle, Sparkles, Award } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PICKUP_TIMES, BUNDLE_SIZES, ORDER_POLICY, TOPPINGS, TOPPERS } from '@/lib/donuts'

// Hard-coded sprinkles pricing tier matching the box sizes
function getSprinklesCost(donutCount: number): number {
  if (donutCount <= 6)   return 0.50 
  if (donutCount <= 12)  return 1.00 
  if (donutCount <= 24)  return 2.00 
  if (donutCount <= 48)  return 3.50 
  return 4.50                        
}

export default function Cart() {
  const {
    cartOpen,
    setCartOpen,
    slots,
    removeSlot,
    bundleKey,
    totalSlots,
    bundlePrice,
    pickupTime,
    setPickupTime,
    selectedToppings, 
    selectedTopperId,
    toggleTopping,
    setTopperId,
  } = useStore()

  const [pickupDate, setPickupDate] = useState<string>('')
  const bundle = BUNDLE_SIZES.find((b) => b.key === bundleKey)!

  // Group slots by donut flavor selection
  const grouped = slots.reduce<Record<string, { name: string; count: number; id: string; price: number }>>((acc, s) => {
    if (acc[s.donut.id]) {
      acc[s.donut.id].count++
    } else {
      acc[s.donut.id] = { name: s.donut.name, count: 1, id: s.donut.id, price: s.donut.price }
    }
    return acc
  }, {})

  const getMinDateString = (): string => {
    const minDate = new Date()
    minDate.setDate(minDate.getDate() + ORDER_POLICY.advanceDaysRequired)
    return minDate.toISOString().split('T')[0]
  }

  const isDateValid = (): boolean => {
    if (!pickupDate) return false
    const selected = new Date(pickupDate + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diffTime = selected.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= ORDER_POLICY.advanceDaysRequired
  }

  // Calculate add-on costs dynamically
  const dynamicSprinklePrice = selectedToppings.length > 0 ? getSprinklesCost(totalSlots) : 0
  const activeTopper = TOPPERS.find(t => t.id === selectedTopperId)
  const topperPrice = activeTopper ? activeTopper.price : 0
  
  // Combined Grand Total
  const finalCalculatedTotal = bundlePrice + dynamicSprinklePrice + topperPrice

  const canCheckout = slots.length === totalSlots && pickupTime !== '' && isDateValid()

  // Enforces Mutually Exclusive Topping Rule
  const handleToppingSelection = (toppingId: string) => {
    const isCurrentlySelected = selectedToppings.includes(toppingId)

    if (isCurrentlySelected) {
      toggleTopping(toppingId)
    } else {
      selectedToppings.forEach((id) => {
        toggleTopping(id)
      })
      toggleTopping(toppingId)
    }
  }

  // Explicit global removal function for toppings
  const clearAllToppings = () => {
    selectedToppings.forEach((id) => {
      toggleTopping(id)
    })
  }

  const handleWhatsAppCheckout = () => {
    if (!canCheckout) return

    const phoneNumber = '584120895577' 

    const itemsList = Object.values(grouped)
      .map((item) => `- ${item.name} (x${item.count})`)
      .join('%0A')

    const activeToppingsNames = selectedToppings.length > 0 
      ? selectedToppings.map(id => TOPPINGS.find(t => t.id === id)?.name).filter(Boolean).join(', ')
      : 'None'

    const activeTopperName = activeTopper ? activeTopper.name : 'None Included'

    const messageText = 
      `*NEW DONUT ORDER*%0A%0A` +
      `*Box Type:* ${bundle.label} (${totalSlots} Units)%0A` +
      `*Pickup Date:* ${pickupDate}%0A` +
      `*Pickup Time:* ${pickupTime}%0A%0A` +
      `*Selected Flavors:*%0A${itemsList}%0A%0A` +
      `*Box Add-ons:*%0A` +
      `- *Toppings (Sprinkles):* ${activeToppingsNames} (${dynamicSprinklePrice > 0 ? `+$${dynamicSprinklePrice.toFixed(2)}` : 'Included/None'})%0A` +
      `- *Topper Plate:* ${activeTopperName} (${topperPrice > 0 ? `+$${topperPrice.toFixed(2)}` : 'None'})%0A%0A` +
      `*Total Amount:* $${finalCalculatedTotal.toFixed(2)}%0A%0A` +
      `*Notice:* I understand that a 50% down payment is required to confirm.%0A%0A` +
      `Please let me know if my order is confirmed! Thank you!`

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${messageText}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
          />

          {/* Drawer Sidebar */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-card shadow-2xl flex flex-col"
          >
            {/* Header section */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-black text-xl text-foreground">Your Box</h2>
              <button onClick={() => setCartOpen(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Progress Bar Info */}
            <div className="px-5 py-3 bg-secondary/50 border-b border-border">
              <p className="font-bold text-secondary-foreground text-sm">
                {bundle.label} — {slots.length}/{totalSlots} selected
              </p>
              <div className="h-2 bg-border rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${(slots.length / totalSlots) * 100}%` }}
                />
              </div>
            </div>

            {/* Advance Notice Alert */}
            <div className="mx-5 mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl flex gap-2 items-start">
              <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-amber-800 dark:text-amber-300 font-medium text-xs leading-tight">
                {ORDER_POLICY.noticeText}
              </p>
            </div>

            {/* Scrollable Main Section */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-6">
              
              {/* Flavor Summary List */}
              <div>
                <h3 className="font-black text-xs uppercase tracking-wider text-muted-foreground mb-2">Flavors Summary</h3>
                {slots.length === 0 ? (
                  <p className="text-xs text-muted-foreground font-medium py-2">Your box is completely empty.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {Object.values(grouped).map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-muted/40 p-2 rounded-xl text-xs">
                        <span className="font-bold text-foreground">
                          {item.name} <span className="text-primary font-black">×{item.count}</span>
                        </span>
                        <button
                          onClick={() => {
                            const slot = slots.findLast((s) => s.donut.id === item.id)
                            if (slot) removeSlot(slot.id)
                          }}
                          className="p-1 hover:bg-muted rounded-md text-destructive transition-colors"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── TOPPING SELECTION TRAY WITH REMOVE ACTION ── */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-muted-foreground">
                    <Sparkles size={14} className="text-primary" /> Select Box Toppings (Max 1)
                  </h3>
                  {selectedToppings.length > 0 ? (
                    <button 
                      onClick={clearAllToppings}
                      className="text-[10px] font-black text-destructive hover:underline bg-destructive/10 px-2 py-0.5 rounded-md transition-all"
                    >
                      Remove Topping
                    </button>
                  ) : (
                    <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                      +${getSprinklesCost(totalSlots).toFixed(2)} total
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TOPPINGS.map((topping) => {
                    const isSelected = selectedToppings.includes(topping.id)
                    return (
                      <button
                        key={topping.id}
                        onClick={() => handleToppingSelection(topping.id)}
                        className={`p-3 rounded-xl border-2 text-left relative overflow-hidden transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-foreground font-bold shadow-sm'
                            : 'border-border bg-card text-muted-foreground font-semibold hover:border-primary/30'
                        }`}
                      >
                        <p className="text-xs text-foreground font-bold">{topping.name}</p>
                        <p className={`text-[10px] mt-1 font-medium ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                          {isSelected ? '✓ Selected' : 'Choose'}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Topper Element Tray */}
              <div>
                <h3 className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  <Award size={14} className="text-primary" /> Festive Topper Banner
                </h3>
                <div className="flex flex-col gap-2">
                  {TOPPERS.map((topper) => {
                    const isSelected = selectedTopperId === topper.id
                    return (
                      <button
                        key={topper.id}
                        onClick={() => setTopperId(topper.id)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary/10 text-foreground shadow-sm font-bold'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold text-foreground">{topper.name}</p>
                          <p className="text-[10px] text-muted-foreground font-normal">Adds celebratory text banner overlay</p>
                        </div>
                        <span className="text-xs font-black text-primary bg-muted px-2 py-1 rounded-lg">
                          +${topper.price.toFixed(2)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>

            {/* Date & Time Logistics Pickers */}
            <div className="px-5 py-3 border-t border-border flex flex-col gap-3 bg-muted/30">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="pickup-date" className="flex items-center gap-1.5 font-bold text-foreground text-xs mb-1">
                    <Calendar size={14} className="text-primary" /> Date
                  </label>
                  <input
                    id="pickup-date"
                    type="date"
                    min={getMinDateString()}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 font-semibold text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label htmlFor="pickup-select" className="flex items-center gap-1.5 font-bold text-foreground text-xs mb-1">
                    <Clock size={14} className="text-primary" /> Time
                  </label>
                  <select
                    id="pickup-select"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full bg-card border border-border rounded-xl px-3 py-2 font-semibold text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select...</option>
                    {PICKUP_TIMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing Summary Footer */}
            <div className="px-5 py-4 border-t border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-foreground">Total order amount</span>
                <span className="font-black text-primary text-xl">${finalCalculatedTotal.toFixed(2)}</span>
              </div>
              <motion.button
                whileTap={canCheckout ? { scale: 0.96 } : {}}
                whileHover={canCheckout ? { scale: 1.02 } : {}}
                disabled={!canCheckout}
                onClick={handleWhatsAppCheckout}
                className={`w-full font-black py-3 rounded-full text-sm transition-colors ${
                  canCheckout
                    ? 'bg-primary text-primary-foreground shadow-md hover:brightness-110'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {slots.length < totalSlots
                  ? `Add ${totalSlots - slots.length} more donut${totalSlots - slots.length !== 1 ? 's' : ''}`
                  : !pickupDate
                  ? 'Choose a pickup date'
                  : !isDateValid()
                  ? 'Requires 3 days notice'
                  : !pickupTime
                  ? 'Select a pickup time'
                  : 'Place order'}
              </motion.button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}