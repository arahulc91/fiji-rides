import { Link } from '@tanstack/react-router'

const navigation = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'FAQs', path: '/faqs' },
  { name: 'Contact', path: '/contact' },
]

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <span className="text-xl font-bold text-white">Logo</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white border-b-2 border-transparent hover:border-indigo-500 transition-colors"
                activeProps={{
                  className: "inline-flex items-center px-1 pt-1 text-sm font-medium text-white border-b-2 border-indigo-500"
                }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
} 