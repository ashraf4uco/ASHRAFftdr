import { useEffect, useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import {
  ServiceCategory,
  ServiceItem,
  ServicePackage,
  filterServices,
} from '../lib/salonLogic';
import { SafeImage } from '../components/SafeImage';

interface ServicesPageProps {
  services: ServiceItem[];
  packages: ServicePackage[];
  initialCategory?: string;
  onSelectServiceForBooking: (serviceName: string) => void;
}

const CATEGORIES: (ServiceCategory | 'All')[] = [
  'All',
  'Hair Care',
  'Beauty & Skin Care',
  'Grooming',
  'Bridal & Special Occasion',
];

export function ServicesPage({
  services,
  packages,
  initialCategory = 'All',
  onSelectServiceForBooking,
}: ServicesPageProps) {
  const validInitial = CATEGORIES.includes(initialCategory as ServiceCategory | 'All')
    ? (initialCategory as ServiceCategory | 'All')
    : 'All';

  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'All'>(validInitial);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (CATEGORIES.includes(initialCategory as ServiceCategory | 'All')) {
      setActiveCategory(initialCategory as ServiceCategory | 'All');
    }
  }, [initialCategory]);

  const filtered = filterServices(services, activeCategory, searchQuery);
  const hasDraftItems = services.some((s) => !s.isConfirmedByOwner);

  return (
    <div className="bg-[#FAF7F2]">
      {/* Header */}
      <section className="py-14 sm:py-16 bg-[#F3EDE4] border-b border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
            Hair &amp; Beauty Services in Tinsukia
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#4A1D2F]">
            Our Services
          </h1>
          <p className="text-base text-[#2B2729] max-w-2xl leading-relaxed">
            Browse our beauty, hair care, grooming, and occasion services. Pricing and exact service availability are confirmed directly upon enquiry.
          </p>
          {hasDraftItems && (
            <p className="text-xs sm:text-sm text-[#5E5659] bg-[#FAF7F2] border border-[#E4DAD0] rounded-lg px-4 py-3 max-w-3xl">
              Note: Items marked as <span className="font-medium text-[#4A1D2F]">Draft menu</span> await final confirmation by the salon owner before publication. Owners can edit names, descriptions, prices, images, and approval status from the Owner Portal.
            </p>
          )}
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="py-8 border-b border-[#E4DAD0] bg-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Filter services by category"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F3EDE4] rounded-lg border border-[#E4DAD0]"
          >
            {CATEGORIES.map((category) => {
              const active = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#4A1D2F] text-[#FAF7F2]'
                      : 'text-[#5E5659] hover:text-[#2B2729] hover:bg-[#FAF7F2]/60'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              className="w-4 h-4 text-[#8A8084] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="service-search" className="sr-only">
              Search services
            </label>
            <input
              id="service-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full min-h-[42px] pl-10 pr-4 py-2 rounded-lg bg-white border border-[#D8CDC3] text-sm text-[#2B2729] placeholder:text-[#8A8084] focus:outline-none focus:border-[#4A1D2F]"
            />
          </div>
        </div>
      </section>

      {/* Service Cards Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-10 text-center space-y-3">
              <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                No matching services found
              </h2>
              <p className="text-sm text-[#5E5659]">
                Try clearing your search or choosing another category, or send a general consultation enquiry.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423]"
              >
                Show All Services
              </button>
            </div>
          ) : activeCategory === 'All' && !searchQuery.trim() ? (
            <div className="space-y-14">
              {(['Hair Care', 'Beauty & Skin Care', 'Grooming', 'Bridal & Special Occasion'] as ServiceCategory[]).map(
                (catName) => {
                  const groupItems = filtered.filter((s) => s.category === catName);
                  if (groupItems.length === 0) return null;
                  return (
                    <div key={catName} className="space-y-6">
                      <div className="flex items-baseline justify-between border-b border-[#E4DAD0] pb-3">
                        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#4A1D2F]">
                          {catName}
                        </h2>
                        <span className="text-xs text-[#5E5659] tabular-nums">
                          {groupItems.length} {groupItems.length === 1 ? 'service' : 'services'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {groupItems.map((service) => (
                          <article
                            key={service.id}
                            className="bg-white border border-[#E4DAD0] rounded-xl overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-shadow duration-200"
                          >
                            <SafeImage
                              src={service.imageUrl}
                              alt={service.imageAlt}
                              containerClassName="aspect-[4/3] w-full"
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                            />

                            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-[#8A5A4D]">
                                  <span>{service.category}</span>
                                  {!service.isConfirmedByOwner && (
                                    <>
                                      <span aria-hidden="true">·</span>
                                      <span className="text-[#5E5659]">Draft menu</span>
                                    </>
                                  )}
                                </div>
                                <h3 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                                  {service.name}
                                </h3>
                                <p className="text-sm text-[#5E5659] leading-relaxed">
                                  {service.description}
                                </p>
                              </div>

                              <div className="pt-4 border-t border-[#E4DAD0] flex items-center justify-between gap-3">
                                <span className="text-sm font-medium text-[#2B2729] tabular-nums">
                                  {service.priceLabel || 'Contact for Pricing'}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onSelectServiceForBooking(service.name)}
                                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-xs sm:text-sm font-medium hover:bg-[#381423] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                                >
                                  <span>Enquire Now</span>
                                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {filtered.map((service) => (
                <article
                  key={service.id}
                  className="bg-white border border-[#E4DAD0] rounded-xl overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-shadow duration-200"
                >
                  <SafeImage
                    src={service.imageUrl}
                    alt={service.imageAlt}
                    containerClassName="aspect-[4/3] w-full"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-[#8A5A4D]">
                        <span>{service.category}</span>
                        {!service.isConfirmedByOwner && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-[#5E5659]">Draft menu</span>
                          </>
                        )}
                      </div>
                      <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                        {service.name}
                      </h2>
                      <p className="text-sm text-[#5E5659] leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E4DAD0] flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-[#2B2729] tabular-nums">
                        {service.priceLabel || 'Contact for Pricing'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectServiceForBooking(service.name)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-xs sm:text-sm font-medium hover:bg-[#381423] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>Enquire Now</span>
                        <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Package Cards (only shown when packages are supplied by the owner) */}
      {packages.length > 0 && (
        <section className="py-14 sm:py-16 bg-[#F3EDE4] border-t border-[#E4DAD0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
                Salon Packages
              </p>
              <h2 className="font-display text-3xl font-semibold text-[#4A1D2F]">
                Curated Service Packages
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <p className="text-xs text-[#8A5A4D]">{pkg.category}</p>
                    <h3 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-[#5E5659] leading-relaxed">{pkg.description}</p>
                  </div>
                  <div className="pt-3 border-t border-[#E4DAD0] flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-[#2B2729] tabular-nums">
                      {pkg.priceLabel || 'Contact for Pricing'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectServiceForBooking(pkg.name)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-xs font-medium hover:bg-[#381423] cursor-pointer"
                    >
                      <span>Enquire Now</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
