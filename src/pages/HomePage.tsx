import { ArrowRight, MapPin, Calendar, MessageSquare, CheckCircle, ExternalLink } from 'lucide-react';
import {
  GENERATED_IMAGES,
  GalleryItem,
  OwnerReview,
  SalonConfig,
  ServiceCategory,
  ServiceItem,
} from '../lib/salonLogic';
import { SafeImage } from '../components/SafeImage';

interface HomePageProps {
  config: SalonConfig;
  services: ServiceItem[];
  gallery: GalleryItem[];
  reviews: OwnerReview[];
  onNavigate: (path: string) => void;
}

const FEATURED_CATEGORIES: {
  category: ServiceCategory;
  summary: string;
  imageUrl: string;
  alt: string;
}[] = [
  {
    category: 'Hair Care',
    summary: 'Haircuts, trimming, styling, hair repair treatments, straightening, and spa consultations.',
    imageUrl: GENERATED_IMAGES.hairCare,
    alt: 'Illustrative hair care and styling setup at a beauty parlour',
  },
  {
    category: 'Beauty & Skin Care',
    summary: 'Facials, gentle skin-care treatments, and personalized beauty sessions suited to your skin.',
    imageUrl: GENERATED_IMAGES.skinCare,
    alt: 'Illustrative facial and skincare ritual with ivory linen towels',
  },
  {
    category: 'Grooming',
    summary: 'Eyebrow threading, relaxing head massage, manicure, and pedicure care.',
    imageUrl: GENERATED_IMAGES.groomingSpa,
    alt: 'Illustrative salon manicure and grooming station',
  },
];

