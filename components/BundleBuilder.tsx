'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { BUNDLE_SIZES } from '@/lib/donuts'
import { cn } from '@/lib/utils'

/** Returns grid columns class based on slot count */
function gridCols(n: number) {
  if (n === 6)  return 'grid-cols-3'
  if (n === 12) return 'grid-cols-4'
  return 'grid-cols-6'
}

export default function BundleBuilder() {
  const { bundleKey, setBundleKey, slots, removeSlot, totalSlots, bundlePrice } = useStore()

  return (
    <section id="builder" className="bg-background py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="font-black text-4xl text-foreground mb-2">Build your box</h2>
          <p className="text-muted-foreground font-semibold">
            Choose a size, then pick your flavors from the menu below.
          </p>
        </div>

        {/* Size Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {BUNDLE_SIZES.map((b) => (
            <motion.button
              key={b.key}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => setBundleKey(b.key)}
              className={cn(
                'flex flex-col items-center gap-1 px-8 py-5 rounded-2xl border-2 font-bold transition-colors',
                bundleKey === b.key
                  ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                  : 'border-border bg-card text-foreground hover:border-primary/50',
              )}
            >
              <span className="text-2xl font-black">{b.slots}</span>
              <span className="text-sm">{b.label}</span>
              <span className={cn('text-xs', bundleKey === b.key ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                ${b.price.toFixed(2)}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Live Box View */}
        <div className="bg-card rounded-3xl border-2 border-border p-6 shadow-inner">
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-foreground text-lg">
              Your box{' '}
              <span className="text-muted-foreground font-semibold text-sm">
                ({slots.length}/{totalSlots} filled)
              </span>
            </p>
            <span className="font-black text-primary text-lg">${bundlePrice.toFixed(2)}</span>
          </div>

          <div className={cn('grid gap-3', gridCols(totalSlots))}>
            {Array.from({ length: totalSlots }).map((_, i) => {
              const slot = slots[i]
              return (
                <div
                  key={i}
                  className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center overflow-hidden relative"
                >
                  <AnimatePresence>
                    {slot ? (
                      <motion.div
                        key={slot.id}
                        initial={{ scale: 0, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={`/donuts/${slot.donut.id}.jpg`}
                          alt={slot.donut.name}
                          fill
                          className="object-cover rounded-xl"
                        />
                        {/* Remove button */}
                        <button
                          onClick={() => removeSlot(slot.id)}
                          aria-label={`Remove ${slot.donut.name}`}
                          className="absolute top-0.5 right-0.5 bg-foreground/70 text-background rounded-full p-0.5 opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
                        >
                          <X size={10} />
                        </button>
                      </motion.div>
                    ) : (
                      <span className="text-muted-foreground/30 text-2xl select-none" aria-hidden="true">+</span>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {slots.length === totalSlots && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center font-bold text-primary"
            >
              Box is full! Head to checkout.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}
