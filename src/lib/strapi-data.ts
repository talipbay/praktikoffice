// Helper functions to fetch and transform Strapi data for pages
import { getOffices, getMeetingRooms, getCoworkingTariffs } from './strapi';
import { getStrapiImageUrl } from './strapi-helpers';

export interface OfficeData {
  id: string;
  name: string;
  size: string;
  capacity: string;
  price: string;
  featureKeys: string[];
  images: string[];
}

export interface MeetingRoomData {
  id: string;
  name: string;
  size: string;
  capacity: string;
  price: string;
  featureKeys: string[];
  images: string[];
  descriptionKey: string;
  specialFeatureKey: string;
}

export interface CoworkingTariffData {
  name: string;
  schedule: string;
  price: string;
  description: string;
  featureKeys: string[];
}

/**
 * Fetch offices from Strapi and transform to page format
 */
export async function fetchOfficesData(locale: string = 'ru'): Promise<OfficeData[]> {
  try {
    console.log('Fetching offices from Strapi for locale:', locale);
    const response = await getOffices(locale);
    
    console.log('Strapi response:', JSON.stringify(response, null, 2));
    
    if (!response.data || !Array.isArray(response.data)) {
      console.log('No data or not an array:', response);
      return [];
    }

    const offices = response.data.map((office: any) => {
      // Strapi v5 uses flat structure (no attributes wrapper)
      const data = office.attributes || office;
      
      return {
        id: data.slug || office.documentId || `office-${office.id}`,
        name: data.name || 'Unnamed Office',
        size: data.size || '',
        capacity: data.capacity || '',
        price: data.price || '',
        featureKeys: data.features || [],
        images: (data.images || []).map((img: any) => {
          // Handle both Strapi v4 and v5 image formats
          if (img.url) {
            return img.url.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${img.url}`;
          }
          if (img.attributes?.url) {
            const url = img.attributes.url;
            return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`;
          }
          return '';
        }).filter(Boolean),
      };
    });
    
    console.log('Transformed offices:', offices);
    return offices;
  } catch (error) {
    console.error('Error fetching offices from Strapi:', error);
    return [];
  }
}

/**
 * Fetch meeting rooms from Strapi and transform to page format
 */
export async function fetchMeetingRoomsData(locale: string = 'ru'): Promise<MeetingRoomData[]> {
  try {
    const response = await getMeetingRooms(locale);
    
    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((room: any) => ({
      id: room.attributes.slug,
      name: room.attributes.name,
      size: room.attributes.size,
      capacity: room.attributes.capacity,
      price: room.attributes.price,
      featureKeys: room.attributes.features || [],
      images: room.attributes.images?.data?.map((img: any) => 
        getStrapiImageUrl(img)
      ) || [],
      descriptionKey: room.attributes.slug, // Use slug as description key
      specialFeatureKey: room.attributes.slug, // Use slug as special feature key
    }));
  } catch (error) {
    console.error('Error fetching meeting rooms from Strapi:', error);
    return [];
  }
}

/**
 * Fetch coworking tariffs from Strapi
 */
export async function fetchCoworkingTariffsData(locale: string = 'ru'): Promise<CoworkingTariffData[]> {
  try {
    const response = await getCoworkingTariffs(locale);
    
    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }

    return response.data.map((tariff: any) => ({
      name: tariff.attributes.name,
      schedule: tariff.attributes.schedule,
      price: tariff.attributes.price,
      description: tariff.attributes.description,
      featureKeys: tariff.attributes.features || [],
    }));
  } catch (error) {
    console.error('Error fetching coworking tariffs from Strapi:', error);
    return [];
  }
}

/**
 * Fetch coworking images from gallery
 */
export async function fetchCoworkingImages(locale: string = 'ru'): Promise<string[]> {
  try {
    // You can implement this to fetch from gallery-categories
    // For now, return empty array and use fallback images
    return [];
  } catch (error) {
    console.error('Error fetching coworking images from Strapi:', error);
    return [];
  }
}
