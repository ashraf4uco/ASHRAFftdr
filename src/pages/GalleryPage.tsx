import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { GalleryCategory, GalleryItem, filterGallery } from '../lib/salonLogic';
import { SafeImage } from '../components/SafeImage';

interface GalleryPageProps {
  gallery: GalleryItem[];
}

const GALLERY_CATEGORIES: (GalleryCategory | 'All')[] = [
  'All',
  'Hair Styling',
  'Hair Treatments',
  'Beauty Services',
  'Bridal Looks',
  'Salon Interior',
];

export function GalleryPage({ gallery }: GalleryPageProps) {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory | 'All'>('All');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = filterGallery(gallery, activeCategory);

  useEffect(() => {
    setSelectedIndex(null);
  }, [activeCategory]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev + 1) % filtered.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setSelectedIndex((prev) =>
          prev === null ? null : (prev - 1 + filtered.length) % filtered.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedIndex, filtered.length]);

  const activeItem = selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <div className="bg-[#FAF7F2]">
      <section className="py-14 sm:py-16 bg-[#F3EDE4] border-b border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#8A5A4D]">
            Salon Portfolio &amp; Atmosphere
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#4A1D2F]">
            Gallery
          </h1>
          <p className="text-base text-[#2B2729] max-w-2xl leading-relaxed">
            Explore our salon space and beauty inspiration categories. Click any photograph to enlarge. Illustrative placeholders are clearly labeled until the salon supplies its own photographs.
          </p>
        </div>
      </section>

      {/* Category Filter Tabs */}
      <section className="py-8 border-b border-[#E4DAD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            role="tablist"
            aria-label="Filter gallery by category"
            className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-[#F3EDE4] border border-[#E4DAD0] rounded-lg"
          >
            {GALLERY_CATEGORIES.map((category) => {
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
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length === 0 ? (
            <div className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-10 text-center space-y-2">
              <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                No photos in this category yet
              </h2>
              <p className="text-sm text-[#5E5659]">
                New salon photographs can be uploaded anytime from the Owner Portal.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <figure
                  key={item.id}
                  className="bg-white border border-[#E4DAD0] rounded-xl overflow-hidden group"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    aria-label={`Enlarge ${item.title}`}
                    className="relative block w-full text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#4A1D2F]"
                  >
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.altText}
                      containerClassName="aspect-[4/3] w-full"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute bottom-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#23191E]/75 text-[#FAF7F2] opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </span>
                  </button>
                  <figcaption className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#8A5A4D]">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#5E5659]">
                        {item.isSalonSupplied ? 'Salon Photo' : 'Illustrative Placeholder'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#2B2729]">{item.title}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Click-to-Enlarge Lightbox */}
      {activeItem && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image preview: ${activeItem.title}`}
          className="fixed inset-0 z-50 bg-[#1B1317]/90 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#FAF7F2] rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E4DAD0]">
              <div>
                <p className="text-xs text-[#8A5A4D]">{activeItem.category}</p>
                <h2 className="font-display text-xl font-semibold text-[#4A1D2F]">
                  {activeItem.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                aria-label="Close enlarged image"
                className="p-2 rounded-lg text-[#2B2729] hover:bg-[#F3EDE4] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative bg-[#23191E] flex items-center justify-center max-h-[70vh]">
              <img
                src={activeItem.imageUrl}
                alt={activeItem.altText}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain"
              />
              {filtered.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIndex((selectedIndex - 1 + filtered.length) % filtered.length)
                    }
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF7F2]/90 text-[#2B2729] flex items-center justify-center hover:bg-white shadow cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedIndex((selectedIndex + 1) % filtered.length)}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FAF7F2]/90 text-[#2B2729] flex items-center justify-center hover:bg-white shadow cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <div className="px-5 py-3 bg-[#F3EDE4] text-xs text-[#5E5659] flex items-center justify-between gap-4">
              <span>{activeItem.altText}</span>
              <span className="tabular-nums shrink-0">
                {selectedIndex + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
