'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { BUNDLE_SIZES } from '@/lib/donuts'
import { cn } from '@/lib/utils'

/** Returns grid columns class based on slot count */
function gridCols(n: number) {
  if (n <= 6)   return 'grid-cols-3'
  if (n <= 12)  return 'grid-cols-4'
  return 'grid-cols-6 md:grid-cols-8 lg:grid-cols-12'
}

export default function BundleBuilder() {
  const { bundleKey, setBundleKey, slots, removeSlot, totalSlots, bundlePrice } = useStore()

  // Group the bundle sizes dynamically into horizontal categories
  const standardBoxes = BUNDLE_SIZES.filter(b => b.key.includes('small') || b.key.includes('party') || b.key.includes('mega') || (!b.label.includes('Classic') && !b.label.includes('Magic') && b.slots <= 24))
  const classicTowers = BUNDLE_SIZES.filter(b => b.label.includes('Classic'))
  const magicTowers = BUNDLE_SIZES.filter(b => b.label.includes('Magic'))

  // Helper render function to keep rows perfectly consistent
  const renderRow = (title: string, bundles: typeof BUNDLE_SIZES) => {
    if (bundles.length === 0) return null
    return (
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 border-b border-border/50 last:border-0 pb-5 last:pb-0">
        <div className="w-full md:w-44 shrink-0">
          <h3 className="font-black text-sm uppercase tracking-wider text-muted-foreground/80">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-3 flex-1">
          {bundles.map((b) => (
            <motion.button
              key={b.key}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setBundleKey(b.key)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-4 py-3 rounded-xl border-2 font-bold transition-all min-w-[130px] flex-1 sm:flex-initial text-center',
                bundleKey === b.key
                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                  : 'border-border bg-card text-foreground hover:border-primary/40',
              )}
            >
              <span className="text-xl font-black leading-none">{b.slots}</span>
              <span className="text-[11px] font-bold tracking-tight opacity-90 line-clamp-1">{b.label.split(' (')[0]}</span>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section id="builder" className="bg-background py-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="font-black text-4xl text-foreground mb-2">Build your box</h2>
          <p className="text-muted-foreground font-semibold text-sm max-w-2xl mx-auto">
            Choose a size, then pick your flavors from the menu below. Tap any added donut to remove it.
          </p>
        </div>

        {/* Categorized Row Selectors */}
        <div className="bg-muted/30 border-2 border-border/70 rounded-3xl p-5 md:p-6 flex flex-col gap-5 mb-12 shadow-sm">
          {renderRow("Standard Boxes", standardBoxes)}
          {renderRow("Doníssima Classic", classicTowers)}
          {renderRow("Doníssima Magic", magicTowers)}
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
              className="mt-4 text-center font-bold text-primary text-sm"
            >
              Box is full! Open your cart drawer to customize toppings and check out.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}