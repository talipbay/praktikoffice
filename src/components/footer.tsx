"use client";

import { Badge } from "@/components/ui/badge";

export const Footer = () => {
  return (
    <footer className="sticky bottom-0 h-screen bg-black text-foreground z-0 flex flex-col transition-colors duration-300">
      <div className="flex-1 flex flex-col justify-around container mx-auto p-5">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-16 mt-16">
          <div className="space-y-6">
            <div>
              <p className="text-xs opacity-60 mb-2">address</p>
              <p className="text-sm">Abu Dhabi Plaza | 26 floor | 360°</p>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-2">mail</p>
              <a
                href="mailto:manager@praktikoffice.kz"
                className="text-sm hover:opacity-70 transition-opacity block"
                data-cursor="small"
              >
                manager@praktikoffice.kz
              </a>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-2">phone</p>
              <a
                href="tel:+77017117221"
                className="text-sm hover:opacity-70 transition-opacity block"
                data-cursor="small"
              >
                +7 701 711 72 21
              </a>
            </div>
            <div>
              <p className="text-xs opacity-60 mb-2">social</p>
              <div className="space-y-1">
                <a
                  href="https://www.instagram.com/praktikoffice/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:opacity-70 transition-opacity block"
                  data-cursor="small"
                >
                  instagram
                </a>
                <a
                  href="https://wa.me/77017117226"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:opacity-70 transition-opacity block"
                  data-cursor="small"
                >
                  whatsapp
                </a>
              </div>
            </div>
          </div>

          {/* Office Categories */}
          <div className="space-y-4">
            <p className="text-xs opacity-60">office spaces</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                офисы
              </Badge>
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                переговорные
              </Badge>
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                коворкинг
              </Badge>
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                лаундж зона
              </Badge>
              <Badge
                variant="outline"
                className="bg-transparent border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
              >
                фитнес зона
              </Badge>
            </div>
          </div>
        </div>

        <div className="overflow-hidden bg-black border-foreground/20 relative">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-4xl lg:text-[8rem] xl:text-[12rem] font-bold font-manrope mx-6 text-foreground">
              praktik
            </span>
            <span className="text-4xl lg:text-[8rem] xl:text-[12rem] font-bold font-melodrama mx-6 text-foreground">
              office
            </span>
            <span className="text-4xl lg:text-[8rem] xl:text-[12rem] font-bold font-manrope mx-6 text-foreground">
              praktik
            </span>
            <span className="text-4xl lg:text-[8rem] xl:text-[12rem] font-bold font-melodrama mx-6 text-foreground">
              office
            </span>
          </div>

          {/* Left gradient overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-black to-transparent pointer-events-none z-10"></div>

          {/* Right gradient overlay */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-black to-transparent pointer-events-none z-10"></div>
        </div>

        <div className="flex justify-between items-end mt-16">
          <p className="text-xs opacity-60">© 2025 All rights reserved</p>
          <div className="flex items-center gap-2 text-xs opacity-60">
            <div className="w-2 h-2 bg-foreground rounded-full"></div>
            <span>MADE BY ALIKHAN TALIPBAYEV</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
