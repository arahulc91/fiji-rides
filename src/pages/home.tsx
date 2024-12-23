import { HeroBackground } from "../components/hero-background";
import { motion, AnimatePresence } from "framer-motion";
import { BookingForm } from "../components/booking-form";
import { AddOnSelector } from "../components/add-ons-selector";
import {
  Clock,
  Car,
  UserCheck,
  Sofa,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "../lib/axios";
import { BookingSummary } from "../components/booking-summary";
import { PickupDropoffLocation } from "../types/index";
import { RouteMap } from "../components/route-map";
import { useNavigate, useSearch } from "@tanstack/react-router";

interface VehicleSlide {
  image: string;
  title: string;
  description: string;
}

interface BookingData {
  pickupLocation: PickupDropoffLocation;
  dropoffLocation: PickupDropoffLocation;
  passengers: number;
  tripType: "one-way" | "return";
  pickupDateTime: string;
  returnDateTime?: string;
}

// Add this constant at the top of the file, outside the component
const HOME_HERO_IMAGE = '/assets/slideshow/FijiRidesHome.webp';

function HomePage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const featureCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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

  const features = [
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Round-the-clock service for your convenience",
    },
    {
      icon: Car,
      title: "Best Fleet",
      description: "Premium vehicles maintained to the highest standards",
    },
    {
      icon: UserCheck,
      title: "Personalized Service",
      description: "Tailored experiences for every customer",
    },
    {
      icon: Sofa,
      title: "Comfort & Convenience",
      description: "Comfort throughout your journey",
    },
    {
      icon: Shield,
      title: "Safe & Reliable",
      description: "Professional drivers and secure transfers",
    },
  ];

  const vehicleSlides: VehicleSlide[] = [
    {
      image: "/assets/slideshow/VIP Ford 1.png",
      title: "VIP Ford Transport",
      description: "Premium luxury travel for executive needs",
    },
    {
      image: "/assets/slideshow/15 seater 1 (1).jpg",
      title: "15 Seater Van",
      description: "Perfect for medium-sized group travel",
    },
    {
      image: "/assets/slideshow/15 seater with cariage.jpg",
      title: "15 Seater with Luggage Space",
      description: "Extended luggage capacity for your belongings",
    },
    {
      image: "/assets/slideshow/22 seater bus 1.png",
      title: "22 Seater Bus",
      description: "Ideal for large group tours and events",
    },
    {
      image: "/assets/slideshow/5 seater.jpg",
      title: "5 Seater Vehicle",
      description: "Perfect for small families and groups",
    },
    {
      image: "/assets/slideshow/7 seater.jpg",
      title: "7 Seater Vehicle",
      description: "Spacious comfort for larger families",
    },
    {
      image: "/assets/slideshow/Garden-of-the-Sleeping-Giant 1 1.png",
      title: "Garden of the Sleeping Giant",
      description: "Explore Fiji's stunning orchid gardens",
    },
    {
      image: "/assets/slideshow/lawai 1 (1).png",
      title: "Lawai Scenic View",
      description: "Discover the beauty of Lawai",
    },
    {
      image: "/assets/slideshow/Nadi Temple 2.png",
      title: "Sri Siva Subramaniya Temple",
      description: "Visit Nadi's iconic Hindu temple",
    },
    {
      image: "/assets/slideshow/Namaka-Marketzzz 1 1.png",
      title: "Namaka Market",
      description: "Experience local culture and fresh produce",
    },
    {
      image: "/assets/slideshow/Sgtka Road Side.jpg",
      title: "Sigatoka Scenic Drive",
      description: "Enjoy beautiful coastal views",
    },
    {
      image: "/assets/slideshow/Sigatoka-Market- 1 1.png",
      title: "Sigatoka Market",
      description: "Explore the vibrant local marketplace",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState<
    "booking" | "addons" | "summary"
  >(() => {
    return search.step ?? "booking";
  });
  const [bookingData, setBookingData] = useState<BookingData | null>(() => {
    if (search.bookingData) {
      try {
        return JSON.parse(decodeURIComponent(search.bookingData));
      } catch {
        return null;
      }
    }
    return null;
  });
  const [selectedAddons, setSelectedAddons] = useState<Record<number, number>>(
    () => {
      if (search.addons) {
        try {
          return JSON.parse(decodeURIComponent(search.addons));
        } catch {
          return {};
        }
      }
      return {};
    }
  );

  // Prefetch add-ons immediately when component loads
  const { data: addons = [], isLoading: isLoadingAddons } = useQuery({
    queryKey: ["addons"],
    queryFn: () => apiService.getTransferAddons(),
    // No enabled condition - will fetch immediately
  });

  // Keep transfer options query as is since it depends on locations
  const { data: transferOptions = [] } = useQuery({
    queryKey: [
      "transferOptions",
      bookingData?.pickupLocation?.id,
      bookingData?.dropoffLocation?.id,
      bookingData?.passengers,
    ],
    queryFn: () =>
      apiService.getTransferOptions({
        pickup_location: bookingData?.pickupLocation?.id ?? 0,
        dropoff_location: bookingData?.dropoffLocation?.id ?? 0,
        pax: bookingData?.passengers ?? 1,
      }),
    enabled: !!bookingData?.pickupLocation?.id,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % vehicleSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [vehicleSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % vehicleSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + vehicleSlides.length) % vehicleSlides.length
    );
  };

  const handleBookingNext = (data: BookingData) => {
    setBookingData(data);
    navigate({
      to: "/",
      search: {
        step: "addons",
        bookingData: encodeURIComponent(JSON.stringify(data)),
      },
      replace: true,
    });
    setCurrentStep("addons");
  };

  const handleAddonsNext = () => {
    navigate({
      to: "/",
      search: {
        step: "summary",
        bookingData: search.bookingData,
        addons: search.addons,
      },
      replace: true,
    });
    setCurrentStep("summary");
  };

  const handleBack = useCallback(() => {
    if (currentStep === "addons") {
      setCurrentStep("booking");
      navigate({
        to: "/",
        search: {
          step: "booking",
        },
        replace: true,
      });
    } else if (currentStep === "summary") {
      setCurrentStep("addons");
      navigate({
        to: "/",
        search: {
          step: "addons",
          ...(bookingData && {
            bookingData: encodeURIComponent(JSON.stringify(bookingData)),
          }),
          ...(Object.keys(selectedAddons).length > 0 && {
            addons: encodeURIComponent(JSON.stringify(selectedAddons)),
          }),
        },
        replace: true,
      });
    }
  }, [currentStep, bookingData, selectedAddons, navigate]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      if (currentStep !== "booking") {
        const previousStep = currentStep === "summary" ? "addons" : "booking";

        navigate({
          to: "/",
          search: {
            step: previousStep,
            ...(bookingData &&
              previousStep !== "booking" && {
                bookingData: encodeURIComponent(JSON.stringify(bookingData)),
              }),
            ...(Object.keys(selectedAddons).length > 0 &&
              previousStep === "addons" && {
                addons: encodeURIComponent(JSON.stringify(selectedAddons)),
              }),
          },
          replace: true,
        });

        setCurrentStep(previousStep);
      }
    };

    // Add extra history entry to handle back button
    if (currentStep !== "booking") {
      window.history.pushState({ step: currentStep }, "");
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentStep, bookingData, selectedAddons, navigate]);

  // Update URL when state changes
  useEffect(() => {
    navigate({
      to: "/",
      search: {
        ...(currentStep && { step: currentStep }),
        ...(currentStep !== "booking" &&
          bookingData && {
            bookingData: encodeURIComponent(JSON.stringify(bookingData)),
          }),
        ...(currentStep === "summary" &&
          Object.keys(selectedAddons).length > 0 && {
            addons: encodeURIComponent(JSON.stringify(selectedAddons)),
          }),
      },
      replace: true,
    });
  }, [currentStep, bookingData, selectedAddons, navigate]);

  // Add to state
  const [tourDates, setTourDates] = useState<
    Array<{
      tour_addon_id: number;
      tour_date: string;
    }>
  >([]);

  return (
    <div className="flex flex-col overflow-x-hidden w-full">
      <HeroBackground 
        className="min-h-screen" 
        showCarousel={false}
        staticImage={HOME_HERO_IMAGE}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 w-full">
          <div
            className={`flex flex-col lg:flex-row lg:items-center gap-8 ${
              currentStep !== "booking" ? "bg-white rounded-2xl" : ""
            }`}
          >
            {/* Hero Text / Map Container */}
            <AnimatePresence mode="wait">
              {(() => {
                if (currentStep === "booking") {
                  return (
                    <motion.div
                      key="hero-text"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-auto text-center lg:text-left self-center"
                    >
                      <motion.h1
                        className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-white"
                        variants={itemVariants}
                      >
                        <div>Fiji's Exclusive</div>
                        <div className="text-primary-300 mt-1 lg:mt-2">
                          24-Hour Private
                        </div>
                        <div className="text-white mt-1 lg:mt-2">
                          Transfer Experience
                        </div>
                      </motion.h1>
                      <motion.p
                        className="mt-4 lg:mt-6 text-base lg:text-lg leading-7 lg:leading-8 text-white/90"
                        variants={itemVariants}
                      >
                        Seamless, comfortable, and personalized transfers at
                        your convenience throughout the beautiful islands of
                        Fiji.
                      </motion.p>
                    </motion.div>
                  );
                }

                return (
                  <motion.div
                    key="route-map"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`${
                      currentStep === "summary" ? "hidden lg:block" : "block"
                    } transition-[width] duration-300 ease-in-out ${
                      currentStep === "summary"
                        ? "lg:w-[calc(100%-540px-2rem)]"
                        : "lg:w-[calc(100%-440px-2rem)]"
                    } w-full h-[400px] lg:h-[680px]`}
                  >
                    {bookingData && (
                      <RouteMap
                        pickupLocation={bookingData.pickupLocation}
                        dropoffLocation={bookingData.dropoffLocation}
                      />
                    )}
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            {/* Form Container */}
            <div
              className={`w-full lg:w-auto transition-[width] duration-300 ease-in-out ${
                currentStep === "summary" ? "lg:w-[540px]" : "lg:w-[440px]"
              }`}
            >
              <div
                className={`w-full lg:w-auto transition-[width] duration-300 ease-in-out ${
                  currentStep === "summary"
                    ? "lg:w-full lg:max-w-2xl"
                    : "lg:w-[440px]"
                } ${
                  currentStep === "booking"
                    ? "bg-white rounded-2xl shadow-xl"
                    : ""
                }`}
              >
                <div
                  className={`relative transition-all duration-300 ease-in-out w-full ${
                    currentStep === "summary"
                      ? "lg:w-[540px] min-h-[1080px] sm:min-h-[680px]"
                      : "lg:w-[440px]"
                  } mx-auto h-[680px] pb-6`}
                >
                  <AnimatePresence mode="wait">
                    {(() => {
                      if (currentStep === "booking") {
                        return (
                          <motion.div
                            key="booking"
                            className="absolute inset-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <BookingForm
                              onNext={handleBookingNext}
                              initialData={bookingData}
                            />
                          </motion.div>
                        );
                      }

                      if (currentStep === "addons") {
                        return (
                          <motion.div
                            key="addons"
                            className="absolute inset-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <AddOnSelector
                              onBack={handleBack}
                              onNext={handleAddonsNext}
                              bookingData={bookingData!}
                              addons={addons}
                              isLoading={isLoadingAddons}
                              selectedAddons={selectedAddons}
                              onAddonsChange={(newAddons) => {
                                setSelectedAddons(newAddons);
                                navigate({
                                  to: "/",
                                  search: {
                                    step: "addons",
                                    bookingData: search.bookingData,
                                    addons: encodeURIComponent(
                                      JSON.stringify(newAddons)
                                    ),
                                  },
                                  replace: true,
                                });
                              }}
                              transferPrice={
                                transferOptions[0]
                                  ? Number(transferOptions[0].price) *
                                    (bookingData?.tripType === "return" ? 2 : 1)
                                  : 0
                              }
                              tourDates={tourDates}
                              onTourDatesChange={setTourDates}
                            />
                          </motion.div>
                        );
                      }

                      if (currentStep === "summary" && transferOptions?.[0]) {
                        return (
                          <motion.div
                            key="summary"
                            className="absolute inset-0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <BookingSummary
                              bookingData={bookingData!}
                              selectedAddons={selectedAddons}
                              addons={addons}
                              transferOption={transferOptions[0]}
                              onBack={handleBack}
                              onNext={() => {
                                console.log("Proceeding to payment");
                              }}
                              tourDates={tourDates}
                            />
                          </motion.div>
                        );
                      }

                      return null;
                    })()}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroBackground>

      {/* Features Section */}
      <div className="bg-white w-full">
        <motion.div
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="text-center mb-20" variants={itemVariants}>
            <h2 className="text-3xl font-bold tracking-tight text-secondary-500 sm:text-4xl">
              Premium Transfer Experience
            </h2>
            <p className="mt-4 text-lg leading-8 text-secondary-400">
              Experience unmatched service quality with our comprehensive range
              of features
            </p>
            <motion.div
              className="mt-4 h-1 w-20 bg-content-primary mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8"
            variants={containerVariants}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-8 hover:shadow-xl 
                         transition-all duration-300 overflow-hidden
                         border border-primary-100"
                variants={featureCardVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {/* Decorative gradient background */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <motion.div
                  className="relative bg-primary-100 p-4 rounded-xl inline-block mb-6
                           group-hover:bg-primary-500 transition-colors duration-300"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <feature.icon
                    className="h-6 w-6 text-primary-600 group-hover:text-white 
                                         transition-colors duration-300"
                  />
                </motion.div>

                <div className="relative">
                  <h3
                    className="text-xl font-semibold text-secondary-500 mb-3
                               group-hover:text-primary-600 transition-colors duration-300"
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-secondary-400 group-hover:text-secondary-500
                              transition-colors duration-300"
                  >
                    {feature.description}
                  </p>
                </div>

                {/* Bottom decorative line */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500
                           transform origin-left scale-x-0 group-hover:scale-x-100
                           transition-transform duration-300"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

      {/* Why Choose Section */}
      <div className="bg-primary-50 border-primary-100 w-full">
        <motion.div
          className="mx-auto max-w-7xl px-6 pt-16 lg:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="text-center">
            <motion.h2
              className="text-3xl font-bold tracking-tight text-secondary-500 sm:text-4xl mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Why Choose Fiji Rides
            </motion.h2>
            <motion.p
              className="text-lg leading-8 text-secondary-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Your trusted partner for premium transportation in Fiji
            </motion.p>
            <motion.div
              className="mt-4 h-1 w-20 bg-content-primary mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            />

            {/* Add TripAdvisor Widget */}
            {/* <motion.div 
              className="mt-12 flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div 
                id="TA_selfserveprop529" 
                className="TA_selfserveprop"
              >
                <ul id="7TZZG8VVWy" className="TA_links Gr5pyk7jSQ8">
                  <li id="aNmI1ebQxI" className="DTP6fgqzUg">
                    <a 
                      target="_blank" 
                      href="https://www.tripadvisor.com/Attraction_Review-g294335-d32698721-Reviews-Fiji_Rides-Nadi_Viti_Levu.html"
                      rel="noopener noreferrer"
                    >
                      <img 
                        src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-11900-2.svg" 
                        alt="TripAdvisor"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </motion.div> */}
          </motion.div>
        </motion.div>
      </div>

      {/* Vehicle Showcase Section */}
      <div className="bg-primary-50 border-b border-primary-100 w-full">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Carousel Section */}
            <motion.div
              className="relative overflow-hidden rounded-2xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative h-[500px] w-full bg-secondary-100 rounded-2xl overflow-hidden">
                {vehicleSlides.map((slide, index) => (
                  <motion.div
                    key={slide.title}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: currentSlide === index ? 1 : 0,
                      scale: currentSlide === index ? 1 : 1.1,
                    }}
                    transition={{ duration: 0.7 }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {slide.title}
                      </h3>
                      <p className="text-white/90">{slide.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 
                         backdrop-blur-sm p-2 rounded-full transition-colors duration-200"
              >
                <ChevronLeft className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 
                         backdrop-blur-sm p-2 rounded-full transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6 text-white" />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex space-x-2">
                {vehicleSlides.map((_, index) => (
                  <button
                    key={index + "vehicle"}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentSlide === index
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Content Section */}
            <motion.div
              className="lg:pl-16"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-secondary-500 sm:text-4xl mb-6">
                Experience the Difference
              </h2>
              <p className="text-lg text-secondary-400 mb-8">
                Choose Fiji Rides for an authentic, local experience with
                professional and experienced drivers who prioritize your comfort
                and safety. As a 100% Fijian-owned company, we offer a wide
                range of services, from airport transfers to guided tours, all
                at competitive prices.
              </p>
              <p className="text-lg text-secondary-400 mb-8">
                Our personalized, guest-centred approach ensures you're treated
                like family, with local expertise to enhance your journey.
                Travel with us for a seamless and unforgettable experience in
                Fiji!
              </p>

              <ul className="space-y-4">
                {[
                  "Professional and experienced drivers",
                  "24/7 availability for your convenience",
                  "Modern and well-maintained luxury fleet",
                  "Competitive and transparent pricing",
                  "Local expertise and personalized service",
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    className="flex items-center space-x-3 text-secondary-500"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <div className="h-2 w-2 bg-primary-500 rounded-full" />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-white border-t border-primary-100 w-full">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-secondary-500">
              Trusted by Travelers Worldwide
            </h2>
            <div className="mt-4 h-1 w-20 bg-primary-300 mx-auto rounded-full" />
          </motion.div>

          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              id="TA_selfserveprop529"
              className="TA_selfserveprop bg-gradient-to-b from-white to-primary-50 px-6 py-4 rounded-xl shadow-sm border border-primary-100"
            >
              <ul id="7TZZG8VVWy" className="TA_links Gr5pyk7jSQ8">
                <li id="aNmI1ebQxI" className="DTP6fgqzUg">
                  <a
                    target="_blank"
                    href="https://www.tripadvisor.com/Attraction_Review-g294335-d32698721-Reviews-Fiji_Rides-Nadi_Viti_Levu.html"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <img
                      src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-11900-2.svg"
                      alt="TripAdvisor"
                      className="h-10 w-auto"
                    />
                  </a>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
