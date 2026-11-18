import { MessageCircle, Phone, MapPin, Clock } from 'lucide-react';
import {
  SalonConfig,
  ServiceItem,
  buildProvisionalWhatsAppUrl,
  buildTelUrl,
} from '../lib/salonLogic';
import { AppointmentForm } from '../components/AppointmentForm';

interface BookPageProps {
  config: SalonConfig;
  services: ServiceItem[];
  initialService?: string;
  onNavigate: (path: string) => void;
}

export function BookPage({
  config,
  services,
  initialService = '',
  onNavigate,
}: BookPageProps) {
  const whatsappUrl = buildProvisionalWhatsAppUrl(
    config.phoneNumber,
    config.whatsappPrefillMessage
  );

  return (
    <div className="bg-[#FAF7F2]">
      <section className="py-14 sm:py-16 bg-[#F3EDE4] border-b border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
            Appointment Request · Tinsukia
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#4A1D2F]">
            Book an Appointment
          </h1>
          <p className="text-base text-[#2B2729] max-w-2xl leading-relaxed">
            Submit your preferred service, date, and time window below. Your appointment request is reviewed by our salon team and is confirmed once we contact you directly.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-8">
            <AppointmentForm
              services={services}
              config={config}
              initialService={initialService}
              onNavigate={onNavigate}
            />
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-6 space-y-4">
              <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                Direct Enquiry Options
              </h2>

              <div className="space-y-3 text-sm text-[#2B2729]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#4A1D2F] mt-1 shrink-0" aria-hidden="true" />
                  <span>{config.address}</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#4A1D2F] mt-1 shrink-0" aria-hidden="true" />
                  <span>
                    {config.hoursConfirmed && config.openingHours
                      ? config.openingHours
                      : 'Opening hours pending owner confirmation'}
                  </span>
                </div>
              </div>

              <div className="pt-2 space-y-2.5">
                {config.phoneConfirmed ? (
                  <>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" aria-hidden="true" />
                      <span>WhatsApp Enquiry</span>
                    </a>
                    <a
                      href={buildTelUrl(config.phoneNumber)}
                      className="flex items-center justify-center gap-2 w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-[#C69C8E] text-[#4A1D2F] text-sm font-medium hover:bg-[#FAF7F2] transition-colors tabular-nums"
                    >
                      <Phone className="w-4 h-4" aria-hidden="true" />
                      <span>Call {config.phoneNumber}</span>
                    </a>
                  </>
                ) : (
                  <div className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-lg p-3.5 text-xs text-[#5E5659] space-y-2">
                    <p className="font-medium text-[#2B2729]">
                      Provisional Phone: <span className="tabular-nums">{config.phoneNumber}</span>
                    </p>
                    <p>
                      Click-to-call and live WhatsApp links will be enabled once the salon owner confirms this number in the Owner Portal.
                    </p>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#4A1D2F] font-medium underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Preview WhatsApp Link</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl p-6 space-y-2">
              <h3 className="font-display text-xl font-semibold text-[#4A1D2F]">
                Please Note
              </h3>
              <p className="text-xs sm:text-sm text-[#5E5659] leading-relaxed">
                Submitting this form records an enquiry only. Your requested date and time are not reserved until a team member from Eve’s Beauty Parlour confirms availability with you.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
