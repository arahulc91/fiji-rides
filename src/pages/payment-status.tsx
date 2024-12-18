import { useEffect, useState } from 'react';
import { useSearch } from '@tanstack/react-router';
import { apiService } from '../lib/axios';
import { motion } from 'framer-motion';
import { HeroBackground } from '../components/hero-background';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentStatus {
  status: 'approved' | 'Declined' | 'pending';
  message?: string;
  primary_traveller_name?: string;
  no_of_passengers?: number;
  return_type?: 'Return' | 'One Way';
  pickup_location?: string;
  dropoff_location?: string;
  pickup_date_time?: string;
  return_date_time?: string;
  addons?: Array<{
    addon_id: number;
    addon_qty: number;
    addon_description: string;
  }>;
  grand_total?: number;
}

export function PaymentStatusPage() {
  const search = useSearch({ from: '/payment-status' });
  const orderId = search.order_id as string | undefined;
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!orderId) return;
      try {
        const response = await apiService.checkPaymentStatus({ order_id: orderId });
        setStatus(response);
      } catch (error) {
        console.error('Error checking payment status:', error);
        setStatus({ status: 'Declined', message: 'Failed to check payment status' });
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [orderId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <HeroBackground>
          <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </HeroBackground>
      </div>
    );
  }

  if (!status || !orderId) {
    return (
      <div className="flex flex-col">
        <HeroBackground>
          <motion.div 
            className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="mx-auto max-w-3xl text-center">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                Invalid Order ID
              </h1>
              <p className="mt-6 text-xl leading-8 text-white/90">
                Unable to find payment information.
              </p>
            </motion.div>
          </motion.div>
        </HeroBackground>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <HeroBackground>
        <motion.div 
          className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 min-h-[calc(100vh-64px)] flex items-center justify-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants} 
            className="w-full max-w-3xl"
          >

           
            {status.status === 'Declined' && (
              <>
               

                <motion.div 
                  variants={itemVariants}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl text-center"
                >
                      <div className="text-center mb-6">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold tracking-tight text-red-500 sm:text-4xl mb-4">
                      Payment Failed
                    </h1>
                    <p className="text-lg text-black">
                      Order ID: {orderId}
                    </p>
                    <p className="mt-2 text-lg text-black">
                      {status.message || 'Your payment could not be processed.'}
                    </p>
                  </div>
                  <h2 className="text-xl font-semibold text-secondary-700 mb-6">
                    What would you like to do?
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => window.location.href = '/'}
                      className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white 
                               rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={() => window.location.href = '/contact'}
                      className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary-600 
                               border-2 border-primary-600 rounded-lg hover:bg-primary-50 
                               transition-colors text-lg font-medium"
                    >
                      Contact Support
                    </button>
                  </div>

                  <div className="mt-8 text-left">
                    <h3 className="text-sm font-medium text-secondary-500 mb-4">
                      Common reasons for payment failure:
                    </h3>
                    <ul className="space-y-2 text-sm text-secondary-600">
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Insufficient funds in the account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Card declined by issuing bank</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Incorrect card information entered</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1">•</span>
                        <span>Transaction flagged for security reasons</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              </>
            )}

            {status.status === 'approved' && (
              <motion.div 
                variants={itemVariants}
                className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
              >
                {/* Main Booking Info */}
                <div className='text-center mb-6'>
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold tracking-tight text-primary-500 sm:text-4xl">
                    Booking Confirmed
                  </h1>
                  <p className="mt-2 text-lg text-black">
                    Order ID: {orderId}
                  </p>
                  </div>
                <div className="grid gap-4 sm:grid-cols-2 mb-6">
                  <div>
                    <p className="text-sm text-primary-600">Traveller</p>
                    <p className="font-medium text-secondary-600">{status.primary_traveller_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-600">Total Amount</p>
                    <p className="font-medium text-secondary-600">${status.grand_total?.toFixed(2)} FJD</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-600">Passengers</p>
                    <p className="font-medium text-secondary-600">{status.no_of_passengers}</p>
                  </div>
                  <div>
                    <p className="text-sm text-primary-600">Trip Type</p>
                    <p className="font-medium text-secondary-600">{status.return_type}</p>
                  </div>
                </div>

                {/* Journey Details */}
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-primary-600 mb-2">Pickup</h3>
                      <p className="text-sm mb-1 text-secondary-600">{status.pickup_location}</p>
                      <p className="text-sm text-secondary-600">{status.pickup_date_time}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-primary-600 mb-2">Drop-off</h3>
                      <p className="text-sm mb-1 text-secondary-600">{status.dropoff_location}</p>
                      {status.return_date_time && (
                        <p className="text-sm text-secondary-600">{status.return_date_time}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Addons - Only show if present */}
                {status.addons && status.addons.length > 0 && (
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-primary-600 mb-2">
                      Additional Services
                    </h3>
                    <div className="space-y-2">
                      {status.addons.map((addon) => (
                        <div 
                          key={addon.addon_id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-secondary-600">{addon.addon_description}</span>
                          <span className="text-secondary-600">x{addon.addon_qty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </HeroBackground>
    </div>
  );
} 