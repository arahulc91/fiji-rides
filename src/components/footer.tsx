import { Link } from "@tanstack/react-router";
import { Car } from "lucide-react";
import { SocialIcon } from "react-social-icons";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center">
              <Car className="h-8 w-8 text-indigo-500" />
              <span className="ml-2 text-xl font-bold text-white">
                Fiji Rides
              </span>
            </Link>
            <p className="mt-2 text-gray-300">
              Fiji's Premium Transfer Service
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-300 hover:text-indigo-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-indigo-500 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-300 hover:text-indigo-500 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faqs"
                  className="text-gray-300 hover:text-indigo-500 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-300 hover:text-indigo-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-300 hover:text-indigo-500 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <SocialIcon
                url="https://facebook.com"
                target="_blank"
                bgColor="transparent"
                fgColor="#9CA3AF"
                className="hover:opacity-75 transition-opacity"
                style={{ height: 32, width: 32 }}
              />
              <SocialIcon
                url="https://twitter.com"
                target="_blank"
                bgColor="transparent"
                fgColor="#9CA3AF"
                className="hover:opacity-75 transition-opacity"
                style={{ height: 32, width: 32 }}
              />
              <SocialIcon
                url="https://instagram.com"
                target="_blank"
                bgColor="transparent"
                fgColor="#9CA3AF"
                className="hover:opacity-75 transition-opacity"
                style={{ height: 32, width: 32 }}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-700 pt-8">
          <p className="text-center text-gray-300">
            © {new Date().getFullYear()} Fiji Rides. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
