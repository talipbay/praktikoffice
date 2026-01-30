import { fetchCoworkingTariffsData, fetchCoworkingImages } from "@/lib/strapi-data";
import OpenSpaceClient from "./open-space-client";

// Fallback data
const fallbackImages = [
  "/gallery/coworking/coworking-1.webp",
  "/gallery/coworking/coworking-2.webp",
  "/gallery/coworking/coworking-3.webp",
  "/gallery/coworking/coworking-4.webp",
  "/gallery/coworking/coworking-5.webp",
  "/gallery/coworking/coworking-6.webp",
];

export default async function OpenSpacePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Try to fetch from Strapi
  const tariffs = await fetchCoworkingTariffsData(locale);
  let images = await fetchCoworkingImages(locale);
  
  // Log for debugging
  console.log('=== OPEN SPACE PAGE DEBUG ===');
  console.log('Locale:', locale);
  console.log('Fetched tariffs count:', tariffs?.length || 0);
  console.log('First tariff:', tariffs?.[0]);
  console.log('Images count:', images?.length || 0);
  console.log('=============================');
  
  // Use fallback images if none from Strapi
  if (!images || images.length === 0) {
    console.log('Using fallback images');
    images = fallbackImages;
  }
  
  // Use first tariff or fallback
  let tariffData;
  if (tariffs && tariffs.length > 0) {
    console.log('Using Strapi tariff data');
    tariffData = tariffs[0];
  } else {
    console.log('Using fallback tariff data');
    tariffData = {
      name: "Тариф Номад",
      description: "Полный дневной доступ к коворкинг-пространству с максимальным набором услуг и удобств.",
      schedule: "День 9:00-20:00",
      price: "15,000 ₸",
      featureKeys: [
        "openSpace",
        "meetingRoom",
        "refreshments",
        "printing",
        "amenities",
      ],
    };
  }

  return (
    <OpenSpaceClient
      tariffName={tariffData.name}
      tariffDescription={tariffData.description}
      schedule={tariffData.schedule}
      price={tariffData.price}
      features={tariffData.featureKeys}
      images={images}
    />
  );
}
