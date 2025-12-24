import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import ReactLenis from "lenis/react";
import Cursor from "@/components/cursor";
import { Footer } from "@/components/footer";
import { ColorProvider } from "@/contexts/ColorContext";
import { getAssetPath } from "@/lib/assets";

const manropeSans = Manrope({
  variable: "--font-manrope-sans",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Praktik - Smart Office",
  description: "Аренда Офисов Класса А | Астана | Коворкинг",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontBasePath = getAssetPath("/fonts");

  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `
            @font-face {
              font-family: "Melodrama";
              src: url("${fontBasePath}/Melodrama-Light.woff2") format("woff2"),
                   url("${fontBasePath}/Melodrama-Light.woff") format("woff");
              font-weight: 300;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: "Melodrama";
              src: url("${fontBasePath}/Melodrama-Regular.woff2") format("woff2"),
                   url("${fontBasePath}/Melodrama-Regular.woff") format("woff");
              font-weight: 400;
              font-style: normal;
              font-display: swap;
            }
            @font-face {
              font-family: "Melodrama";
              src: url("${fontBasePath}/Melodrama-Bold.woff2") format("woff2"),
                   url("${fontBasePath}/Melodrama-Bold.woff") format("woff");
              font-weight: 700;
              font-style: normal;
              font-display: swap;
            }
          `,
          }}
        />
      </head>
      <body
        className={`${manropeSans.variable} ${inter.variable} bg-black antialiased min-h-vh relative`}
      >
        <ColorProvider>
          <ReactLenis root />
          <Cursor />
          <Navbar />
          {children}
          <Footer />
        </ColorProvider>
      </body>
    </html>
  );
}
