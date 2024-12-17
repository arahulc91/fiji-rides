import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface Location {
  id: number
  description: string
}

interface LocationAutocompleteProps {
  locations: Location[]
  value: Location | null
  onChange: (location: Location | null) => void
  placeholder: string
  isLoading?: boolean
}

export function LocationAutocomplete({
  locations,
  value,
  onChange,
  placeholder,
  isLoading = false
}: Readonly<LocationAutocompleteProps>) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  const filteredLocations = query === ''
    ? locations
    : locations.filter((location) =>
        location.description
          .toLowerCase()
          .includes(query.toLowerCase())
      )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const renderDropdownContent = () => {
    if (isLoading) {
      return (
        <div className="py-3 px-4 text-sm text-gray-500 text-center">
          Finding locations...
        </div>
      );
    }

    if (filteredLocations.length === 0) {
      return (
        <div className="py-3 px-4 text-sm text-gray-500 text-center">
          No locations found
        </div>
      );
    }

    return filteredLocations.map((location) => (
      <button
        key={location.id}
        className={`px-4 py-2.5 text-sm cursor-pointer w-full  transition-colors duration-150
          ${value?.id === location.id 
            ? 'bg-emerald-500 text-white font-medium' 
            : 'text-gray-900 hover:bg-emerald-50'
          }`}
        onClick={() => {
          onChange(location)
          setIsOpen(false)
          setQuery('')
        }}
      >
        {location.description}
      </button>
    ));
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button 
        type="button"
        className="relative w-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 
                   focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-center text-sm pr-12"
          placeholder={placeholder}
          value={value ? value.description : query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onClick={() => setIsOpen(true)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <ChevronDown 
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-xl bg-white py-1.5 shadow-xl ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto">
          {renderDropdownContent()}
        </div>
      )}
    </div>
  )
}
