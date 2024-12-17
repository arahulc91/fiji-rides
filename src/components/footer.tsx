import { Link } from "@tanstack/react-router";
import { SocialIcon } from "react-social-icons";
import logo from "../assets/logo.svg";

export function Footer() {
  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="col-span-1">
            <Link
              to="/"
              className="inline-flex items-center bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors"
            >
              <div className="ml-3">
                <img
                  src={logo}
                  alt="Fiji Rides Logo"
                  className={`h-8 w-auto transition-opacity duration-300`}
                />
                <span className="text-sm text-gray-400">
                  Premium Transfer Service
                </span>
              </div>
            </Link>
            <p className="mt-4 text-gray-400 leading-relaxed">
              Your trusted partner for premium transportation services across
              Fiji. Available 24/7 for your convenience.
            </p>
          </div>

          <div className="md:ml-auto md:mr-auto">
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1.5"
                >
                 
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1.5"
                >
                
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:ml-auto">
            <h3 className="text-lg font-semibold text-white mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/faqs"
                  className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  <span>FAQs</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-400 hover:text-primary-400 transition-colors inline-flex items-center gap-2"
                >
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>

            <div className="mt-8">
              <h4 className="text-sm font-semibold text-white mb-4">
                Follow Us
              </h4>
              <div className="flex space-x-4">
                <SocialIcon
                  url="https://facebook.com"
                  target="_blank"
                  bgColor="transparent"
                  fgColor="#9CA3AF"
                  className="hover:opacity-75 transition-opacity !h-8 !w-8"
                />
                <SocialIcon
                  url="https://twitter.com"
                  target="_blank"
                  bgColor="transparent"
                  fgColor="#9CA3AF"
                  className="hover:opacity-75 transition-opacity !h-8 !w-8"
                />
                <SocialIcon
                  url="https://instagram.com"
                  target="_blank"
                  bgColor="transparent"
                  fgColor="#9CA3AF"
                  className="hover:opacity-75 transition-opacity !h-8 !w-8"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Fiji Rides. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
