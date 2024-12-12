import { HeroBackground } from '../components/hero-background'
import { motion } from "framer-motion";
import { BookingForm } from '../components/booking-form';

function HomePage() {
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

  return (
    <div className="flex flex-col">
      <HeroBackground className="min-h-[800px]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Hero Text */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-5xl font-bold tracking-tight text-white"
                variants={itemVariants}
              >
                Fiji's Exclusive
                <span className="block text-primary-300 mt-2">24-Hour Private</span>
                <span className="block text-white mt-2">Transfer Experience</span>
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg leading-8 text-white/90"
                variants={itemVariants}
              >
                Seamless, comfortable, and personalized transfers at your convenience throughout the beautiful islands of Fiji.
              </motion.p>
            </motion.div>

            {/* Booking Form */}
            <BookingForm />
          </div>
        </div>
      </HeroBackground>
    </div>
  );
}

export default HomePage; 