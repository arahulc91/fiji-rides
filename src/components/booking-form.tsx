import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../lib/axios";
import { LocationAutocomplete } from "./location-autocomplete";
import { PickupDropoffLocation } from "../types";
import { useDateTimePicker } from "../hooks/useDateTimePicker";
import { z } from "zod";
import { MapPin, Flag } from "lucide-react";

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
  pickupLocation: z
    .object({
      id: z.number(),
      description: z.string(),
    })
    .nullable(),
  dropoffLocation: z
    .object({
      id: z.number(),
      description: z.string(),
    })
    .nullable(),
  passengers: z.number().min(1).max(22),
  tripType: z.enum(["one-way", "return"]),
  pickupDateTime: z.string().min(1, "Pickup date & time is required"),
  returnDateTime: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      return new Date(date) > new Date();
    }, "Return date must be in the future"),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface FormErrors {
  pickupLocation?: string;
  dropoffLocation?: string;
  passengers?: string;
  pickupDateTime?: string;
  returnDateTime?: string;
}

export function BookingForm({
  onNext,
  initialData,
}: Readonly<BookingFormProps>) {
  const [tripType, setTripType] = useState<TripType>(
    () => initialData?.tripType ?? "return"
  );

  const [passengers, setPassengers] = useState(
    () => initialData?.passengers ?? 1
  );

  const [pickupLocation, setPickupLocation] =
    useState<PickupDropoffLocation | null>(
      () => initialData?.pickupLocation ?? null
    );

  const [dropoffLocation, setDropoffLocation] =
    useState<PickupDropoffLocation | null>(
      () => initialData?.dropoffLocation ?? null
    );

  const [pickupDateTime, setPickupDateTime] = useState(
    () => initialData?.pickupDateTime ?? ""
  );

  const [returnDateTime, setReturnDateTime] = useState(
    () => initialData?.returnDateTime ?? ""
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
      // Clear return date if it's before the new pickup date
      if (returnDateTime && new Date(returnDateTime) <= date) {
        setReturnDateTime("");
      }

      // Update both pickers to show the range
      if (pickupPickerRef.current && returnPickerRef.current) {
        const rangeEnd = returnDateTime ? new Date(returnDateTime) : null;
        pickupPickerRef.current.options.rangeStart = date;
        pickupPickerRef.current.options.rangeEnd = rangeEnd;
        returnPickerRef.current.options.rangeStart = date;
        returnPickerRef.current.options.rangeEnd = rangeEnd;
      }
    },
    {
      isRangePicker: tripType === "return",
      minDate: new Date(),
      rangeStart: pickupDateTime ? new Date(pickupDateTime) : null,
      rangeEnd:
        tripType === "return"
          ? returnDateTime
            ? new Date(returnDateTime)
            : null
          : null,
    }
  );

  const [returnRef, returnPickerRef] = useDateTimePicker(
    (date) => {
      setReturnDateTime(date.toISOString());

      // Update both pickers to show the range
      if (pickupPickerRef.current && returnPickerRef.current) {
        const rangeStart = pickupDateTime ? new Date(pickupDateTime) : null;
        pickupPickerRef.current.options.rangeStart = rangeStart;
        pickupPickerRef.current.options.rangeEnd = date;
        returnPickerRef.current.options.rangeStart = rangeStart;
        returnPickerRef.current.options.rangeEnd = date;
      }
    },
    {
      isRangePicker: tripType === "return",
      linkedPicker: pickupPickerRef.current,
      minDate: pickupDateTime ? new Date(pickupDateTime) : new Date(),
      rangeStart: pickupDateTime ? new Date(pickupDateTime) : null,
      rangeEnd: returnDateTime ? new Date(returnDateTime) : null,
    }
  );

  // Update range display when trip type changes
  useEffect(() => {
    if (pickupPickerRef.current) {
      pickupPickerRef.current.options.isRangePicker = tripType === "return";
      if (tripType === "one-way") {
        pickupPickerRef.current.options.rangeEnd = null;
      }
    }
    if (returnRef.current && tripType === "return") {
      // Re-run the useDateTimePicker hook's initialization logic
      const newOptions = {
        isRangePicker: true,
        linkedPicker: pickupPickerRef.current,
        minDate: pickupDateTime ? new Date(pickupDateTime) : new Date(),
        rangeStart: pickupDateTime ? new Date(pickupDateTime) : null,
        rangeEnd: returnDateTime ? new Date(returnDateTime) : null,
      };

      // Update the options of the existing picker
      if (returnPickerRef.current) {
        Object.assign(returnPickerRef.current.options, newOptions);
      }
    }
  }, [tripType, pickupDateTime, returnDateTime]);

  // Reset return date when switching to one-way
  useEffect(() => {
    if (tripType === "one-way") {
      setReturnDateTime("");
    }
  }, [tripType]);

  const isSwapping = useRef(false);

  useEffect(() => {
    if (!isSwapping.current && pickupLocation) {
      setDropoffLocation(null);
    }
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
          if (!newErrors[path]) {
            // Only add if not already present
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
      <div className="flex-1 px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8 lg:pt-4">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-3 text-secondary-500">
            Book a Transfer
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Combined Location Field */}
            <div className={`relative bg-white rounded-xl shadow-sm overflow-hidden
                             border transition-colors duration-200
                             ${Object.keys(errors).some(key => key.includes('Location')) 
                               ? 'border-red-200 ring-1 ring-red-500' 
                               : 'border-gray-200 hover:border-gray-300'}`}>
              {/* Pickup Location */}
              <div className="relative">
                <LocationAutocomplete
                  locations={pickupLocations}
                  value={pickupLocation}
                  onChange={(location) => setPickupLocation(location as PickupDropoffLocation)}
                  placeholder="From: Address, airport, hotel"
                  isLoading={isLoadingPickup}
                  id="pickup-location"
                  className={`border-0 focus:ring-0 ${
                    errors.pickupLocation 
                      ? 'bg-red-50' 
                      : 'bg-transparent hover:bg-gray-50 focus:bg-white'
                  }`}
                  icon={
                    <div className="relative">
                      <MapPin className={`h-5 w-5 ${
                        errors.pickupLocation ? 'text-red-400' : 'text-gray-400'
                      }`} />
                    </div>
                  }
                />
              </div>

              {/* Connecting Line and Divider */}
              <div className="relative">
                <div
                  className="absolute left-[25px] w-[2px] top-[-10px] h-[calc(100%+20px)] z-10"
                  style={{
                    background:
                      "repeating-linear-gradient(to bottom, #9CA3AF 0, #9CA3AF 4px, transparent 4px, transparent 8px)",
                  }}
                />
                <div className="flex items-center">
                  <div
                    className="h-[1px] flex-1 ml-12"
                    style={{
                      background:
                        "repeating-linear-gradient(to right, #E5E7EB 0, #E5E7EB 4px, transparent 4px, transparent 8px)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Store both values first
                      const temp1 = pickupLocation;
                      const temp2 = dropoffLocation;
                      
                      // Disable the useEffect temporarily
                      isSwapping.current = true;
                      
                      // Then update both states
                      setPickupLocation(temp2);
                      setDropoffLocation(temp1);
                      
                      // Re-enable the useEffect after the swap
                      setTimeout(() => {
                        isSwapping.current = false;
                      }, 0);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 
                               transition-colors duration-150 focus:outline-none 
                               focus:ring-2 focus:ring-primary-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-400"
                    >
                      <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Dropoff Location */}
              <div className="relative">
                <LocationAutocomplete
                  locations={dropoffLocations}
                  value={dropoffLocation}
                  onChange={(location) => setDropoffLocation(location as PickupDropoffLocation)}
                  placeholder="To: Address, airport, hotel"
                  isLoading={isLoadingDropoff}
                  id="dropoff-location"
                  className={`border-0 focus:ring-0 ${
                    errors.dropoffLocation 
                      ? 'bg-red-50' 
                      : 'bg-transparent hover:bg-gray-50 focus:bg-white'
                  }`}
                  icon={
                    <div className="relative">
                      <Flag className={`h-5 w-5 ${
                        errors.dropoffLocation ? 'text-red-400' : 'text-gray-400'
                      }`} />
                    </div>
                  }
                />
              </div>
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
                  errors.pickupDateTime ? "border-red-500" : "border-gray-200"
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
                        errors.returnDateTime
                          ? "border-red-500"
                          : "border-gray-200"
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
