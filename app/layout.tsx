import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Dotty\'s Mini Donuts — Made-to-Order, 5cm Perfection',
  description:
    'Build your own custom donut box from Dotty\'s Mini Donuts. Every donut is exactly 5cm, made fresh to order. Choose your flavors, build your box, pick your time.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${nunito.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
