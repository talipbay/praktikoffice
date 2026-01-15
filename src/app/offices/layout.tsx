import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Аренда Офисов в Астане - От 1,800$/мес | Praktik Office",
  description:
    "Индивидуальные офисы для команд от 4 до 12 человек в бизнес-центре класса А. Площадь от 12 до 36 м². Современная мебель, переговорные зоны, все коммунальные услуги включены. Цены от 1,800$/месяц.",
  keywords: [
    "аренда офиса астана",
    "офис в аренду астана",
    "снять офис астана",
    "офис для команды астана",
    "индивидуальный офис астана",
    "офис класса а астана",
    "офис с мебелью астана",
    "готовый офис астана",
  ],
  openGraph: {
    title: "Аренда Офисов в Астане - От 1,800$/мес | Praktik Office",
    description:
      "Индивидуальные офисы для команд от 4 до 12 человек. Площадь от 12 до 36 м². Все включено: мебель, интернет, коммунальные услуги.",
    url: "https://praktikoffice.kz/offices/",
    images: ["/gallery/offices/office-1.webp"],
  },
};

export default function OfficesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
