import { motion, AnimatePresence } from "framer-motion";
import { HeroBackground } from '../components/hero-background';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "How do I book my transfer?",
    answer: "You can book your transfer through our website by selecting your desired route and vehicle."
  },
  {
    question: "What vehicles are available?",
    answer: "We offer a range of vehicles from sedans to SUVs, all maintained to the highest standards."
  },
  {
    question: "Is my booking refundable?",
    answer: "Yes, bookings can be refunded if canceled within the specified time frame."
  },
  {
    question: "Do you offer child seats?",
    answer: "Yes, we provide child seats upon request to ensure the safety of your little ones."
  },
  {
    question: "What areas do you service?",
    answer: "We provide service throughout Fiji, including all major hotels, resorts, and airports. Popular destinations include Nadi, Suva, Denarau, and the Coral Coast."
  }
];

function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
      <HeroBackground>
        <motion.div 
          className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            className="mx-auto max-w-3xl text-center"
            variants={itemVariants}
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90">
              Find answers to common questions about our services, booking process, and policies.
            </p>
          </motion.div>
        </motion.div>
      </HeroBackground>

      {/* FAQs Accordion Section */}
      <div className="bg-white">
        <motion.div 
          className="mx-auto max-w-3xl px-6 py-24 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial="hidden"
                whileInView="visible"
                variants={itemVariants}
                className="overflow-hidden"
              >
                <motion.div
                  className={`
                    bg-primary-50 rounded-2xl transition-all duration-300 ease-in-out
                    ${openIndex === index ? 'bg-opacity-100' : 'bg-opacity-50 hover:bg-opacity-75'}
                  `}
                >
                  {/* Question Header */}
                  <motion.button
                    className="w-full px-8 py-6 flex items-center justify-between gap-4"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-xl font-semibold text-secondary-500 text-left">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <ChevronDown className="h-6 w-6 text-content-primary flex-shrink-0" />
                    </motion.div>
                  </motion.button>

                  {/* Answer Content */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: "auto", 
                          opacity: 1,
                          transition: {
                            height: {
                              duration: 0.4,
                              ease: [0.22, 1, 0.36, 1]
                            },
                            opacity: {
                              duration: 0.25,
                              delay: 0.15
                            }
                          }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                            height: {
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1]
                            },
                            opacity: {
                              duration: 0.2
                            }
                          }
                        }}
                      >
                        <motion.div 
                          className="px-8 pb-6 text-lg text-secondary-400"
                          initial={{ y: 10, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -10, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {faq.answer}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default FaqsPage; 