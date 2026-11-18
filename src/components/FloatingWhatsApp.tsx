import { useState } from 'react';
import { MessageCircle, Phone, X, ArrowRight } from 'lucide-react';
import {
  SalonConfig,
  buildProvisionalWhatsAppUrl,
  buildTelUrl,
} from '../lib/salonLogic';

interface FloatingWhatsAppProps {
  config: SalonConfig;
  onNavigate: (path: string) => void;
}

export function FloatingWhatsApp({ config, onNavigate }: FloatingWhatsAppProps) {
  const [open, setOpen] = useState(false);

  const whatsappUrl = buildProvisionalWhatsAppUrl(
    config.phoneNumber,
    config.whatsappPrefillMessage
  );

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3">
      {open && (
        <div
          role="dialog"
          aria-label="WhatsApp and phone enquiry options"
          className="w-80 max-w-[calc(100vw-2rem)] bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl shadow-xl p-4 text-[#2B2729]"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display text-lg font-semibold text-[#4A1D2F]">
                Enquire with {config.businessName}
              </h3>
              <p className="text-xs text-[#5E5659]">
                {config.phoneConfirmed
                  ? 'Reach us via WhatsApp, phone, or our appointment request form.'
                  : 'Listed number is provisional until confirmed by the salon owner.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close contact options"
              className="p-1.5 rounded-md text-[#5E5659] hover:bg-[#F3EDE4] hover:text-[#2B2729]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 mt-3">
            {config.phoneConfirmed ? (
              <>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message on WhatsApp
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={buildTelUrl(config.phoneNumber)}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg bg-[#F3EDE4] text-[#2B2729] text-sm font-medium hover:bg-[#E7D9C4] transition-colors"
                >
                  <span className="inline-flex items-center gap-2 tabular-nums">
                    <Phone className="w-4 h-4 text-[#4A1D2F]" />
                    Call {config.phoneNumber}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </>
            ) : (
              <div className="space-y-2">
                <div className="rounded-lg bg-[#F3EDE4] p-3 text-xs text-[#2B2729] space-y-1">
                  <p className="font-medium">
                    Provisional Number: <span className="tabular-nums">{config.phoneNumber}</span>
                  </p>
                  <p className="text-[#5E5659]">
                    Please verify this number in the Owner Portal before enabling public WhatsApp/call links on the live site.
                  </p>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg border border-[#C69C8E] text-[#4A1D2F] text-sm font-medium hover:bg-[#F3EDE4] transition-colors"
                >
                  <span className="inline-flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Preview WhatsApp Link
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onNavigate('/book');
              }}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-lg border border-[#E4DAD0] text-[#2B2729] text-sm font-medium hover:bg-[#F3EDE4] transition-colors"
            >
              <span>Online Appointment Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {config.phoneConfirmed ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Enquire via WhatsApp"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#4A1D2F] text-[#FAF7F2] shadow-lg hover:bg-[#381423] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A1D2F]"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm font-medium hidden sm:inline">WhatsApp</span>
        </a>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-label="Open WhatsApp and enquiry options"
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-[#4A1D2F] text-[#FAF7F2] shadow-lg hover:bg-[#381423] transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A1D2F]"
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          <span className="text-sm font-medium hidden sm:inline">Enquire</span>
        </button>
      )}
    </div>
  );
}
