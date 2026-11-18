export type ServiceCategory =
  | 'Hair Care'
  | 'Beauty & Skin Care'
  | 'Grooming'
  | 'Bridal & Special Occasion';

export type GalleryCategory =
  | 'Hair Styling'
  | 'Hair Treatments'
  | 'Beauty Services'
  | 'Bridal Looks'
  | 'Salon Interior';

export type EnquiryStatus =
  | 'Pending Salon Confirmation'
  | 'Contacted'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled';

export interface SalonConfig {
  businessName: string;
  category: string;
  address: string;
  phoneNumber: string;
  phoneConfirmed: boolean;
  openingHours: string;
  hoursConfirmed: boolean;
  bridalConfirmed: boolean;
  googleMapsUrl: string;
  googleBusinessProfileUrl: string;
  ashrafWebsiteUrl: string;
  whatsappPrefillMessage: string;
  aboutIntro: string;
  careApproach: string;
  consultationNote: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  priceLabel: string;
  imageUrl: string;
  imageAlt: string;
  isConfirmedByOwner: boolean;
  isPlaceholderImage: boolean;
}

export interface ServicePackage {
  id: string;
  name: string;
  category: 'Bridal & Special Occasion' | 'General Care';
  description: string;
  priceLabel: string;
  isConfirmedByOwner: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  altText: string;
  isSalonSupplied: boolean;
}

export interface OwnerReview {
  id: string;
  authorName: string;
  serviceNote: string;
  quote: string;
  dateLabel: string;
  isApproved: boolean;
}

export interface AppointmentEnquiryInput {
  customerName: string;
  mobileNumber: string;
  serviceRequired: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  privacyConsent: boolean;
}

export interface AppointmentEnquiry extends AppointmentEnquiryInput {
  id: string;
  status: EnquiryStatus;
  ownerNotes: string;
  createdAt: string;
}

export interface SalonDataStore {
  config: SalonConfig;
  services: ServiceItem[];
  packages: ServicePackage[];
  gallery: GalleryItem[];
  reviews: OwnerReview[];
  enquiries: AppointmentEnquiry[];
}

export const GENERATED_IMAGES = {
  heroInterior: '/src/assets/images/salon_hero_interior_1794989834459.jpg',
  hairCare: '/src/assets/images/hair_care_styling_1794989835117.jpg',
  skinCare: '/src/assets/images/skincare_facial_ritual_1794989834377.jpg',
  groomingSpa: '/src/assets/images/grooming_manicure_spa_1794989835651.jpg',
  bridalLook: '/src/assets/images/bridal_occasion_look_1794989835278.jpg',
} as const;

