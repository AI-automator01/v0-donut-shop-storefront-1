'use client'

import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useStore } from '@/lib/store'

export default function Navbar() {
  const { slots, totalSlots, setCartOpen } = useStore()

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">🍩</span>
          <span className="font-black text-xl text-primary tracking-tight">
            Doníssima 
          </span>
        </div>

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 bg-primary text-primary-foreground font-bold px-4 py-2 rounded-full shadow-md"
          aria-label={`Open cart — ${slots.length} of ${totalSlots} slots filled`}
        >
          <ShoppingBag size={18} />
          <span className="text-sm">My Box</span>
          {slots.length > 0 && (
            <motion.span
              key={slots.length}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-black w-5 h-5 rounded-full flex items-center justify-center"
            >
              {slots.length}
            </motion.span>
          )}
        </motion.button>
      </div>
    </header>
  )
}
