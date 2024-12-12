import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronsUpDown } from 'lucide-react'
import { PickupDropoffLocation } from '../types';

interface LocationAutocompleteProps {
  locations: PickupDropoffLocation[]
  value: PickupDropoffLocation | null
  onChange: (location: PickupDropoffLocation) => void
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

  const filteredLocations =
    query === ''
      ? locations
      : locations.filter((location) =>
          location.description
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div className="relative">
      <Combobox value={value} onChange={onChange}>
        <div className="relative w-full">
          <Combobox.Input
            className="w-full px-4 py-3 rounded-xl bg-white border border-primary-100 text-secondary-500 
                     focus:ring-2 focus:ring-content-primary focus:border-transparent transition-all"
            displayValue={(location: PickupDropoffLocation) => location?.description || ''}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronsUpDown
              className="h-5 w-5 text-content-primary"
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
          <Combobox.Options className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {isLoading ? (
              <div className="relative cursor-default select-none py-2 px-4 text-secondary-400">
                Loading...
              </div>
            ) : filteredLocations.length === 0 && query !== '' ? (
              <div className="relative cursor-default select-none py-2 px-4 text-secondary-400">
                Nothing found.
              </div>
            ) : (
              filteredLocations.map((location) => (
                <Combobox.Option
                  key={location.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-content-primary text-white' : 'text-secondary-500'
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
      </Combobox>
    </div>
  )
} 