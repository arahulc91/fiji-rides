import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.svg'

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'FAQs', path: '/faqs' },
  { name: 'Contact', path: '/contact' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/70 shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src={logo} 
                alt="Fiji Rides Logo" 
                className={`h-8 w-auto transition-opacity duration-300 ${
                  isScrolled ? 'opacity-90' : 'opacity-100'
                }`}
              />
             
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-secondary hover:text-primary' 
                    : 'text-white/90 hover:text-white'
                }`}
                activeProps={{
                  className: `text-sm font-medium transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-primary font-semibold' 
                      : 'text-white font-semibold'
                  }`
                }}
              >
                {item.name}
              </Link>
            ))}
           
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={isScrolled ? 'text-secondary' : 'text-white'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            {navigation.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="block px-3 py-2 text-secondary hover:text-primary text-sm font-medium"
                activeProps={{
                  className: "block px-3 py-2 text-primary font-semibold text-sm"
                }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
           
          </div>
        </div>
      )}
    </header>
  )
} 