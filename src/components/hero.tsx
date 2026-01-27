"use client";

import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getAssetPath } from "@/lib/assets";

export const Hero = () => {
  const t = useTranslations('hero');
  const imageRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useLenis(() => {
    if (!imageRef.current) return;

    const imageElement = imageRef.current;
    const rect = imageElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate scroll progress when image is in view
    const imageTop = rect.top;

    // Add scroll margin - start animation after some scrolling
    const scrollMargin = windowHeight * 0.6; // Start animation when 30% scrolled past initial position
    const startPoint = windowHeight - scrollMargin; // Delayed start point
    const endPoint = 0; // Animation completes when image top reaches viewport top
    const totalDistance = startPoint - endPoint;

    if (imageTop <= startPoint && imageTop >= endPoint) {
      const progress = (startPoint - imageTop) / totalDistance;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    } else if (imageTop > startPoint) {
      // Before animation starts
      setScrollProgress(0);
    } else if (imageTop <= endPoint) {
      // After animation completes - keep at 100%
      setScrollProgress(1);
    }
  });

  // Calculate dynamic styles based on scroll progress
  const widthPercentage = 25 + scrollProgress * 75; // From 25% to 100% (narrower initial width)
  const topBorderRadius = (1 - scrollProgress) * 500; // From 50px to 0px

  return (
    <div className="flex flex-col mx-auto justify-center items-center relative z-30 bg-black transition-colors duration-300">
      <div className="container mx-auto min-h-[calc(100vh-100px)] flex flex-col items-center justify-center">
        <h1
          className="leading-normal text-6xl md:text-8xl font-extrabold text-center text-foreground transition-colors duration-300"
          data-cursor="huge"
        >
          {t('title')} <br></br>{" "}
          <span className="italic font-light text-4xl md:text-6xl">
            &
          </span>
          <br></br>{" "}
          <span className="italic font-light font-melodrama text-4xl md:text-6xl">
            {t('subtitle')}
          </span>
        </h1>
      </div>

      <div
        ref={imageRef}
        className="relative aspect-video overflow-hidden h-screen mx-auto"
        style={{
          borderTopLeftRadius: `${topBorderRadius}px`,
          borderTopRightRadius: `${topBorderRadius}px`,
          width: `${widthPercentage}%`,
          translate: "0px -100px",
        }}
      >
        <Image
          src={getAssetPath("/hero.webp")}
          alt="Praktik Office - Премиум офисы класса А в Астане с современным дизайном и панорамными окнами"
          fill
          className="object-cover"
          priority
          quality={85}
          sizes="100vw"
        />
      </div>
    </div>
  );
};
