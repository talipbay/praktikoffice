const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

interface StrapiMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

interface StrapiResponse<T> {
  data: T;
  meta?: StrapiMeta;
}

async function fetchAPI<T>(
  endpoint: string,
  locale?: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN && { Authorization: `Bearer ${STRAPI_TOKEN}` }),
  };

  // Add locale parameter if provided
  const separator = endpoint.includes('?') ? '&' : '?';
  const localeParam = locale ? `${separator}locale=${locale}` : '';
  
  const res = await fetch(`${STRAPI_URL}/api${endpoint}${localeParam}`, {
    headers,
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Strapi API error: ${res.status}`);
  }

  return res.json();
}

// Gallery Categories
export async function getGalleryCategories(locale?: string) {
  return fetchAPI<StrapiResponse<unknown>>('/gallery-categories?populate=*', locale);
}

// Offices
export async function getOffices(locale?: string) {
  return fetchAPI<StrapiResponse<unknown>>('/offices?populate=*', locale);
}

export async function getOfficeBySlug(slug: string, locale?: string) {
  return fetchAPI<StrapiResponse<unknown>>(`/offices?filters[slug][$eq]=${slug}&populate=*`, locale);
}

// Meeting Rooms
export async function getMeetingRooms(locale?: string) {
  return fetchAPI<StrapiResponse<unknown>>('/meeting-rooms?populate=*', locale);
}

export async function getMeetingRoomBySlug(slug: string, locale?: string) {
  return fetchAPI<StrapiResponse<unknown>>(`/meeting-rooms?filters[slug][$eq]=${slug}&populate=*`, locale);
}

// Coworking Tariffs
export async function getCoworkingTariffs(locale?: string) {
  return fetchAPI<StrapiResponse<unknown>>('/coworking-tariffs?populate=*', locale);
}

// Amenities
export async function getAmenities(locale?: string) {
  return fetchAPI<StrapiResponse<unknown>>('/amenities?sort=order:asc', locale);
}

// About Section (Single Type)
export async function getAboutSection(locale?: string) {
  return fetchAPI<StrapiResponse<unknown>>('/about-section?populate=*', locale);
}

// Hero Section (Single Type)
export async function getHeroSection(locale?: string) {
  return fetchAPI<StrapiResponse<unknown>>('/hero-section?populate=*', locale);
}
