import { motion } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-900 to-secondary-800 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8"
        >
          <span className="text-9xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 text-transparent bg-clip-text">
            404
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-semibold text-white mb-4"
        >
          Page Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-300 mb-8"
        >
          Oops! It seems you've ventured off the beaten path in Fiji.
          Let's get you back to familiar waters.
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate({ to: "/" })}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white 
                   rounded-xl hover:bg-primary-600 transition-colors"
        >
          <Home className="w-5 h-5" />
          Return Home
        </motion.button>
      </motion.div>
    </div>
  );
} 