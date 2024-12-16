import { Dialog } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface TourDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: string[];
  details: string;
  title: string;
}

export default function TourDetailsModal({
  isOpen,
  onClose,
  photos,
  details,
  title,
}: TourDetailsModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNextSlide = useCallback(() => {
    setCurrentPhotoIndex((current) => (current + 1) % photos.length);
  }, [photos.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentPhotoIndex((current) => 
      current === 0 ? photos.length - 1 : current - 1
    );
  }, [photos.length]);

  // Auto-slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const intervalId = setInterval(goToNextSlide, 3000); // Change slide every 5 seconds

    return () => clearInterval(intervalId);
  }, [isAutoPlaying, goToNextSlide]);

  // Pause auto-slide on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      
      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-[500px] max-h-[90vh] bg-white rounded-2xl shadow-xl 
                               transform transition-all overflow-hidden">
          {/* Fixed header with photo carousel */}
          <div className="sticky top-0 bg-white z-10">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 p-2 rounded-full 
                       bg-black/20 hover:bg-black/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            {/* Photo carousel */}
            <div className="p-4">
              <div 
                className="relative h-[320px] w-full bg-gray-100 rounded-xl overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {photos.map((photo, index) => (
                  <motion.img
                    key={photo}
                    src={photo}
                    alt={`${title} photo ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-contain"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: currentPhotoIndex === index ? 1 : 0,
                      transition: { duration: 0.3 } 
                    }}
                  />
                ))}
                
                {/* Navigation arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2
                               bg-black/20 hover:bg-black/30 rounded-full
                               transition-colors group"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-6 h-6 text-white 
                                            group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={goToNextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2
                               bg-black/20 hover:bg-black/30 rounded-full
                               transition-colors group"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-6 h-6 text-white 
                                             group-hover:scale-110 transition-transform" />
                    </button>
                  </>
                )}
                
                {/* Photo navigation dots */}
                {photos.length > 1 && (
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                    {photos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all transform
                                  ${currentPhotoIndex === index 
                                    ? "bg-white scale-110" 
                                    : "bg-white/50 hover:bg-white/70"}`}
                        aria-label={`Go to photo ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto max-h-[calc(90vh-380px)] px-6 pb-6 pr-[26px] mr-[-10px]
                        scrollbar-thin scrollbar-track-gray-100 
                        scrollbar-thumb-primary-200 hover:scrollbar-thumb-primary-300 
                        scrollbar-thumb-rounded-full">
            <Dialog.Title className="text-xl font-semibold text-gray-900 mb-2">
              {title}
            </Dialog.Title>
            
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Additional Details
            </h3>
            
            <div 
              className="prose prose-sm max-w-none
                       prose-headings:font-semibold prose-headings:text-gray-900
                       prose-p:text-gray-600 prose-strong:text-gray-700
                       prose-ul:text-gray-600 prose-li:marker:text-gray-400
                       prose-h2:text-lg prose-h3:text-base prose-h4:text-sm"
              dangerouslySetInnerHTML={{ __html: details }}
            />
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}