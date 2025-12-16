"use client";

import { useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { Menu } from "./menu";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div className="flex container mx-auto p-5 justify-between fixed top-0 left-0 right-0 z-50 text-foreground transition-colors duration-300">
        <h1 className="text-4xl font-bold" data-cursor="medium">
          praktik.
        </h1>

        <div className="flex gap-4 items-center" data-cursor="small">
          <Hamburger
            toggled={isMenuOpen}
            toggle={setIsMenuOpen}
            duration={0.8}
            size={20}
          />
        </div>
      </div>

      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};
