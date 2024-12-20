import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../lib/axios";
import { LocationAutocomplete } from "./location-autocomplete";
import { PickupDropoffLocation } from "../types";
import { useDateTimePicker } from "../hooks/useDateTimePicker";
import { z } from "zod";

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
  initialData?: BookingData | null;
}

// Add validation schema
const bookingFormSchema = z.object({
  pickupLocation: z.object({
    id: z.number(),
    description: z.string(),
  }).nullable(),
  dropoffLocation: z.object({
    id: z.number(),
    description: z.string(),
  }).nullable(),
  passengers: z.number().min(1).max(22),
  tripType: z.enum(["one-way", "return"]),
  pickupDateTime: z.string().min(1, "Pickup date & time is required"),
  returnDateTime: z.string().optional().refine(
    (date) => {
      if (!date) return true;
      return new Date(date) > new Date();
    },
    "Return date must be in the future"
  ),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface FormErrors {
  pickupLocation?: string;
  dropoffLocation?: string;
  passengers?: string;
  pickupDateTime?: string;
  returnDateTime?: string;
}

export function BookingForm({ onNext, initialData }: Readonly<BookingFormProps>) {
  const [tripType, setTripType] = useState<TripType>(() => 
    initialData?.tripType ?? "return"
  );
  
  const [passengers, setPassengers] = useState(() => 
    initialData?.passengers ?? 1
  );
  
  const [pickupLocation, setPickupLocation] = useState<PickupDropoffLocation | null>(() => 
    initialData?.pickupLocation ?? null
  );
  
  const [dropoffLocation, setDropoffLocation] = useState<PickupDropoffLocation | null>(() => 
    initialData?.dropoffLocation ?? null
  );
  
  const [pickupDateTime, setPickupDateTime] = useState(() => 
    initialData?.pickupDateTime ?? ""
  );
  
  const [returnDateTime, setReturnDateTime] = useState(() => 
    initialData?.returnDateTime ?? ""
  );

  const [errors, setErrors] = useState<FormErrors>({});

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

  // Add this useEffect to reset dropoff location when pickup location changes
  useEffect(() => {
    setDropoffLocation(null);
  }, [pickupLocation]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData: BookingFormData = {
      pickupLocation,
      dropoffLocation,
      passengers,
      tripType,
      pickupDateTime,
      returnDateTime: tripType === "return" ? returnDateTime : undefined,
    };

    // Collect all validation errors at once
    const newErrors: FormErrors = {};
    
    // Remove the try-catch block and combine all validations
    if (!formData.pickupLocation) {
      newErrors.pickupLocation = "Pickup location is required";
    }
    if (!formData.dropoffLocation) {
      newErrors.dropoffLocation = "Dropoff location is required";
    }
    if (!formData.pickupDateTime) {
      newErrors.pickupDateTime = "Pickup date & time is required";
    }
    if (tripType === "return" && !formData.returnDateTime) {
      newErrors.returnDateTime = "Return date & time is required";
    }

    // Additional Zod validation if needed
    try {
      bookingFormSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof FormErrors;
          if (!newErrors[path]) { // Only add if not already present
            newErrors[path] = err.message;
          }
        });
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext(formData as BookingData);
  }

  return (
    <div className="h-full flex flex-col">
      {/* Main content */}
      <div className="flex-1 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
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
                onClick={() => setPassengers(Math.min(22, passengers + 1))}
                className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                +
              </button>
            </div>
          </div>

          {/* Pickup Location - Remove error message */}
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
              onChange={(location) => setPickupLocation(location as PickupDropoffLocation)}
              placeholder="Nadi International Airport"
              isLoading={isLoadingPickup}
              id="pickup-location"
              className={errors.pickupLocation ? 'border-red-500' : ''}
            />
          </div>

          {/* Dropoff Location - Remove error message */}
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
              onChange={(location) => setDropoffLocation(location as PickupDropoffLocation)}
              placeholder="Select hotel/resort"
              isLoading={isLoadingDropoff}
              id="dropoff-location"
              className={errors.dropoffLocation ? 'border-red-500' : ''}
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
              className={`w-full px-4 py-3 rounded-xl bg-white border ${
                errors.pickupDateTime ? 'border-red-500' : 'border-gray-200'
              } text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center text-sm`}
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
                    className={`w-full px-4 py-3 rounded-xl bg-white border ${
                      errors.returnDateTime ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-center text-sm`}
                    readOnly
                    id="return-date-time"
                  />
                
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Bottom section with errors and button */}
      <div className="p-4">
        <div className="max-w-md mx-auto">
          {/* Error Messages - only show if there are any errors */}
          {Object.keys(errors).length > 0 && (
            <div
              className="mb-3 bg-red-50 border-l-4 border-red-400 p-2 text-sm text-red-700 rounded"
              role="alert"
            >
              Please fill in all required fields
            </div>
          )}

          {/* Next button */}
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
