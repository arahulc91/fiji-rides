import { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";

interface Location {
  id: number;
  description: string;
  region_tags?: string[];
}

interface LocationAutocompleteProps {
  locations: Location[];
  value: Location | null;
  onChange: (location: Location | null) => void;
  placeholder: string;
  isLoading?: boolean;
  id?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function LocationAutocomplete({
  locations,
  value,
  onChange,
  placeholder,
  isLoading = false,
  id,
  className,
  icon,
}: Readonly<LocationAutocompleteProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isUserTyping = useRef(false);

  useEffect(() => {
    if (!isUserTyping.current) {
      setQuery("");
    }
  }, [value]);

  const filteredLocations =
    query === ""
      ? locations
      : locations.filter((location) => {
          const searchQuery = query.toLowerCase();

          const descriptionMatch = location.description
            .toLowerCase()
            .includes(searchQuery);

          const tagMatch = location.region_tags?.some((tag) =>
            tag.toLowerCase().includes(searchQuery)
          );

          return descriptionMatch || tagMatch;
        });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    isUserTyping.current = true;
    setQuery(newValue);

    if (
      newValue === "" ||
      (value &&
        !value.description.toLowerCase().startsWith(newValue.toLowerCase()))
    ) {
      onChange(null);
    }

    setIsOpen(true);
    setTimeout(() => {
      isUserTyping.current = false;
    }, 100);
  };

  const inputValue = query || (value?.description ?? "");

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
        className={`px-4 py-2.5 text-sm cursor-pointer w-full transition-colors duration-150
          ${
            value?.id === location.id
              ? "bg-emerald-500 text-white font-medium"
              : "text-gray-900 hover:bg-emerald-50"
          }`}
        onClick={() => {
          onChange(location);
          setIsOpen(false);
          setQuery("");
        }}
      >
        <div className="text-left">
          <div>{location.description}</div>
          {location.region_tags && location.region_tags.length > 0 && (
            <div className="text-xs mt-0.5 text-gray-500">
              {location.region_tags.join(" · ")}
            </div>
          )}
        </div>
      </button>
    ));
  };

  return (
    <div id={id} ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        className="relative w-full cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          {icon || <MapPin className="h-5 w-5 text-gray-400" />}
        </div>

        <input
          type="text"
          className={`w-full cursor-pointer px-4 py-3 pl-12 rounded-xl bg-white border border-gray-200 
                     text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                     transition-all text-left text-sm pr-12 ${className}`}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
        />
      
      </button>

      {isOpen && (
        <div 
          className="absolute z-[100] w-full mt-2 rounded-xl bg-white py-1.5 shadow-xl ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto"
          style={{ 
            position: 'fixed', 
            left: wrapperRef.current?.getBoundingClientRect()?.left ?? 0, 
            top: (wrapperRef.current?.getBoundingClientRect()?.bottom ?? 0) + 8, 
            width: wrapperRef.current?.offsetWidth ?? 0 
          }}
        >
          {renderDropdownContent()}
        </div>
      )}
    </div>
  );
}
