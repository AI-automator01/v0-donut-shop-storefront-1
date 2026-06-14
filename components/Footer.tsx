export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground font-semibold text-sm">
        <p>
          <span className="text-primary font-black">Doníssima</span> — Every donut exactly 5cm. Made with love, made to order.
        </p>
        <p>&copy; {new Date().getFullYear()} Dotty&apos;s Mini Donuts. All rights reserved.</p>
      </div>
    </footer>
  )
}
