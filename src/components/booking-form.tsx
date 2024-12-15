import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../lib/axios";
import { LocationAutocomplete } from "./location-autocomplete";
import { PickupDropoffLocation } from "../types";
import { useDateTimePicker } from "../hooks/useDateTimePicker";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};


type TripType = "one-way" | "return";

interface BookingData {
  pickupLocation: PickupDropoffLocation;
  dropoffLocation: PickupDropoffLocation;
  passengers: number;
  tripType: "one-way" | "return";
  pickupDateTime: string;
  returnDateTime?: string;
}

interface BookingFormProps {
  onNext: (bookingData: BookingData) => void;
}

export function BookingForm({ onNext }: BookingFormProps) {
  const [tripType, setTripType] = useState<TripType>("return");
  const [passengers, setPassengers] = useState(1);
  const [pickupLocation, setPickupLocation] =
    useState<PickupDropoffLocation | null>(null);
  const [dropoffLocation, setDropoffLocation] =
    useState<PickupDropoffLocation | null>(null);
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [returnDateTime, setReturnDateTime] = useState("");

  const { data: unsortedPickupLocations = [], isLoading: isLoadingPickup } = useQuery({
    queryKey: ["pickupLocations"],
    queryFn: apiService.getPickupLocations,
  });

  const pickupLocations = [...unsortedPickupLocations].sort((a, b) => 
    (a?.description ?? '').localeCompare(b?.description ?? '')
  );

  const { data: unsortedDropoffLocations = [], isLoading: isLoadingDropoff } = useQuery({
    queryKey: ["dropoffLocations", pickupLocation?.id],
    queryFn: () => apiService.getDropoffLocations(pickupLocation?.id || 0),
    enabled: !!pickupLocation?.id,
  });

  const dropoffLocations = [...unsortedDropoffLocations].sort((a, b) => 
    (a?.description ?? '').localeCompare(b?.description ?? '')
  );

  useEffect(() => {
    if (pickupLocations.length > 0 && !pickupLocation) {
      const defaultLocation = pickupLocations.find(loc => loc.id === 593);
      if (defaultLocation) {
        setPickupLocation(defaultLocation);
      }
    }
  }, [pickupLocations, pickupLocation]);

  useEffect(() => {
    if (dropoffLocations.length > 0 && pickupLocation) {
      setDropoffLocation(dropoffLocations[0]);
    }
  }, [pickupLocation, dropoffLocations.length]);

  const [pickupRef, pickupPickerRef] = useDateTimePicker(
    (date) => {
      setPickupDateTime(date.toISOString());
    },
    {
      isRangePicker: tripType === "return",
      rangeStart: pickupDateTime ? new Date(pickupDateTime) : null
    }
  );

  const [returnRef, returnPickerRef] = useDateTimePicker(
    (date) => {
      setReturnDateTime(date.toISOString());
    },
    {
      isRangePicker: tripType === "return",
      linkedPicker: pickupPickerRef?.current,
      minDate: pickupDateTime ? new Date(pickupDateTime) : new Date(),
      rangeStart: pickupDateTime ? new Date(pickupDateTime) : null,
      rangeEnd: returnDateTime ? new Date(returnDateTime) : null
    }
  );

  // Update return picker options when pickup date changes
  useEffect(() => {
    if (returnPickerRef.current && pickupDateTime) {
      returnPickerRef.current.options.rangeStart = new Date(pickupDateTime);
      returnPickerRef.current.options.minDate = new Date(pickupDateTime);
    }
  }, [pickupDateTime]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pickupLocation && dropoffLocation) {
      onNext({
        pickupLocation,
        dropoffLocation,
        passengers,
        tripType,
        pickupDateTime,
        returnDateTime: tripType === 'return' ? returnDateTime : undefined
      });
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto w-full"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type Selection */}
        <div className="flex justify-center space-x-8">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-content-primary h-4 w-4"
              checked={tripType === "one-way"}
              onChange={() => setTripType("one-way")}
            />
            <span className="ml-2 text-gray-700">One-way</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              className="form-radio text-content-primary h-4 w-4"
              checked={tripType === "return"}
              onChange={() => setTripType("return")}
            />
            <span className="ml-2 text-gray-700">Return</span>
          </label>
        </div>

        {/* Number of Passengers */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Number of Passengers
          </label>
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
            >
              -
            </button>
            <span className="text-lg font-medium w-8 text-center text-gray-700">
              {passengers}
            </span>
            <button
              type="button"
              onClick={() => setPassengers(passengers + 1)}
              className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pickup Location
          </label>
          <LocationAutocomplete
            locations={pickupLocations}
            value={pickupLocation}
            onChange={setPickupLocation}
            placeholder="Nadi International Airport"
            isLoading={isLoadingPickup}
          />
        </div>

        {/* Dropoff Location */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dropoff Location
          </label>
          <LocationAutocomplete
            locations={dropoffLocations}
            value={dropoffLocation}
            onChange={setDropoffLocation}
            placeholder="Select hotel/resort"
            isLoading={isLoadingDropoff}
            //disabled={!pickupLocation}
          />
        </div>

        {/* Pickup Date & Time */}
        <div className="text-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {tripType === "return" ? "Pickup Date & Time" : "Date & Time"}
          </label>
          <input
            ref={pickupRef}
            type="text"
            placeholder="dd/mm/yyyy | hh:mm"
            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 
                     focus:ring-2 focus:ring-content-primary focus:border-transparent transition-all text-center"
            readOnly
          />
        </div>

        {/* Return Date & Time */}
        <AnimatePresence mode="sync">
          {tripType === "return" && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                marginTop: "1.5rem",
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
                marginTop: 0,
                transition: {
                  height: {
                    duration: 0.3,
                    ease: "easeIn",
                  },
                  opacity: {
                    duration: 0.2,
                  },
                },
              }}
              className="text-center overflow-hidden"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date & Time
              </label>
              <input
                ref={returnRef}
                type="text"
                placeholder="dd/mm/yyyy | hh:mm"
                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 
                         focus:ring-2 focus:ring-content-primary focus:border-transparent transition-all text-center"
                readOnly
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next Button */}
        <motion.button
          type="submit"
          className="w-full bg-content-primary text-white py-3 px-6 rounded-xl hover:bg-primary-600 
                   transform transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-primary-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Next
        </motion.button>
      </form>
    </motion.div>
  );
}
