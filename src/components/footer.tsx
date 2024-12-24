import { Link, useNavigate } from "@tanstack/react-router";
import logo from "../assets/logo.svg";

export function Footer() {
  const navigate = useNavigate();

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate({
      to: "/",
      search: {},
      replace: true,
    });
    window.location.href = "/";
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If we're not on the home page, navigate there first
      navigate({ to: "/" });
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="col-span-1">
            <Link
              to="/"
              className="inline-flex items-center bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors"
              onClick={handleHomeClick}
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

          <div className="md:ml-auto">
            <h3 className="text-lg font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection('about-section')}
                  className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1.5"
                >
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('faqs-section')}
                  className="text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1.5"
                >
                  <span>FAQs</span>
                </button>
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
