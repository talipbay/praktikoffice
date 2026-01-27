export const locales = ['kz', 'ru', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export const localeNames: Record<Locale, string> = {
  kz: 'Қазақша',
  ru: 'Русский',
  en: 'English',
};

export const localeFlags: Record<Locale, string> = {
  kz: '🇰🇿',
  ru: '🇷🇺',
  en: '🇬🇧',
};
