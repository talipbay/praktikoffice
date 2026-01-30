"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ContactFormModal } from "@/components/contact-form-modal";
import { getAssetPath } from "@/lib/assets";
import { officeRentalSchema, breadcrumbSchema } from "@/lib/structured-data";

const officeOptions = [
  {
    id: "office-k10",
    name: "Офис К10",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    featureKeys: [
      "workplaces_8",
      "meetingZone",
      "spaciousLayout",
      "loungeArea",
    ],
    images: [
      "/gallery/offices/office-3.webp",
      "/gallery/offices/office-4.webp",
      "/gallery/offices/office-5.webp",
    ],
  },
  {
    id: "office-k11",
    name: "Офис К11",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    featureKeys: [
      "workplaces_8",
      "meetingZone",
      "modernFurniture",
      "excellentLayout",
    ],
    images: [
      "/gallery/offices/office-4.webp",
      "/gallery/offices/office-5.webp",
      "/gallery/offices/office-6.webp",
    ],
  },
  {
    id: "office-k14",
    name: "Офис К14",
    size: "18 м²",
    capacity: "до 6 человек",
    price: "2,700 $/месяц",
    featureKeys: [
      "workplaces_6",
      "meetingArea",
      "goodLighting",
      "convenientLayout",
    ],
    images: [
      "/gallery/offices/office-2.webp",
      "/gallery/offices/office-3.webp",
      "/gallery/offices/office-4.webp",
    ],
  },
  {
    id: "office-k17",
    name: "Офис К17",
    size: "30 м²",
    capacity: "до 10 человек",
    price: "5,000 $/месяц",
    featureKeys: [
      "workplaces_10",
      "largeMeetingRoom",
      "loungeArea",
      "premiumLayout",
    ],
    images: [
      "/gallery/offices/office-2.webp",
      "/gallery/offices/office-4.webp",
      "/gallery/offices/office-6.webp",
    ],
  },
];
const moreOffices = [
  {
    id: "office-k18",
    name: "Офис К18",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    featureKeys: [
      "workplaces_8",
      "presentationZone",
      "comfortableEnvironment",
      "functionalLayout",
    ],
    images: [
      "/gallery/offices/office-5.webp",
      "/gallery/offices/office-6.webp",
      "/gallery/offices/office-1.webp",
    ],
  },
  {
    id: "office-k19",
    name: "Офис К19",
    size: "12 м²",
    capacity: "до 4 человек",
    price: "1,800 $/месяц",
    featureKeys: [
      "workplaces_4",
      "naturalLighting",
      "compactLayout",
      "accessToCommonAreas",
    ],
    images: [
      "/gallery/offices/office-1.webp",
      "/gallery/offices/office-2.webp",
      "/gallery/offices/office-3.webp",
    ],
  },
  {
    id: "office-k31",
    name: "Офис К31",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    featureKeys: [
      "workplaces_8",
      "convenientLocation",
      "modernEquipment",
      "flexibleLayout",
    ],
    images: [
      "/gallery/offices/office-6.webp",
      "/gallery/offices/office-1.webp",
      "/gallery/offices/office-2.webp",
    ],
  },
  {
    id: "office-k38",
    name: "Офис К38",
    size: "36 м²",
    capacity: "до 12 человек",
    price: "6,000 $/месяц",
    featureKeys: [
      "workplaces_12",
      "largeMeetingRoom",
      "loungeArea",
      "separateWorkZones",
      "maximumComfort",
    ],
    images: [
      "/gallery/offices/office-3.webp",
      "/gallery/offices/office-5.webp",
      "/gallery/offices/office-1.webp",
    ],
  },
  {
    id: "office-k41",
    name: "Офис К41",
    size: "27 м²",
    capacity: "до 9 человек",
    price: "4,500 $/месяц",
    featureKeys: [
      "workplaces_9",
      "expandedWorkZone",
      "meetingArea",
      "additionalSpace",
    ],
    images: [
      "/gallery/offices/office-1.webp",
      "/gallery/offices/office-3.webp",
      "/gallery/offices/office-5.webp",
    ],
  },
];

