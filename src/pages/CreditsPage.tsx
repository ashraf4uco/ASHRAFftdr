import { ExternalLink } from 'lucide-react';
import { SalonConfig, getExternalHref } from '../lib/salonLogic';

interface CreditsPageProps {
  config: SalonConfig;
}

export function CreditsPage({ config }: CreditsPageProps) {
  const ashrafHref = getExternalHref(config.ashrafWebsiteUrl);

  return (
    <div className="bg-[#FAF7F2]">
      <section className="py-14 sm:py-16 bg-[#F3EDE4] border-b border-[#E4DAD0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
            Attribution &amp; Rights
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#4A1D2F]">
            Credits &amp; Copyright
          </h1>
          <p className="text-sm text-[#5E5659]">
            {config.businessName} · {config.address}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-6 sm:p-9 space-y-5">
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#4A1D2F]">
              Ownership &amp; Developer Credit
            </h2>
            <p className="text-base text-[#2B2729] leading-relaxed">
              © 2026 Eve’s Beauty Parlour. All rights reserved. Business information, logos, and photographs supplied by the salon remain the property of their respective owners. Website design and development credit: ASHRAF.
            </p>

            <div className="pt-2">
              {ashrafHref ? (
                <a
                  href={ashrafHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] transition-colors"
                >
                  <span>Website Designed &amp; Developed by ASHRAF — Visit Website</span>
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              ) : (
                <div className="space-y-2">
                  <a
                    href={config.ashrafWebsiteUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] transition-colors"
                  >
                    <span>Website Designed &amp; Developed by ASHRAF — Visit Website</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                  <p className="text-xs text-[#5E5659]">
                    Developer link placeholder: <code className="px-1.5 py-0.5 bg-[#FAF7F2] border border-[#E4DAD0] rounded">{config.ashrafWebsiteUrl}</code> (editable in the Owner Portal before final publication).
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 text-sm sm:text-base text-[#2B2729] leading-relaxed">
            <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
              Third-Party Materials &amp; Trademarks
            </h2>
            <p className="text-[#5E5659]">
              Third-party trademarks, service names, map embeds, and external platform marks remain the property of their respective owners. Illustrative placeholder visuals displayed prior to salon photography replacement are intended solely for layout preview and are not presented as past customer work.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
