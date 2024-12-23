import { motion } from "framer-motion";
import { useState } from "react";
import { PickupDropoffLocation, TransferOption, TransferAddon } from "../types";
import { apiService } from "../lib/axios";
import { BookingRequest } from "../types/index";
import { Link } from "@tanstack/react-router";

interface BookingSummaryProps {
  onBack: () => void;
  onNext: () => void;
  bookingData: {
    pickupLocation: PickupDropoffLocation;
    dropoffLocation: PickupDropoffLocation;
    passengers: number;
    tripType: "one-way" | "return";
    pickupDateTime: string;
    returnDateTime?: string;
  };
  selectedAddons: Record<number, number>;
  addons: TransferAddon[];
  transferOption: TransferOption;
  tourDates: Array<{
    tour_addon_id: number;
    tour_date: string;
  }>;
}

export function BookingSummary({
  onBack,
  bookingData,
  selectedAddons,
  addons,
  transferOption,
  tourDates,
}: Readonly<BookingSummaryProps>) {
  // Simplified state - removed WebSocket related state
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  const handlePayNow = async () => {
    try {
      const bookingRequest: BookingRequest = {
        return_type: bookingData.tripType,
        pax: bookingData.passengers,
        pickup_location_id: bookingData.pickupLocation.id,
        dropoff_location_id: bookingData.dropoffLocation.id,
        pickup_date: bookingData.pickupDateTime,
        return_date: bookingData.returnDateTime,
        addons: Object.entries(selectedAddons).map(([id, quantity]) => ({
          addon_id: parseInt(id),
          addon_qty: quantity,
        })),
        email: formData.email,
        full_name: formData.fullName,
        terms_and_conditions_accepted: acceptedTerms,
        tour_dates: tourDates,
      };

      const response = await apiService.createBooking(bookingRequest);
      // Redirect to payment URL in same tab
      window.location.href = response.payment_url;
    } catch (error) {
      console.error("Booking Error:", error);
    }
  };

  // Early return after all hooks
  if (!transferOption) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl p-6 shadow-xl max-w-4xl mx-auto w-full"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading transfer details...</p>
        </div>
      </motion.div>
    );
  }

  const getAddonPrice = (addon: TransferAddon) => {
    let price = parseFloat(addon.price);
    if (bookingData.tripType === "return" && addon.return_type === "return") {
      price *= 2;
    }
    return price;
  };

  const totalAddons = Object.entries(selectedAddons).reduce(
    (sum, [id, quantity]) => {
      const addon = addons.find((a) => a.id === parseInt(id));
      return sum + (addon ? getAddonPrice(addon) * quantity : 0);
    },
    0
  );

  const transferPrice =
    bookingData.tripType === "return"
      ? parseFloat(transferOption.price) * 2
      : parseFloat(transferOption.price);

  const grandTotal = transferPrice + totalAddons;

  // Function to render modal content based on payment status
  const renderModalContent = () => {
    // This component doesn't handle payment status anymore, so this function is empty
    return null;
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Main content */}
      <div className="flex-1 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center mb-6 text-secondary-500">
            Booking Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Vehicle Details - Moved Up */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  This is your ride:
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  {transferOption.vehicle_image_base64 && (
                    <div className="aspect-[16/9] md:h-32 w-full mb-2">
                      <img
                        src={`data:image/jpeg;base64,${transferOption.vehicle_image_base64}`}
                        alt="Vehicle"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="text-sm font-medium text-gray-900">
                    {transferOption.transfer_option}
                  </div>
                  <div className="text-sm text-gray-600">
                    {transferOption.transfer_company}
                  </div>
                </div>
              </div>

              {/* Trip Details - Moved Down with Updated Font Sizes */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Pickup Location
                  </div>
                  <div className="text-sm text-gray-900 font-semibold">
                    {bookingData.pickupLocation.description}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Dropoff Location
                  </div>
                  <div className="text-sm text-gray-900 font-semibold">
                    {bookingData.dropoffLocation.description}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Return Type
                  </div>
                  <div className="text-sm text-gray-900 font-semibold capitalize">
                    {bookingData.tripType}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">
                    Passengers
                  </div>
                  <div className="text-sm text-gray-900 font-semibold">
                    {bookingData.passengers}{" "}
                    {bookingData.passengers === 1 ? "passenger" : "passengers"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Price Breakdown */}
              <div className="bg-primary-50 p-4 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Transfer Price
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    FJ${transferPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Total Addons
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    FJ${totalAddons.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-primary-100 mt-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-700">
                      Grand Total
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      FJ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               placeholder:text-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-900
                               focus:ring-2 focus:ring-primary-500 focus:border-transparent
                               placeholder:text-gray-400"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 
                               focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700">
                    I Accept the{" "}
                    <Link
                      to="/terms"
                      className="text-primary-600 hover:text-primary-700 underline"
                    >
                      terms and conditions
                    </Link>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom buttons - pushed down by flex-1 above */}
      <div className="p-4">
        <div className="flex gap-3 max-w-4xl mx-auto">
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
            onClick={handlePayNow}
            disabled={!acceptedTerms || !formData.fullName || !formData.email}
            className="flex-1 py-3 px-4 rounded-xl bg-primary-600 text-white 
                     hover:bg-primary-700 transition-colors text-sm font-medium
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pay Now
          </motion.button>
        </div>
      </div>

      {/* Payment Status Modal */}
      {renderModalContent()}
    </div>
  );
}