export function HomePage({
  config,
  services,
  gallery,
  reviews,
  onNavigate,
}: HomePageProps) {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const previewGallery = gallery.slice(0, 4);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative min-h-[540px] lg:min-h-[620px] flex items-center overflow-hidden bg-[#23191E]">
        <img
          src={GENERATED_IMAGES.heroInterior}
          alt="Illustrative warm beauty salon interior at Eve’s Beauty Parlour, Tinsukia"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#1F151A]/90 via-[#1F151A]/68 to-[#1F151A]/25"
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
          <div className="max-w-2xl space-y-6">
            <p className="text-xs sm:text-sm font-medium tracking-[0.14em] uppercase text-[#E7D9C4]">
              Chinapatty · Makum Road · Tinsukia, Assam
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold text-[#FAF7F2] leading-[1.08] tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Your Beauty, Your Confidence, Our Care.
            </h1>
            <p className="text-base sm:text-lg text-[#EDE4DC] leading-relaxed max-w-xl">
              Discover beauty and grooming services in a welcoming salon environment at Eve’s Beauty Parlour, Tinsukia.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="/book"
                onClick={(e) => handleNav(e, '/book')}
                className="inline-flex items-center justify-center gap-2 min-h-[46px] px-6 py-3 rounded-lg bg-[#FAF7F2] text-[#4A1D2F] text-sm font-semibold hover:bg-[#E7D9C4] transition-colors whitespace-nowrap shrink-0"
              >
                <span>Book an Appointment</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="/services"
                onClick={(e) => handleNav(e, '/services')}
                className="inline-flex items-center justify-center min-h-[46px] px-6 py-3 rounded-lg border border-[#E7D9C4]/70 text-[#FAF7F2] text-sm font-medium hover:bg-[#FAF7F2]/10 transition-colors whitespace-nowrap shrink-0"
              >
                Explore Our Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Short Salon Introduction */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
                Beauty Parlour in Tinsukia
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F] leading-tight">
                Welcoming Beauty &amp; Grooming Care on Makum Road
              </h2>
              <p className="text-base text-[#2B2729] leading-relaxed max-w-2xl">
                {config.aboutIntro}
              </p>
              <div className="pt-2">
                <a
                  href="/about"
                  onClick={(e) => handleNav(e, '/about')}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A1D2F] hover:text-[#381423] underline underline-offset-4"
                >
                  <span>Read more about our salon</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-6 sm:p-8 space-y-4">
              <h3 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                Visit Us in Chinapatty
              </h3>
              <p className="text-sm text-[#5E5659] leading-relaxed">
                Conveniently situated for hair and beauty services in Tinsukia along Makum Road.
              </p>
              <div className="space-y-2.5 text-sm text-[#2B2729] pt-1">
                <p>
                  <span className="font-medium">Address:</span> {config.address}
                </p>
                <p>
                  <span className="font-medium">Hours:</span>{' '}
                  {config.hoursConfirmed && config.openingHours
                    ? config.openingHours
                    : 'To be confirmed with the salon'}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{' '}
                  <span className="tabular-nums">{config.phoneNumber}</span>{' '}
                  {!config.phoneConfirmed && (
                    <span className="text-xs text-[#5E5659]">(Provisional listing)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Service Categories */}
      <section className="py-16 sm:py-20 bg-[#F3EDE4] border-y border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
                Draft Service Categories
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F]">
                Hair, Skin &amp; Grooming Services
              </h2>
              <p className="text-sm sm:text-base text-[#5E5659]">
                Explore our draft beauty menu below. Specific availability and pricing are confirmed directly with the salon team.
              </p>
            </div>
            <a
              href="/services"
              onClick={(e) => handleNav(e, '/services')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A1D2F] hover:text-[#381423] whitespace-nowrap shrink-0"
            >
              <span>View full service menu ({services.length})</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {FEATURED_CATEGORIES.map((cat) => (
              <article
                key={cat.category}
                className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl overflow-hidden flex flex-col"
              >
                <SafeImage
                  src={cat.imageUrl}
                  alt={cat.alt}
                  containerClassName="aspect-[4/3] w-full"
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                      {cat.category}
                    </h3>
                    <p className="text-sm text-[#5E5659] leading-relaxed">{cat.summary}</p>
                  </div>
                  <div className="pt-2 border-t border-[#E4DAD0] flex items-center justify-between">
                    <span className="text-xs text-[#5E5659]">Contact for Pricing</span>
                    <a
                      href={`/services?category=${encodeURIComponent(cat.category)}`}
                      onClick={(e) =>
                        handleNav(e, `/services?category=${encodeURIComponent(cat.category)}`)
                      }
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4A1D2F] hover:text-[#381423]"
                    >
                      <span>Browse</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Conditional Highlighted Bridal & Special Occasion Section (only shown when confirmed by owner) */}
      {config.bridalConfirmed && (
        <section className="py-16 sm:py-20 bg-[#FAF7F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl overflow-hidden">
              <div className="lg:col-span-5">
                <SafeImage
                  src={GENERATED_IMAGES.bridalLook}
                  alt="Illustrative bridal portrait in warm natural lighting"
                  containerClassName="h-full min-h-[320px] w-full"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center space-y-5">
                <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
                  Bridal &amp; Special Occasion
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F] leading-tight">
                  Make Your Special Moments Even More Beautiful.
                </h2>
                <p className="text-base text-[#2B2729] leading-relaxed">
                  Planning a wedding, reception, or festive gathering in Tinsukia? Schedule an advance consultation to discuss bridal, party makeup, and occasion styling requirements.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <a
                    href="/bridal"
                    onClick={(e) => handleNav(e, '/bridal')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] transition-colors"
                  >
                    <span>Explore Bridal Enquiries</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <a
                    href="/book?service=Bridal%20Makeup"
                    onClick={(e) => handleNav(e, '/book?service=Bridal%20Makeup')}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg border border-[#C69C8E] text-[#4A1D2F] text-sm font-medium hover:bg-[#FAF7F2] transition-colors"
                  >
                    Request Bridal Consultation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. Curated Gallery Preview */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
                Visual Preview
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F]">
                Inside the Salon &amp; Inspiration Gallery
              </h2>
              <p className="text-sm text-[#5E5659]">
                Editorial placeholder previews — easily replaceable with actual Eve’s Beauty Parlour photography by the owner.
              </p>
            </div>
            <a
              href="/gallery"
              onClick={(e) => handleNav(e, '/gallery')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#4A1D2F] hover:text-[#381423] whitespace-nowrap shrink-0"
            >
              <span>Open Full Gallery</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {previewGallery.map((item) => (
              <a
                key={item.id}
                href="/gallery"
                onClick={(e) => handleNav(e, '/gallery')}
                className="group block bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl overflow-hidden"
              >
                <SafeImage
                  src={item.imageUrl}
                  alt={item.altText}
                  containerClassName="aspect-[4/3] w-full"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="p-4 space-y-1">
                  <p className="text-xs text-[#8A5A4D] font-medium">{item.category}</p>
                  <h3 className="text-sm font-medium text-[#2B2729] truncate">{item.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Simple "How to Book" Section */}
      <section className="py-16 sm:py-20 bg-[#F3EDE4] border-y border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
              Simple Request Process
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F]">
              How to Book an Appointment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between text-[#8A5A4D]">
                <span className="font-display text-2xl font-semibold tabular-nums">01</span>
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#4A1D2F]">
                Choose Your Service
              </h3>
              <p className="text-sm text-[#5E5659] leading-relaxed">
                Browse hair care, skincare, grooming, or occasion enquiries and select what you are interested in.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between text-[#8A5A4D]">
                <span className="font-display text-2xl font-semibold tabular-nums">02</span>
                <Calendar className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#4A1D2F]">
                Send Your Preferred Date
              </h3>
              <p className="text-sm text-[#5E5659] leading-relaxed">
                Submit your name, mobile number, and preferred time window via our quick online enquiry form.
              </p>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between text-[#8A5A4D]">
                <span className="font-display text-2xl font-semibold tabular-nums">03</span>
                <CheckCircle className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#4A1D2F]">
                Await Salon Confirmation
              </h3>
              <p className="text-sm text-[#5E5659] leading-relaxed">
                Our team reviews availability and contacts you directly to confirm your appointment slot and pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Reviews & Trust (strictly honest — never fabricated) */}
      <section className="py-16 sm:py-20 bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
                Customer Trust
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F]">
                Verified Customer Words
              </h2>
            </div>
            {config.googleBusinessProfileUrl && (
              <a
                href={config.googleBusinessProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#C69C8E] text-sm font-medium text-[#4A1D2F] hover:bg-[#F3EDE4] transition-colors whitespace-nowrap shrink-0"
              >
                <span>View Google Business Profile</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <blockquote
                  key={rev.id}
                  className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-6 space-y-4"
                >
                  <p className="text-sm text-[#2B2729] leading-relaxed">“{rev.quote}”</p>
                  <footer className="text-xs text-[#5E5659] pt-2 border-t border-[#E4DAD0]">
                    <span className="font-semibold text-[#4A1D2F]">{rev.authorName}</span>
                    {rev.serviceNote && <span> · {rev.serviceNote}</span>}
                    {rev.dateLabel && <span> · {rev.dateLabel}</span>}
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <div className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <h3 className="font-display text-xl font-semibold text-[#4A1D2F]">
                  Genuine Reviews Added Only Upon Owner Approval
                </h3>
                <p className="text-sm text-[#5E5659] leading-relaxed">
                  To uphold complete authenticity, we never display generated ratings or placeholder testimonials. Verified client feedback will appear here once supplied by Eve’s Beauty Parlour.
                </p>
              </div>
              <a
                href="/contact"
                onClick={(e) => handleNav(e, '/contact')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#FAF7F2] border border-[#D8CDC3] text-sm font-medium text-[#4A1D2F] hover:bg-white transition-colors whitespace-nowrap shrink-0"
              >
                <span>Contact the Salon</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </section>

      {/* 8. Location Preview with Google Maps */}
      <section className="py-16 sm:py-20 bg-[#F3EDE4] border-t border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
                Find Us in Tinsukia
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F]">
                Beauty Parlour near Chinapatty, Makum Road
              </h2>
              <div className="flex items-start gap-2.5 text-sm sm:text-base text-[#2B2729]">
                <MapPin className="w-5 h-5 text-[#4A1D2F] shrink-0 mt-0.5" aria-hidden="true" />
                <span>{config.address}</span>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={config.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] transition-colors"
                >
                  <span>Get Directions on Google Maps</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
                <a
                  href="/book"
                  onClick={(e) => handleNav(e, '/book')}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg border border-[#C69C8E] text-[#4A1D2F] text-sm font-medium hover:bg-[#FAF7F2] transition-colors"
                >
                  Book an Appointment
                </a>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl overflow-hidden shadow-sm">
              <iframe
                title="Google Maps location for Eve’s Beauty Parlour in Chinapatty, Tinsukia"
                src="https://maps.google.com/maps?q=Eve%27s%20Beauty%20Parlour%2C%20Chinapatty%2C%20Makum%20Road%2C%20Tinsukia%2C%20Assam%2C%20India&t=&z=15&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                className="w-full h-72 sm:h-80 border-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final Appointment Call-to-Action */}
      <section className="py-16 sm:py-20 bg-[#4A1D2F] text-[#FAF7F2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">
            Ready to Plan Your Next Salon Visit in Tinsukia?
          </h2>
          <p className="text-sm sm:text-base text-[#E7D9C4] max-w-xl mx-auto leading-relaxed">
            Send an appointment request online and our team will contact you directly to confirm timing and service details.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <a
              href="/book"
              onClick={(e) => handleNav(e, '/book')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FAF7F2] text-[#4A1D2F] text-sm font-semibold hover:bg-[#E7D9C4] transition-colors"
            >
              <span>Request an Appointment</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <a
              href="/contact"
              onClick={(e) => handleNav(e, '/contact')}
              className="inline-flex items-center px-6 py-3 rounded-lg border border-[#E7D9C4]/60 text-[#FAF7F2] text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Contact Details
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
