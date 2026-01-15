import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Коворкинг в Астане - 15,000₸/день | Open Space | Praktik Office",
  description:
    "Коворкинг-пространство в Астане с тарифом Номад 15,000₸/день. Свободное размещение, безлимит в переговорные, бесплатные кофе и снэки, фитнес-зал. Работа с 9:00 до 20:00.",
  keywords: [
    "коворкинг астана",
    "коворкинг пространство астана",
    "open space астана",
    "рабочее место астана",
    "коворкинг цена астана",
    "коворкинг центр астана",
    "аренда рабочего места астана",
  ],
  openGraph: {
    title: "Коворкинг в Астане - 15,000₸/день | Praktik Office",
    description:
      "Современное коворкинг-пространство с полным набором услуг. Свободное размещение, переговорные, фитнес-зал, бесплатные напитки и снэки.",
    url: "https://praktikoffice.kz/open-space/",
    images: ["/gallery/coworking/coworking-1.webp"],
  },
};

export default function OpenSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
