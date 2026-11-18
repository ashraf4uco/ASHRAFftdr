import { MessageCircle, ArrowRight } from 'lucide-react';
import {
  GENERATED_IMAGES,
  GalleryItem,
  SalonConfig,
  ServiceItem,
  ServicePackage,
  buildProvisionalWhatsAppUrl,
} from '../lib/salonLogic';
import { SafeImage } from '../components/SafeImage';
import { AppointmentForm } from '../components/AppointmentForm';

interface BridalPageProps {
  config: SalonConfig;
  services: ServiceItem[];
  packages: ServicePackage[];
  gallery: GalleryItem[];
  onNavigate: (path: string) => void;
}

export function BridalPage({
  config,
  services,
  packages,
  gallery,
  onNavigate,
}: BridalPageProps) {
  const bridalServices = services.filter((s) => s.category === 'Bridal & Special Occasion');
  const bridalPackages = packages.filter((p) => p.category === 'Bridal & Special Occasion');
  const bridalGallery = gallery.filter((g) => g.category === 'Bridal Looks');

  const bridalWhatsappMsg =
    'Hello Eve’s Beauty Parlour, I would like to enquire about bridal or special occasion beauty and styling availability. Please share consultation details.';
  const whatsappUrl = buildProvisionalWhatsAppUrl(config.phoneNumber, bridalWhatsappMsg);

  return (
    <div className="bg-[#FAF7F2]">
      {/* Bridal Hero */}
      <section className="bg-[#23191E] text-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#E7D9C4]">
              Bridal &amp; Special Occasion · Tinsukia
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.08]"
              style={{ textWrap: 'balance' }}
            >
              Make Your Special Moments Even More Beautiful.
            </h1>
            <p className="text-base sm:text-lg text-[#EDE4DC] leading-relaxed max-w-xl">
              Planning a special occasion? Get in touch with Eve’s Beauty Parlour to discuss your beauty and styling requirements.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#bridal-consultation"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FAF7F2] text-[#4A1D2F] text-sm font-semibold hover:bg-[#E7D9C4] transition-colors"
              >
                <span>Request Consultation</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>

              {config.phoneConfirmed ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#E7D9C4]/70 text-[#FAF7F2] text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp Bridal Enquiry</span>
                </a>
              ) : (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#E7D9C4]/60 text-[#E7D9C4] text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>WhatsApp Enquiry (Provisional Number)</span>
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <SafeImage
              src={GENERATED_IMAGES.bridalLook}
              alt="Illustrative Indian bridal portrait in burgundy saree and jasmine flowers"
              containerClassName="aspect-[3/4] max-h-[460px] w-full rounded-xl border border-[#3B2B33]"
            />
            <p className="mt-2 text-xs text-[#B9AEB2]">
              Illustrative bridal inspiration placeholder — replaceable with salon bridal photography.
            </p>
          </div>
        </div>
      </section>

      {/* Owner Confirmation Notice when bridal services are still in draft */}
      {!config.bridalConfirmed && (
        <section className="bg-[#F3EDE4] border-b border-[#E4DAD0] py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-[#2B2729] leading-relaxed">
              <span className="font-semibold text-[#4A1D2F]">Owner Confirmation Notice:</span>{' '}
              Bridal and special-occasion offerings shown below are draft enquiry categories pending final confirmation from Eve’s Beauty Parlour. Submit an enquiry below to check availability for your event dates.
            </p>
          </div>
        </section>
      )}

      {/* Occasion Service Offerings */}
      <section className="py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
              Occasion Enquiries
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F]">
              {config.bridalConfirmed
                ? 'Bridal & Special Occasion Services'
                : 'Available Upon Salon Confirmation'}
            </h2>
            <p className="text-sm sm:text-base text-[#5E5659]">
              Every celebration has unique timing and styling needs. Pricing is shared individually after discussing your event requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bridalServices.map((srv) => (
              <div
                key={srv.id}
                className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-xs text-[#8A5A4D]">
                    {srv.isConfirmedByOwner ? 'Confirmed Offering' : 'Draft · Confirm with Salon'}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-[#4A1D2F]">
                    {srv.name}
                  </h3>
                  <p className="text-sm text-[#5E5659] leading-relaxed">{srv.description}</p>
                </div>
                <div className="pt-3 border-t border-[#E4DAD0] flex items-center justify-between text-xs">
                  <span className="font-medium text-[#2B2729]">{srv.priceLabel}</span>
                  <a
                    href="#bridal-consultation"
                    className="font-semibold text-[#4A1D2F] hover:underline"
                  >
                    Enquire
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridal Portfolio Preview & Optional Confirmed Packages */}
      <section className="py-14 sm:py-16 bg-[#F3EDE4] border-y border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-4">
              <h2 className="font-display text-3xl font-semibold text-[#4A1D2F]">
                Bridal &amp; Occasion Gallery
              </h2>
              <p className="text-sm text-[#5E5659] leading-relaxed">
                Placeholder lookbook visuals are shown until Eve’s Beauty Parlour uploads its own bridal portfolio photography.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bridalGallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl overflow-hidden"
                  >
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.altText}
                      containerClassName="aspect-[3/4] w-full"
                    />
                    <div className="p-3">
                      <p className="text-xs font-medium text-[#2B2729]">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <h2 className="font-display text-3xl font-semibold text-[#4A1D2F]">
                Package Enquiries
              </h2>
              {bridalPackages.length > 0 ? (
                <div className="space-y-4">
                  {bridalPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-xl font-semibold text-[#4A1D2F]">
                          {pkg.name}
                        </h3>
                        <span className="text-sm font-medium text-[#2B2729]">
                          {pkg.priceLabel}
                        </span>
                      </div>
                      <p className="text-sm text-[#5E5659]">{pkg.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl p-6 space-y-3">
                  <h3 className="font-display text-xl font-semibold text-[#4A1D2F]">
                    Custom Quote Upon Consultation
                  </h3>
                  <p className="text-sm text-[#5E5659] leading-relaxed">
                    We do not publish preset bridal package prices without salon confirmation. Share your event date, preferred look, and services needed to receive accurate availability and pricing directly from the team.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Consultation & Appointment Request Form */}
      <section id="bridal-consultation" className="py-16 sm:py-20 scroll-mt-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
              Advance Enquiry
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F]">
              Bridal &amp; Occasion Consultation Form
            </h2>
            <p className="text-sm text-[#5E5659]">
              Submit your preferred date and occasion notes. Our team will reach out to discuss details and confirm availability.
            </p>
          </div>

          <AppointmentForm
            services={services}
            config={config}
            initialService="Bridal Makeup (Subject to Confirmation)"
            onNavigate={onNavigate}
          />
        </div>
      </section>
    </div>
  );
}
