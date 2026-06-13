'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, Clock } from 'lucide-react'
import { useStore } from '@/lib/store'
import { PICKUP_TIMES, BUNDLE_SIZES } from '@/lib/donuts'

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
  } = useStore()

  const bundle = BUNDLE_SIZES.find((b) => b.key === bundleKey)!

  // Group slots by donut
  const grouped = slots.reduce<Record<string, { name: string; count: number; id: string; price: number }>>((acc, s) => {
    if (acc[s.donut.id]) {
      acc[s.donut.id].count++
    } else {
      acc[s.donut.id] = { name: s.donut.name, count: 1, id: s.donut.id, price: s.donut.price }
    }
    return acc
  }, {})

  const canCheckout = slots.length === totalSlots && pickupTime !== ''

  // ── WHATSAPP CHECKOUT HANDLER ──────────────────────────────────────────────
  const handleWhatsAppCheckout = () => {
    if (!canCheckout) return

    // TODO: Replace with the actual business phone number (include country code, digits only)
    // Example: '15551234567'
    const phoneNumber = '584120895577' 

    // Format the items list text block using native bullet dashes
    const itemsList = Object.values(grouped)
      .map((item) => `- ${item.name} (x${item.count}) - $${(item.price * item.count).toFixed(2)}`)
      .join('\n')

    // Construct the structured order message template using native WhatsApp markdown asterisks
    const messageText = `*NEW DONUT ORDER*\n\n` +
      `*Box Type:* ${bundle.label}\n` +
      `*Pickup Time:* ${pickupTime}\n\n` +
      `*Selected Flavors:*\n${itemsList}\n\n` +
      `*Total Amount:* $${bundlePrice.toFixed(2)}\n\n` +
      `Please let me know if my order is confirmed! Thank you!`

    // Securely encode the text layout strings for safe URI redirection
    const encodedMessage = encodeURIComponent(messageText)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`

    // Open WhatsApp thread in a clean, secure tab window
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }
  // ───────────────────────────────────────────────────────────────────────────

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
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-card shadow-2xl flex flex-col"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-black text-xl text-foreground">Your Box</h2>
              <button
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Bundle summary */}
            <div className="px-5 py-3 bg-secondary/50 border-b border-border">
              <p className="font-bold text-secondary-foreground text-sm">
                {bundle.label} — {slots.length}/{totalSlots} donuts selected
              </p>
              <div className="h-2 bg-border rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${(slots.length / totalSlots) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {slots.length === 0 ? (
                <p className="text-center text-muted-foreground font-semibold py-10">
                  Your box is empty — add donuts from the menu!
                </p>
              ) : (
                Object.values(grouped).map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <Image src={`/donuts/${item.id}.jpg`} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-foreground text-sm">{item.name}</p>
                      <p className="text-muted-foreground text-xs">×{item.count} · ${(item.price * item.count).toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => {
                        const slot = slots.findLast((s) => s.donut.id === item.id)
                        if (slot) removeSlot(slot.id)
                      }}
                      aria-label={`Remove one ${item.name}`}
                      className="p-1.5 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Pickup Time */}
            <div className="px-5 py-4 border-t border-border">
              <label htmlFor="pickup-select" className="flex items-center gap-2 font-bold text-foreground text-sm mb-2">
                <Clock size={16} className="text-primary" />
                Pickup Time
              </label>
              <select
                id="pickup-select"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 font-semibold text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select a time...</option>
                {PICKUP_TIMES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Footer */}
            <div className="px-5 py-5 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-foreground">Box total</span>
                <span className="font-black text-primary text-xl">${bundlePrice.toFixed(2)}</span>
              </div>
              <motion.button
                whileTap={canCheckout ? { scale: 0.96 } : {}}
                whileHover={canCheckout ? { scale: 1.02 } : {}}
                disabled={!canCheckout}
                onClick={handleWhatsAppCheckout} // <-- Added the action logic handler call here
                className={`w-full font-black py-3.5 rounded-full text-base transition-colors ${
                  canCheckout
                    ? 'bg-primary text-primary-foreground shadow-md hover:brightness-110'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {slots.length < totalSlots
                  ? `Add ${totalSlots - slots.length} more donut${totalSlots - slots.length !== 1 ? 's' : ''}`
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