export const DEFAULT_SALON_DATA: SalonDataStore = {
  config: {
    businessName: 'Eve’s Beauty Parlour',
    category: 'Beauty Parlour / Beauty Salon',
    address: 'Chinapatty, Makum Road, Tinsukia, Assam, India',
    phoneNumber: '+91 94353 35087',
    phoneConfirmed: false,
    openingHours: '',
    hoursConfirmed: false,
    bridalConfirmed: false,
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Eve%27s+Beauty+Parlour%2C+Chinapatty%2C+Makum+Road%2C+Tinsukia%2C+Assam%2C+India',
    googleBusinessProfileUrl: '',
    ashrafWebsiteUrl: '[ASHRAF_WEBSITE_URL]',
    whatsappPrefillMessage:
      'Hello Eve’s Beauty Parlour, I would like to enquire about your services and appointment availability. Please share the details.',
    aboutIntro:
      'Eve’s Beauty Parlour is a local beauty salon located in Chinapatty, Makum Road, Tinsukia. Our aim is to provide a welcoming place where customers can explore beauty and grooming services and choose treatments suited to their preferences.',
    careApproach:
      'Every visit begins with attentive listening. We focus on unhurried personal care, clean salon hygiene, and gentle service suited to your hair texture, skin comfort, and occasion timeline.',
    consultationNote:
      'Not sure which treatment fits best? Send an appointment enquiry or speak with the salon team beforehand to discuss service availability, suitability, and pricing.',
  },
  services: [
    {
      id: 'srv-haircut',
      name: 'Haircut and Trimming',
      category: 'Hair Care',
      description:
        'Tailored trimming, shaping, and everyday hair maintenance styled to suit your comfort and hair length.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.hairCare,
      imageAlt: 'Illustrative salon hair care and wooden styling combs on a light stone counter',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-hair-styling',
      name: 'Hair Styling',
      category: 'Hair Care',
      description:
        'Blow-dries, soft waves, and neat styling options for daily wear, family gatherings, and local celebrations.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.hairCare,
      imageAlt: 'Illustrative soft waves and hair styling setup in a bright salon interior',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-hair-repair',
      name: 'Hair Treatments & Hair Repair',
      category: 'Hair Care',
      description:
        'Nourishing hair care sessions focused on softness, manageability, and dryness care.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.hairCare,
      imageAlt: 'Illustrative ceramic bowls and gentle hair treatment tools in a salon',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-straightening',
      name: 'Hair Straightening or Rebonding',
      category: 'Hair Care',
      description:
        'Smoothing and straightening consultations planned around your hair condition and maintenance routine.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.hairCare,
      imageAlt: 'Illustrative smooth hair styling preparation at a salon station',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-hair-spa',
      name: 'Hair Spa (Subject to Availability)',
      category: 'Hair Care',
      description:
        'Relaxing scalp and hair conditioning ritual, subject to confirmation by the salon team.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.hairCare,
      imageAlt: 'Illustrative calming hair spa bowls and linen towels',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-facial',
      name: 'Facial Services',
      category: 'Beauty & Skin Care',
      description:
        'Gentle facial cleansing and soothing care tailored to your skin type and personal preference.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.skinCare,
      imageAlt: 'Illustrative facial skincare setup with warm ivory towels and glass bottles',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-skincare',
      name: 'Skin-Care Treatments',
      category: 'Beauty & Skin Care',
      description:
        'Personalized skin-care sessions designed to refresh and maintain healthy-feeling skin.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.skinCare,
      imageAlt: 'Illustrative botanical skin-care treatment bottles on travertine stone',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-antitan',
      name: 'Anti-Tan Treatments (Subject to Availability)',
      category: 'Beauty & Skin Care',
      description:
        'Soothing brightening care to address sun exposure, available upon salon confirmation.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.skinCare,
      imageAlt: 'Illustrative skincare ritual with jade roller and folded towels',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-other-beauty',
      name: 'Custom Beauty Treatments',
      category: 'Beauty & Skin Care',
      description:
        'Additional beauty services available upon consultation and confirmation with the salon.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.skinCare,
      imageAlt: 'Illustrative warm salon skincare station by natural window light',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-threading',
      name: 'Eyebrow Threading',
      category: 'Grooming',
      description:
        'Clean, careful shaping to frame your natural features with comfort and precision.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.groomingSpa,
      imageAlt: 'Illustrative calm beauty grooming station in champagne and beige tones',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-head-massage',
      name: 'Head Massage',
      category: 'Grooming',
      description:
        'Restorative head massage to help ease everyday tension in a quiet salon setting.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.groomingSpa,
      imageAlt: 'Illustrative natural botanical oils and folded cotton towels for relaxation',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-manicure',
      name: 'Manicure',
      category: 'Grooming',
      description:
        'Hand soaking, nail shaping, cuticle care, and neat finishing for clean, well-kept hands.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.groomingSpa,
      imageAlt: 'Illustrative ceramic manicure soaking bowl with botanicals and towels',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-pedicure',
      name: 'Pedicure',
      category: 'Grooming',
      description:
        'Relaxing foot care, gentle exfoliation, and nail grooming for everyday comfort.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.groomingSpa,
      imageAlt: 'Illustrative pedicure and nail care station with warm neutral linens',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-bridal-makeup',
      name: 'Bridal Makeup (Subject to Confirmation)',
      category: 'Bridal & Special Occasion',
      description:
        'Bespoke bridal beauty preparation arranged through an advance consultation with the salon.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.bridalLook,
      imageAlt: 'Illustrative Indian bridal beauty portrait in deep burgundy silk saree',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-party-makeup',
      name: 'Party Makeup (Subject to Confirmation)',
      category: 'Bridal & Special Occasion',
      description:
        'Refined makeup styling for receptions, family celebrations, and festive evenings.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.bridalLook,
      imageAlt: 'Illustrative special occasion makeup and floral hair styling',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-occasion-styling',
      name: 'Occasion-Ready Styling (Subject to Confirmation)',
      category: 'Bridal & Special Occasion',
      description:
        'Coordinated hair pinning, draping support, and finishing touches tailored to your event schedule.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.bridalLook,
      imageAlt: 'Illustrative occasion hair styling with fresh jasmine flowers',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
    {
      id: 'srv-special-event',
      name: 'Special Event Beauty Services (Subject to Confirmation)',
      category: 'Bridal & Special Occasion',
      description:
        'Pre-event grooming and beauty preparations planned around your special dates in Tinsukia.',
      priceLabel: 'Contact for Pricing',
      imageUrl: GENERATED_IMAGES.bridalLook,
      imageAlt: 'Illustrative special event beauty look in warm natural light',
      isConfirmedByOwner: false,
      isPlaceholderImage: true,
    },
  ],
  packages: [],
  gallery: [
    {
      id: 'gal-interior-1',
      title: 'Warm Salon Sanctuary (Illustrative Placeholder)',
      category: 'Salon Interior',
      imageUrl: GENERATED_IMAGES.heroInterior,
      altText: 'Illustrative sunlit beauty salon interior with arched mirrors and champagne upholstered chairs',
      isSalonSupplied: false,
    },
    {
      id: 'gal-hair-1',
      title: 'Soft Waves & Hair Care (Illustrative Placeholder)',
      category: 'Hair Styling',
      imageUrl: GENERATED_IMAGES.hairCare,
      altText: 'Illustrative styled waves and wooden grooming combs on a warm stone counter',
      isSalonSupplied: false,
    },
    {
      id: 'gal-treatment-1',
      title: 'Nourishing Hair Rituals (Illustrative Placeholder)',
      category: 'Hair Treatments',
      imageUrl: GENERATED_IMAGES.hairCare,
      altText: 'Illustrative ceramic hair treatment bowls and gentle application brush',
      isSalonSupplied: false,
    },
    {
      id: 'gal-beauty-1',
      title: 'Botanical Skin Care Setup (Illustrative Placeholder)',
      category: 'Beauty Services',
      imageUrl: GENERATED_IMAGES.skinCare,
      altText: 'Illustrative facial skincare setup with linen towels, jade roller, and amber bottles',
      isSalonSupplied: false,
    },
    {
      id: 'gal-grooming-1',
      title: 'Calm Manicure & Hand Care (Illustrative Placeholder)',
      category: 'Beauty Services',
      imageUrl: GENERATED_IMAGES.groomingSpa,
      altText: 'Illustrative manicure ceramic soaking bowl with rose petals and botanical oils',
      isSalonSupplied: false,
    },
    {
      id: 'gal-bridal-1',
      title: 'Traditional Bridal Inspiration (Illustrative Placeholder)',
      category: 'Bridal Looks',
      imageUrl: GENERATED_IMAGES.bridalLook,
      altText: 'Illustrative Indian bridal portrait with deep burgundy saree and jasmine floral bun',
      isSalonSupplied: false,
    },
  ],
  reviews: [],
  enquiries: [],
};

export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

export interface EnquiryValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof AppointmentEnquiryInput, string>>;
}

