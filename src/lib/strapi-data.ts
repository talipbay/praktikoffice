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
      
      // Get images
      const images = (data.images || []).map((img: any) => {
        // Handle both Strapi v4 and v5 image formats
        if (img.url) {
          return img.url.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${img.url}`;
        }
        if (img.attributes?.url) {
          const url = img.attributes.url;
          return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`;
        }
        return '';
      }).filter(Boolean);
      
      // Use fallback images if none provided
      const finalImages = images.length > 0 ? images : [
        "/gallery/offices/office-1.webp",
        "/gallery/offices/office-2.webp",
        "/gallery/offices/office-3.webp",
      ];
      
      return {
        id: data.slug || office.documentId || `office-${office.id}`,
        name: data.name || 'Unnamed Office',
        size: data.size || '',
        capacity: data.capacity || '',
        price: data.price || '',
        featureKeys: data.features || [],
        images: finalImages,
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
    console.log('Fetching meeting rooms from Strapi for locale:', locale);
    const response = await getMeetingRooms(locale);
    
    console.log('Strapi meeting rooms response:', JSON.stringify(response, null, 2));
    
    if (!response.data || !Array.isArray(response.data)) {
      console.log('No meeting room data or not an array:', response);
      return [];
    }

    const rooms = response.data.map((room: any) => {
      // Strapi v5 uses flat structure (no attributes wrapper)
      const data = room.attributes || room;
      
      // Get images
      const images = (data.images || []).map((img: any) => {
        if (img.url) {
          return img.url.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${img.url}`;
        }
        if (img.attributes?.url) {
          const url = img.attributes.url;
          return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`;
        }
        return '';
      }).filter(Boolean);
      
      // Use fallback images if none provided
      const finalImages = images.length > 0 ? images : [
        "/gallery/meeting/meeting-1.webp",
        "/gallery/meeting/meeting-2.webp",
        "/gallery/meeting/meeting-3.webp",
      ];
      
      return {
        id: data.slug || room.documentId || `meeting-${room.id}`,
        name: data.name || 'Unnamed Room',
        size: data.size || '',
        capacity: data.capacity || '',
        price: data.price || '',
        featureKeys: data.features || [],
        images: finalImages,
        descriptionKey: data.slug || room.documentId || `meeting-${room.id}`,
        specialFeatureKey: data.slug || room.documentId || `meeting-${room.id}`,
      };
    });
    
    console.log('Transformed meeting rooms:', rooms);
    return rooms;
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
    console.log('Fetching coworking tariffs from Strapi for locale:', locale);
    const response = await getCoworkingTariffs(locale);
    
    console.log('Strapi coworking tariffs response:', JSON.stringify(response, null, 2));
    
    if (!response.data || !Array.isArray(response.data)) {
      console.log('No coworking tariff data or not an array:', response);
      return [];
    }

    const tariffs = response.data.map((tariff: any) => {
      // Strapi v5 uses flat structure (no attributes wrapper)
      const data = tariff.attributes || tariff;
      
      return {
        name: data.name || 'Unnamed Tariff',
        schedule: data.schedule || '',
        price: data.price || '',
        description: typeof data.description === 'string' 
          ? data.description 
          : (Array.isArray(data.description) && data.description.length > 0 && data.description[0].children?.[0]?.text)
            ? data.description[0].children[0].text
            : '',
        featureKeys: data.features || [],
      };
    });
    
    console.log('Transformed coworking tariffs:', tariffs);
    return tariffs;
  } catch (error) {
    console.error('Error fetching coworking tariffs from Strapi:', error);
    return [];
  }
}

/**
 * Fetch coworking images from Strapi
 */
export async function fetchCoworkingImages(locale: string = 'ru'): Promise<string[]> {
  try {
    console.log('Fetching coworking images from Strapi for locale:', locale);
    const response = await getCoworkingTariffs(locale);
    
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      console.log('No coworking data for images');
      return [];
    }

    // Get images from the first tariff
    const data = response.data[0].attributes || response.data[0];
    const images = (data.images || []).map((img: any) => {
      if (img.url) {
        return img.url.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${img.url}`;
      }
      if (img.attributes?.url) {
        const url = img.attributes.url;
        return url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${url}`;
      }
      return '';
    }).filter(Boolean);
    
    console.log('Coworking images:', images);
    return images;
  } catch (error) {
    console.error('Error fetching coworking images from Strapi:', error);
    return [];
  }
}
