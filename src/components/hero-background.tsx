import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showCarousel?: boolean;
  staticImage?: string;
}

const backgroundImages = [
  '/assets/slideshow/cp-fiji-hm.webp',
  '/assets/slideshow/Fiji-Travel-Business-Image-jpg.webp',
  '/assets/slideshow/garden-of-the-sleeping-giant-fiji-image-5-feat-img.webp',

];

export function HeroBackground({ children, className = '', showCarousel = false, staticImage }: Readonly<HeroBackgroundProps>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    if (!showCarousel) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [showCarousel]);

  // Add image preloading
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImages[currentImageIndex];
  }, [currentImageIndex]);

  return (
    <div className={`relative isolate min-h-screen pt-16 flex items-center justify-center 
                    lg:max-h-[120vh] ${className}`}>
      {/* Carousel Background */}
      {showCarousel && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img 
                src={backgroundImages[currentImageIndex]}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => console.error('Image failed to load:', e)}
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
          
          {/* Additional color overlays for brand consistency */}
          <div 
            className="absolute inset-0 mix-blend-overlay opacity-50" 
            style={{
              background: 'radial-gradient(circle at top right, #0EB981 0%, transparent 50%)'
            }}
          />
          <div 
            className="absolute inset-0 mix-blend-overlay opacity-50" 
            style={{
              background: 'radial-gradient(circle at bottom left, #0A8B61 0%, transparent 50%)'
            }}
          />
        </div>
      )}

      {/* Static Background - Modified */}
      {!showCarousel && (
        <div className="absolute inset-0">
          {staticImage ? (
            // Single image background
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img 
                src={staticImage}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => console.error('Image failed to load:', e)}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
              
              {/* Additional color overlays for brand consistency */}
              <div 
                className="absolute inset-0 mix-blend-overlay opacity-50" 
                style={{
                  background: 'radial-gradient(circle at top right, #0EB981 0%, transparent 50%)'
                }}
              />
              <div 
                className="absolute inset-0 mix-blend-overlay opacity-50" 
                style={{
                  background: 'radial-gradient(circle at bottom left, #0A8B61 0%, transparent 50%)'
                }}
              />
            </div>
          ) : (
            // Fallback gradient background (existing code)
            <div className="absolute inset-0 bg-secondary">
              <div 
                className="absolute inset-0" 
                style={{
                  background: 'radial-gradient(circle at top right, #0EB981 0%, transparent 50%)'
                }}
              />
              <div 
                className="absolute inset-0" 
                style={{
                  background: 'radial-gradient(circle at bottom left, #0A8B61 0%, transparent 50%)'
                }}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          )}
        </div>
      )}
      
      {/* Navigation dots */}
      {showCarousel && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 
                ${currentImageIndex === index 
                  ? 'bg-white w-6' 
                  : 'bg-white/50 hover:bg-white/70'
                }`}
            />
          ))}
        </div>
      )}
      
      {/* Content with overflow handling */}
      <div className="relative z-10 w-full max-h-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
} 