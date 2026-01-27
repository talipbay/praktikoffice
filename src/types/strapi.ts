// Strapi Image Format
export interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
  size: number;
  ext: string;
  mime: string;
}

// Strapi Image
export interface StrapiImage {
  id: number;
  attributes: {
    name: string;
    alternativeText: string | null;
    caption: string | null;
    width: number;
    height: number;
    formats: {
      thumbnail?: StrapiImageFormat;
      small?: StrapiImageFormat;
      medium?: StrapiImageFormat;
      large?: StrapiImageFormat;
    };
    url: string;
  };
}

// Gallery Category
export interface GalleryCategory {
  id: number;
  attributes: {
    name: string;
    slug: string;
    font: string;
    order: number;
    images: {
      data: StrapiImage[];
    };
  };
}

// Office
export interface Office {
  id: number;
  attributes: {
    name: string;
    slug: string;
    size: string;
    capacity: string;
    price: string;
    description: string;
    features: string[];
    isAvailable: boolean;
    images: {
      data: StrapiImage[];
    };
  };
}

// Meeting Room
export interface MeetingRoom {
  id: number;
  attributes: {
    name: string;
    slug: string;
    size: string;
    capacity: string;
    price: string;
    description: string;
    workingHours: string;
    specialFeature: string;
    features: string[];
    isAvailable: boolean;
    images: {
      data: StrapiImage[];
    };
  };
}

// Coworking Tariff
export interface CoworkingTariff {
  id: number;
  attributes: {
    name: string;
    slug: string;
    schedule: string;
    price: string;
    description: string;
    features: string[];
    isActive: boolean;
  };
}

// Amenity
export interface Amenity {
  id: number;
  attributes: {
    name: string;
    slug: string;
    iconName: string;
    order: number;
    isActive: boolean;
  };
}

// About Section
export interface AboutSection {
  id: number;
  attributes: {
    mainHeading: string;
    firstColumnText: string;
    secondColumnText: string;
    features: Array<{
      text: string;
      gradientColors: string[];
      textColor: string;
    }>;
  };
}

// Hero Section
export interface HeroSection {
  id: number;
  attributes: {
    mainText: string;
    italicText: string;
    heroImage: {
      data: StrapiImage;
    };
  };
}
