"use client";

import { useState, useEffect, useRef } from "react";
import { useColorContext } from "@/contexts/ColorContext";

const categories = [
  { id: "offices", name: "офисы", font: "font-melodrama italic" },
  { id: "meeting", name: "переговорные", font: "font-sans font-bold" },
  { id: "coworking", name: "коворкинг", font: "font-melodrama font-light" },
  { id: "lounge", name: "лаундж зона", font: "font-sans font-medium" },
  { id: "fitness", name: "фитнес зона", font: "font-melodrama font-normal" },
];

// Gallery images organized by category
const galleryImages = {
  offices: [
    "/gallery/offices/office-1.jpg",
    "/gallery/offices/office-2.jpg",
    "/gallery/offices/office-3.jpg",
    "/gallery/offices/office-4.jpg",
    "/gallery/offices/office-5.jpg",
    "/gallery/offices/office-6.jpg",
  ],
  meeting: [
    "/gallery/meeting/meeting-1.jpg",
    "/gallery/meeting/meeting-2.jpg",
    "/gallery/meeting/meeting-3.jpg",
    "/gallery/meeting/meeting-4.jpg",
    "/gallery/meeting/meeting-5.jpg",
    "/gallery/meeting/meeting-6.jpg",
  ],
  coworking: [
    "/gallery/coworking/coworking-1.jpg",
    "/gallery/coworking/coworking-2.jpg",
    "/gallery/coworking/coworking-3.jpg",
    "/gallery/coworking/coworking-4.jpg",
    "/gallery/coworking/coworking-5.jpg",
    "/gallery/coworking/coworking-6.jpg",
  ],
  lounge: [
    "/gallery/lounge/lounge-1.jpg",
    "/gallery/lounge/lounge-2.jpg",
    "/gallery/lounge/lounge-3.jpg",
    "/gallery/lounge/lounge-4.jpg",
    "/gallery/lounge/lounge-5.jpg",
    "/gallery/lounge/lounge-6.jpg",
  ],
  fitness: [
    "/gallery/fitness/fitness-1.jpg",
    "/gallery/fitness/fitness-2.jpg",
    "/gallery/fitness/fitness-3.jpg",
    "/gallery/fitness/fitness-4.jpg",
    "/gallery/fitness/fitness-5.jpg",
    "/gallery/fitness/fitness-6.jpg",
  ],
};

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("offices");
  const sectionRef = useRef<HTMLElement>(null);
  const { setScrollProgress, backgroundColor, textColor } = useColorContext();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start transition when section is 50% visible from bottom
      const startPoint = windowHeight * 0.5;
      const endPoint = -rect.height * 0.3; // Complete transition when 30% of section is past viewport

      if (rect.top <= startPoint && rect.top >= endPoint) {
        const progress = (startPoint - rect.top) / (startPoint - endPoint);
        setScrollProgress(Math.min(Math.max(progress, 0), 1));
      } else if (rect.top > startPoint) {
        setScrollProgress(0);
      } else if (rect.top <= endPoint) {
        setScrollProgress(1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setScrollProgress]);

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 relative z-20 bg-background text-foreground transition-colors duration-300"
    >
      <div className="container mx-auto px-5 space-y-12">
        {/* Header with tabs and gallery title */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          {/* Left side - Category tabs */}
          <div className="flex flex-wrap gap-8 lg:gap-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`relative text-lg lg:text-xl cursor-pointer transition-all duration-300 hover:opacity-70 group text-foreground ${category.font}`}
                data-cursor="small"
              >
                <span className="relative z-10">{category.name}</span>

                {/* Underline for active tab */}
                <div
                  className={`absolute bottom-0 left-0 h-0.5 bg-foreground transition-all duration-300 ${
                    activeCategory === category.id
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />

                {/* Orange accent underline for active tab */}
                {activeCategory === category.id && (
                  <div
                    className="absolute bottom-0 left-0 h-1 transition-all duration-300"
                    style={{
                      width: "100%",
                      background:
                        "linear-gradient(90deg, #E85014 0%, #F16001 100%)",
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Right side - Gallery title */}
          <div>
            <h2 className="text-6xl lg:text-8xl xl:text-9xl font-light font-melodrama leading-tight text-foreground">
              gallery.
            </h2>
          </div>
        </div>

        {/* Photo grid - 3x2 layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {galleryImages[activeCategory as keyof typeof galleryImages].map(
            (image, index) => (
              <div
                key={`${activeCategory}-${index}`}
                className="relative aspect-4/3 overflow-hidden rounded-lg bg-gray-800 group cursor-pointer"
                data-cursor="medium"
              >
                <img
                  src={image}
                  alt={`${
                    categories.find((c) => c.id === activeCategory)?.name
                  } ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback to hero image if gallery image doesn't exist
                    (e.target as HTMLImageElement).src = "/hero.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />

                {/* Image overlay with number */}
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-sm font-medium opacity-70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};
