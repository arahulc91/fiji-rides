import { Car } from 'lucide-react'
import { HeroBackground } from '../components/hero-background'

function AboutPage() {
  return (
    <div className="flex flex-col">
      <HeroBackground>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Car className="h-16 w-16 text-white" />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              About Fiji Rides
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Your trusted partner for premium transportation services across Fiji's beautiful islands.
            </p>
          </div>
        </div>
      </HeroBackground>

      {/* Rest of the content */}
    </div>
  )
}

export default AboutPage 