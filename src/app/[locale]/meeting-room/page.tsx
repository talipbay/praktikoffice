"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
    featureKeys: [
      "smartGlass",
      "coworkingAccess",
      "kitchenCoffee",
      "whiteboardOnRequest",
    ],
    images: [
      "/gallery/meeting/meeting-1.webp",
      "/gallery/meeting/meeting-2.webp",
      "/gallery/meeting/meeting-3.webp",
    ],
    descriptionKey: "p6",
    specialFeatureKey: "p6",
  },
  {
    id: "meeting-p8",
    name: "П8",
    size: "20 м²",
    capacity: "8 мест",
    price: "15,000 ₸/час",
    featureKeys: [
      "smartGlass",
      "coworkingAccess",
      "kitchenCoffee",
      "whiteboardOnRequest",
    ],
    images: [
      "/gallery/meeting/meeting-2.webp",
      "/gallery/meeting/meeting-3.webp",
      "/gallery/meeting/meeting-4.webp",
    ],
    descriptionKey: "p8",
    specialFeatureKey: "p8",
  },
  {
    id: "meeting-p10",
    name: "П10",
    size: "37 м²",
    capacity: "10 мест",
    price: "25,000 ₸/час",
    featureKeys: [
      "coworkingAccess",
      "kitchenCoffee",
      "spaciousRoom",
    ],
    images: [
      "/gallery/meeting/meeting-3.webp",
      "/gallery/meeting/meeting-4.webp",
      "/gallery/meeting/meeting-5.webp",
    ],
    descriptionKey: "p10",
    specialFeatureKey: "p10",
  },
  {
    id: "meeting-p12",
    name: "П12",
    size: "30 м²",
    capacity: "12 мест",
    price: "25,000 ₸/час",
    featureKeys: [
      "smartGlass",
      "tvWithClicker",
      "whiteboard",
      "ownCoffeePoint",
      "outletsOnTable",
      "panoramicView",
      "extraChairs",
    ],
    images: [
      "/gallery/meeting/meeting-4.webp",
      "/gallery/meeting/meeting-5.webp",
      "/gallery/meeting/meeting-6.webp",
    ],
    descriptionKey: "p12",
    specialFeatureKey: "p12",
  },
  {
    id: "meeting-p16",
    name: "П16",
    size: "38 м²",
    capacity: "16 человек",
    price: "25,000 ₸/час",
    featureKeys: [
      "smartGlass",
      "tvWithClicker",
      "whiteboard",
      "coworkingAccess",
      "theaterSeating",
      "flexibleSpace",
    ],
    images: [
      "/gallery/meeting/meeting-5.webp",
      "/gallery/meeting/meeting-6.webp",
      "/gallery/meeting/meeting-1.webp",
    ],
    descriptionKey: "p16",
    specialFeatureKey: "p16",
  },
];
export default function MeetingRoomPage() {
  const [selectedRoom, setSelectedRoom] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const t = useTranslations("meetingRooms");

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
          {t("title")}
        </h1>
        <p className="text-lg opacity-70 max-w-2xl">
          {t("subtitle")}
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
                  {t("roomPrefix")} {meetingRoomOptions[selectedRoom].name}
                </h2>
                <p className="text-lg opacity-70 mb-6">
                  {t(`roomDescriptions.${meetingRoomOptions[selectedRoom].descriptionKey}`)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm opacity-60 mb-2">{t("area")}</p>
                  <p className="text-xl font-medium">
                    {meetingRoomOptions[selectedRoom].size}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-60 mb-2">{t("capacity")}</p>
                  <p className="text-xl font-medium">
                    {meetingRoomOptions[selectedRoom].capacity}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm opacity-60 mb-2">{t("price")}</p>
                <p className="text-3xl font-bold text-orange-500">
                  {meetingRoomOptions[selectedRoom].price}
                </p>
              </div>

              <div>
                <p className="text-sm opacity-60 mb-2">{t("workingHours")}</p>
                <p className="text-lg font-medium">
                  {t("schedule")}
                </p>
              </div>

              {/* Special Feature */}
              <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                <h4 className="font-medium mb-2 text-orange-500">
                  {t("specialFeature")}
                </h4>
                <p className="text-sm opacity-80">
                  {t(`specialFeatures.${meetingRoomOptions[selectedRoom].specialFeatureKey}`)}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  {meetingRoomOptions[selectedRoom].featureKeys.map(
                    (featureKey, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-transparent border-foreground text-foreground"
                      >
                        {t(`roomFeatures.${featureKey}`)}
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
                {t("bookButton")}
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
                    {t("whatsIncluded.basic.title")}
                  </h3>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>{t("whatsIncluded.basic.coworking")}</li>
                    <li>{t("whatsIncluded.basic.kitchen")}</li>
                    <li>{t("whatsIncluded.basic.wifi")}</li>
                    <li>{t("whatsIncluded.basic.cleaning")}</li>
                    <li>{t("whatsIncluded.basic.support")}</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-4 text-orange-500">
                    {t("whatsIncluded.equipment.title")}
                  </h3>
                  <ul className="space-y-2 text-sm opacity-80">
                    <li>{t("whatsIncluded.equipment.tv")}</li>
                    <li>{t("whatsIncluded.equipment.whiteboard")}</li>
                    <li>{t("whatsIncluded.equipment.outlets")}</li>
                    <li>{t("whatsIncluded.equipment.smartGlass")}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  {t("whatsIncluded.additional.title")}
                </h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>{t("whatsIncluded.additional.chairs")}</li>
                  <li>{t("whatsIncluded.additional.catering")}</li>
                  <li>{t("whatsIncluded.additional.eventSupport")}</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-4 text-orange-500">
                  {t("whatsIncluded.features.title")}
                </h3>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>{t("whatsIncluded.features.smartGlass")}</li>
                  <li>{t("whatsIncluded.features.cityView")}</li>
                  <li>{t("whatsIncluded.features.theater")}</li>
                  <li>{t("whatsIncluded.features.flexible")}</li>
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
