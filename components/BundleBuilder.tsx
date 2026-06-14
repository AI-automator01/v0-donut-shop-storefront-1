'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { BUNDLE_SIZES } from '@/lib/donuts'
import { cn } from '@/lib/utils'

function gridCols(n: number) {
  if (n <= 6)   return 'grid-cols-3'
  if (n <= 12)  return 'grid-cols-4'
  return 'grid-cols-6 md:grid-cols-8 lg:grid-cols-12'
}

// Color hex mappings corresponding to the donut's color category property
const COLOR_MAP: Record<string, { bg: string; border: string }> = {
  'bg-yellow-100': { bg: '#fef9c3', border: '#fde047' },
  'bg-sky-100':    { bg: '#e0f2fe', border: '#7dd3fc' },
  'bg-amber-200':  { bg: '#fde68a', border: '#fbbf24' },
  'bg-fuchsia-200':{ bg: '#fae8ff', border: '#f472b6' },
  'bg-amber-900':  { bg: '#451a03', border: '#78350f' },
  'bg-rose-200':   { bg: '#ffe4e6', border: '#fda4af' },
  'bg-orange-200': { bg: '#ffedd5', border: '#fdba74' },
  'bg-teal-200':   { bg: '#ccfbf1', border: '#5eead4' },
  'bg-indigo-400': { bg: '#818cf8', border: '#6366f1' },
}

export default function BundleBuilder() {
  const { bundleKey, setBundleKey, slots, removeSlot, totalSlots, bundlePrice } = useStore()
  
  // Track image loading error fallbacks individually by slot ID key strings
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const standardBoxes = BUNDLE_SIZES.filter(b => ['small', 'party', 'mega1'].includes(b.key))
  const classicTowers = BUNDLE_SIZES.filter(b => b.key.startsWith('classic-'))
  const magicTowers = BUNDLE_SIZES.filter(b => b.key.startsWith('magic-'))

  const handleImageError = (slotId: string) => {
    setImageErrors((prev) => ({ ...prev, [slotId]: true }))
  }

  const renderRow = (title: string, bundles: typeof BUNDLE_SIZES) => {
    return (
      <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 border-b border-border/50 last:border-0 pb-5 last:pb-0">
        <div className="w-full md:w-44 shrink-0">
          <h3 className="font-black text-xs uppercase tracking-wider text-muted-foreground/80">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2.5 flex-1">
          {bundles.map((b) => {
            const isSelected = bundleKey === b.key
            const displayLabel = b.key === 'small' ? 'Small Box' : b.key === 'party' ? 'Party Box' : b.key === 'mega1' ? 'Mega Box' : b.label.includes('Tower') ? `${b.slots} Minis Tower` : `${b.slots} Minis Box`
            
            return (
              <motion.button
                key={b.key}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setBundleKey(b.key)}
                className={cn(
                  'flex flex-col items-center justify-center px-4 py-2.5 rounded-xl border-2 font-bold transition-all min-w-[125px] flex-1 sm:flex-initial text-center',
                  isSelected
                    ? 'border-primary bg-primary text-primary-foreground shadow-md'
                    : 'border-border bg-card text-foreground hover:border-primary/40',
                )}
              >
                <span className="text-xl font-black leading-none">{b.slots}</span>
                <span className="text-[10px] font-bold tracking-tight uppercase mt-0.5 opacity-90">{displayLabel}</span>
                {'price' in b ? (
                  <span className={cn('text-[10px] font-black mt-0.5', isSelected ? 'text-primary-foreground/90' : 'text-primary')}>
                    ${(b.price as number).toFixed(2)}
                  </span>
                ) : (
                  <span className="text-[9px] font-semibold opacity-60 mt-0.5">By Unit Cost</span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section id="builder" className="bg-background py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="font-black text-4xl text-foreground mb-2">Build your box</h2>
          <p className="text-muted-foreground font-semibold text-sm max-w-2xl mx-auto">
            Choose a size, then pick your flavors from the menu below. Tap any added donut to remove it.
          </p>
        </div>

        {/* Rows Layout */}
        <div className="bg-muted/30 border-2 border-border/70 rounded-3xl p-5 md:p-6 flex flex-col gap-5 mb-12 shadow-sm">
          {renderRow("Standard Boxes", standardBoxes)}
          {renderRow("Doníssima Classic", classicTowers)}
          {renderRow("Doníssima Magic", magicTowers)}
        </div>

        {/* Visual Box Container Wrapper */}
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
              const donutData = slot?.donut ? slot.donut : null
              const colorConfig = donutData ? (COLOR_MAP[donutData.color] || { bg: '#fef9c3', border: '#fde047' }) : null
              
              // Dynamic image source asset configuration matching the item ID structure
              const imageSrc = donutData ? `/donuts/${donutData.id}.jpg` : null
              const hasError = slot ? !!imageErrors[slot.id] : false

              return (
                <div
                  key={i}
                  className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center overflow-hidden relative"
                >
                  <AnimatePresence mode="wait">
                    {slot && donutData ? (
                      <motion.button
                        key={slot.id}
                        initial={{ scale: 0, rotate: -20, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        onClick={() => removeSlot(slot.id)}
                        className="absolute inset-0 w-full h-full group text-left focus:outline-none"
                      >
                        {/* Colored card slot content backing */}
                        <div 
                          style={{
                            backgroundColor: colorConfig?.bg,
                            borderColor: colorConfig?.border
                          }}
                          className="absolute inset-0 rounded-xl transition-transform duration-200 group-hover:scale-95 flex flex-col items-center justify-center shadow-inner border p-2"
                        >
                          {imageSrc && !hasError ? (
                            <div className="relative w-full h-full transform transition-transform group-hover:scale-110">
                              <Image
                                src={imageSrc}
                                alt={donutData.name}
                                fill
                                sizes="(max-width: 768px) 33vw, 10vw"
                                className="object-contain"
                                onError={() => handleImageError(slot.id)}
                                priority
                              />
                            </div>
                          ) : (
                            /* High-fidelity text emoji fallback structure if your PNG asset directory link drops */
                            <span className="text-3xl drop-shadow-sm select-none transform transition-transform group-hover:scale-110 block">
                              {donutData.emoji}
                            </span>
                          )}
                        </div>

                        {/* Always visible Delete X badge icon */}
                        <div className="absolute top-1.5 right-1.5 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md transition-transform group-hover:scale-110 z-10">
                          <X size={12} className="stroke-[3]" />
                        </div>

                        {/* Quick Hover/Focus Remove banner overlay tag */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity flex items-center justify-center rounded-xl z-10">
                          <span className="text-white font-black text-[10px] tracking-wider uppercase bg-destructive/95 px-2 py-1 rounded-md shadow-sm">
                            Remove
                          </span>
                        </div>
                      </motion.button>
                    ) : (
                      <span className="text-muted-foreground/30 text-2xl font-bold select-none" aria-hidden="true">+</span>
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