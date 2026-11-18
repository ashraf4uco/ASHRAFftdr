import { MapPin, Phone, MessageCircle, ExternalLink } from 'lucide-react';
import {
  SalonConfig,
  buildProvisionalWhatsAppUrl,
  buildTelUrl,
  getExternalHref,
} from '../lib/salonLogic';

interface FooterProps {
  config: SalonConfig;
  onNavigate: (path: string) => void;
}

export function Footer({ config, onNavigate }: FooterProps) {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  const ashrafHref = getExternalHref(config.ashrafWebsiteUrl);
  const whatsappUrl = buildProvisionalWhatsAppUrl(
    config.phoneNumber,
    config.whatsappPrefillMessage
  );

  return (
    <footer className="bg-[#23191E] text-[#F3EDE4] border-t border-[#3B2B33]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-16 pb-24 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Address */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-semibold text-[#FAF7F2]">
              {config.businessName}
            </h2>
            <p className="text-sm text-[#D6CBC4] leading-relaxed">
              {config.category} serving Tinsukia with thoughtful beauty, hair, and grooming care.
            </p>
            <a
              href={config.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-2 text-sm text-[#E7D9C4] hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#C69C8E]" aria-hidden="true" />
              <span>{config.address}</span>
            </a>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#E7D9C4] mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6CBC4]">
              {[
                { path: '/', label: 'Home' },
                { path: '/about', label: 'About Us' },
                { path: '/gallery', label: 'Gallery' },
                { path: '/book', label: 'Book an Appointment' },
                { path: '/contact', label: 'Contact Us' },
              ].map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    onClick={(e) => handleNav(e, item.path)}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[#E7D9C4] mb-4">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm text-[#D6CBC4]">
              {[
                { path: '/services', label: 'Our Services' },
                { path: '/services?category=Hair%20Care', label: 'Hair Care' },
                { path: '/services?category=Beauty%20%26%20Skin%20Care', label: 'Beauty & Skin Care' },
                { path: '/services?category=Grooming', label: 'Grooming' },
                { path: '/bridal', label: 'Bridal & Special Occasion' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.path}
                    onClick={(e) => handleNav(e, item.path)}
                    className="hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Policies */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wide text-[#E7D9C4] mb-4">
              Connect & Info
            </h3>

            <div className="space-y-2.5 text-sm">
              {config.phoneConfirmed ? (
                <>
                  <div>
                    <a
                      href={buildTelUrl(config.phoneNumber)}
                      className="inline-flex items-center gap-2 text-[#F3EDE4] hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#C69C8E]" aria-hidden="true" />
                      <span className="tabular-nums">{config.phoneNumber}</span>
                    </a>
                  </div>
                  <div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#E7D9C4] hover:text-white transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-[#C69C8E]" aria-hidden="true" />
                      <span>WhatsApp Enquiry</span>
                    </a>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-xs text-[#C69C8E]">
                    Listed Phone (Provisional — Pending Owner Confirmation):{' '}
                    <span className="tabular-nums text-[#F3EDE4]">{config.phoneNumber}</span>
                  </p>
                  <a
                    href="/contact"
                    onClick={(e) => handleNav(e, '/contact')}
                    className="inline-flex items-center gap-1.5 text-sm text-[#E7D9C4] hover:text-white underline underline-offset-4"
                  >
                    View Contact & Enquiry Options
                  </a>
                </div>
              )}

              <div className="pt-1">
                <a
                  href={config.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#D6CBC4] hover:text-white transition-colors"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-[#3B2B33] text-xs text-[#B9AEB2] space-y-1">
              <p>
                Hours:{' '}
                {config.hoursConfirmed && config.openingHours
                  ? config.openingHours
                  : 'To be confirmed with salon'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & ASHRAF Credit Bar */}
        <div className="mt-12 pt-8 border-t border-[#3B2B33] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#B9AEB2]">
          <div className="space-y-1">
            <p>© 2026 Eve’s Beauty Parlour. All rights reserved.</p>
            <p>
              {ashrafHref ? (
                <a
                  href={ashrafHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E7D9C4] hover:text-white underline underline-offset-4 transition-colors"
                >
                  Designed &amp; Developed by ASHRAF
                </a>
              ) : (
                <a
                  href="/credits"
                  onClick={(e) => handleNav(e, '/credits')}
                  className="text-[#E7D9C4] hover:text-white underline underline-offset-4 transition-colors"
                >
                  Designed &amp; Developed by ASHRAF
                </a>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="/privacy-policy"
              onClick={(e) => handleNav(e, '/privacy-policy')}
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              onClick={(e) => handleNav(e, '/terms')}
              className="hover:text-white transition-colors"
            >
              Terms &amp; Conditions
            </a>
            <a
              href="/credits"
              onClick={(e) => handleNav(e, '/credits')}
              className="hover:text-white transition-colors"
            >
              Credits &amp; Copyright
            </a>
            <a
              href="/owner"
              onClick={(e) => handleNav(e, '/owner')}
              className="text-[#C69C8E] hover:text-white transition-colors"
            >
              Owner Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
