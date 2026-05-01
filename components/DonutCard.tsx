'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useStore } from '@/lib/store'
import type { Donut } from '@/lib/donuts'
import { cn } from '@/lib/utils'

interface Props {
  donut: Donut
}

export default function DonutCard({ donut }: Props) {
  const { addDonut, slots, totalSlots } = useStore()
  const isFull = slots.length >= totalSlots
  const count = slots.filter((s) => s.donut.id === donut.id).length

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-card rounded-2xl border border-border overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div className="relative aspect-square">
        <Image
          src={`/donuts/${donut.id}.jpg`}
          alt={donut.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {count > 0 && (
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-black px-2 py-0.5 rounded-full">
            ×{count}
          </span>
        )}
        {/* Allergen badges */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {donut.allergens.includes('nuts') && (
            <span className="bg-orange-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">Nuts</span>
          )}
          {donut.allergens.includes('dairy') && (
            <span className="bg-blue-300 text-blue-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">Dairy</span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-black text-foreground text-base leading-tight">{donut.name}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed flex-1">{donut.description}</p>

        <div className="flex items-center justify-between mt-1">
          <span className="font-bold text-foreground">${donut.price.toFixed(2)}</span>
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={isFull ? {} : { scale: 1.1 }}
            onClick={() => addDonut(donut)}
            disabled={isFull}
            aria-label={`Add ${donut.name} to box`}
            className={cn(
              'flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full transition-colors',
              isFull
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:brightness-110',
            )}
          >
            <Plus size={14} />
            Add
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
