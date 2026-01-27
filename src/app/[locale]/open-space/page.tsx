"use client";

import { useState } from "react";
import Image from "next/image";
import { ContactFormModal } from "@/components/contact-form-modal";
import { getAssetPath } from "@/lib/assets";
import { coworkingSchema, breadcrumbSchema } from "@/lib/structured-data";

const openSpaceImages = [
  "/gallery/coworking/coworking-1.webp",
  "/gallery/coworking/coworking-2.webp",
  "/gallery/coworking/coworking-3.webp",
  "/gallery/coworking/coworking-4.webp",
  "/gallery/coworking/coworking-5.webp",
  "/gallery/coworking/coworking-6.webp",
];

const nomadTariff = {
  name: "Тариф Номад",
  schedule: "День 9:00-20:00",
  price: "15,000 ₸",
  features: [
    "Свободное размещение в open space",
    "Безлимит в переговорную на 4 человека и скайп-рум",
    "Бесплатные кофе, чай, вода, снэки и фрукты",
    "Бесплатная распечатка",
    "Доступ к фитнес залу, душевым кабинкам, намазхане",
  ],
  description:
    "Полный дневной доступ к коворкинг-пространству с максимальным набором услуг и удобств.",
};

export default function OpenSpacePage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="relative z-5 bg-black text-foreground font-inter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(coworkingSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Главная", url: "https://praktikoffice.kz/" },
              {
                name: "Коворкинг",
                url: "https://praktikoffice.kz/open-space/",
              },
            ])
          ),
        }}
      />
      {/* Header */}
      <div className="container mx-auto px-5 pt-24 pb-16">
        <h1 className="text-6xl lg:text-8xl xl:text-9xl font-light font-melodrama leading-tight mb-8">
          open space.
        </h1>
        <p className="text-lg opacity-70 max-w-2xl">
          Современное коворкинг-пространство для продуктивной работы в
          комфортной атмосфере
        </p>
      </div>

      {/* Content */}
      <div className="container mx-auto px-5 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left - Tariff Details */}
          <div className="space-y-8">
            {/* Tariff Card */}
            <div className="bg-foreground/5 p-8 rounded-2xl border border-foreground/10">
              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-semibold mb-2">
                    {nomadTariff.name}
                  </h2>
                  <p className="text-lg opacity-70 mb-6">
                    {nomadTariff.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm opacity-60 mb-2">время работы</p>
                    <p className="text-xl font-medium">
                      {nomadTariff.schedule}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60 mb-2">стоимость</p>
                    <p className="text-3xl font-bold text-orange-500">
                      {nomadTariff.price}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm opacity-60 mb-4">что включено</p>
                  <div className="space-y-3">
                    {nomadTariff.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm opacity-80">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="w-full px-8 py-4 bg-foreground text-background rounded-lg text-lg font-medium hover:opacity-80 transition-opacity"
                  data-cursor="small"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  Забронировать место
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-medium mb-4">
                  Преимущества коворкинга
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      - Профессиональная рабочая атмосфера
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      - Нетворкинг и новые знакомства
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">- Высокоскоростной интернет</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">- Фитнес-зал и зоны отдыха</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right - Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src={getAssetPath(openSpaceImages[selectedImage])}
                alt={`Открытое пространство - фото ${selectedImage + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 gap-4">
              {openSpaceImages.map((image, index) => (
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
                    alt={`Открытое пространство - миниатюра ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Services Section */}
        <div className="mt-24 pt-16 border-t border-foreground/20">
          <h2 className="text-4xl font-light font-sans mb-12">
            Дополнительные удобства
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-foreground/5 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4 text-orange-500">
                Рабочая зона
              </h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>• Свободное размещение</li>
                <li>• Эргономичные рабочие места</li>
                <li>• Высокоскоростной Wi-Fi</li>
                <li>• Розетки на каждом столе</li>
                <li>• Комфортное освещение</li>
              </ul>
            </div>

            <div className="bg-foreground/5 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4 text-orange-500">
                Переговорные
              </h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>• Безлимитный доступ</li>
                <li>• Комната на 4 человека</li>
                <li>• Скайп-рум для видеозвонков</li>
                <li>• Презентационное оборудование</li>
                <li>• Приватная атмосфера</li>
              </ul>
            </div>

            <div className="bg-foreground/5 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4 text-orange-500">
                Комфорт
              </h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>• Фитнес-зал</li>
                <li>• Душевые кабинки</li>
                <li>• Намазхана</li>
                <li>• Зоны отдыха</li>
                <li>• Кухня с техникой</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-foreground/5 p-8 rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  Бесплатные услуги
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Напитки и еда</h4>
                    <ul className="space-y-1 text-sm opacity-80">
                      <li>• Кофе</li>
                      <li>• Чай</li>
                      <li>• Вода</li>
                      <li>• Снэки</li>
                      <li>• Свежие фрукты</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Офисные услуги</h4>
                    <ul className="space-y-1 text-sm opacity-80">
                      <li>• Распечатка документов</li>
                      <li>• Сканирование</li>
                      <li>• Копирование</li>
                      <li>• Канцелярские принадлежности</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        defaultService="coworking"
      />
    </div>
  );
}
