import { Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, Mail } from 'lucide-react'
import logo from '../assets/logo.svg'

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'Contact', path: '/contact' },
]

export function Header() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.onbeforeunload = null;
    window.removeEventListener('beforeunload', () => {});
    
    navigate({
      to: "/",
      search: {},
      replace: true,
    });
    window.location.href = "/";
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#111827] shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center"
              onClick={handleHomeClick}
            >
              <img 
                src={logo} 
                alt="Fiji Rides Logo" 
                className={`h-8 w-auto transition-opacity duration-300 ${
                  isScrolled ? 'opacity-90' : 'opacity-100'
                }`}
              />
            </Link>
          </div>
          
          <div className="hidden md:flex items-center">
            <div className="flex items-center space-x-8 mr-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={item.path === '/' ? handleHomeClick : undefined}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-white hover:text-primary' 
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

            {/* Combined Contact Information */}
            <div className="flex items-center bg-[#111827]/80 hover:bg-[#111827] px-4 py-2 rounded-full transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-primary-500" />
                  <span className="text-xs text-white">info@fijirides.com</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-primary-500" />
                  <span className="text-xs text-white">+679 6724244</span>
                </div>
              </div>
            </div>
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden overflow-hidden">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white sm:px-6">
            {navigation.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={(e) => {
                  setIsOpen(false);
                  if (item.path === '/') {
                    handleHomeClick(e);
                  }
                }}
                className="block px-3 py-2 text-secondary hover:text-primary text-sm font-medium"
                activeProps={{
                  className: "block px-3 py-2 text-primary font-semibold text-sm"
                }}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Combined Contact Information */}
            <div className="px-3 py-4">
              <div className="flex flex-col space-y-2 text-secondary">
                <a href="mailto:info@fijirides.com" className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-primary-500" />
                  <span className="text-sm">info@fijirides.com</span>
                </a>
                <a href="tel:+6799994377" className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-primary-500" />
                  <span className="text-sm">+679 9994377</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
} 