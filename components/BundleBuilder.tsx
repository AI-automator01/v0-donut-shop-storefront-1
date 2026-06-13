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
            Choose a size, then pick your flavors from the menu below. Tap any added donut to remove it.
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
                      <motion.button
                        key={slot.id}
                        initial={{ scale: 0, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        onClick={() => removeSlot(slot.id)}
                        aria-label={`Remove ${slot.donut.name}`}
                        className="absolute inset-0 w-full h-full group text-left focus:outline-none"
                      >
                        <Image
                          src={`/donuts/${slot.donut.id}.jpg`}
                          alt={slot.donut.name}
                          fill
                          className="object-cover rounded-xl transition-transform duration-200 group-hover:scale-95 group-focus:scale-95"
                        />
                        
                        {/* Always visible Close/Delete Badge in top right corner */}
                        <div className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md transition-transform group-hover:scale-110">
                          <X size={12} className="stroke-[3]" />
                        </div>

                        {/* Quick Hover/Focus Overlay text */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                          <span className="text-white font-black text-xs tracking-wider uppercase bg-destructive/90 px-2 py-1 rounded-md">
                            Remove
                          </span>
                        </div>
                      </motion.button>
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