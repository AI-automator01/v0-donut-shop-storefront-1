import { StoreProvider } from '@/lib/store'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import BundleBuilder from '@/components/BundleBuilder'
import Menu from '@/components/Menu'
import Cart from '@/components/Cart'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <StoreProvider>
      <Navbar />
      <main>
        <Hero />
        <BundleBuilder />
        <Menu />
      </main>
      <Footer />
      <Cart />
    </StoreProvider>
  )
}
