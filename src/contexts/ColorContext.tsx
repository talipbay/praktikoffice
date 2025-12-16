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

  // Define color values using CSS custom properties
  // Default (gray): --background: rgb(51 51 51), --foreground: rgb(249 249 249)
  // Gallery (black): rgb(0 0 0), rgb(255 255 255)

  // Calculate colors based on scroll progress (0 = gray, 1 = black)
  const backgroundColor = `rgb(${Math.round(
    51 + (0 - 51) * scrollProgress
  )} ${Math.round(51 + (0 - 51) * scrollProgress)} ${Math.round(
    51 + (0 - 51) * scrollProgress
  )})`;

  const textColor = `rgb(${Math.round(
    249 + (255 - 249) * scrollProgress
  )} ${Math.round(249 + (255 - 249) * scrollProgress)} ${Math.round(
    249 + (255 - 249) * scrollProgress
  )})`;

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
    document.body.style.transition =
      "background-color 0.3s ease, color 0.3s ease";
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
