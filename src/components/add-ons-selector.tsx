import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info } from 'lucide-react';
import { PickupDropoffLocation } from '../types/index';

interface TransferAddon {
  id: number;
  addon: string;
  company: string;
  price: string;
  return_type: string;
  additional_details: string;
  photos: string[];
  is_tour_addon: boolean;
}

interface BookingData {
  pickupLocation: PickupDropoffLocation;
  dropoffLocation: PickupDropoffLocation;
  passengers: number;
  tripType: "one-way" | "return";
  pickupDateTime: string;
  returnDateTime?: string;
}

interface AddOnSelectorProps {
  onBack: () => void;
  onNext: () => void;
  bookingData: BookingData;
  addons: TransferAddon[];
  isLoading: boolean;
  selectedAddons: Record<number, number>;
  onAddonsChange: (addons: Record<number, number>) => void;
}

interface AccordionHeaderProps {
  title: string;
  isExpanded: boolean;
  onClick: () => void;
  count: number;
}

function AccordionHeader({ title, isExpanded, onClick, count }: AccordionHeaderProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center p-4 text-sm font-medium 
                 rounded-xl transition-colors
                 ${isExpanded 
                   ? 'bg-primary-50 text-primary-700' 
                   : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
    >
      <div className="flex items-center gap-2">
        {title}
        <span className="px-2 py-0.5 text-xs rounded-full bg-white/80 text-gray-600">
          {count}
        </span>
      </div>
      <ChevronDown
        className={`w-4 h-4 transition-transform duration-200 
                   ${isExpanded ? 'rotate-180 text-primary-600' : 'text-gray-400'}`}
      />
    </button>
  );
}

export function AddOnSelector({ 
  onBack, 
  onNext, 
  bookingData, 
  addons = [], 
  isLoading,
  selectedAddons,
  onAddonsChange
}: AddOnSelectorProps) {
  const [expandedSection, setExpandedSection] = useState<'popular' | 'tours' | null>('popular');

  const filteredAddons = addons.filter(addon => {
    if (bookingData.tripType === 'one-way' && addon.return_type === 'return') {
      return false;
    }
    return true;
  });

  const popularAddons = filteredAddons.filter(addon => !addon.is_tour_addon);
  const tourAddons = filteredAddons.filter(addon => addon.is_tour_addon);

  const getAddonPrice = (addon: TransferAddon) => {
    const price = parseFloat(addon.price);
    if (addon.addon.toLowerCase().includes('per person')) {
      return price * bookingData.passengers;
    }
    return price;
  };

  function updateQuantity(id: number, delta: number) {
    const current = selectedAddons[id] || 0;
    const newValue = Math.max(0, current + delta);
    
    if (newValue === 0) {
      const rest = Object.fromEntries(
        Object.entries(selectedAddons).filter(([key]) => key !== id.toString())
      );
      onAddonsChange(rest);
    } else {
      onAddonsChange({ ...selectedAddons, [id]: newValue });
    }
  }

  const totalPrice = Object.entries(selectedAddons).reduce((sum, [id, quantity]) => {
    const addon = addons.find(a => a.id === parseInt(id));
    return sum + (addon ? getAddonPrice(addon) * quantity : 0);
  }, 0);

  const AddOnItem = ({ addon }: { addon: TransferAddon }) => {
    const isAdult = addon.addon.toLowerCase().includes('adult');
    const isChild = addon.addon.toLowerCase().includes('child');
    const price = parseFloat(addon.price);

    return (
      <div className="flex items-center justify-between py-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 text-sm">
              {addon.addon}
              {addon.is_tour_addon && (
                <span className="text-xs text-gray-500 ml-1">
                  ({isAdult ? 'Adult' : isChild ? 'Child' : ''})
                </span>
              )}
            </span>
            {price === 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
                FREE
              </span>
            )}
            {addon.additional_details && (
              <Info 
                className="w-4 h-4 text-gray-400 cursor-help"
                aria-label={addon.additional_details.replace(/<[^>]*>/g, '')}
              />
            )}
          </div>
          <div className="text-sm text-gray-500">
            {price > 0 && (
              <span>
                ${price.toFixed(2)}
                {addon.return_type === 'return' && ' (Return)'}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => updateQuantity(addon.id, -1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg 
                     bg-gray-100 text-gray-600 hover:bg-gray-200 
                     disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            disabled={!selectedAddons[addon.id]}
          >
            -
          </motion.button>
          <span className="w-6 text-center text-sm text-secondary-500 font-medium">
            {selectedAddons[addon.id] || 0}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => updateQuantity(addon.id, 1)}
            className="w-7 h-7 flex items-center justify-center rounded-lg 
                     bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm"
          >
            +
          </motion.button>
        </div>
      </div>
    );
  };

  const handleAccordionClick = (section: 'popular' | 'tours') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl p-6 shadow-xl max-w-md mx-auto w-full text-center"
      >
        <div className="py-8">Loading available add-ons...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl p-6 shadow-xl max-w-md mx-auto w-full"
    >
      <h2 className="text-xl font-semibold text-center mb-6 text-secondary-500">Select Add-ons</h2>
      
      <div className="space-y-4 max-h-[600px] overflow-y-auto px-1">
        {popularAddons.length > 0 && (
          <div>
            <AccordionHeader
              title="Popular Add-ons"
              isExpanded={expandedSection === 'popular'}
              onClick={() => handleAccordionClick('popular')}
              count={popularAddons.length}
            />
            <AnimatePresence initial={false}>
              {expandedSection === 'popular' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 space-y-2 px-2 overflow-hidden"
                >
                  {popularAddons.map(addon => (
                    <AddOnItem key={addon.id} addon={addon} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {tourAddons.length > 0 && (
          <div>
            <AccordionHeader
              title="Tours & Activities"
              isExpanded={expandedSection === 'tours'}
              onClick={() => handleAccordionClick('tours')}
              count={tourAddons.length}
            />
            <AnimatePresence initial={false}>
              {expandedSection === 'tours' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 space-y-2 px-2 overflow-hidden"
                >
                  {tourAddons.map(addon => (
                    <AddOnItem key={addon.id} addon={addon} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {totalPrice > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: 'auto', 
              opacity: 1,
              transition: {
                height: {
                  duration: 0.3,
                  ease: "easeOut"
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.1
                }
              }
            }}
            exit={{ 
              height: 0, 
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: "easeIn"
                },
                opacity: {
                  duration: 0.1
                }
              }
            }}
            className="overflow-hidden mt-4"
          >
            <motion.div 
              className="p-3 rounded-xl bg-primary-50 border border-primary-100"
              initial={{ y: 10 }}
              animate={{ 
                y: 0,
                transition: {
                  duration: 0.3,
                  ease: "easeOut"
                }
              }}
            >
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-700">Total Add-ons</span>
                <motion.span 
                  key={totalPrice}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut"
                    }
                  }}
                  className="font-semibold text-gray-900"
                >
                  ${totalPrice.toFixed(2)}
                </motion.span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-3 mt-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 
                   text-gray-700 hover:bg-gray-50 transition-colors text-sm"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          className="flex-1 py-2.5 px-4 rounded-xl bg-content-primary text-white 
                   hover:bg-primary-600 transition-colors text-sm"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
} 