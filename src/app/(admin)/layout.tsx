import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Admin - Praktik Office",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Standalone layout without navbar, footer, or any wrappers
  return children;
}
