import { motion } from "framer-motion";
import { HeroBackground } from "../components/hero-background";
import {
  Target,
  Users,
  Car,
  Award,
  ArrowRight,
  Star,
  Shield,
  Map,
  Clock,
} from "lucide-react";

function AboutPage() {
  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const heroDescriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const visionContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const valueCardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    hover: {
      y: -8,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const valueItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

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
    <div className="flex flex-col">
      {/* Hero Section */}
      <HeroBackground>
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <motion.h1
              className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
              variants={heroTextVariants}
            >
              About Fiji Rides
            </motion.h1>
            <motion.p
              className="mt-6 text-xl leading-8 text-white/90"
              variants={heroDescriptionVariants}
            >
              Welcome to Fiji Rides, a proud product of Global Bedbank, founded
              in 2024. We are a 100% Fijian-owned company committed to
              delivering the best in authentic Fijian hospitality and
              customer-centric transport services across Fiji.
            </motion.p>
          </motion.div>
        </div>
      </HeroBackground>

      {/* New Vision & Values Section */}
      <div className="bg-primary-50 border-y border-primary-100">
        <motion.div
          className="mx-auto max-w-7xl px-6 py-16 lg:px-8"
          variants={visionContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Vision Statement */}
          <motion.div
            className="text-center mb-16"
            variants={heroDescriptionVariants}
          >
            <motion.div
              className="inline-flex items-center justify-center mb-6"
              whileHover={{ scale: 1.1, rotate: 180 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Star className="h-8 w-8 text-content-primary" />
            </motion.div>
            <motion.p
              className="text-xl font-medium text-secondary-500 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              To provide exceptional transfer experiences that combine Fijian
              hospitality with world-class service standards, ensuring every
              journey is memorable.
            </motion.p>
          </motion.div>

          {/* Core Values */}
          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={visionContainerVariants}
          >
            {[
              {
                icon: Shield,
                title: "Safety First",
                text: "Regular vehicle maintenance and professional drivers ensure your safety.",
              },
              {
                icon: Map,
                title: "Local Expertise",
                text: "Our team knows Fiji inside out, providing insider knowledge and recommendations.",
              },
              {
                icon: Clock,
                title: "Reliability",
                text: "24/7 service with punctual pickups and efficient transfers.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-white shadow-sm"
                variants={valueCardVariants}
                whileHover="hover"
                custom={index}
              >
                <motion.div
                  className="bg-primary-50 p-3 rounded-xl mb-4"
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                  <item.icon className="h-6 w-6 text-content-primary" />
                </motion.div>
                <motion.h3
                  className="text-lg font-semibold text-secondary-500 mb-2"
                  variants={valueItemVariants}
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  className="text-secondary-400"
                  variants={valueItemVariants}
                >
                  {item.text}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white">
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
              className="mt-2 h-1 w-20 bg-content-primary mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          </motion.div>

          {/* Content Grid */}
          <motion.div
            className="grid md:grid-cols-2 gap-12"
            variants={containerVariants}
          >
            {/* Left Column */}
            <div className="grid content-start gap-12">
              {/* Mission Section */}
              <motion.div
                className="relative bg-primary-50 rounded-2xl p-8 h-[280px]"
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
                <div className="h-full flex flex-col">
                  <h3 className="text-2xl font-semibold text-secondary-500 mt-2 mb-4">
                    Our Mission
                  </h3>
                  <p className="text-lg leading-relaxed text-secondary-400">
                    At Fiji Rides, we believe that travel is not just about
                    getting from one place to another: it's about experiencing
                    the warmth and culture of Fiji along the way.
                  </p>
                </div>
              </motion.div>

              {/* Team Section */}
              <motion.div
                className="relative bg-primary-50 rounded-2xl p-8 h-[280px]"
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
                <div className="h-full flex flex-col">
                  <h3 className="text-2xl font-semibold text-secondary-500 mt-2 mb-4">
                    Our Team
                  </h3>
                  <p className="text-lg leading-relaxed text-secondary-400">
                    Our team of experienced, professional drivers are passionate
                    about offering you more than just a ride—they aim to provide
                    you with a memorable journey, enriched with local insights,
                    personalized care, and exceptional service.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="grid content-start gap-12">
              {/* Services Section */}
              <motion.div
                className="relative bg-primary-50 rounded-2xl p-8 h-[280px]"
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
                <div className="h-full flex flex-col">
                  <h3 className="text-2xl font-semibold text-secondary-500 mt-2 mb-4">
                    Our Services
                  </h3>
                  <p className="text-lg leading-relaxed text-secondary-400">
                    Whether you're arriving in Fiji for the first time,
                    embarking on a guided tour, or simply needing reliable
                    transportation, we've got you covered. Our range of services
                    includes airport transfers, group transport, and tailored
                    tours, all designed to offer convenience, comfort, and
                    affordable pricing.
                  </p>
                </div>
              </motion.div>

              {/* Experience Section */}
              <motion.div
                className="relative bg-primary-50 rounded-2xl p-8 h-[280px]"
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
                <div className="h-full flex flex-col">
                  <h3 className="text-2xl font-semibold text-secondary-500 mt-2 mb-4">
                    Our Experience
                  </h3>
                  <p className="text-lg leading-relaxed text-secondary-400">
                    Fiji Rides brings together years of expertise in hospitality
                    and customer service, offering a seamless travel experience
                    that showcases the true spirit of Fiji.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div className="mt-24 text-center" variants={itemVariants}>
            <motion.div
              className="inline-flex items-center gap-4 rounded-full px-8 py-4 bg-primary-50 border border-primary-100 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <p className="text-lg font-medium text-secondary-500">
                Join us and discover why Fiji Rides is the preferred choice for
                authentic, reliable, and customer-focused transport in Fiji.
              </p>
              <motion.span
                className="text-content-primary font-semibold flex items-center gap-2"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </motion.span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutPage;
