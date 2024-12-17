import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../lib/axios";
import { LocationAutocomplete } from "./location-autocomplete";
import { PickupDropoffLocation } from "../types";
import { useDateTimePicker } from "../hooks/useDateTimePicker";

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

export function BookingForm({ onNext }: Readonly<BookingFormProps>) {
  const [tripType, setTripType] = useState<TripType>("return");
  const [passengers, setPassengers] = useState(1);
  const [pickupLocation, setPickupLocation] =
    useState<PickupDropoffLocation | null>(null);
  const [dropoffLocation, setDropoffLocation] =
    useState<PickupDropoffLocation | null>(null);
  const [pickupDateTime, setPickupDateTime] = useState("");
  const [returnDateTime, setReturnDateTime] = useState("");

  const { data: unsortedPickupLocations = [], isLoading: isLoadingPickup } =
    useQuery({
      queryKey: ["pickupLocations"],
      queryFn: apiService.getPickupLocations,
    });

  const pickupLocations = [...unsortedPickupLocations].sort((a, b) =>
    (a?.description ?? "").localeCompare(b?.description ?? "")
  );

  const { data: unsortedDropoffLocations = [], isLoading: isLoadingDropoff } =
    useQuery({
      queryKey: ["dropoffLocations", pickupLocation?.id],
      queryFn: () => apiService.getDropoffLocations(pickupLocation?.id ?? 0),
      enabled: !!pickupLocation?.id,
    });

  const dropoffLocations = [...unsortedDropoffLocations].sort((a, b) =>
    (a?.description ?? "").localeCompare(b?.description ?? "")
  );

  const pickupLocationWasSet = useRef(false);

  useEffect(() => {
    if (
      pickupLocations.length > 0 &&
      !pickupLocation &&
      !pickupLocationWasSet.current
    ) {
      const defaultLocation = pickupLocations.find((loc) => loc.id === 593);
      if (defaultLocation) {
        setPickupLocation(defaultLocation);
        pickupLocationWasSet.current = true;
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
      rangeStart: pickupDateTime ? new Date(pickupDateTime) : null,
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
      rangeEnd: returnDateTime ? new Date(returnDateTime) : null,
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
        returnDateTime: tripType === "return" ? returnDateTime : undefined,
      });
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main content */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
          {/* Trip Type Selection */}
          <motion.div
            className="flex justify-center space-x-8 text-sm"
            initial={false}
          >
            <motion.label
              className="inline-flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="radio"
                className="form-radio text-primary-600 h-4 w-4"
                checked={tripType === "one-way"}
                onChange={() => setTripType("one-way")}
              />
              <motion.span
                className="ml-2 font-medium"
                animate={{
                  fontWeight: tripType === "one-way" ? 600 : 500,
                  color: tripType === "one-way" ? "#4B5563" : "#6B7280",
                }}
              >
                One-way
              </motion.span>
            </motion.label>
            <motion.label
              className="inline-flex items-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <input
                type="radio"
                className="form-radio text-primary-600 h-4 w-4"
                checked={tripType === "return"}
                onChange={() => setTripType("return")}
              />
              <motion.span
                className="ml-2 font-medium"
                animate={{
                  fontWeight: tripType === "return" ? 600 : 500,
                  color: tripType === "return" ? "#4B5563" : "#6B7280",
                }}
              >
                Return
              </motion.span>
            </motion.label>
          </motion.div>

          {/* Number of Passengers */}
          <div className="text-center">
            <label
              htmlFor="decrement-passengers"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Passengers
            </label>
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                id="decrement-passengers"
                onClick={() => setPassengers(Math.max(1, passengers - 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                -
              </button>
              <span className="text-lg font-medium w-8 text-center text-gray-700">
                {passengers}
              </span>
              <button
                type="button"
                onClick={() => setPassengers(passengers + 1)}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Pickup Location */}
          <div className="text-center">
            <label
              htmlFor="pickup-location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Pickup Location
            </label>
            <LocationAutocomplete
              locations={pickupLocations}
              value={pickupLocation}
              onChange={setPickupLocation}
              placeholder="Nadi International Airport"
              isLoading={isLoadingPickup}
              id="pickup-location"
            />
          </div>

          {/* Dropoff Location */}
          <div className="text-center">
            <label
              htmlFor="dropoff-location"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Dropoff Location
            </label>
            <LocationAutocomplete
              locations={dropoffLocations}
              value={dropoffLocation}
              onChange={setDropoffLocation}
              placeholder="Select hotel/resort"
              isLoading={isLoadingDropoff}
              id="dropoff-location"
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
                       focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center text-sm"
              readOnly
            />
          </div>

          {/* Return Date & Time */}
          <AnimatePresence mode="wait">
            {tripType === "return" && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -10 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  y: 0,
                  transition: {
                    height: { duration: 0.3, ease: "easeOut" },
                    opacity: { duration: 0.2, delay: 0.1 },
                    y: { duration: 0.2, delay: 0.1 },
                  },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  y: -10,
                  transition: {
                    height: { duration: 0.2, ease: "easeIn" },
                    opacity: { duration: 0.1 },
                    y: { duration: 0.1 },
                  },
                }}
                className="overflow-hidden"
              >
                <div className="text-center pt-2">
                  <label
                    htmlFor="return-date-time"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Return Date & Time
                  </label>
                  <input
                    ref={returnRef}
                    type="text"
                    placeholder="dd/mm/yyyy | hh:mm"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 
                             focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center text-sm"
                    readOnly
                    id="return-date-time"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Bottom button - pushed down by flex-1 above */}
      <div className="p-4">
        <div className="max-w-md mx-auto">
          <motion.button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-3 px-4 rounded-xl bg-primary-600 text-white font-medium text-sm
                     hover:bg-primary-700 transition-colors focus:ring-2 focus:ring-primary-200
                     disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
}
