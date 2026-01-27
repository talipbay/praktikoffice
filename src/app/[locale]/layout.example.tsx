import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import "../globals.css";
import { Navbar } from "@/components/navbar";
import ReactLenis from "lenis/react";
import Cursor from "@/components/cursor";
import { Footer } from "@/components/footer";
import { ColorProvider } from "@/contexts/ColorContext";
import { getAssetPath } from "@/lib/assets";
import { organizationSchema } from "@/lib/structured-data";

const manropeSans = Manrope({
  variable: "--font-manrope-sans",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://praktikoffice.kz"),
  title: {
    default:
      "Praktik Office - Сервисные Офисы Класса А в Астане | Коворкинг и Переговорные",
    template: "%s | Praktik Office",
  },
  description:
    "Сервисные офисы класса А в Астане с форматом «всё включено». Аренда офисов, коворкинг, переговорные комнаты. Доступ 24/7, юридический адрес, инфраструктура премиум-класса.",
  keywords: [
    "офисы астана",
    "аренда офиса астана",
    "коворкинг астана",
    "переговорные комнаты астана",
    "офис класса а астана",
    "сервисные офисы астана",
    "бизнес центр астана",
    "praktik office",
    "praktikoffice",
  ],
  alternates: {
    canonical: "https://praktikoffice.kz",
    languages: {
      'kk-KZ': 'https://praktikoffice.kz/kz',
      'ru-RU': 'https://praktikoffice.kz/ru',
      'en-US': 'https://praktikoffice.kz/en',
    },
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params in Next.js 15+
  const { locale } = await params;
  
  // Validate locale
  type Locale = typeof locales[number];
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const fontBasePath = getAssetPath("/fonts");

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/favicon.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/favicon.jpg" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${manropeSans.variable} ${inter.variable} bg-black antialiased min-h-vh relative`}
      >
        <NextIntlClientProvider messages={messages}>
          <ColorProvider>
            <ReactLenis root />
            <Cursor />
            <Navbar locale={locale} />
            {children}
            <Footer />
          </ColorProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
