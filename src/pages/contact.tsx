import { Mail, Phone, MapPin } from 'lucide-react'
import { HeroBackground } from '../components/hero-background'

function ContactPage() {
  return (
    <div className="flex flex-col">
      <HeroBackground>
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <Mail className="h-16 w-16 text-white" />
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Get in touch with our team for any inquiries or assistance.
            </p>
          </div>
        </div>
      </HeroBackground>

      {/* Contact Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Phone className="h-6 w-6 text-indigo-500" />
                <span className="text-gray-300">+679 123 4567</span>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-indigo-500" />
                <span className="text-gray-300">info@fijirides.com</span>
              </div>
              <div className="flex items-center space-x-4">
                <MapPin className="h-6 w-6 text-indigo-500" />
                <span className="text-gray-300">123 Main Street, Suva, Fiji</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300">Message</label>
              <textarea
                id="message"
                rows={4}
                className="mt-1 block w-full rounded-md bg-slate-700 border-slate-600 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactPage 