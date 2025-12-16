"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: "home", label: "HOME" },
  { id: "spaces", label: "SPACES" },
  { id: "contact", label: "CONTACT" },
];

const carouselImages = [
  "/hero.jpg",
  "/hero.jpg",
  "/hero.jpg",
  "/hero.jpg",
  "/hero.jpg",
  "/hero.jpg",
];

export const Menu = ({ isOpen, onClose }: MenuProps) => {
  // No state needed for continuous scroll

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 bg-background text-foreground mx-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 2, delay: 0, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 h-full container mx-auto">
              {/* Left Side - Navigation */}
              <div className="flex flex-col container justify-center items-start space-y-2 px-5">
                {menuItems.map((item) => (
                  <div key={item.id} className="relative overflow-hidden">
                    <motion.h2
                      className="text-6xl xl:text-8xl font-extralight  font-melodrama cursor-pointer select-none"
                      whileHover="hover"
                      initial="initial"
                      data-cursor="huge"
                    >
                      <motion.div
                        variants={{
                          initial: { y: 0 },
                          hover: { y: "-100%" },
                        }}
                        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {item.label}
                      </motion.div>
                      <motion.div
                        className="absolute top-0 left-0"
                        variants={{
                          initial: { y: "100%" },
                          hover: { y: 0 },
                        }}
                        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {item.label}
                      </motion.div>
                    </motion.h2>
                  </div>
                ))}
              </div>

              {/* Middle - Vertical Scrolling Images */}
              <div className="flex items-center justify-center px-16 relative">
                <div className="relative w-full max-w-xs h-[100vh] overflow-hidden rounded-3xl">
                  {/* Continuous vertical scrolling container */}
                  <div className="flex flex-col animate-scroll-up">
                    {/* Triple images for seamless infinite loop */}
                    {[
                      ...carouselImages,
                      ...carouselImages,
                      ...carouselImages,
                    ].map((image, index) => (
                      <div
                        key={index}
                        className="shrink-0 w-full aspect-4/3 mb-6"
                      >
                        <img
                          src={image}
                          alt={`Gallery image ${
                            (index % carouselImages.length) + 1
                          }`}
                          className={`w-full h-full object-cover rounded-2xl 
                            ${
                              index % 3 === 1
                                ? "" //grayscale
                                : index % 3 === 2
                                ? "" //sepia
                                : ""
                            }`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/hero.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Top gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-24 bg-linear-to-b from-background via-background/80 to-transparent pointer-events-none z-10"></div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none z-10"></div>
                </div>
              </div>

              {/* Right Side - Contact & Actions */}
              <div className="flex flex-col justify-center px-5 space-y-4 mx-auto">
                {/* Contact Info */}
                <div className="text-left space-y-6">
                  <div>
                    <p className="text-sm opacity-60 mb-2">mail</p>
                    <a
                      href="mailto:manager@praktikoffice.kz"
                      className="text-lg hover:opacity-70 transition-opacity"
                      data-cursor="small"
                    >
                      manager@praktikoffice.kz
                    </a>
                  </div>
                  <div>
                    <p className="text-sm opacity-60 mb-2">phone</p>
                    <a
                      href="tel:+77017117221"
                      className="text-lg hover:opacity-70 transition-opacity"
                      data-cursor="small"
                    >
                      +7 701 711 72 21
                    </a>
                  </div>
                  <div>
                    <p className="text-sm opacity-60 mb-2">social</p>
                    <div className="space-y-2">
                      <a
                        href="https://www.instagram.com/praktikoffice/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-lg hover:opacity-70 transition-opacity"
                        data-cursor="small"
                      >
                        instagram
                      </a>
                      <a
                        href="https://wa.me/77017117226"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-lg hover:opacity-70 transition-opacity"
                        data-cursor="small"
                      >
                        whatsapp
                      </a>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className=" mt-12 justify-start">
                  <button
                    className="block text-lg font-medium hover:opacity-70 transition-opacity"
                    data-cursor="small"
                  >
                    book now
                  </button>
                  <button
                    className="block text-lg font-medium hover:opacity-70 transition-opacity"
                    data-cursor="small"
                  >
                    privacy
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col h-full p-8">
              {/* Navigation */}
              <div className="flex-1 flex flex-col justify-center space-y-2">
                {menuItems.map((item) => (
                  <div key={item.id} className="relative overflow-hidden">
                    <motion.h2
                      className="text-5xl md:text-6xl font-extralight font-melodrama cursor-pointer select-none"
                      whileHover="hover"
                      initial="initial"
                      data-cursor="huge"
                    >
                      <motion.div
                        variants={{
                          initial: { y: 0 },
                          hover: { y: "-100%" },
                        }}
                        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {item.label}
                      </motion.div>
                      <motion.div
                        className="absolute top-0 left-0"
                        variants={{
                          initial: { y: "100%" },
                          hover: { y: 0 },
                        }}
                        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {item.label}
                      </motion.div>
                    </motion.h2>
                  </div>
                ))}
              </div>

              {/* Bottom Section - Two Columns */}
              <div className="grid grid-cols-2 gap-8 mt-12">
                {/* Left Column - Actions */}
                <div className="space-y-4">
                  <button
                    className="block text-lg font-medium hover:opacity-70 transition-opacity"
                    data-cursor="small"
                  >
                    book now
                  </button>
                  <button
                    className="block text-lg font-medium hover:opacity-70 transition-opacity"
                    data-cursor="small"
                  >
                    privacy
                  </button>
                </div>

                {/* Right Column - Contact */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm opacity-60 mb-1">mail</p>
                    <a
                      href="mailto:manager@praktikoffice.kz"
                      className="text-sm hover:opacity-70 transition-opacity block"
                      data-cursor="small"
                    >
                      manager@praktikoffice.kz
                    </a>
                  </div>
                  <div>
                    <p className="text-sm opacity-60 mb-1">phone</p>
                    <a
                      href="tel:+77017117221"
                      className="text-sm hover:opacity-70 transition-opacity block"
                      data-cursor="small"
                    >
                      +7 701 711 72 21
                    </a>
                  </div>
                  <div>
                    <p className="text-sm opacity-60 mb-1">social</p>
                    <div className="space-y-1">
                      <a
                        href="https://www.instagram.com/praktikoffice/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm hover:opacity-70 transition-opacity"
                        data-cursor="small"
                      >
                        instagram
                      </a>
                      <a
                        href="https://wa.me/77017117226"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm hover:opacity-70 transition-opacity"
                        data-cursor="small"
                      >
                        whatsapp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