export function validateEnquiryInput(
  input: Partial<AppointmentEnquiryInput>,
  referenceDate = new Date()
): EnquiryValidationResult {
  const errors: Partial<Record<keyof AppointmentEnquiryInput, string>> = {};

  const name = sanitizeText(input.customerName, 120);
  if (!name || name.length < 2) {
    errors.customerName = 'Please enter your full name (at least 2 characters).';
  }

  const rawMobile = sanitizeText(input.mobileNumber, 30);
  const digitsOnly = rawMobile.replace(/\D/g, '');
  if (!rawMobile) {
    errors.mobileNumber = 'Please enter a valid mobile number so the salon can contact you.';
  } else if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    errors.mobileNumber = 'Please enter a valid 10 to 15 digit phone number.';
  }

  const serviceRequired = sanitizeText(input.serviceRequired, 160);
  if (!serviceRequired) {
    errors.serviceRequired = 'Please select the service you would like to enquire about.';
  }

  const preferredDate = sanitizeText(input.preferredDate, 20);
  if (!preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(preferredDate)) {
    errors.preferredDate = 'Please choose a preferred appointment date.';
  } else {
    const todayStr = referenceDate.toISOString().slice(0, 10);
    if (preferredDate < todayStr) {
      errors.preferredDate = 'Please select today or an upcoming date.';
    }
  }

  const preferredTime = sanitizeText(input.preferredTime, 40);
  if (!preferredTime) {
    errors.preferredTime = 'Please choose a preferred time window.';
  }

  if (input.privacyConsent !== true) {
    errors.privacyConsent =
      'Please agree to the privacy consent notice so we can forward your enquiry to the salon.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppUrl(
  phoneNumber: string,
  message: string,
  phoneConfirmed = true
): string | null {
  if (!phoneConfirmed) return null;
  const digits = phoneNumber.replace(/\D/g, '');
  if (!digits) return null;
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function buildProvisionalWhatsAppUrl(phoneNumber: string, message: string): string {
  const digits = phoneNumber.replace(/\D/g, '');
  const encoded = encodeURIComponent(message.trim());
  return `https://wa.me/${digits}?text=${encoded}`;
}

export function buildTelUrl(phoneNumber: string): string {
  const cleaned = normalizePhoneDigits(phoneNumber);
  return `tel:${cleaned}`;
}

export function filterServices(
  services: ServiceItem[],
  category: ServiceCategory | 'All',
  searchQuery = ''
): ServiceItem[] {
  const q = searchQuery.trim().toLowerCase();
  return services.filter((item) => {
    const matchesCategory = category === 'All' || item.category === category;
    if (!matchesCategory) return false;
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });
}

export function filterGallery(
  items: GalleryItem[],
  category: GalleryCategory | 'All'
): GalleryItem[] {
  if (category === 'All') return items;
  return items.filter((item) => item.category === category);
}

export function getExternalHref(urlPlaceholderOrUrl: string): string | null {
  const trimmed = urlPlaceholderOrUrl.trim();
  if (!trimmed || trimmed === '[ASHRAF_WEBSITE_URL]') {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}
