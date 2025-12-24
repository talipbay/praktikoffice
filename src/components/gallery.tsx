"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useColorContext } from "@/contexts/ColorContext";
import { getAssetPath } from "@/lib/assets";

const categories = [
  { id: "coworking", name: "open space", font: "font-manrope font-bold" },
  { id: "offices", name: "office", font: "font-manrope font-bold" },
  { id: "meeting", name: "meeting room", font: "font-manrope font-bold" },
];

// Gallery images organized by category
const galleryImages = {
  coworking: [
    "/gallery/coworking/coworking-1.webp",
    "/gallery/coworking/coworking-2.webp",
    "/gallery/coworking/coworking-3.webp",
    "/gallery/coworking/coworking-4.webp",
    "/gallery/coworking/coworking-5.webp",
    "/gallery/coworking/coworking-6.webp",
  ],
  offices: [
    "/gallery/offices/office-1.webp",
    "/gallery/offices/office-2.webp",
    "/gallery/offices/office-3.webp",
    "/gallery/offices/office-4.webp",
    "/gallery/offices/office-5.webp",
    "/gallery/offices/office-6.webp",
  ],
  meeting: [
    "/gallery/meeting/meeting-1.webp",
    "/gallery/meeting/meeting-6.webp",
    "/gallery/meeting/meeting-2.webp",
    "/gallery/meeting/meeting-3.webp",
    "/gallery/meeting/meeting-5.webp",
    "/gallery/meeting/meeting-4.webp",
  ],
};

export const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("coworking");
  const sectionRef = useRef<HTMLElement>(null);
  const { setScrollProgress } = useColorContext();
  const router = useRouter();

  // Navigation mapping
  const categoryRoutes = {
    coworking: "/open-space",
    offices: "/offices",
    meeting: "/meeting-room",
  };

  const handleLearnMore = () => {
    const route = categoryRoutes[activeCategory as keyof typeof categoryRoutes];
    router.push(route);
  };

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
      id="gallery"
      data-gallery
      className="gallery py-16 lg:py-24 relative z-20 bg-black text-foreground transition-colors duration-300"
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
                <Image
                  src={getAssetPath(image)}
                  alt={`${
                    categories.find((c) => c.id === activeCategory)?.name
                  } ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading={index < 3 ? "eager" : "lazy"}
                  quality={75}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  priority={index < 3}
                  onError={(e) => {
                    console.error(
                      `Failed to load image: ${getAssetPath(image)}`
                    );
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

        {/* Learn More Button */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLearnMore}
            className="group relative px-8 py-4 bg-transparent border-2 border-foreground text-foreground rounded-lg hover:bg-foreground hover:text-background transition-all duration-300 font-medium text-lg"
            data-cursor="small"
          >
            <span className="relative z-10">узнать подробнее</span>
            <div className="absolute inset-0 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg" />
          </button>
        </div>
      </div>
    </section>
  );
};
