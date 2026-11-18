import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  businessName: string;
}

const DESKTOP_LINKS = [
  { path: '/about', label: 'About' },
  { path: '/services', label: 'Services' },
  { path: '/bridal', label: 'Bridal' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
];

const MOBILE_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About Us' },
  { path: '/services', label: 'Our Services' },
  { path: '/bridal', label: 'Bridal & Special Occasion' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact Us' },
  { path: '/book', label: 'Book an Appointment' },
];

export function Header({ currentPath, onNavigate, businessName }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  const handleLinkClick = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    onNavigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E4DAD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          className="font-display text-2xl sm:text-[1.65rem] font-semibold tracking-tight text-[#4A1D2F] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A1D2F]"
        >
          {businessName}
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7">
          {DESKTOP_LINKS.map((link) => {
            const active = currentPath === link.path;
            return (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleLinkClick(e, link.path)}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium whitespace-nowrap shrink-0 pb-0.5 transition-colors duration-150 border-b ${
                  active
                    ? 'text-[#4A1D2F] border-[#4A1D2F]'
                    : 'text-[#5E5659] border-transparent hover:text-[#2B2729] hover:border-[#C69C8E]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/book"
            onClick={(e) => handleLinkClick(e, '/book')}
            className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-[#FAF7F2] bg-[#4A1D2F] rounded-lg hover:bg-[#381423] transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A1D2F]"
          >
            Book Appointment
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-[#E4DAD0] text-[#2B2729] hover:bg-[#F3EDE4] transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          id="mobile-nav-drawer"
          aria-label="Mobile navigation"
          className="md:hidden bg-[#FAF7F2] border-t border-[#E4DAD0] px-4 py-4 shadow-lg"
        >
          <ul className="space-y-1">
            {MOBILE_LINKS.map((link) => {
              const active = currentPath === link.path;
              const isPrimary = link.path === '/book';
              return (
                <li key={link.path}>
                  <a
                    href={link.path}
                    onClick={(e) => handleLinkClick(e, link.path)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center min-h-[44px] px-3 rounded-lg text-base font-medium transition-colors ${
                      isPrimary
                        ? 'mt-2 justify-center bg-[#4A1D2F] text-[#FAF7F2] hover:bg-[#381423]'
                        : active
                          ? 'bg-[#F3EDE4] text-[#4A1D2F]'
                          : 'text-[#2B2729] hover:bg-[#F3EDE4]'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
