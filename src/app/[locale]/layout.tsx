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
    "офисы в аренду астана",
    "коворкинг пространство",
    "аренда переговорной",
    "офис с юридическим адресом",
    "премиум офисы астана",
  ],
  authors: [{ name: "Praktik Office" }],
  creator: "Praktik Office",
  publisher: "Praktik Office",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://praktikoffice.kz",
    siteName: "Praktik Office",
    title: "Praktik Office - Сервисные Офисы Класса А в Астане",
    description:
      "Сервисные офисы класса А с форматом «всё включено». Аренда офисов, коворкинг, переговорные комнаты в Астане. Доступ 24/7, премиум инфраструктура.",
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
        alt: "Praktik Office - Премиум офисы в Астане",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Praktik Office - Сервисные Офисы Класса А в Астане",
    description:
      "Аренда офисов класса А, коворкинг и переговорные комнаты в Астане. Формат «всё включено», доступ 24/7.",
    images: ["/hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://praktikoffice.kz",
    languages: {
      'kk-KZ': 'https://praktikoffice.kz/kz',
      'ru-RU': 'https://praktikoffice.kz/ru',
      'en-US': 'https://praktikoffice.kz/en',
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
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
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-86JBER2K5Q"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-86JBER2K5Q');
            `,
          }}
        />
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
        <span id="_zero_75520">
          <noscript>
            <a href="https://zero.kz/?s=75520" target="_blank" rel="noopener noreferrer">
              <img src="https://c.zero.kz/z.png?u=75520" width="88" height="31" alt="ZERO.kz" />
            </a>
          </noscript>
        </span>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var _zero_kz_ = _zero_kz_ || [];
              _zero_kz_.push(['id', 75520]);
              _zero_kz_.push(['type', 1]);
              (function () {
                var a = document.getElementsByTagName('script')[0],
                s = document.createElement('script');
                s.async = true;
                s.src = (document.location.protocol == 'http:' ? 'http:' : 'https:') + '//c.zero.kz/z.js';
                a.parentNode.insertBefore(s, a);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
