export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Praktik Office",
  alternateName: "PraktikOffice",
  url: "https://praktikoffice.kz",
  logo: "https://praktikoffice.kz/praktik_logo_dark.png",
  description:
    "Сервисные офисы класса А в Астане с форматом «всё включено». Аренда офисов, коворкинг, переговорные комнаты.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Астана",
    addressCountry: "KZ",
  },
  sameAs: [
    // Add your social media links here when available
  ],
};

export const officeRentalSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Аренда офисов класса А",
  description:
    "Индивидуальные офисы для команд от 4 до 12 человек с современной мебелью и всем необходимым оборудованием",
  brand: {
    "@type": "Brand",
    name: "Praktik Office",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "1800",
    highPrice: "6000",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "1800",
      priceCurrency: "USD",
      unitText: "MONTH",
    },
  },
};

export const coworkingSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Коворкинг Тариф Номад",
  description:
    "Полный дневной доступ к коворкинг-пространству с максимальным набором услуг",
  brand: {
    "@type": "Brand",
    name: "Praktik Office",
  },
  offers: {
    "@type": "Offer",
    price: "15000",
    priceCurrency: "KZT",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "15000",
      priceCurrency: "KZT",
      unitText: "DAY",
    },
  },
};

export const meetingRoomSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Аренда переговорных комнат",
  description:
    "Современные переговорные комнаты на 6-16 человек с профессиональным оборудованием",
  brand: {
    "@type": "Brand",
    name: "Praktik Office",
  },
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "KZT",
    lowPrice: "12500",
    highPrice: "25000",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "12500",
      priceCurrency: "KZT",
      unitText: "HOUR",
    },
  },
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