const allOffices = [...officeOptions, ...moreOffices];
export default function OfficesPage() {
  const [selectedOffice, setSelectedOffice] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const t = useTranslations("offices");

  return (
    <div className="relative z-5 bg-black text-foreground font-inter">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(officeRentalSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Главная", url: "https://praktikoffice.kz/" },
              { name: "Офисы", url: "https://praktikoffice.kz/offices/" },
            ])
          ),
        }}
      />
      <div className="container mx-auto px-5 pt-24 pb-16">
        <h1 className="text-6xl lg:text-8xl xl:text-9xl font-light font-melodrama leading-tight mb-8">
          {t("title")}
        </h1>
        <p className="text-lg opacity-70 max-w-2xl">
          {t("subtitle")}
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
                  {t("description")}
                </p>
              </div>

              {/* <div className="grid grid-cols-2 gap-6">
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
              </div> */}
              <div>
                <p className="text-sm opacity-60 mb-2">{t("price")}</p>
                <p className="text-3xl font-bold text-orange-500">
                  {allOffices[selectedOffice].price}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-60 mb-4">{t("included")}</p>
                <div className="flex flex-wrap gap-2">
                  {allOffices[selectedOffice].featureKeys.map((featureKey, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-transparent border-foreground text-foreground"
                    >
                      {t(`officeFeatures.${featureKey}`)}
                    </Badge>
                  ))}
                </div>
              </div>

              <button
                className="w-full px-8 py-4 bg-foreground text-background rounded-lg text-lg font-medium hover:opacity-80 transition-opacity"
                data-cursor="small"
                onClick={() => setIsContactModalOpen(true)}
              >
                {t("bookButton")}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-4/3 overflow-hidden rounded-lg">
              <Image
                src={getAssetPath(
                  allOffices[selectedOffice].images[selectedImage]
                )}
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
                    src={getAssetPath(image)}
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
          <h2 className="text-4xl font-light font-sans mb-12">
            {t("whatsIncluded.title")}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <p className="text-lg opacity-80 mb-8 leading-relaxed">
                {t("whatsIncluded.description")}
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-medium mb-4 text-orange-500">
                    {t("whatsIncluded.services.title")}
                  </h3>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>{t("whatsIncluded.services.reception")}</li>
                    <li>{t("whatsIncluded.services.booking")}</li>
                    <li>{t("whatsIncluded.services.support")}</li>
                    <li>{t("whatsIncluded.services.skype")}</li>
                    <li>{t("whatsIncluded.services.printing")}</li>
                    <li>{t("whatsIncluded.services.lockers")}</li>
                    <li>{t("whatsIncluded.services.wardrobe")}</li>
                    <li>{t("whatsIncluded.services.smartDesks")}</li>
                    <li>{t("whatsIncluded.services.events")}</li>
                    <li>{t("whatsIncluded.services.utilities")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4 text-orange-500">
                    {t("whatsIncluded.comfort.title")}
                  </h3>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>{t("whatsIncluded.comfort.lounge")}</li>
                    <li>{t("whatsIncluded.comfort.kitchens")}</li>
                    <li>{t("whatsIncluded.comfort.fitness")}</li>
                    <li>{t("whatsIncluded.comfort.gaming")}</li>
                    <li>{t("whatsIncluded.comfort.prayer")}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  {t("whatsIncluded.food.title")}
                </h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>{t("whatsIncluded.food.tea")}</li>
                  <li>{t("whatsIncluded.food.coffee")}</li>
                  <li>{t("whatsIncluded.food.water")}</li>
                  <li>{t("whatsIncluded.food.snacks")}</li>
                  <li>{t("whatsIncluded.food.fruits")}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  {t("whatsIncluded.additional.title")}
                </h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>{t("whatsIncluded.additional.legalAddress")}</li>
                  <li>{t("whatsIncluded.additional.parking")}</li>
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
        defaultService="office"
      />
    </div>
  );
}
