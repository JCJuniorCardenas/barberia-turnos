import { BookingFlow } from '../components/BookingFlow'
import { Backdrop } from '../components/landing/Backdrop'
import { Contact } from '../components/landing/Contact'
import { FloatingCTA } from '../components/landing/FloatingCTA'
import { Footer } from '../components/landing/Footer'
import { Hero } from '../components/landing/Hero'
import { Marquee } from '../components/landing/Marquee'
import { Navbar } from '../components/landing/Navbar'

export function Booking() {
  return (
    <>
      <Backdrop />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <BookingFlow />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
