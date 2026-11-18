import { SalonConfig } from '../lib/salonLogic';

interface TermsPageProps {
  config: SalonConfig;
  onNavigate: (path: string) => void;
}

export function TermsPage({ config, onNavigate }: TermsPageProps) {
  return (
    <div className="bg-[#FAF7F2]">
      <section className="py-14 sm:py-16 bg-[#F3EDE4] border-b border-[#E4DAD0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
            Website Usage
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#4A1D2F]">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-[#5E5659]">
            {config.businessName} · {config.address}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-sm sm:text-base text-[#2B2729] leading-relaxed">
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
              1. Website Information
            </h2>
            <p>
              This website provides general information about {config.businessName} in Chinapatty, Makum Road, Tinsukia, Assam, India. Service listings, availability, and opening hours are subject to confirmation by the salon owner.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
              2. Appointment Enquiries Require Confirmation
            </h2>
            <p>
              Submitting an appointment enquiry form or sending a WhatsApp message does not guarantee an automatic booking or reserved time slot. All appointment requests remain pending until the salon team contacts you directly to confirm availability, timing, and pricing.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
              3. Pricing &amp; Service Availability
            </h2>
            <p>
              Where “Contact for Pricing” is displayed, final service rates depend on your specific hair, skin, or occasion requirements and will be shared by the salon prior to service confirmation.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
              4. Visual Materials
            </h2>
            <p>
              Placeholder editorial images shown prior to final salon photography are for visual presentation only and are clearly distinguished from photographs supplied directly by the salon. For ownership and attribution details, please view{' '}
              <a
                href="/credits"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/credits');
                }}
                className="underline text-[#4A1D2F] font-medium"
              >
                Credits &amp; Copyright
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
