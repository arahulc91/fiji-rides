import { Fragment, useState, useRef } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'

interface Location {
  id: number
  description: string
}

interface LocationAutocompleteProps {
  locations: Location[]
  value: Location | null
  onChange: (location: Location) => void
  placeholder: string
  isLoading?: boolean
}

export function LocationAutocomplete({
  locations,
  value,
  onChange,
  placeholder,
  isLoading = false
}: LocationAutocompleteProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredLocations =
    query === ''
      ? locations
      : locations.filter((location) =>
          location.description
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  const handleWrapperClick = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full">
      <Combobox value={value} onChange={onChange}>
        {({ open }) => (
          <>
            <div 
              className="relative w-full cursor-pointer"
              onClick={handleWrapperClick}
            >
              <Combobox.Input
                ref={inputRef}
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 
                         focus:ring-2 focus:ring-content-primary focus:border-transparent transition-all text-center cursor-pointer"
                displayValue={(location: Location) => location?.description || ''}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                autoComplete="off"
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                <ChevronsUpDown
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <Combobox.Options 
                className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                {isLoading ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Loading...
                  </div>
                ) : filteredLocations.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredLocations.map((location) => (
                    <Combobox.Option
                      key={location.id}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active ? 'bg-content-primary text-white' : 'text-gray-900'
                        }`
                      }
                      value={location}
                    >
                      {({ selected, active }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                            {location.description}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-content-primary'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </>
        )}
      </Combobox>
    </div>
  )
} 