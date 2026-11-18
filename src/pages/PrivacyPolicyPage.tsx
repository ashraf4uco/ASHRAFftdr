import { SalonConfig } from '../lib/salonLogic';

interface PrivacyPolicyPageProps {
  config: SalonConfig;
  onNavigate: (path: string) => void;
}

export function PrivacyPolicyPage({ config, onNavigate }: PrivacyPolicyPageProps) {
  return (
    <div className="bg-[#FAF7F2]">
      <section className="py-14 sm:py-16 bg-[#F3EDE4] border-b border-[#E4DAD0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
            Customer Information
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#4A1D2F]">
            Privacy Policy
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
              1. Information Collected Through Appointment Enquiries
            </h2>
            <p>
              When you submit an appointment enquiry on this website, we collect only the details you provide in the form: your name, mobile number, selected service, preferred appointment date and time window, and any optional message or requirements you choose to share.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
              2. Why Contact Information Is Needed
            </h2>
            <p>
              Your contact information is used solely so that {config.businessName} can review your enquiry, check salon availability, share pricing or consultation information, and contact you to confirm or coordinate an appointment.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
              3. No Public Display of Customer Details
            </h2>
            <p>
              Customer names, mobile numbers, appointment requests, and notes submitted through this website are never displayed publicly on any page of the site. Only authorized salon management may access enquiry records to respond to your request.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
              4. Requesting Correction or Deletion
            </h2>
            <p>
              If you would like to correct or delete an appointment enquiry you previously submitted, please reach out to {config.businessName} directly via our{' '}
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/contact');
                }}
                className="underline text-[#4A1D2F] font-medium"
              >
                Contact Us
              </a>{' '}
              page or in person at {config.address}, and the salon team will remove or update your enquiry record upon request.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
