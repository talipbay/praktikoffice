"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ContactFormModal } from "@/components/contact-form-modal";
import { getAssetPath } from "@/lib/assets";
import { officeRentalSchema, breadcrumbSchema } from "@/lib/structured-data";

interface Office {
  id: string;
  name: string;
  size: string;
  capacity: string;
  price: string;
  description: string;
  featureKeys: string[];
  images: string[];
}

interface OfficesClientProps {
  offices: Office[];
}

export default function OfficesClient({ offices }: OfficesClientProps) {
  const [selectedOffice, setSelectedOffice] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const t = useTranslations("offices");

  if (!offices || offices.length === 0) {
    return (
      <div className="relative z-5 bg-black text-foreground font-inter">
        <div className="container mx-auto px-5 pt-24 pb-16">
          <h1 className="text-6xl lg:text-8xl xl:text-9xl font-light font-melodrama leading-tight mb-8">
            {t("title")}
          </h1>
          <p className="text-lg opacity-70 max-w-2xl">
            No offices available at the moment.
          </p>
        </div>
      </div>
    );
  }

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
              {offices.map((office, index) => (
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
                  {offices[selectedOffice].name}
                </h2>
                <p className="text-lg opacity-70 mb-4">
                  {offices[selectedOffice].description || t("description")}
                </p>
                <div className="flex gap-6 text-sm opacity-70">
                  <div>
                    <span className="opacity-60">{t("size")}: </span>
                    <span className="font-medium">{offices[selectedOffice].size}</span>
                  </div>
                  <div>
                    <span className="opacity-60">{t("capacity")}: </span>
                    <span className="font-medium">{offices[selectedOffice].capacity}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm opacity-60 mb-2">{t("price")}</p>
                <p className="text-3xl font-bold text-orange-500">
                  {offices[selectedOffice].price}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-60 mb-4">{t("included")}</p>
                <div className="flex flex-wrap gap-2">
                  {offices[selectedOffice].featureKeys.map((featureKey, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-transparent border-foreground text-foreground"
                    >
                      {featureKey}
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
                  offices[selectedOffice].images[selectedImage]
                )}
                alt={`${offices[selectedOffice].name} - фото ${
                  selectedImage + 1
                }`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {offices[selectedOffice].images.map((image, index) => (
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
                    alt={`${offices[selectedOffice].name} - миниатюра ${
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
