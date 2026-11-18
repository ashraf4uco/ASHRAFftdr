import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_SALON_DATA,
  GalleryItem,
  OwnerReview,
  SalonConfig,
  ServiceItem,
  ServicePackage,
} from './lib/salonLogic';
import { getRouteMeta } from './lib/routes';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { BridalPage } from './pages/BridalPage';
import { GalleryPage } from './pages/GalleryPage';
import { BookPage } from './pages/BookPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { CreditsPage } from './pages/CreditsPage';
import { OwnerDashboardPage } from './pages/OwnerDashboardPage';

interface PublicSalonPayload {
  config: SalonConfig;
  services: ServiceItem[];
  packages: ServicePackage[];
  gallery: GalleryItem[];
  reviews: OwnerReview[];
}

export default function App() {
  const [locationState, setLocationState] = useState<{ pathname: string; search: string }>(() => ({
    pathname: window.location.pathname || '/',
    search: window.location.search || '',
  }));

  const [salonData, setSalonData] = useState<PublicSalonPayload>({
    config: DEFAULT_SALON_DATA.config,
    services: DEFAULT_SALON_DATA.services,
    packages: DEFAULT_SALON_DATA.packages,
    gallery: DEFAULT_SALON_DATA.gallery,
    reviews: DEFAULT_SALON_DATA.reviews,
  });

  const fetchSalonData = useCallback(async () => {
    try {
      const res = await fetch('/api/public/salon');
      if (!res.ok) return;
      const data = (await res.json()) as PublicSalonPayload;
      if (data && data.config) {
        setSalonData(data);
      }
    } catch {
      // Keep default fallback salon configuration on transient error
    }
  }, []);

  useEffect(() => {
    fetchSalonData();
  }, [fetchSalonData]);

  useEffect(() => {
    const onPopState = () => {
      setLocationState({
        pathname: window.location.pathname || '/',
        search: window.location.search || '',
      });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Update SEO title, meta description, and OpenGraph tags per route
  useEffect(() => {
    const meta = getRouteMeta(locationState.pathname);
    document.title = meta.title;

    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    updateMeta('meta[name="description"]', meta.description);
    updateMeta('meta[property="og:title"]', meta.title);
    updateMeta('meta[property="og:description"]', meta.description);
    updateMeta('meta[name="twitter:title"]', meta.title);
    updateMeta('meta[name="twitter:description"]', meta.description);
  }, [locationState.pathname]);

  const navigate = useCallback((target: string) => {
    const url = new URL(target, window.location.origin);
    window.history.pushState({}, '', url.pathname + url.search);
    setLocationState({
      pathname: url.pathname,
      search: url.search,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const normalizedPath =
    locationState.pathname === '/' ? '/' : locationState.pathname.replace(/\/+$/, '');
  const params = new URLSearchParams(locationState.search);

  const renderPage = () => {
    switch (normalizedPath) {
      case '/':
        return (
          <HomePage
            config={salonData.config}
            services={salonData.services}
            gallery={salonData.gallery}
            reviews={salonData.reviews}
            onNavigate={navigate}
          />
        );
      case '/about':
        return <AboutPage config={salonData.config} onNavigate={navigate} />;
      case '/services':
        return (
          <ServicesPage
            services={salonData.services}
            packages={salonData.packages}
            initialCategory={params.get('category') || 'All'}
            onSelectServiceForBooking={(serviceName) =>
              navigate(`/book?service=${encodeURIComponent(serviceName)}`)
            }
          />
        );
      case '/bridal':
        return (
          <BridalPage
            config={salonData.config}
            services={salonData.services}
            packages={salonData.packages}
            gallery={salonData.gallery}
            onNavigate={navigate}
          />
        );
      case '/gallery':
        return <GalleryPage gallery={salonData.gallery} />;
      case '/book':
        return (
          <BookPage
            config={salonData.config}
            services={salonData.services}
            initialService={params.get('service') || ''}
            onNavigate={navigate}
          />
        );
      case '/contact':
        return (
          <ContactPage
            config={salonData.config}
            services={salonData.services}
            onNavigate={navigate}
          />
        );
      case '/privacy-policy':
        return <PrivacyPolicyPage config={salonData.config} onNavigate={navigate} />;
      case '/terms':
        return <TermsPage config={salonData.config} onNavigate={navigate} />;
      case '/credits':
        return <CreditsPage config={salonData.config} />;
      case '/owner':
        return <OwnerDashboardPage onDataChanged={fetchSalonData} />;
      default:
        return (
          <HomePage
            config={salonData.config}
            services={salonData.services}
            gallery={salonData.gallery}
            reviews={salonData.reviews}
            onNavigate={navigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2B2729]">
      <Header
        currentPath={normalizedPath}
        onNavigate={navigate}
        businessName={salonData.config.businessName}
      />

      <main className="flex-1">{renderPage()}</main>

      <Footer config={salonData.config} onNavigate={navigate} />

      {normalizedPath !== '/owner' && (
        <FloatingWhatsApp config={salonData.config} onNavigate={navigate} />
      )}
    </div>
  );
}
