"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { ContactFormModal } from "@/components/contact-form-modal";

const officeOptions = [
  {
    id: "office-k10",
    name: "Офис К10",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    features: [
      "8 рабочих мест",
      "Переговорная зона",
      "Просторная планировка",
      "Зона отдыха",
    ],
    images: [
      "/gallery/offices/office-3.webp",
      "/gallery/offices/office-4.webp",
      "/gallery/offices/office-5.webp",
    ],
    description:
      "Просторный офис для команды с отдельными зонами для работы и встреч.",
  },
  {
    id: "office-k11",
    name: "Офис К11",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    features: [
      "8 рабочих мест",
      "Переговорная зона",
      "Современная мебель",
      "Отличная планировка",
    ],
    images: [
      "/gallery/offices/office-4.webp",
      "/gallery/offices/office-5.webp",
      "/gallery/offices/office-6.webp",
    ],
    description: "Современный офис для команды с удобной рабочей средой.",
  },
  {
    id: "office-k14",
    name: "Офис К14",
    size: "18 м²",
    capacity: "до 6 человек",
    price: "2,700 $/месяц",
    features: [
      "6 рабочих мест",
      "Зона для встреч",
      "Хорошее освещение",
      "Удобная планировка",
    ],
    images: [
      "/gallery/offices/office-2.webp",
      "/gallery/offices/office-3.webp",
      "/gallery/offices/office-4.webp",
    ],
    description:
      "Удобный офис для команды среднего размера с зоной для коллабораций.",
  },
  {
    id: "office-k17",
    name: "Офис К17",
    size: "30 м²",
    capacity: "до 10 человек",
    price: "5,000 $/месяц",
    features: [
      "10 рабочих мест",
      "Большая переговорная",
      "Зона отдыха",
      "Премиум планировка",
    ],
    images: [
      "/gallery/offices/office-2.webp",
      "/gallery/offices/office-4.webp",
      "/gallery/offices/office-6.webp",
    ],
    description:
      "Премиальный офис для большой команды с максимальным комфортом.",
  },
];
const moreOffices = [
  {
    id: "office-k18",
    name: "Офис К18",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    features: [
      "8 рабочих мест",
      "Зона для презентаций",
      "Комфортная среда",
      "Функциональная планировка",
    ],
    images: [
      "/gallery/offices/office-5.webp",
      "/gallery/offices/office-6.webp",
      "/gallery/offices/office-1.webp",
    ],
    description:
      "Функциональный офис с зоной для презентаций и командной работы.",
  },
  {
    id: "office-k19",
    name: "Офис К19",
    size: "12 м²",
    capacity: "до 4 человек",
    price: "1,800 $/месяц",
    features: [
      "4 рабочих места",
      "Естественное освещение",
      "Компактная планировка",
      "Доступ к общим зонам",
    ],
    images: [
      "/gallery/offices/office-1.webp",
      "/gallery/offices/office-2.webp",
      "/gallery/offices/office-3.webp",
    ],
    description:
      "Компактный офис для небольшой команды с эффективным использованием пространства.",
  },
  {
    id: "office-k31",
    name: "Офис К31",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    features: [
      "8 рабочих мест",
      "Удобное расположение",
      "Современное оборудование",
      "Гибкая планировка",
    ],
    images: [
      "/gallery/offices/office-6.webp",
      "/gallery/offices/office-1.webp",
      "/gallery/offices/office-2.webp",
    ],
    description: "Удобно расположенный офис с современным оборудованием.",
  },
  {
    id: "office-k38",
    name: "Офис К38",
    size: "36 м²",
    capacity: "до 12 человек",
    price: "6,000 $/месяц",
    features: [
      "12 рабочих мест",
      "Большая переговорная",
      "Зона отдыха",
      "Отдельные рабочие зоны",
      "Максимальный комфорт",
    ],
    images: [
      "/gallery/offices/office-3.webp",
      "/gallery/offices/office-5.webp",
      "/gallery/offices/office-1.webp",
    ],
    description:
      "Самый просторный офис для крупной команды с отдельными рабочими зонами.",
  },
  {
    id: "office-k41",
    name: "Офис К41",
    size: "27 м²",
    capacity: "до 9 человек",
    price: "4,500 $/месяц",
    features: [
      "9 рабочих мест",
      "Расширенная рабочая зона",
      "Зона для встреч",
      "Дополнительное пространство",
    ],
    images: [
      "/gallery/offices/office-1.webp",
      "/gallery/offices/office-3.webp",
      "/gallery/offices/office-5.webp",
    ],
    description:
      "Расширенный офис для большой команды с дополнительными удобствами.",
  },
];

