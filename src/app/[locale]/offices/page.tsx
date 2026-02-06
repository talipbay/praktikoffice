import { fetchOfficesData } from "@/lib/strapi-data";
import OfficesClient from "./offices-client";

// Fallback data in case Strapi is not available
const fallbackOffices = [
  {
    id: "office-k10",
    name: "Офис К10",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    description: "Просторный офис с зоной для встреч и комфортной планировкой",
    featureKeys: ["workplaces_8", "meetingZone", "spaciousLayout", "loungeArea"],
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
    description: "Современный офис с отличной планировкой и новой мебелью",
    featureKeys: ["workplaces_8", "meetingZone", "modernFurniture", "excellentLayout"],
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
    description: "Компактный офис с хорошим освещением и удобной планировкой",
    featureKeys: ["workplaces_6", "meetingArea", "goodLighting", "convenientLayout"],
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
    description: "Большой офис премиум-класса с зоной отдыха и переговорной",
    featureKeys: ["workplaces_10", "largeMeetingRoom", "loungeArea", "premiumLayout"],
    images: [
      "/gallery/offices/office-2.webp",
      "/gallery/offices/office-4.webp",
      "/gallery/offices/office-6.webp",
    ],
  },
  {
    id: "office-k18",
    name: "Офис К18",
    size: "24 м²",
    capacity: "до 8 человек",
    price: "4,000 $/месяц",
    description: "Функциональный офис с зоной для презентаций",
    featureKeys: ["workplaces_8", "presentationZone", "comfortableEnvironment", "functionalLayout"],
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
    description: "Компактный офис с естественным освещением",
    featureKeys: ["workplaces_4", "naturalLighting", "compactLayout", "accessToCommonAreas"],
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
    description: "Офис с удобным расположением и современным оборудованием",
    featureKeys: ["workplaces_8", "convenientLocation", "modernEquipment", "flexibleLayout"],
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
    description: "Большой офис с отдельными рабочими зонами и максимальным комфортом",
    featureKeys: ["workplaces_12", "largeMeetingRoom", "loungeArea", "separateWorkZones", "maximumComfort"],
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
    description: "Офис с расширенной рабочей зоной и дополнительным пространством",
    featureKeys: ["workplaces_9", "expandedWorkZone", "meetingArea", "additionalSpace"],
    images: [
      "/gallery/offices/office-1.webp",
      "/gallery/offices/office-3.webp",
      "/gallery/offices/office-5.webp",
    ],
  },
];

export default async function OfficesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Try to fetch from Strapi
  let offices = await fetchOfficesData(locale);
  
  // Log for debugging
  console.log('=== OFFICES PAGE DEBUG ===');
  console.log('Locale:', locale);
  console.log('Fetched offices count:', offices?.length || 0);
  console.log('First office:', offices?.[0]);
  console.log('========================');
  
  // If no data from Strapi, use fallback
  if (!offices || offices.length === 0) {
    console.log('Using fallback office data - no data from Strapi');
    offices = fallbackOffices;
  } else {
    console.log('Using Strapi data - found', offices.length, 'offices');
  }

  return <OfficesClient offices={offices} />;
}
