import { motion } from "framer-motion";
import { useState } from "react";
import { PickupDropoffLocation, TransferOption, TransferAddon } from "../types";

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
}

export function BookingSummary({
  onBack,
  onNext,
  bookingData,
  selectedAddons,
  addons,
  transferOption,
}: BookingSummaryProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });

  if (!transferOption) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto w-full"
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading transfer details...</p>
        </div>
      </motion.div>
    );
  }

  const totalAddons = Object.entries(selectedAddons).reduce((sum, [id, quantity]) => {
    const addon = addons.find(a => a.id === parseInt(id));
    return sum + (addon ? parseFloat(addon.price) * quantity : 0);
  }, 0);

  const transferPrice = parseFloat(transferOption.price);
  const grandTotal = transferPrice + totalAddons;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl p-8 shadow-xl max-w-md mx-auto w-full"
    >
      <h2 className="text-xl font-semibold text-center mb-6 text-secondary-500">Booking Summary</h2>

      {/* Location Details */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-xl space-y-2">
          <div>
            <div className="text-sm text-gray-500">Pickup Location</div>
            <div className="font-medium text-gray-900">{bookingData.pickupLocation.description}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Dropoff Location</div>
            <div className="font-medium text-gray-900">{bookingData.dropoffLocation.description}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Trip Type</div>
            <div className="font-medium text-gray-900 capitalize">{bookingData.tripType}</div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-4 mb-8">
        <div className="bg-primary-50 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700">Your Ride</span>
            <span className="font-semibold text-gray-900">FJ${transferPrice.toFixed(2)}</span>
          </div>
          {totalAddons > 0 && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Total Addons</span>
              <span className="font-semibold text-gray-900">FJ${totalAddons.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-primary-100 mt-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Grand Total</span>
              <span className="font-bold text-gray-900">FJ${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter your email address"
          />
        </div>
      </div>

      {/* Terms Checkbox */}
      <div className="mb-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-gray-700">
            I Accept the{" "}
            <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
              terms and conditions
            </a>
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex-1 py-3 px-4 rounded-xl border border-gray-200 
                   text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNext}
          disabled={!acceptedTerms || !formData.fullName || !formData.email}
          className="flex-1 py-3 px-4 rounded-xl bg-primary-600 text-white 
                   hover:bg-primary-700 transition-colors disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          Pay Now
        </motion.button>
      </div>
    </motion.div>
  );
} 