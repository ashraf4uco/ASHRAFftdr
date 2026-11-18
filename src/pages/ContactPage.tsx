import { MapPin, ExternalLink, Phone, MessageCircle, Clock } from 'lucide-react';
import {
  SalonConfig,
  ServiceItem,
  buildProvisionalWhatsAppUrl,
  buildTelUrl,
} from '../lib/salonLogic';
import { AppointmentForm } from '../components/AppointmentForm';

interface ContactPageProps {
  config: SalonConfig;
  services: ServiceItem[];
  onNavigate: (path: string) => void;
}

export function ContactPage({ config, services, onNavigate }: ContactPageProps) {
  const whatsappUrl = buildProvisionalWhatsAppUrl(
    config.phoneNumber,
    config.whatsappPrefillMessage
  );

  return (
    <div className="bg-[#FAF7F2]">
      <section className="py-14 sm:py-16 bg-[#F3EDE4] border-b border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
            Salon on Makum Road · Tinsukia
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#4A1D2F]">
            Contact Us
          </h1>
          <p className="text-base text-[#2B2729] max-w-2xl leading-relaxed">
            Reach Eve’s Beauty Parlour in Chinapatty, Makum Road, Tinsukia for service enquiries, directions, or appointment requests.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Details & Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                  {config.businessName}
                </h2>
                <p className="text-xs text-[#8A5A4D] mt-0.5">{config.category}</p>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5E5659]">
                  Address
                </p>
                <a
                  href={config.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-2.5 text-sm sm:text-base text-[#2B2729] hover:text-[#4A1D2F] transition-colors"
                >
                  <MapPin className="w-5 h-5 text-[#4A1D2F] shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="underline decoration-[#C69C8E] underline-offset-4">
                    {config.address}
                  </span>
                </a>
                <div className="pt-1">
                  <a
                    href={config.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] transition-colors"
                  >
                    <span>Get Directions</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="space-y-1.5 pt-4 border-t border-[#E4DAD0]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5E5659]">
                  Opening Hours
                </p>
                <div className="flex items-start gap-2.5 text-sm text-[#2B2729]">
                  <Clock className="w-4 h-4 text-[#4A1D2F] shrink-0 mt-0.5" aria-hidden="true" />
                  {config.hoursConfirmed && config.openingHours ? (
                    <span>{config.openingHours}</span>
                  ) : (
                    <span className="text-[#5E5659]">
                      Opening schedule not yet confirmed. Please enquire before visiting.
                    </span>
                  )}
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="space-y-3 pt-4 border-t border-[#E4DAD0]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#5E5659]">
                  Phone &amp; WhatsApp
                </p>
                {config.phoneConfirmed ? (
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                    <a
                      href={buildTelUrl(config.phoneNumber)}
                      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-[#C69C8E] text-[#4A1D2F] text-sm font-medium hover:bg-[#FAF7F2] tabular-nums"
                    >
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      <span>Call {config.phoneNumber}</span>
                    </a>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423]"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>WhatsApp Enquiry</span>
                    </a>
                  </div>
                ) : (
                  <div className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-lg p-3.5 text-xs text-[#5E5659] space-y-2">
                    <p className="text-[#2B2729] font-medium">
                      Listed Phone (Provisional):{' '}
                      <span className="tabular-nums">{config.phoneNumber}</span>
                    </p>
                    <p>
                      Awaiting confirmation from the salon owner before enabling live call &amp; WhatsApp links on production.
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#4A1D2F] font-medium underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Preview WhatsApp Enquiry</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Map Embed */}
            <div className="bg-white border border-[#E4DAD0] rounded-xl overflow-hidden shadow-xs">
              <iframe
                title="Google Maps location for Eve’s Beauty Parlour in Chinapatty, Makum Road, Tinsukia"
                src="https://maps.google.com/maps?q=Eve%27s%20Beauty%20Parlour%2C%20Chinapatty%2C%20Makum%20Road%2C%20Tinsukia%2C%20Assam%2C%20India&t=&z=15&ie=UTF8&iwloc=&output=embed"
                loading="lazy"
                className="w-full h-72 border-0"
              />
            </div>
          </div>

          {/* Right: Appointment Enquiry Form */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <h2 className="font-display text-3xl font-semibold text-[#4A1D2F]">
                Send an Appointment Enquiry
              </h2>
              <p className="text-sm text-[#5E5659]">
                Prefer a call back or slot check? Share your details below and our team will respond to confirm.
              </p>
            </div>
            <AppointmentForm
              services={services}
              config={config}
              onNavigate={onNavigate}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
