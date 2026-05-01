'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { DONUTS, CATEGORIES } from '@/lib/donuts'
import DonutCard from './DonutCard'

export default function Menu() {
  const { hideNuts, hideDairy, setHideNuts, setHideDairy } = useStore()

  const visibleDonuts = DONUTS.filter((d) => {
    if (hideNuts && d.allergens.includes('nuts')) return false
    if (hideDairy && d.allergens.includes('dairy')) return false
    return true
  })

  return (
    <section id="menu" className="bg-muted/30 py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <h2 className="font-black text-4xl text-foreground mb-2">The Menu</h2>
          <p className="text-muted-foreground font-semibold">
            All donuts are exactly 5cm in diameter — click to add to your box.
          </p>
        </div>

        {/* Allergen Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <Toggle
            label="Hide Nut Ingredients"
            checked={hideNuts}
            onChange={setHideNuts}
            id="hide-nuts"
          />
          <Toggle
            label="Hide Dairy Ingredients"
            checked={hideDairy}
            onChange={setHideDairy}
            id="hide-dairy"
          />
        </div>

        {/* Categories */}
        {CATEGORIES.map(({ key, label }) => {
          const catDonuts = visibleDonuts.filter((d) => d.category === key)
          if (catDonuts.length === 0) return null
          return (
            <div key={key} className="mb-14">
              <h3 className="font-black text-2xl text-foreground mb-6 flex items-center gap-3">
                {label}
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </h3>
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {catDonuts.map((donut) => (
                  <motion.div
                    key={donut.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <DonutCard donut={donut} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )
        })}

        {visibleDonuts.length === 0 && (
          <p className="text-center text-muted-foreground font-semibold py-16">
            No donuts match your current filters. Try adjusting the toggles above.
          </p>
        )}
      </div>
    </section>
  )
}

/* ── Toggle ─────────────────────────────────────────────────────────────────── */
interface ToggleProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  id: string
}

function Toggle({ label, checked, onChange, id }: ToggleProps) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer bg-card border border-border rounded-full px-5 py-3 font-bold text-sm text-foreground select-none hover:border-primary/50 transition-colors"
    >
      <span>{label}</span>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-0.5 w-5 h-5 rounded-full bg-card shadow"
          style={{ left: checked ? '22px' : '2px' }}
        />
      </button>
    </label>
  )
}
