"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ContactFormModal } from "@/components/contact-form-modal";
import { getAssetPath } from "@/lib/assets";
import { meetingRoomSchema, breadcrumbSchema } from "@/lib/structured-data";

const meetingRoomOptions = [
  {
    id: "meeting-p6",
    name: "П6",
    size: "15 м²",
    capacity: "6 мест",
    price: "12,500 ₸/час",
    features: [
      "Смарт-стекло с затемнением",
      "Доступ к коворкинг-зоне",
      "Кухня и кофе-пойнт",
      "Маркерная доска (по запросу)",
    ],
    images: [
      "/gallery/meeting/meeting-1.webp",
      "/gallery/meeting/meeting-2.webp",
      "/gallery/meeting/meeting-3.webp",
    ],
    description:
      "Переговорная комната на 6 мест с уникальным смарт-стеклом для создания приватной атмосферы.",
    workingHours: "09:00 - 20:00",
    specialFeature:
      "Смарт-стекло с функцией затемнения. Одним нажатием создаёт приватную атмосферу для переговоров",
  },
  {
    id: "meeting-p8",
    name: "П8",
    size: "20 м²",
    capacity: "8 мест",
    price: "15,000 ₸/час",
    features: [
      "Смарт-стекло с затемнением",
      "Доступ к коворкинг-зоне",
      "Кухня и кофе-пойнт",
      "Маркерная доска (по запросу)",
    ],
    images: [
      "/gallery/meeting/meeting-2.webp",
      "/gallery/meeting/meeting-3.webp",
      "/gallery/meeting/meeting-4.webp",
    ],
    description:
      "Переговорная комната на 8 мест с современным оборудованием и смарт-стеклом.",
    workingHours: "09:00 - 20:00",
    specialFeature:
      "Смарт-стекло с функцией затемнения. Одним нажатием создаёт приватную атмосферу для переговоров",
  },
  {
    id: "meeting-p10",
    name: "П10",
    size: "37 м²",
    capacity: "10 мест",
    price: "25,000 ₸/час",
    features: [
      "Доступ к коворкинг-зоне",
      "Кухня и кофе-пойнт",
      "Просторное помещение",
    ],
    images: [
      "/gallery/meeting/meeting-3.webp",
      "/gallery/meeting/meeting-4.webp",
      "/gallery/meeting/meeting-5.webp",
    ],
    description: "Просторная переговорная комната на 10 мест площадью 37 м².",
    workingHours: "09:00 - 20:00",
    specialFeature: "Большая площадь 37 м² для комфортных переговоров",
  },
  {
    id: "meeting-p12",
    name: "П12",
    size: "30 м²",
    capacity: "12 мест",
    price: "25,000 ₸/час",
    features: [
      "Смарт-стекло с затемнением",
      "Телевизор с кликером",
      "Маркерная доска",
      "Собственный кофе-пойнт",
      "Розетки на столе",
      "Панорамный вид на город",
      "Дополнительные стулья (по запросу)",
    ],
    images: [
      "/gallery/meeting/meeting-4.webp",
      "/gallery/meeting/meeting-5.webp",
      "/gallery/meeting/meeting-6.webp",
    ],
    description:
      "Премиальная переговорная на 12 мест с панорамным видом на город и полным набором оборудования.",
    workingHours: "09:00 - 20:00",
    specialFeature:
      "Смарт-стекло с функцией затемнения и панорамный вид на город",
  },
  {
    id: "meeting-p16",
    name: "П16",
    size: "38 м²",
    capacity: "16 человек",
    price: "25,000 ₸/час",
    features: [
      "Смарт-стекло с затемнением",
      "Телевизор с кликером",
      "Маркерная доска",
      "Доступ к коворкинг-зоне",
      "Театральная рассадка",
      "Гибкая организация пространства",
    ],
    images: [
      "/gallery/meeting/meeting-5.webp",
      "/gallery/meeting/meeting-6.webp",
      "/gallery/meeting/meeting-1.webp",
    ],
    description:
      "Большая переговорная на 16 человек с возможностью театральной рассадки и гибкой организацией пространства.",
    workingHours: "09:00 - 20:00",
    specialFeature:
      "Возможна театральная рассадка. Гибкий подход к формату мероприятий",
  },
];
export default function MeetingRoomPage() {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="relative z-5 bg-black text-foreground font-inter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(meetingRoomSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Главная", url: "https://praktikoffice.kz/" },
              {
                name: "Переговорные",
                url: "https://praktikoffice.kz/meeting-room/",
              },
            ])
          ),
        }}
      />
      {/* Header */}
      <div className="container mx-auto px-5 pt-24 pb-16">
        <h1 className="text-6xl lg:text-8xl xl:text-9xl font-light font-melodrama leading-tight mb-8">
          meeting rooms.
        </h1>
        <p className="text-lg opacity-70 max-w-2xl">
          Современные переговорные комнаты с профессиональным оборудованием для
          встреч и презентаций
        </p>
      </div>

      {/* Room Options */}
      <div className="container mx-auto px-5 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Room Selection */}
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4 mb-8">
              {meetingRoomOptions.map((room, index) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setSelectedRoom(index);
                    setSelectedImage(0);
                  }}
                  className={`px-6 py-3 rounded-lg border transition-all duration-300 ${
                    selectedRoom === index
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-foreground/20 hover:border-foreground"
                  }`}
                  data-cursor="small"
                >
                  {room.name}
                </button>
              ))}
            </div>

            {/* Room Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold mb-4">
                  Переговорная {meetingRoomOptions[selectedRoom].name}
                </h2>
                <p className="text-lg opacity-70 mb-6">
                  {meetingRoomOptions[selectedRoom].description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm opacity-60 mb-2">площадь</p>
                  <p className="text-xl font-medium">
                    {meetingRoomOptions[selectedRoom].size}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-60 mb-2">вместимость</p>
                  <p className="text-xl font-medium">
                    {meetingRoomOptions[selectedRoom].capacity}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm opacity-60 mb-2">стоимость</p>
                <p className="text-3xl font-bold text-orange-500">
                  {meetingRoomOptions[selectedRoom].price}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-60 mb-2">время работы</p>
                <p className="text-lg font-medium">
                  {meetingRoomOptions[selectedRoom].workingHours}
                </p>
              </div>

              {/* Special Feature */}
              <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                <h4 className="font-medium mb-2 text-orange-500">
                  Особенность помещения
                </h4>
                <p className="text-sm opacity-80">
                  {meetingRoomOptions[selectedRoom].specialFeature}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  {meetingRoomOptions[selectedRoom].features.map(
                    (feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-transparent border-foreground text-foreground"
                      >
                        {feature}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <button
                className="w-full px-8 py-4 bg-foreground text-background rounded-lg text-lg font-medium hover:opacity-80 transition-opacity"
                data-cursor="small"
                onClick={() => setIsContactModalOpen(true)}
              >
                Забронировать переговорную
              </button>
            </div>
          </div>
          {/* Right - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src={getAssetPath(
                  meetingRoomOptions[selectedRoom].images[selectedImage]
                )}
                alt={`Переговорная ${
                  meetingRoomOptions[selectedRoom].name
                } - фото ${selectedImage + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {meetingRoomOptions[selectedRoom].images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-4/3 overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                    selectedImage === index
                      ? "border-foreground"
                      : "border-transparent hover:border-foreground/50"
                  }`}
                  data-cursor="small"
                >
                  <Image
                    src={getAssetPath(image)}
                    alt={`Переговорная ${
                      meetingRoomOptions[selectedRoom].name
                    } - миниатюра ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-24 pt-16 border-t border-foreground/20">
          <h2 className="text-4xl font-light font-sans mb-12">
            Что включено в стоимость
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-lg opacity-80 mb-8 leading-relaxed">
                В стоимость аренды переговорной входит доступ к коворкинг-зоне,
                где вы можете пользоваться кухней и кофе-пойнтом во время
                аренды.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-4 text-orange-500">
                    Базовые услуги
                  </h3>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>• Доступ к коворкинг-зоне</li>
                    <li>• Кухня и кофе-пойнт</li>
                    <li>• Wi-Fi высокой скорости</li>
                    <li>• Кондиционирование</li>
                    <li>• Уборка помещения</li>
                    <li>• Техническая поддержка</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4 text-orange-500">
                    Оборудование
                  </h3>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>• Телевизор для презентаций (в П12, П16)</li>
                    <li>• Кликер для презентаций</li>
                    <li>• Маркерная доска</li>
                    <li>• Розетки на столе</li>
                    <li>• Смарт-стекло с затемнением</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  Дополнительные услуги
                </h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>• Дополнительные стулья (по запросу)</li>
                  <li>• Маркерная доска (по запросу для П6, П8)</li>
                  <li>• Организация кейтеринга</li>
                  <li>• Техническая поддержка мероприятий</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  Особенности
                </h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>• Смарт-стекло для приватности</li>
                  <li>• Панорамный вид на город (П12)</li>
                  <li>• Театральная рассадка (П16)</li>
                  <li>• Гибкая организация пространства</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        defaultService="meeting"
      />
    </div>
  );
}
