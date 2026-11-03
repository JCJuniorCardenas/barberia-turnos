import { useState } from 'react'
import { BookingFlow } from '../components/BookingFlow'
import { About } from '../components/landing/About'
import { BeforeAfter } from '../components/landing/BeforeAfter'
import { Contact } from '../components/landing/Contact'
import { FloatingCTA } from '../components/landing/FloatingCTA'
import { Footer } from '../components/landing/Footer'
import { Gallery } from '../components/landing/Gallery'
import { Hero } from '../components/landing/Hero'
import { Marquee } from '../components/landing/Marquee'
import { Navbar } from '../components/landing/Navbar'
import { Services } from '../components/landing/Services'

export function Booking() {
  const [services, setServices] = useState(null)
  const [request, setRequest] = useState(null)

  function pickService(service) {
    setRequest({ service })
    document.getElementById('reservar')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services services={services || []} loading={services === null} onSelect={pickService} />
        <Gallery />
        <BeforeAfter />
        <BookingFlow request={request} onServicesLoaded={setServices} />
        <Contact />
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
