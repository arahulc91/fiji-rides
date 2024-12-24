import { motion } from "framer-motion";
import { Target, Users, Car, Award } from "lucide-react";

export function AboutSection() {
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -5,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <div id="about-section" className="bg-white w-full">
      <motion.div
        className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Section Header */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h2 className="text-3xl font-bold tracking-tight text-secondary-500 sm:text-4xl">
            Discover Our Story
          </h2>
          <motion.div
            className="mt-4 h-1 w-20 bg-content-primary mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />
        </motion.div>

        {/* Content Grid */}
        <motion.div className="grid md:grid-cols-2 gap-12" variants={containerVariants}>
          {/* Left Column */}
          <div className="grid content-start gap-12">
            {/* Mission Section */}
            <motion.div
              className="relative bg-primary-50 rounded-2xl p-8 h-[280px] flex flex-col"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="absolute -top-5 left-8"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-content-primary p-3 rounded-xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col flex-1">
                <h3 className="text-2xl font-semibold text-secondary-500 mt-2 mb-4">
                  Our Mission
                </h3>
                <p className="text-lg leading-relaxed text-secondary-400">
                  At Fiji Rides, we believe that travel is not just about getting from
                  one place to another: it's about experiencing the warmth and culture
                  of Fiji along the way.
                </p>
              </div>
            </motion.div>

            {/* Team Section */}
            <motion.div
              className="relative bg-primary-50 rounded-2xl p-8 h-[280px] flex flex-col"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="absolute -top-5 left-8"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-content-primary p-3 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col flex-1">
                <h3 className="text-2xl font-semibold text-secondary-500 mt-2 mb-4">
                  Our Team
                </h3>
                <p className="text-lg leading-relaxed text-secondary-400">
                  Our team of experienced, professional drivers are passionate about
                  offering you more than just a ride—they aim to provide you with a
                  memorable journey, enriched with local insights, personalized care,
                  and exceptional service.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="grid content-start gap-12">
            {/* Services Section */}
            <motion.div
              className="relative bg-primary-50 rounded-2xl p-8 h-[280px] flex flex-col"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="absolute -top-5 left-8"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-content-primary p-3 rounded-xl shadow-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col flex-1">
                <h3 className="text-2xl font-semibold text-secondary-500 mt-2 mb-4">
                  Our Services
                </h3>
                <p className="text-lg leading-relaxed text-secondary-400">
                  Whether you're arriving in Fiji for the first time, embarking on a
                  guided tour, or simply needing reliable transportation, we've got you
                  covered. Our range of services includes airport transfers, group
                  transport, and tailored tours.
                </p>
              </div>
            </motion.div>

            {/* Experience Section */}
            <motion.div
              className="relative bg-primary-50 rounded-2xl p-8 h-[280px] flex flex-col"
              variants={cardVariants}
              whileHover="hover"
            >
              <motion.div
                className="absolute -top-5 left-8"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="bg-content-primary p-3 rounded-xl shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              <div className="flex flex-col flex-1">
                <h3 className="text-2xl font-semibold text-secondary-500 mt-2 mb-4">
                  Our Experience
                </h3>
                <p className="text-lg leading-relaxed text-secondary-400">
                  Fiji Rides brings together years of expertise in hospitality and
                  customer service, offering a seamless travel experience that
                  showcases the true spirit of Fiji.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 