const allOffices = [...officeOptions, ...moreOffices];
export default function OfficesPage() {
  const [selectedOffice, setSelectedOffice] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <div className="relative z-10 bg-background text-foreground">
      <div className="container mx-auto px-5 pt-24 pb-16">
        <h1 className="text-6xl lg:text-8xl xl:text-9xl font-light font-melodrama leading-tight mb-8">
          offices.
        </h1>
        <p className="text-lg opacity-70 max-w-2xl">
          Индивидуальные офисы для команд разного размера с современной мебелью
          и всем необходимым оборудованием
        </p>
      </div>

      <div className="container mx-auto px-5 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-4 mb-8">
              {allOffices.map((office, index) => (
                <button
                  key={office.id}
                  onClick={() => {
                    setSelectedOffice(index);
                    setSelectedImage(0);
                  }}
                  className={`px-6 py-3 rounded-lg border transition-all duration-300 ${
                    selectedOffice === index
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-foreground/20 hover:border-foreground"
                  }`}
                  data-cursor="small"
                >
                  {office.name}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-semibold mb-4">
                  {allOffices[selectedOffice].name}
                </h2>
                <p className="text-lg opacity-70 mb-6">
                  {allOffices[selectedOffice].description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm opacity-60 mb-2">размер</p>
                  <p className="text-xl font-medium">
                    {allOffices[selectedOffice].size}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-60 mb-2">вместимость</p>
                  <p className="text-xl font-medium">
                    {allOffices[selectedOffice].capacity}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm opacity-60 mb-2">цена</p>
                <p className="text-3xl font-bold text-orange-500">
                  {allOffices[selectedOffice].price}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-60 mb-4">включено</p>
                <div className="flex flex-wrap gap-2">
                  {allOffices[selectedOffice].features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-transparent border-foreground text-foreground"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <button
                className="w-full px-8 py-4 bg-foreground text-background rounded-lg text-lg font-medium hover:opacity-80 transition-opacity"
                data-cursor="small"
                onClick={() => setIsContactModalOpen(true)}
              >
                Забронировать офис
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src={allOffices[selectedOffice].images[selectedImage]}
                alt={`${allOffices[selectedOffice].name} - фото ${
                  selectedImage + 1
                }`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {allOffices[selectedOffice].images.map((image, index) => (
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
                    src={image}
                    alt={`${allOffices[selectedOffice].name} - миниатюра ${
                      index + 1
                    }`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 33vw, 16vw"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-24 pt-16 border-t border-foreground/20">
          <h2 className="text-4xl font-light font-melodrama mb-12">
            что включено в стоимость
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-lg opacity-80 mb-8 leading-relaxed">
                В стоимость входит полный набор сервисов, доступ к
                инфраструктуре 24/7 и участие во всех мероприятиях сообщества
                Praktik Office.
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-4 text-orange-500">
                    Сервисы
                  </h3>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>• Ресепшн</li>
                    <li>• Бронирование переговорных комнат</li>
                    <li>• Техническая поддержка</li>
                    <li>
                      • Конфиденциальные переговорные комнаты (3 часа включено)
                    </li>
                    <li>• Zoom-комнаты</li>
                    <li>• Принтерная зона (A4 и А3 форматы)</li>
                    <li>• Локеры</li>
                    <li>• Гардероб</li>
                    <li>• Смарт-столы</li>
                    <li>• Регулярные мероприятия для резидентов</li>
                    <li>• Все коммунальные услуги включены</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4 text-orange-500">
                    Комфорт и отдых
                  </h3>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>• Лаунж-зона</li>
                    <li>• Кухни</li>
                    <li>• Фитнес-зона</li>
                    <li>• PS-game зоны с настольными играми</li>
                    <li>• Намазхана</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  Питание
                </h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>• Чай</li>
                  <li>• Кофе</li>
                  <li>• Вода</li>
                  <li>• Снэки</li>
                  <li>• Выпечка</li>
                  <li>• Свежие фрукты и овощи</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  За дополнительную плату
                </h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>• Юридический адрес</li>
                  <li>• Паркинг</li>
                </ul>
              </div>

              <div className="bg-foreground/5 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Готовы арендовать офис?</h4>
                <p className="text-sm opacity-70 mb-4">
                  Свяжитесь с нами для консультации и просмотра офисов
                </p>
                <div className="space-y-2 text-sm">
                  <p>📧 manager@praktikoffice.kz</p>
                  <p>📞 +7 701 711 72 21</p>
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
        defaultService="office"
      />
    </div>
  );
}
