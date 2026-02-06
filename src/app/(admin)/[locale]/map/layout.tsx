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
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Reset cursor to default for admin interface */
            * {
              cursor: default !important;
            }
            
            /* Override any custom cursor styles */
            body, html {
              cursor: default !important;
            }
            
            /* Ensure buttons and interactive elements have pointer cursor */
            button, a, [role="button"], input[type="button"], input[type="submit"] {
              cursor: pointer !important;
            }
            
            /* Text inputs should have text cursor */
            input[type="text"], input[type="email"], textarea {
              cursor: text !important;
            }
            
            /* Force light theme colors for admin interface */
            :root {
              --background: 0 0% 100%;
              --foreground: 0 0% 9%;
              --card: 0 0% 100%;
              --card-foreground: 0 0% 9%;
              --popover: 0 0% 100%;
              --popover-foreground: 0 0% 9%;
              --primary: 221 83% 53%;
              --primary-foreground: 0 0% 98%;
              --secondary: 0 0% 96%;
              --secondary-foreground: 0 0% 9%;
              --muted: 0 0% 96%;
              --muted-foreground: 0 0% 45%;
              --accent: 0 0% 96%;
              --accent-foreground: 0 0% 9%;
              --destructive: 0 84% 60%;
              --destructive-foreground: 0 0% 98%;
              --border: 0 0% 90%;
              --input: 0 0% 90%;
              --ring: 221 83% 53%;
            }
            
            /* Ensure text is always visible */
            body {
              color: rgb(17, 24, 39) !important;
              background: white !important;
            }
            
            /* Fix button text colors */
            button {
              color: inherit;
            }
            
            button[class*="bg-black"],
            button[class*="bg-gray-900"] {
              color: white !important;
            }
            
            /* Ensure all text elements are visible */
            h1, h2, h3, h4, h5, h6, p, span, div, label {
              color: rgb(17, 24, 39);
            }
          `
        }} />
      </head>
      <body className="bg-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
