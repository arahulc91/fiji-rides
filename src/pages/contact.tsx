import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { HeroBackground } from '../components/hero-background';

function ContactPage() {
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
              Contact Us
            </h1>
            <p className="mt-6 text-xl leading-8 text-white/90">
              Get in touch with our team for any questions or assistance.
            </p>
          </motion.div>
        </motion.div>
      </HeroBackground>

      {/* Contact Section */}
      <div className="bg-white">
        <motion.div 
          className="mx-auto max-w-7xl px-6 py-24 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form - Now on the left */}
            <motion.div variants={containerVariants}>
              <motion.div 
                className="bg-primary-50 rounded-2xl p-8 lg:p-12 h-full"
                variants={itemVariants}
              >
                <h2 className="text-2xl font-semibold text-secondary-500 mb-8">
                  Get in Touch
                </h2>
                <form className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <label htmlFor="name" className="block text-sm font-medium text-secondary-500 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-primary-100 text-secondary-500 
                               focus:ring-2 focus:ring-content-primary focus:border-transparent transition-all"
                      placeholder="Your name"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="email" className="block text-sm font-medium text-secondary-500 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 rounded-xl bg-white border border-primary-100 text-secondary-500 
                               focus:ring-2 focus:ring-content-primary focus:border-transparent transition-all"
                      placeholder="your@email.com"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label htmlFor="message" className="block text-sm font-medium text-secondary-500 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-primary-100 text-secondary-500 
                               focus:ring-2 focus:ring-content-primary focus:border-transparent transition-all"
                      placeholder="Your message"
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="w-full bg-content-primary text-white py-3 px-6 rounded-xl hover:bg-primary-600 
                             transform transition-all hover:-translate-y-0.5 focus:ring-2 focus:ring-primary-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Message
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>

            {/* Contact Information - Now on the right */}
            <motion.div 
              className="space-y-12 lg:pl-8"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <h2 className="text-2xl font-semibold text-secondary-500 mb-8">
                  Contact Information
                </h2>
                <div className="space-y-8">
                  <motion.div 
                    className="flex items-start space-x-6 group"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-primary-50 p-3 rounded-xl">
                      <Phone className="h-6 w-6 text-content-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-500 mb-1">Phone</h3>
                      <p className="text-lg text-secondary-400">+679 6724244</p>
                      <div className="flex items-center gap-2 mt-2 text-content-primary">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">Available 24/7</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start space-x-6 group"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-primary-50 p-3 rounded-xl">
                      <Mail className="h-6 w-6 text-content-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-500 mb-1">Email</h3>
                      <p className="text-lg text-secondary-400">booking@fijirides.com</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex items-start space-x-6 group"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-primary-50 p-3 rounded-xl">
                      <MapPin className="h-6 w-6 text-content-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-secondary-500 mb-1">Office</h3>
                      <p className="text-lg text-secondary-400">
                        Level 1 HLB Building 2, Nadi Int'l Airport<br />
                        3 Cruickshank Road<br />
                        Nadi, Fiji
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ContactPage; 