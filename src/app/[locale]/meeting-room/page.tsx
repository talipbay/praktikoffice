import { fetchMeetingRoomsData } from "@/lib/strapi-data";
import MeetingRoomClient from "./meeting-room-client";

// Fallback data
const fallbackRooms = [
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

export default async function MeetingRoomPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Try to fetch from Strapi
  let rooms = await fetchMeetingRoomsData(locale);
  
  // Log for debugging
  console.log('=== MEETING ROOMS PAGE DEBUG ===');
  console.log('Locale:', locale);
  console.log('Fetched rooms count:', rooms?.length || 0);
  console.log('First room:', rooms?.[0]);
  console.log('================================');
  
  // If no data from Strapi, use fallback
  if (!rooms || rooms.length === 0) {
    console.log('Using fallback meeting room data - no data from Strapi');
    rooms = fallbackRooms;
  } else {
    console.log('Using Strapi data - found', rooms.length, 'meeting rooms');
  }

  return <MeetingRoomClient rooms={rooms} />;
}
