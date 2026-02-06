import type { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "Zone Management - Praktik Office",
  description: "Interactive floor plan zone management system for Praktik Office",
  robots: {
    index: false, // Don't index admin pages
    follow: false,
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Standalone layout without navbar or footer
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
      </head>
      <body className="bg-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
