import { HeroBackground } from '../components/hero-background'
import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'

function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroBackground className="min-h-[800px]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white sm:text-7xl">
              <div>Your Premium Transport</div>
              <span className="block text-primary-300">Across Fiji Islands</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Experience comfortable and reliable transportation services across Fiji's beautiful islands. 
              From airport transfers to island tours, we've got you covered.
            </p>
            <div className="mt-10 flex items-center justify-center gap-6">
              <Link
                to="/contact"
                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 transition-colors duration-300"
              >
                Book Now
                <ArrowRight className="ml-2 -mr-1 h-4 w-4 inline-block" />
              </Link>
              <Link
                to="/about"
                className="rounded-lg px-6 py-3 text-sm font-semibold text-white hover:text-primary-300 transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </HeroBackground>

      {/* You can add more sections below the hero if needed */}
    </div>
  )
}

export default HomePage 