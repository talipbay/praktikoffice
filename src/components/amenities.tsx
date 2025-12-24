"use client";

import { useEffect, useRef } from "react";
import { useColorContext } from "@/contexts/ColorContext";
import {
  ChefHat,
  Printer,
  Building2,
  Lock,
  Gamepad2,
  Car,
  Bed,
  Video,
} from "lucide-react";

const amenities = [
  { id: "kitchen", name: "кухня", icon: ChefHat },
  { id: "printing", name: "распечатка", icon: Printer },
  { id: "prayer", name: "место для молитвы", icon: Building2 },
  { id: "lockers", name: "локеры", icon: Lock },
  { id: "gaming", name: "игровая зона", icon: Gamepad2 },
  { id: "parking", name: "паркинг", icon: Car },
  { id: "sleep", name: "капсула для сна", icon: Bed },
  { id: "zoom", name: "zoom комната", icon: Video },
];

export const Amenities = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { setAmenitiesProgress } = useColorContext();

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Start reverting colors when amenities section is 30% visible from bottom
      const startPoint = windowHeight * 0.7;
      const endPoint = windowHeight * 0.3; // Complete reversion when section is 70% visible

      if (rect.top <= startPoint && rect.top >= endPoint) {
        // Calculate reverse progress (1 to 0)
        const progress = 1 - (startPoint - rect.top) / (startPoint - endPoint);
        setAmenitiesProgress(Math.min(Math.max(progress, 0), 1));
      } else if (rect.top > startPoint) {
        // Section not reached yet, keep gallery colors
        setAmenitiesProgress(1);
      } else if (rect.top <= endPoint) {
        // Section fully visible, revert to original colors
        setAmenitiesProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setAmenitiesProgress]);

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-24 relative z-20 bg-background text-foreground transition-colors duration-300"
    >
      <div className="container mx-auto px-5 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-light font-sans font-medium leading-tight text-foreground">
            Продуманная инфраструктура
          </h2>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 lg:gap-12">
          {amenities.map((amenity, index) => (
            <div
              key={amenity.id}
              className="flex flex-col items-center text-center space-y-4 group cursor-pointer"
              data-cursor="small"
            >
              {/* Icon */}
              <div className="transition-transform duration-300 group-hover:scale-110">
                <amenity.icon
                  size={48}
                  className="lg:w-16 lg:h-16 mx-auto text-foreground"
                />
              </div>

              {/* Label */}
              <p className="text-sm lg:text-base font-medium transition-opacity duration-300 group-hover:opacity-70 text-foreground">
                {amenity.name}
              </p>

              {/* Separator line */}
              {index < amenities.length - 1 && (index + 1) % 4 !== 0 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-16 opacity-20 bg-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom separator lines */}
        <div className="grid grid-cols-4 gap-8 lg:gap-12">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-px opacity-20 bg-foreground" />
          ))}
        </div>
      </div>
    </section>
  );
};
