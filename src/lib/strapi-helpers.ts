import { StrapiImage } from '@/types/strapi';

/**
 * Get the full URL for a Strapi image
 */
export function getStrapiImageUrl(image: StrapiImage | null | undefined): string {
  if (!image?.attributes?.url) return '';
  
  const url = image.attributes.url;
  
  // If URL is already absolute, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, prepend Strapi URL
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
  return `${strapiUrl}${url}`;
}

/**
 * Get the alt text for a Strapi image
 */
export function getStrapiImageAlt(image: StrapiImage | null | undefined, fallback = ''): string {
  return image?.attributes?.alternativeText || image?.attributes?.name || fallback;
}

/**
 * Transform Strapi image array to simple URL array
 */
export function transformStrapiImages(images: { data: StrapiImage[] } | undefined): string[] {
  if (!images?.data) return [];
  return images.data.map(img => getStrapiImageUrl(img));
}

/**
 * Check if we should use Strapi data (based on env variable)
 */
export function useStrapiData(): boolean {
  return !!process.env.NEXT_PUBLIC_STRAPI_URL && process.env.NEXT_PUBLIC_STRAPI_URL !== '';
}
