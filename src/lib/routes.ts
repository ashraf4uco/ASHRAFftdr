export interface PageMeta {
  path: string;
  label: string;
  title: string;
  description: string;
}

export const PUBLIC_ROUTES: PageMeta[] = [
  {
    path: '/',
    label: 'Home',
    title: 'Eve’s Beauty Parlour | Beauty Salon in Tinsukia, Assam',
    description:
      'Explore beauty and grooming services at Eve’s Beauty Parlour, located in Chinapatty, Makum Road, Tinsukia, Assam. Contact us to enquire about services and appointments.',
  },
  {
    path: '/about',
    label: 'About Us',
    title: 'About Us | Eve’s Beauty Parlour, Tinsukia',
    description:
      'Learn about Eve’s Beauty Parlour on Makum Road, Chinapatty, Tinsukia — our approach to welcoming customer care and personalized beauty consultations.',
  },
  {
    path: '/services',
    label: 'Our Services',
    title: 'Hair & Beauty Services in Tinsukia | Eve’s Beauty Parlour',
    description:
      'Browse hair care, beauty and skin-care, grooming, and occasion service enquiries at Eve’s Beauty Parlour in Chinapatty, Tinsukia.',
  },
  {
    path: '/bridal',
    label: 'Bridal & Special Occasion',
    title: 'Bridal & Special Occasion Enquiries | Eve’s Beauty Parlour, Tinsukia',
    description:
      'Planning a wedding or celebration in Tinsukia? Enquire with Eve’s Beauty Parlour to discuss bridal and occasion beauty requirements.',
  },
  {
    path: '/gallery',
    label: 'Gallery',
    title: 'Salon Gallery | Eve’s Beauty Parlour, Tinsukia',
    description:
      'View our salon interior and beauty inspiration gallery at Eve’s Beauty Parlour near Chinapatty, Makum Road, Tinsukia.',
  },
  {
    path: '/book',
    label: 'Book an Appointment',
    title: 'Book an Appointment | Eve’s Beauty Parlour, Tinsukia',
    description:
      'Submit an appointment enquiry online for Eve’s Beauty Parlour in Tinsukia, Assam. Our salon team will contact you to confirm availability.',
  },
  {
    path: '/contact',
    label: 'Contact Us',
    title: 'Contact & Directions | Eve’s Beauty Parlour, Tinsukia',
    description:
      'Find Eve’s Beauty Parlour at Chinapatty, Makum Road, Tinsukia, Assam. View Google Maps directions and send an appointment enquiry.',
  },
  {
    path: '/privacy-policy',
    label: 'Privacy Policy',
    title: 'Privacy Policy | Eve’s Beauty Parlour',
    description:
      'Read how Eve’s Beauty Parlour handles appointment enquiry information and how you can request updates or deletion.',
  },
  {
    path: '/terms',
    label: 'Terms & Conditions',
    title: 'Terms & Conditions | Eve’s Beauty Parlour',
    description:
      'Website usage terms and appointment enquiry confirmation policy for Eve’s Beauty Parlour, Tinsukia.',
  },
  {
    path: '/credits',
    label: 'Credits & Copyright',
    title: 'Credits & Copyright | Eve’s Beauty Parlour',
    description:
      'Ownership, content rights, and design & development credits for the Eve’s Beauty Parlour website.',
  },
];

export const OWNER_ROUTE: PageMeta = {
  path: '/owner',
  label: 'Owner Portal',
  title: 'Owner Portal | Eve’s Beauty Parlour',
  description: 'Private management area for Eve’s Beauty Parlour enquiries, services, and salon details.',
};

export function getRouteMeta(pathname: string): PageMeta {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  if (normalized === '/owner') return OWNER_ROUTE;
  return PUBLIC_ROUTES.find((r) => r.path === normalized) || PUBLIC_ROUTES[0];
}
