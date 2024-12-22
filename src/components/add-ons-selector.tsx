import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Info } from "lucide-react";
import { PickupDropoffLocation } from "../types/index";
import TourDetailsModal from "./tourdetails";
import { useDateTimePicker } from "../hooks/useDateTimePicker";

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
  transferPrice: number;
  tourDates: Array<TourDate>;
  onTourDatesChange: (
    dates: Array<TourDate> | ((prev: Array<TourDate>) => Array<TourDate>)
  ) => void;
}

interface AccordionHeaderProps {
  title: string;
  isExpanded: boolean;
  onClick: () => void;
  count: number;
}

function AccordionHeader({
  title,
  isExpanded,
  onClick,
  count,
}: Readonly<AccordionHeaderProps>) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center p-4 
                 text-base font-semibold rounded-xl transition-all duration-200
                 shadow-sm border
                 ${
                   isExpanded
                     ? "bg-primary-50 text-primary-600 border-primary-100 shadow-primary-100/50"
                     : "bg-white text-gray-700 hover:bg-gray-50 border-gray-100"
                 }`}
    >
      <div className="flex items-center gap-2">
        <span>{title}</span>
        <span
          className={`px-2.5 py-0.5 text-xs font-medium rounded-full 
                     ${
                       isExpanded
                         ? "bg-primary-100 text-primary-700"
                         : "bg-gray-100 text-gray-600"
                     }`}
        >
          {count}
        </span>
      </div>
      <ChevronDown
        className={`w-5 h-5 transition-transform duration-200 
                   ${
                     isExpanded
                       ? "rotate-180 text-primary-600"
                       : "text-gray-400"
                   }`}
      />
    </button>
  );
}

interface GroupedTourAddon {
  baseName: string;
  adultAddon?: TransferAddon;
  childAddon?: TransferAddon;
  photos: string[];
  additional_details: string;
}

function groupTourAddons(addons: TransferAddon[]): GroupedTourAddon[] {
  const tourGroups = new Map<string, GroupedTourAddon>();

  addons.forEach((addon) => {
    if (!addon.is_tour_addon) return;

    // Remove "-Adult" or "-Child" to get base name
    const baseName = addon.addon.replace(/-Adult$|-Child$/, "");

    if (!tourGroups.has(baseName)) {
      tourGroups.set(baseName, {
        baseName,
        photos: addon.photos,
        additional_details: addon.additional_details,
      });
    }

    const group = tourGroups.get(baseName)!;
    if (addon.addon.endsWith("-Adult")) {
      group.adultAddon = addon;
    } else if (addon.addon.endsWith("-Child")) {
      group.childAddon = addon;
    }
  });

  return Array.from(tourGroups.values());
}

interface TourDate {
  tour_addon_id: number;
  tour_date: string;
}

interface TourDatePickerProps {
  group: GroupedTourAddon;
  selectedAddons: Record<number, number>;
  tourDates: TourDate[];
  onTourDatesChange: (
    dates: Array<TourDate> | ((prev: Array<TourDate>) => Array<TourDate>)
  ) => void;
  bookingData: BookingData;
}

function TourDatePicker({
  group,
  selectedAddons,
  tourDates,
  onTourDatesChange,
  bookingData,
}: Readonly<TourDatePickerProps>) {
  const [hasError, setHasError] = useState(false);

  const rangeStart = new Date(bookingData.pickupDateTime);
  const rangeEnd = bookingData.tripType === "return" && bookingData.returnDateTime 
    ? new Date(bookingData.returnDateTime)
    : rangeStart;

  const [datePickerRef] = useDateTimePicker(
    (date) => {
      const newDate = date.toISOString().split("T")[0];
      setHasError(false);
      onTourDatesChange((prev: TourDate[]) => {
        const filtered = prev.filter(
          (td: TourDate) =>
            !(
              (group.adultAddon && td.tour_addon_id === group.adultAddon.id) ||
              (group.childAddon && td.tour_addon_id === group.childAddon.id)
            )
        );

        if (newDate) {
          const newDates: TourDate[] = [];
          if (group.adultAddon && selectedAddons[group.adultAddon.id] > 0) {
            newDates.push({
              tour_addon_id: group.adultAddon.id,
              tour_date: newDate,
            });
          }
          if (group.childAddon && selectedAddons[group.childAddon.id] > 0) {
            newDates.push({
              tour_addon_id: group.childAddon.id,
              tour_date: newDate,
            });
          }
          return [...filtered, ...newDates];
        }
        return filtered;
      });
    },
    {
      minDate: rangeStart,
      maxDate: bookingData.tripType === "return" ? rangeEnd : undefined,
      dateOnly: true,
      isRangePicker: true,
      rangeStart,
      rangeEnd,
      linkedPicker: null
    }
  );

  const currentDate =
    tourDates.find(
      (td) =>
        (group.adultAddon && td.tour_addon_id === group.adultAddon.id) ||
        (group.childAddon && td.tour_addon_id === group.childAddon.id)
    )?.tour_date ?? "";

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Tour Date:
      </div>
      <div className="flex-1">
        <input
          ref={datePickerRef}
          type="text"
          value={currentDate ? new Date(currentDate).toLocaleDateString() : ""}
          placeholder="Select date"
          className={`w-full px-2 py-1 text-sm text-secondary-500 rounded-lg border 
                     ${hasError ? 'border-red-500' : 'border-gray-200'}
                     focus:ring-1 focus:ring-primary-500 focus:border-transparent`}
          readOnly
        />
      </div>
    </div>
  );
}

export function AddOnSelector({
  onBack,
  onNext,
  bookingData,
  addons = [],
  isLoading,
  selectedAddons,
  onAddonsChange,
  transferPrice,
  tourDates,
  onTourDatesChange,
}: Readonly<AddOnSelectorProps>) {
  const popularAddons = addons.filter((addon) => !addon.is_tour_addon);
  const tourAddons = addons.filter((addon) => addon.is_tour_addon);

  const [expandedSection, setExpandedSection] = useState<"popular" | "tours">(
    popularAddons.length > 0 ? "popular" : "tours"
  );
  const [modalData, setModalData] = useState<{
    photos: string[];
    details: string;
    title: string;
  } | null>(null);

  const getAddonPrice = (addon: TransferAddon) => {
    let price = parseFloat(addon.price);

    // Only multiply by 2 if both booking and addon are return type
    if (bookingData.tripType === "return" && addon.return_type === "return") {
      price *= 2;
    }

    return price;
  };

  function updateQuantity(id: number, delta: number) {
    const current = selectedAddons[id] || 0;
    const newValue = Math.max(0, Math.min(22, current + delta));

    if (newValue === 0) {
      const rest = Object.fromEntries(
        Object.entries(selectedAddons).filter(([key]) => key !== id.toString())
      );
      onAddonsChange(rest);
    } else {
      onAddonsChange({ ...selectedAddons, [id]: newValue });
    }
  }

  const addonsTotal = Object.entries(selectedAddons).reduce(
    (sum, [id, quantity]) => {
      const addon = addons.find((a) => a.id === parseInt(id));
      return sum + (addon ? getAddonPrice(addon) * quantity : 0);
    },
    0
  );

  const totalPrice = transferPrice + addonsTotal;

  const AddOnItem = ({ addon }: { addon: TransferAddon }) => {
    const price = getAddonPrice(addon);

    return (
      <div className="flex flex-col py-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-700">
                  {addon.addon}
                </span>
                {price > 0 && (
                  <span className="text-sm text-gray-500">
                    (${price.toFixed(2)}
                    {addon.return_type === "return" &&
                      bookingData.tripType === "return" &&
                      " Return"}
                    )
                  </span>
                )}
                {price === 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
                    FREE
                  </span>
                )}
              </div>
              {addon.additional_details && (
                <button
                  onClick={() =>
                    setModalData({
                      photos: addon.photos,
                      details: addon.additional_details,
                      title: addon.addon,
                    })
                  }
                  className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 
                           transition-colors text-gray-600"
                >
                  <Info className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateQuantity(addon.id, -1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg 
                       bg-gray-100 text-gray-700 hover:bg-gray-200 
                       disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              disabled={!selectedAddons[addon.id]}
            >
              -
            </motion.button>
            <span className="w-6 text-center text-sm font-medium text-gray-700">
              {selectedAddons[addon.id] || 0}
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateQuantity(addon.id, 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg 
                       bg-gray-100 text-gray-700 hover:bg-gray-200 
                       text-sm font-medium"
            >
              +
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  const handleAccordionClick = (section: "popular" | "tours") => {
    if (section !== expandedSection) {
      setExpandedSection(section);
    } else if (
      (section === "popular" && tourAddons.length > 0) ||
      (section === "tours" && popularAddons.length > 0)
    ) {
      setExpandedSection(section === "popular" ? "tours" : "popular");
    }
  };

  const handleTourInfoClick = (group: GroupedTourAddon) => {
    setModalData({
      photos: group.photos,
      details: group.additional_details,
      title: group.baseName,
    });
  };

  const handleNext = () => {
    let hasError = false;
    const groupedTours = groupTourAddons(tourAddons);
    
    groupedTours.forEach(group => {
      const hasAdultBooking = group.adultAddon && selectedAddons[group.adultAddon.id] > 0;
      const hasChildBooking = group.childAddon && selectedAddons[group.childAddon.id] > 0;
      
      if ((hasAdultBooking || hasChildBooking)) {
        const hasDate = tourDates.some(
          td => 
            (group.adultAddon && td.tour_addon_id === group.adultAddon.id) ||
            (group.childAddon && td.tour_addon_id === group.childAddon.id)
        );
        
        if (!hasDate) {
          hasError = true;
          const datePickerElement = document.querySelector(`[data-group-id="${group.baseName}"]`);
          if (datePickerElement) {
            datePickerElement.classList.add('border-red-500');
          }
        }
      }
    });

    if (hasError) {
      return;
    }

    onNext();
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
    <div className="h-full flex flex-col">
      <div className="flex-1 px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8 lg:pt-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-3 text-secondary-500">
            Select Add-ons
          </h2>

          <div className="space-y-2 max-h-[600px] overflow-y-auto px-1">
            {popularAddons.length > 0 && (
              <div>
                <AccordionHeader
                  title="Popular Add-ons"
                  isExpanded={expandedSection === "popular"}
                  onClick={() => handleAccordionClick("popular")}
                  count={popularAddons.length}
                />
                <AnimatePresence initial={false}>
                  {expandedSection === "popular" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 space-y-1 px-2 overflow-hidden"
                    >
                      {popularAddons.map((addon) => (
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
                  isExpanded={expandedSection === "tours"}
                  onClick={() => handleAccordionClick("tours")}
                  count={groupTourAddons(tourAddons).length}
                />
                <AnimatePresence initial={false}>
                  {expandedSection === "tours" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 space-y-4 overflow-hidden"
                    >
                      {groupTourAddons(tourAddons).map((group) => (
                        <div
                          key={group.baseName}
                          className="p-3 rounded-xl bg-gray-50 space-y-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {group.baseName}
                            </span>
                            {group.additional_details && (
                              <button
                                onClick={() => handleTourInfoClick(group)}
                                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 
                                         transition-colors text-gray-600"
                              >
                                <Info className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            {group.adultAddon && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-medium text-gray-700">
                                    Adult
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ($
                                    {parseFloat(group.adultAddon.price).toFixed(
                                      2
                                    )}
                                    )
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      updateQuantity(group.adultAddon!.id, -1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center rounded-lg 
                                             bg-gray-100 text-gray-700 hover:bg-gray-200 
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={
                                      !selectedAddons[group.adultAddon.id]
                                    }
                                  >
                                    -
                                  </motion.button>
                                  <span className="w-6 text-center text-sm text-secondary-500 font-medium">
                                    {selectedAddons[group.adultAddon.id] || 0}
                                  </span>
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      updateQuantity(group.adultAddon!.id, 1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center rounded-lg 
                                             bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  >
                                    +
                                  </motion.button>
                                </div>
                              </div>
                            )}
                            {group.childAddon && (
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-medium text-gray-700">
                                    Child
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    ($
                                    {parseFloat(group.childAddon.price).toFixed(
                                      2
                                    )}
                                    )
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      updateQuantity(group.childAddon!.id, -1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center rounded-lg 
                                             bg-gray-100 text-gray-700 hover:bg-gray-200 
                                             disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={
                                      !selectedAddons[group.childAddon.id]
                                    }
                                  >
                                    -
                                  </motion.button>
                                  <span className="w-6 text-center text-sm text-secondary-500 font-medium">
                                    {selectedAddons[group.childAddon.id] || 0}
                                  </span>
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      updateQuantity(group.childAddon!.id, 1)
                                    }
                                    className="w-7 h-7 flex items-center justify-center rounded-lg 
                                             bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  >
                                    +
                                  </motion.button>
                                </div>
                              </div>
                            )}

                            {((group.adultAddon &&
                              selectedAddons[group.adultAddon.id] > 0) ||
                              (group.childAddon &&
                                selectedAddons[group.childAddon.id] > 0)) && (
                              <TourDatePicker
                                group={group}
                                selectedAddons={selectedAddons}
                                tourDates={tourDates}
                                onTourDatesChange={onTourDatesChange}
                                bookingData={bookingData}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                  opacity: {
                    duration: 0.2,
                    delay: 0.1,
                  },
                },
              }}
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: {
                    duration: 0.3,
                    ease: "easeIn",
                  },
                  opacity: {
                    duration: 0.1,
                  },
                },
              }}
              className="overflow-hidden mt-4 px-1"
            >
              <motion.div
                className="p-3 rounded-xl bg-primary-50 border border-primary-100"
                initial={{ y: 10 }}
                animate={{
                  y: 0,
                  transition: {
                    duration: 0.3,
                    ease: "easeOut",
                  },
                }}
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700 flex items-center gap-1">
                    Total Price{" "}
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={addonsTotal > 0 ? "with-addons" : "transfer-only"}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="text-gray-500"
                      >
                        ({addonsTotal > 0 ? "Transfer + Add-ons" : "Transfer"})
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <motion.span
                    key={totalPrice}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.3,
                        ease: "easeOut",
                      },
                    }}
                    className="font-semibold text-gray-900"
                  >
                    ${totalPrice.toFixed(2)}
                  </motion.span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="p-4">
        <div className="flex gap-3 max-w-md mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 
                     text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="flex-1 py-3 px-4 rounded-xl bg-primary-600 text-white 
                     hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            Next
          </motion.button>
        </div>
      </div>

      <TourDetailsModal
        isOpen={modalData !== null}
        onClose={() => setModalData(null)}
        photos={modalData?.photos ?? []}
        details={modalData?.details ?? ""}
        title={modalData?.title ?? ""}
      />
    </div>
  );
}
