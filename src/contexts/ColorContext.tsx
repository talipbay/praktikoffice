"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ColorContextType {
  scrollProgress: number;
  backgroundColor: string;
  textColor: string;
  setScrollProgress: (progress: number) => void;
  setAmenitiesProgress: (progress: number) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export const useColorContext = () => {
  const context = useContext(ColorContext);
  if (!context) {
    throw new Error("useColorContext must be used within a ColorProvider");
  }
  return context;
};

interface ColorProviderProps {
  children: ReactNode;
}

export const ColorProvider = ({ children }: ColorProviderProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fixed colors - no transition based on scroll
  // Always use black background and white text
  const backgroundColor = "rgb(0 0 0)"; // Always black
  const textColor = "rgb(255 255 255)"; // Always white

  // Amenities can also control the scroll progress (for reverting colors)
  const setAmenitiesProgress = (progress: number) => {
    setScrollProgress(progress);
  };

  // Apply colors to CSS custom properties and document body
  useEffect(() => {
    const root = document.documentElement;

    // Update CSS custom properties
    root.style.setProperty("--background", backgroundColor);
    root.style.setProperty("--foreground", textColor);

    // Also apply to body for immediate effect
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = textColor;
    // Remove transition since colors are now fixed
    document.body.style.transition = "";
  }, [backgroundColor, textColor]);

  return (
    <ColorContext.Provider
      value={{
        scrollProgress,
        backgroundColor,
        textColor,
        setScrollProgress,
        setAmenitiesProgress,
      }}
    >
      {children}
    </ColorContext.Provider>
  );
};
