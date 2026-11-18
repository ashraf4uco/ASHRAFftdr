import { ArrowRight, MapPin } from 'lucide-react';
import { GENERATED_IMAGES, SalonConfig } from '../lib/salonLogic';
import { SafeImage } from '../components/SafeImage';

interface AboutPageProps {
  config: SalonConfig;
  onNavigate: (path: string) => void;
}

export function AboutPage({ config, onNavigate }: AboutPageProps) {
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
  };

  return (
    <div className="bg-[#FAF7F2]">
      {/* Page Header */}
      <section className="py-14 sm:py-20 bg-[#F3EDE4] border-b border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
              About Us · Tinsukia, Assam
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#4A1D2F] leading-tight">
              Welcome to Eve’s Beauty Parlour
            </h1>
            <p className="text-base sm:text-lg text-[#2B2729] leading-relaxed">
              {config.aboutIntro}
            </p>
            <div className="flex items-start gap-2 text-sm text-[#5E5659]">
              <MapPin className="w-4 h-4 text-[#4A1D2F] mt-0.5 shrink-0" aria-hidden="true" />
              <span>{config.address}</span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <SafeImage
              src={GENERATED_IMAGES.heroInterior}
              alt="Illustrative warm beauty salon interior placeholder for Eve’s Beauty Parlour"
              containerClassName="aspect-[4/3] rounded-xl border border-[#E4DAD0]"
            />
            <p className="mt-2 text-xs text-[#5E5659]">
              Illustrative salon placeholder — replaceable with photographs supplied by the salon owner.
            </p>
          </div>
        </div>
      </section>

      {/* Approach & Consultation */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-7 sm:p-9 space-y-4">
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
              01 · Customer Care
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#4A1D2F]">
              Our Approach to Customer Care
            </h2>
            <p className="text-sm sm:text-base text-[#2B2729] leading-relaxed">
              {config.careApproach}
            </p>
          </div>

          <div className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-7 sm:p-9 space-y-4">
            <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
              02 · Tailored Choice
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#4A1D2F]">
              Consultation &amp; Service Preferences
            </h2>
            <p className="text-sm sm:text-base text-[#2B2729] leading-relaxed">
              {config.consultationNote}
            </p>
          </div>
        </div>
      </section>

      {/* Interior & Care Gallery Strip */}
      <section className="py-14 sm:py-16 bg-[#F3EDE4] border-t border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold text-[#4A1D2F]">
                Salon Atmosphere Preview
              </h2>
              <p className="text-sm text-[#5E5659] mt-1">
                Placeholder interior and care visuals pending actual salon photography.
              </p>
            </div>
            <a
              href="/book"
              onClick={(e) => handleNav(e, '/book')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Request an Appointment</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SafeImage
              src={GENERATED_IMAGES.heroInterior}
              alt="Illustrative salon styling mirrors and seating"
              containerClassName="aspect-[4/3] rounded-xl border border-[#E4DAD0]"
            />
            <SafeImage
              src={GENERATED_IMAGES.skinCare}
              alt="Illustrative facial skincare towels and bottles"
              containerClassName="aspect-[4/3] rounded-xl border border-[#E4DAD0]"
            />
            <SafeImage
              src={GENERATED_IMAGES.groomingSpa}
              alt="Illustrative manicure and grooming setup"
              containerClassName="aspect-[4/3] rounded-xl border border-[#E4DAD0]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
