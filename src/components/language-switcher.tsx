"use client";

import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { useState } from 'react';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const switchLocale = (newLocale: Locale) => {
    setIsOpen(false);
    
    // Get the path without any locale prefix
    let pathnameWithoutLocale = pathname;
    
    // Remove any existing locale prefix
    for (const loc of locales) {
      if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
        pathnameWithoutLocale = pathname.replace(`/${loc}`, '') || '/';
        break;
      }
    }
    
    // Ensure path starts with /
    if (!pathnameWithoutLocale.startsWith('/')) {
      pathnameWithoutLocale = '/' + pathnameWithoutLocale;
    }
    
    // Build new path - ALWAYS include locale prefix
    const newPath = `/${newLocale}${pathnameWithoutLocale}`;
    
    // Use window.location.replace for immediate navigation
    window.location.replace(newPath);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-foreground/20 hover:border-foreground/40 transition-colors"
        data-cursor="small"
      >
        <span className="text-sm font-medium">
          {localeNames[locale as Locale]}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 bg-background border border-foreground/20 rounded-lg shadow-lg overflow-hidden z-50 min-w-[80px]">
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => switchLocale(loc)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-foreground/10 transition-colors ${
                  locale === loc ? 'bg-foreground/5' : ''
                }`}
                data-cursor="small"
              >
                
                <span className="text-sm font-medium">{localeNames[loc]}</span>
                <span>{localeFlags[loc]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
