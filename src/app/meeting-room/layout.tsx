import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Аренда Переговорных Комнат в Астане - От 12,500₸/час | Praktik Office",
  description:
    "Современные переговорные комнаты на 6-16 человек со смарт-стеклом, телевизорами и панорамным видом. Почасовая аренда от 12,500₸. Доступ к коворкинг-зоне и кофе-пойнту включен.",
  keywords: [
    "переговорная комната астана",
    "аренда переговорной астана",
    "конференц зал астана",
    "переговорная почасово астана",
    "meeting room астана",
    "зал для презентаций астана",
    "переговорная со смарт-стеклом",
  ],
  openGraph: {
    title: "Аренда Переговорных Комнат в Астане | Praktik Office",
    description:
      "Переговорные комнаты на 6-16 человек с современным оборудованием. Смарт-стекло, телевизоры, панорамный вид. От 12,500₸/час.",
    url: "https://praktikoffice.kz/meeting-room/",
    images: ["/gallery/meeting/meeting-1.webp"],
  },
};

export default function MeetingRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
