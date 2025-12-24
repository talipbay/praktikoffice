"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getAssetPath } from "@/lib/assets";
import { useRouter } from "next/navigation";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: "home", label: "HOME" },
  { id: "spaces", label: "SPACES" },
  { id: "contact", label: "CONTACT" },
];

const spaceTypes = [
  { id: "open-space", label: "open space" },
  { id: "office", label: "office" },
  { id: "meeting-room", label: "meeting room" },
];

const carouselImages = [
  // Coworking images
  "/gallery/coworking/coworking-1.webp",
  "/gallery/coworking/coworking-2.webp",
  "/gallery/coworking/coworking-3.webp",
  "/gallery/coworking/coworking-4.webp",
  "/gallery/coworking/coworking-5.webp",
  "/gallery/coworking/coworking-6.webp",
  // Office images
  "/gallery/offices/office-1.webp",
  "/gallery/offices/office-2.webp",
  "/gallery/offices/office-3.webp",
  "/gallery/offices/office-4.webp",
  "/gallery/offices/office-5.webp",
  "/gallery/offices/office-6.webp",
  // Meeting room images
  "/gallery/meeting/meeting-1.webp",
  "/gallery/meeting/meeting-2.webp",
  "/gallery/meeting/meeting-3.webp",
  "/gallery/meeting/meeting-4.webp",
  "/gallery/meeting/meeting-5.webp",
  "/gallery/meeting/meeting-6.webp",
];

export const Menu = ({ isOpen, onClose }: MenuProps) => {
  const router = useRouter();
  const [showSpaceTypes, setShowSpaceTypes] = useState(false);

  const handleMenuClick = (itemId: string) => {
    if (itemId === "home") {
      setShowSpaceTypes(false); // Reset submenu
      router.push("/");
      onClose();
    } else if (itemId === "spaces") {
      // Toggle space types visibility instead of navigating
      setShowSpaceTypes(!showSpaceTypes);
    } else if (itemId === "contact") {
      setShowSpaceTypes(false); // Reset submenu
      // First close menu, then jump to footer component
      onClose();
      setTimeout(() => {
        // For sticky footer, scroll to bottom of page
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });

        // Fallback: try to find footer element
        const footer =
          document.querySelector("footer") ||
          document.querySelector("[data-footer]") ||
          document.getElementById("footer");
        if (footer) {
          footer.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 300); // Wait for menu close animation
    }
  };

  const handleSpaceTypeClick = (spaceTypeId: string) => {
    // Close menu first, then navigate to the appropriate page
    onClose();
    setTimeout(() => {
      // Navigate to the corresponding page
      if (spaceTypeId === "open-space") {
        router.push("/open-space");
      } else if (spaceTypeId === "office") {
        router.push("/offices");
      } else if (spaceTypeId === "meeting-room") {
        router.push("/meeting-room");
      }
    }, 300); // Wait for menu close animation
  };
  // No state needed for continuous scroll

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSpaceTypes(false); // Reset submenu
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      // Reset submenu when menu closes
      setShowSpaceTypes(false);
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
          className="fixed inset-0 z-40 bg-black text-foreground mx-auto"
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
                {menuItems.map((item, index) => (
                  <div key={item.id} className="relative overflow-hidden">
                    <motion.h2
                      className="text-6xl xl:text-8xl font-extralight  font-melodrama cursor-pointer select-none"
                      whileHover={
                        item.id === "spaces" && showSpaceTypes ? "" : "hover"
                      }
                      initial="initial"
                      data-cursor="huge"
                      onClick={() => handleMenuClick(item.id)}
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
                        animate={{
                          opacity:
                            item.id === "spaces" && showSpaceTypes ? 0 : 1,
                        }}
                      >
                        {item.label}
                      </motion.div>
                    </motion.h2>

                    {/* Show space types when SPACES is clicked */}
                    <AnimatePresence>
                      {item.id === "spaces" && showSpaceTypes && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex flex-row gap-4 mt-6"
                        >
                          {spaceTypes.map((spaceType, spaceIndex) => (
                            <motion.div
                              key={spaceType.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: spaceIndex * 0.1,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="cursor-pointer"
                              onClick={() => handleSpaceTypeClick(spaceType.id)}
                              data-cursor="small"
                            >
                              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <span className="text-md font-light text-white">
                                  {spaceType.label}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Middle - Vertical Scrolling Images */}
              <div className="flex items-center justify-center px-16 relative">
                <div className="relative w-full max-w-xs h-screen overflow-hidden rounded-3xl">
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
                          src={getAssetPath(image)}
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
                            (e.target as HTMLImageElement).src =
                              getAssetPath("/hero.webp");
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Top gradient overlay */}
                  <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none z-10"></div>

                  {/* Bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none z-10"></div>
                </div>
              </div>

              {/* Right Side - Contact & Actions */}
              <div className="flex flex-col justify-center px-5 space-y-4 mx-auto">
                {/* Contact Info */}
                <div className="text-left space-y-6">
                  <div>
                    <p className="text-sm opacity-60 mb-2">почта</p>
                    <a
                      href="mailto:manager@praktikoffice.kz"
                      className="text-lg hover:opacity-70 transition-opacity"
                      data-cursor="small"
                    >
                      manager@praktikoffice.kz
                    </a>
                  </div>
                  <div>
                    <p className="text-sm opacity-60 mb-2">телефон</p>
                    <a
                      href="tel:+77017117221"
                      className="text-lg hover:opacity-70 transition-opacity"
                      data-cursor="small"
                    >
                      +7 701 711 72 21
                    </a>
                  </div>
                  <div>
                    <p className="text-sm opacity-60 mb-2">соц. сети</p>
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
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="lg:hidden flex flex-col h-full p-8">
              {/* Navigation */}
              <div className="flex-1 flex flex-col justify-center space-y-2">
                {menuItems.map((item, index) => (
                  <div key={item.id} className="relative overflow-hidden">
                    <motion.h2
                      className="text-5xl md:text-6xl font-extralight font-melodrama cursor-pointer select-none"
                      whileHover={
                        item.id === "spaces" && showSpaceTypes ? "" : "hover"
                      }
                      initial="initial"
                      data-cursor="huge"
                      onClick={() => handleMenuClick(item.id)}
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
                        animate={{
                          opacity:
                            item.id === "spaces" && showSpaceTypes ? 0 : 1,
                        }}
                      >
                        {item.label}
                      </motion.div>
                    </motion.h2>

                    {/* Show space types when SPACES is clicked - Mobile */}
                    <AnimatePresence>
                      {item.id === "spaces" && showSpaceTypes && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex flex-wrap gap-3 mt-4"
                        >
                          {spaceTypes.map((spaceType, spaceIndex) => (
                            <motion.div
                              key={spaceType.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{
                                duration: 0.4,
                                delay: spaceIndex * 0.1,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="cursor-pointer"
                              onClick={() => handleSpaceTypeClick(spaceType.id)}
                              data-cursor="small"
                            >
                              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300">
                                <span className="text-sm font-light text-white">
                                  {spaceType.label}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Bottom Section - Two Columns */}
              <div className="grid grid-cols-2 gap-8 mt-12">
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
