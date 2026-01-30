"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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

export default function OpenSpacePage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const t = useTranslations("openSpace");

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
          {t("title")}
        </h1>
        <p className="text-lg opacity-70 max-w-2xl">
          {t("subtitle")}
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
                    {t("tariffName")}
                  </h2>
                  <p className="text-lg opacity-70 mb-6">
                    {t("tariffDescription")}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm opacity-60 mb-2">{t("workingHours")}</p>
                    <p className="text-xl font-medium">
                      {t("schedule")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60 mb-2">{t("price")}</p>
                    <p className="text-3xl font-bold text-orange-500">
                      {t("priceValue")}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm opacity-60 mb-4">{t("whatsIncluded")}</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm opacity-80">{t("features.openSpace")}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm opacity-80">{t("features.meetingRoom")}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm opacity-80">{t("features.refreshments")}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm opacity-80">{t("features.printing")}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm opacity-80">{t("features.amenities")}</p>
                    </div>
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

            {/* Additional Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-medium mb-4">
                  {t("benefits.title")}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {t("benefits.professional")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {t("benefits.networking")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{t("benefits.internet")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{t("benefits.wellness")}</span>
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
            {t("additionalAmenities.title")}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-foreground/5 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4 text-orange-500">
                {t("additionalAmenities.workspace.title")}
              </h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>{t("additionalAmenities.workspace.flexible")}</li>
                <li>{t("additionalAmenities.workspace.ergonomic")}</li>
                <li>{t("additionalAmenities.workspace.wifi")}</li>
                <li>{t("additionalAmenities.workspace.outlets")}</li>
                <li>{t("additionalAmenities.workspace.lighting")}</li>
              </ul>
            </div>

            <div className="bg-foreground/5 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4 text-orange-500">
                {t("additionalAmenities.meetingRooms.title")}
              </h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>{t("additionalAmenities.meetingRooms.unlimited")}</li>
                <li>{t("additionalAmenities.meetingRooms.skype")}</li>
                <li>{t("additionalAmenities.meetingRooms.equipment")}</li>
                <li>{t("additionalAmenities.meetingRooms.privacy")}</li>
              </ul>
            </div>

            <div className="bg-foreground/5 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4 text-orange-500">
                {t("additionalAmenities.comfort.title")}
              </h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li>{t("additionalAmenities.comfort.yoga")}</li>
                <li>{t("additionalAmenities.comfort.prayer")}</li>
                <li>{t("additionalAmenities.comfort.lounge")}</li>
                <li>{t("additionalAmenities.comfort.kitchen")}</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 bg-foreground/5 p-8 rounded-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  {t("freeServices.title")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">{t("freeServices.beverages.title")}</h4>
                    <ul className="space-y-1 text-sm opacity-80">
                      <li>{t("freeServices.beverages.coffee")}</li>
                      <li>{t("freeServices.beverages.tea")}</li>
                      <li>{t("freeServices.beverages.water")}</li>
                      <li>{t("freeServices.beverages.snacks")}</li>
                      <li>{t("freeServices.beverages.fruits")}</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">{t("freeServices.office.title")}</h4>
                    <ul className="space-y-1 text-sm opacity-80">
                      <li>{t("freeServices.office.printing")}</li>
                      <li>{t("freeServices.office.scanning")}</li>
                      <li>{t("freeServices.office.copying")}</li>
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
