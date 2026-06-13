'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 text-center md:text-left"
        >
          <p className="inline-block bg-secondary text-secondary-foreground text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            Made fresh to order
          </p>
          <h1 className="font-black text-5xl md:text-6xl leading-tight text-balance text-foreground mb-4">
            Mini donuts,{' '}
            <span className="text-primary">mega joy.</span>
          </h1>
          <p className="text-muted-foreground font-semibold text-lg leading-relaxed max-w-md mx-auto md:mx-0 text-pretty">
            Every single donut is exactly{' '}
            <strong className="text-foreground">5cm in diameter</strong> — hand-crafted,
            made-to-order, and packed into your custom box. Pick your flavors and we&apos;ll
            have them ready at your chosen time.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 justify-center md:justify-start">
            <a
              href="#builder"
              className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-shadow"
            >
              Build your box
            </a>
            <a
              href="#menu"
              className="bg-secondary text-secondary-foreground font-bold px-6 py-3 rounded-full"
            >
              See the menu
            </a>
          </div>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/hero-box.jpg"
              alt="Open pastel box filled with 12 assorted mini donuts"
              fill
              className="object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Decorative dots */}
      <div
        aria-hidden="true"
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-accent/30 blur-2xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 -left-8 w-32 h-32 rounded-full bg-secondary/40 blur-2xl pointer-events-none"
      />
    </section>
  )
}
