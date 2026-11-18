import { useEffect, useState } from 'react';
import {
  Check,
  Lock,
  LogOut,
  Plus,
  Trash2,
  Save,
  AlertCircle,
} from 'lucide-react';
import {
  AppointmentEnquiry,
  EnquiryStatus,
  GalleryCategory,
  GalleryItem,
  OwnerReview,
  SalonConfig,
  SalonDataStore,
  ServiceCategory,
  ServiceItem,
  ServicePackage,
  GENERATED_IMAGES,
} from '../lib/salonLogic';

interface OwnerDashboardPageProps {
  onDataChanged: () => Promise<void>;
}

type AdminTab = 'enquiries' | 'settings' | 'services' | 'gallery' | 'reviews';

const ENQUIRY_STATUSES: EnquiryStatus[] = [
  'Pending Salon Confirmation',
  'Contacted',
  'Confirmed',
  'Completed',
  'Cancelled',
];

export function OwnerDashboardPage({ onDataChanged }: OwnerDashboardPageProps) {
  const [token, setToken] = useState<string>(() => sessionStorage.getItem('eves_owner_token') || '');
  const [accessCode, setAccessCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [store, setStore] = useState<SalonDataStore | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<AdminTab>('enquiries');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Local editable config state
  const [configDraft, setConfigDraft] = useState<SalonConfig | null>(null);

  // Add service form
  const [newService, setNewService] = useState<{
    name: string;
    category: ServiceCategory;
    description: string;
    priceLabel: string;
    imageUrl: string;
    isConfirmedByOwner: boolean;
  }>({
    name: '',
    category: 'Hair Care',
    description: '',
    priceLabel: 'Contact for Pricing',
    imageUrl: GENERATED_IMAGES.hairCare,
    isConfirmedByOwner: true,
  });

  // Add package form
  const [newPkg, setNewPkg] = useState<{
    name: string;
    category: 'Bridal & Special Occasion' | 'General Care';
    description: string;
    priceLabel: string;
  }>({
    name: '',
    category: 'Bridal & Special Occasion',
    description: '',
    priceLabel: 'Contact for Pricing',
  });

  // Add gallery item form
  const [newGallery, setNewGallery] = useState<{
    title: string;
    category: GalleryCategory;
    imageUrl: string;
    altText: string;
    isSalonSupplied: boolean;
  }>({
    title: '',
    category: 'Salon Interior',
    imageUrl: '',
    altText: '',
    isSalonSupplied: true,
  });

  // Add verified review form
  const [newReview, setNewReview] = useState({
    authorName: '',
    serviceNote: '',
    quote: '',
    dateLabel: '',
  });

  const loadDashboard = async (authToken: string) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/owner/dashboard', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        sessionStorage.removeItem('eves_owner_token');
        setToken('');
        setStore(null);
        return;
      }
      if (!res.ok) throw new Error('Could not load dashboard');
      const data = (await res.json()) as SalonDataStore;
      setStore(data);
      setConfigDraft(data.config);
    } catch {
      setErrorMessage('Failed to load owner dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadDashboard(token);
    }
  }, [token]);

  const notifySaved = async (msg: string) => {
    setStatusMessage(msg);
    setErrorMessage('');
    await onDataChanged();
    if (token) await loadDashboard(token);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoggingIn(true);
    try {
      const res = await fetch('/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || 'Invalid access code.');
        return;
      }
      sessionStorage.setItem('eves_owner_token', data.token);
      setToken(data.token);
      setAccessCode('');
    } catch {
      setAuthError('Unable to reach server.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      await fetch('/api/owner/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    sessionStorage.removeItem('eves_owner_token');
    setToken('');
    setStore(null);
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] bg-[#FAF7F2] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-7 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#8A5A4D]">
              <Lock className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Private Salon Management</span>
            </div>
            <h1 className="font-display text-3xl font-semibold text-[#4A1D2F]">
              Owner Portal Sign In
            </h1>
            <p className="text-sm text-[#5E5659]">
              Customer enquiries and editable salon settings are kept private behind owner authentication.
            </p>
          </div>

          {authError && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 rounded-lg bg-[#FDF2F2] border border-[#E5B8B8] text-xs text-[#7A2021]"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="owner-access-code"
                className="block text-sm font-medium text-[#2B2729] mb-1.5"
              >
                Owner Access Code
              </label>
              <input
                id="owner-access-code"
                type="password"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Enter owner access code"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border border-[#D8CDC3] text-sm text-[#2B2729] focus:outline-none focus:border-[#4A1D2F]"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full min-h-[44px] px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] disabled:opacity-60 cursor-pointer"
            >
              {loggingIn ? 'Verifying...' : 'Sign In to Owner Portal'}
            </button>
          </form>

          <p className="text-xs text-[#5E5659] border-t border-[#E4DAD0] pt-4 leading-relaxed">
            Default preview passcode: <code className="px-1.5 py-0.5 bg-[#FAF7F2] border border-[#E4DAD0] rounded">eves-tinsukia-2026</code> (set <code className="px-1 py-0.5 bg-[#FAF7F2] rounded">OWNER_ACCESS_CODE</code> in server environment variables before publishing).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-[75vh]">
      <section className="bg-[#F3EDE4] border-b border-[#E4DAD0] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-wider uppercase text-[#8A5A4D]">
              Private Salon Management
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[#4A1D2F]">
              Eve’s Beauty Parlour — Owner Portal
            </h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#C69C8E] text-sm font-medium text-[#4A1D2F] hover:bg-[#FAF7F2] cursor-pointer self-start sm:self-auto"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign Out</span>
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {statusMessage && (
          <div
            role="status"
            className="flex items-center gap-2 p-3.5 rounded-lg bg-[#EEF6EE] border border-[#BFD6BF] text-sm text-[#234B23]"
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-center gap-2 p-3.5 rounded-lg bg-[#FDF2F2] border border-[#E5B8B8] text-sm text-[#7A2021]"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Owner dashboard sections"
          className="flex flex-wrap gap-1.5 p-1 bg-[#F3EDE4] border border-[#E4DAD0] rounded-lg"
        >
          {(
            [
              ['enquiries', `Enquiries (${store?.enquiries.length ?? 0})`],
              ['settings', 'Salon Details & Approvals'],
              ['services', `Services & Packages (${store?.services.length ?? 0})`],
              ['gallery', `Gallery (${store?.gallery.length ?? 0})`],
              ['reviews', `Verified Reviews (${store?.reviews.length ?? 0})`],
            ] as [AdminTab, string][]
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                tab === id
                  ? 'bg-[#4A1D2F] text-[#FAF7F2]'
                  : 'text-[#5E5659] hover:text-[#2B2729]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading || !store || !configDraft ? (
          <div className="p-8 text-sm text-[#5E5659]">Loading owner portal...</div>
        ) : (
          <>
            {/* TAB 1: ENQUIRIES */}
            {tab === 'enquiries' && (
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                  Appointment Enquiries
                </h2>
                {store.enquiries.length === 0 ? (
                  <div className="bg-[#F3EDE4] border border-[#E4DAD0] rounded-xl p-8 text-sm text-[#5E5659]">
                    No customer enquiries have been submitted yet. New submissions from the Book Appointment or Contact page will appear here privately.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {store.enquiries.map((enq) => (
                      <EnquiryRow
                        key={enq.id}
                        enquiry={enq}
                        onUpdate={async (status, ownerNotes) => {
                          const res = await fetch(`/api/owner/enquiries/${enq.id}`, {
                            method: 'PATCH',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ status, ownerNotes }),
                          });
                          if (res.ok) await notifySaved(`Updated enquiry ${enq.id}.`);
                        }}
                        onDelete={async () => {
                          const res = await fetch(`/api/owner/enquiries/${enq.id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          if (res.ok) await notifySaved(`Deleted enquiry ${enq.id}.`);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: SALON DETAILS & APPROVALS */}
            {tab === 'settings' && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await fetch('/api/owner/config', {
                    method: 'PUT',
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(configDraft),
                  });
                  if (res.ok) await notifySaved('Salon settings updated across the website.');
                }}
                className="bg-white border border-[#E4DAD0] rounded-xl p-6 sm:p-8 space-y-6"
              >
                <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                  Confirm Business Details &amp; Publication Toggles
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#2B2729] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={configDraft.phoneNumber}
                      onChange={(e) =>
                        setConfigDraft({ ...configDraft, phoneNumber: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm tabular-nums"
                    />
                    <label className="mt-2 inline-flex items-center gap-2 text-xs text-[#2B2729] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configDraft.phoneConfirmed}
                        onChange={(e) =>
                          setConfigDraft({ ...configDraft, phoneConfirmed: e.target.checked })
                        }
                        className="accent-[#4A1D2F]"
                      />
                      <span>Owner confirms this phone number (enables live Call &amp; WhatsApp links)</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2B2729] mb-1">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={configDraft.openingHours}
                      onChange={(e) =>
                        setConfigDraft({ ...configDraft, openingHours: e.target.value })
                      }
                      placeholder="e.g. Tue–Sun, 10:00 AM – 7:30 PM"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                    <label className="mt-2 inline-flex items-center gap-2 text-xs text-[#2B2729] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={configDraft.hoursConfirmed}
                        onChange={(e) =>
                          setConfigDraft({ ...configDraft, hoursConfirmed: e.target.checked })
                        }
                        className="accent-[#4A1D2F]"
                      />
                      <span>Owner confirms opening hours are accurate for display</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2B2729] mb-1">
                      Google Business Profile URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={configDraft.googleBusinessProfileUrl}
                      onChange={(e) =>
                        setConfigDraft({
                          ...configDraft,
                          googleBusinessProfileUrl: e.target.value,
                        })
                      }
                      placeholder="https://g.page/..."
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2B2729] mb-1">
                      ASHRAF Website URL (Credits &amp; Footer Link)
                    </label>
                    <input
                      type="text"
                      value={configDraft.ashrafWebsiteUrl}
                      onChange={(e) =>
                        setConfigDraft({ ...configDraft, ashrafWebsiteUrl: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[#F3EDE4] border border-[#E4DAD0]">
                  <label className="inline-flex items-center gap-2.5 text-sm font-medium text-[#2B2729] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configDraft.bridalConfirmed}
                      onChange={(e) =>
                        setConfigDraft({ ...configDraft, bridalConfirmed: e.target.checked })
                      }
                      className="accent-[#4A1D2F]"
                    />
                    <span>
                      Confirm Bridal &amp; Special Occasion Services (displays highlighted Bridal section on Homepage)
                    </span>
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2B2729] mb-1">
                      About Salon Introduction
                    </label>
                    <textarea
                      rows={3}
                      value={configDraft.aboutIntro}
                      onChange={(e) =>
                        setConfigDraft({ ...configDraft, aboutIntro: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#2B2729] mb-1">
                        Approach to Customer Care
                      </label>
                      <textarea
                        rows={3}
                        value={configDraft.careApproach}
                        onChange={(e) =>
                          setConfigDraft({ ...configDraft, careApproach: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#2B2729] mb-1">
                        Consultation &amp; Preferences Note
                      </label>
                      <textarea
                        rows={3}
                        value={configDraft.consultationNote}
                        onChange={(e) =>
                          setConfigDraft({ ...configDraft, consultationNote: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Salon Settings</span>
                </button>
              </form>
            )}

            {/* TAB 3: SERVICES & PACKAGES */}
            {tab === 'services' && (
              <div className="space-y-8">
                {/* Add New Service */}
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/owner/services', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(newService),
                    });
                    if (res.ok) {
                      setNewService({
                        name: '',
                        category: 'Hair Care',
                        description: '',
                        priceLabel: 'Contact for Pricing',
                        imageUrl: GENERATED_IMAGES.hairCare,
                        isConfirmedByOwner: true,
                      });
                      await notifySaved('Added new service.');
                    }
                  }}
                  className="bg-white border border-[#E4DAD0] rounded-xl p-6 space-y-4"
                >
                  <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                    Add Service Card
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Service name"
                      value={newService.name}
                      onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                      className="px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                    <select
                      value={newService.category}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          category: e.target.value as ServiceCategory,
                        })
                      }
                      className="px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    >
                      <option value="Hair Care">Hair Care</option>
                      <option value="Beauty & Skin Care">Beauty &amp; Skin Care</option>
                      <option value="Grooming">Grooming</option>
                      <option value="Bridal & Special Occasion">
                        Bridal &amp; Special Occasion
                      </option>
                    </select>
                    <input
                      type="text"
                      placeholder="Price (default: Contact for Pricing)"
                      value={newService.priceLabel}
                      onChange={(e) =>
                        setNewService({ ...newService, priceLabel: e.target.value })
                      }
                      className="px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Short description"
                    value={newService.description}
                    onChange={(e) =>
                      setNewService({ ...newService, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Service</span>
                  </button>
                </form>

                {/* Existing Services Editor */}
                <div className="space-y-3">
                  <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                    Edit or Confirm Existing Services
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {store.services.map((srv) => (
                      <ServiceEditorCard
                        key={srv.id}
                        service={srv}
                        onSave={async (updated) => {
                          const res = await fetch(`/api/owner/services/${srv.id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify(updated),
                          });
                          if (res.ok) await notifySaved(`Saved "${updated.name}".`);
                        }}
                        onDelete={async () => {
                          const res = await fetch(`/api/owner/services/${srv.id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          if (res.ok) await notifySaved(`Removed "${srv.name}".`);
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Package Cards Manager */}
                <div className="bg-white border border-[#E4DAD0] rounded-xl p-6 space-y-4">
                  <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                    Service Packages ({store.packages.length})
                  </h2>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const res = await fetch('/api/owner/packages', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ ...newPkg, isConfirmedByOwner: true }),
                      });
                      if (res.ok) {
                        setNewPkg({
                          name: '',
                          category: 'Bridal & Special Occasion',
                          description: '',
                          priceLabel: 'Contact for Pricing',
                        });
                        await notifySaved('Added package.');
                      }
                    }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3"
                  >
                    <input
                      type="text"
                      required
                      placeholder="Package title"
                      value={newPkg.name}
                      onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                    <select
                      value={newPkg.category}
                      onChange={(e) =>
                        setNewPkg({
                          ...newPkg,
                          category: e.target.value as ServicePackage['category'],
                        })
                      }
                      className="px-3 py-2 rounded-lg border border-[#D8CDC3] text-sm"
                    >
                      <option value="Bridal & Special Occasion">
                        Bridal &amp; Special Occasion
                      </option>
                      <option value="General Care">General Care</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Price (e.g. Contact for Pricing)"
                      value={newPkg.priceLabel}
                      onChange={(e) => setNewPkg({ ...newPkg, priceLabel: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] cursor-pointer"
                    >
                      Add Package
                    </button>
                    <input
                      type="text"
                      placeholder="Package description"
                      value={newPkg.description}
                      onChange={(e) => setNewPkg({ ...newPkg, description: e.target.value })}
                      className="md:col-span-4 px-3 py-2 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                  </form>

                  {store.packages.length > 0 && (
                    <ul className="divide-y divide-[#E4DAD0]">
                      {store.packages.map((pkg) => (
                        <li
                          key={pkg.id}
                          className="py-3 flex items-center justify-between gap-4 text-sm"
                        >
                          <div>
                            <p className="font-semibold text-[#4A1D2F]">
                              {pkg.name} · <span className="text-[#2B2729]">{pkg.priceLabel}</span>
                            </p>
                            <p className="text-xs text-[#5E5659]">{pkg.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch(`/api/owner/packages/${pkg.id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              await notifySaved('Package removed.');
                            }}
                            aria-label={`Delete package ${pkg.name}`}
                            className="p-2 text-[#8C2626] hover:bg-[#FDF2F2] rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: GALLERY */}
            {tab === 'gallery' && (
              <div className="space-y-6">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/owner/gallery', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(newGallery),
                    });
                    if (res.ok) {
                      setNewGallery({
                        title: '',
                        category: 'Salon Interior',
                        imageUrl: '',
                        altText: '',
                        isSalonSupplied: true,
                      });
                      await notifySaved('Added gallery photo.');
                    }
                  }}
                  className="bg-white border border-[#E4DAD0] rounded-xl p-6 space-y-4"
                >
                  <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                    Add Salon Photograph
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Photo title"
                      value={newGallery.title}
                      onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                      className="px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                    <select
                      value={newGallery.category}
                      onChange={(e) =>
                        setNewGallery({
                          ...newGallery,
                          category: e.target.value as GalleryCategory,
                        })
                      }
                      className="px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    >
                      <option value="Salon Interior">Salon Interior</option>
                      <option value="Hair Styling">Hair Styling</option>
                      <option value="Hair Treatments">Hair Treatments</option>
                      <option value="Beauty Services">Beauty Services</option>
                      <option value="Bridal Looks">Bridal Looks</option>
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="Image URL"
                      value={newGallery.imageUrl}
                      onChange={(e) =>
                        setNewGallery({ ...newGallery, imageUrl: e.target.value })
                      }
                      className="px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <label className="inline-flex items-center gap-2 text-xs text-[#2B2729] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newGallery.isSalonSupplied}
                        onChange={(e) =>
                          setNewGallery({ ...newGallery, isSalonSupplied: e.target.checked })
                        }
                        className="accent-[#4A1D2F]"
                      />
                      <span>Genuine photograph supplied by Eve’s Beauty Parlour</span>
                    </label>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Photo</span>
                    </button>
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {store.gallery.map((item: GalleryItem) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#E4DAD0] rounded-xl p-4 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-xs text-[#8A5A4D]">{item.category}</p>
                        <p className="text-sm font-medium text-[#2B2729] truncate">{item.title}</p>
                        <p className="text-xs text-[#5E5659]">
                          {item.isSalonSupplied ? 'Salon Photo' : 'Illustrative Placeholder'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          await fetch(`/api/owner/gallery/${item.id}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` },
                          });
                          await notifySaved('Gallery item removed.');
                        }}
                        aria-label={`Remove ${item.title}`}
                        className="p-2 text-[#8C2626] hover:bg-[#FDF2F2] rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: VERIFIED REVIEWS */}
            {tab === 'reviews' && (
              <div className="space-y-6">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch('/api/owner/reviews', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify(newReview),
                    });
                    if (res.ok) {
                      setNewReview({
                        authorName: '',
                        serviceNote: '',
                        quote: '',
                        dateLabel: '',
                      });
                      await notifySaved('Published genuine customer review.');
                    }
                  }}
                  className="bg-white border border-[#E4DAD0] rounded-xl p-6 space-y-4"
                >
                  <h2 className="font-display text-2xl font-semibold text-[#4A1D2F]">
                    Add Genuine Customer Review
                  </h2>
                  <p className="text-xs text-[#5E5659]">
                    Only publish reviews supplied directly by real customers with permission.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Customer name"
                      value={newReview.authorName}
                      onChange={(e) =>
                        setNewReview({ ...newReview, authorName: e.target.value })
                      }
                      className="px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Service visited for (optional)"
                      value={newReview.serviceNote}
                      onChange={(e) =>
                        setNewReview({ ...newReview, serviceNote: e.target.value })
                      }
                      className="px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Date (optional, e.g. Nov 2026)"
                      value={newReview.dateLabel}
                      onChange={(e) =>
                        setNewReview({ ...newReview, dateLabel: e.target.value })
                      }
                      className="px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    placeholder="Customer quote"
                    value={newReview.quote}
                    onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8CDC3] text-sm"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Approved Review</span>
                  </button>
                </form>

                {store.reviews.length > 0 && (
                  <div className="space-y-3">
                    {store.reviews.map((rev: OwnerReview) => (
                      <div
                        key={rev.id}
                        className="bg-white border border-[#E4DAD0] rounded-xl p-5 flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-[#4A1D2F]">
                            {rev.authorName}
                            {rev.serviceNote && ` · ${rev.serviceNote}`}
                          </p>
                          <p className="text-sm text-[#2B2729]">“{rev.quote}”</p>
                        </div>
                        <button
                          type="button"
                          onClick={async () => {
                            await fetch(`/api/owner/reviews/${rev.id}`, {
                              method: 'DELETE',
                              headers: { Authorization: `Bearer ${token}` },
                            });
                            await notifySaved('Review deleted.');
                          }}
                          aria-label={`Delete review by ${rev.authorName}`}
                          className="p-2 text-[#8C2626] hover:bg-[#FDF2F2] rounded-lg cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EnquiryRow({
  enquiry,
  onUpdate,
  onDelete,
}: {
  enquiry: AppointmentEnquiry;
  onUpdate: (status: EnquiryStatus, ownerNotes: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [status, setStatus] = useState<EnquiryStatus>(enquiry.status);
  const [notes, setNotes] = useState(enquiry.ownerNotes || '');

  return (
    <div className="bg-white border border-[#E4DAD0] rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E4DAD0] pb-3">
        <div>
          <p className="text-xs text-[#8A5A4D] tabular-nums">
            {enquiry.id} · Submitted {new Date(enquiry.createdAt).toLocaleString()}
          </p>
          <h3 className="font-display text-xl font-semibold text-[#4A1D2F]">
            {enquiry.customerName} — <span className="tabular-nums">{enquiry.mobileNumber}</span>
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label={`Status for ${enquiry.customerName}`}
            value={status}
            onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
            className="px-3 py-1.5 rounded-lg border border-[#D8CDC3] text-xs font-medium text-[#2B2729]"
          >
            {ENQUIRY_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onUpdate(status, notes)}
            className="px-3 py-1.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-xs font-medium hover:bg-[#381423] cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete enquiry ${enquiry.id}`}
            className="p-1.5 rounded-lg text-[#8C2626] hover:bg-[#FDF2F2] cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-[#2B2729]">
        <div>
          <span className="text-[#5E5659]">Service:</span> {enquiry.serviceRequired}
        </div>
        <div className="tabular-nums">
          <span className="text-[#5E5659]">Date:</span> {enquiry.preferredDate}
        </div>
        <div>
          <span className="text-[#5E5659]">Time:</span> {enquiry.preferredTime}
        </div>
      </div>

      {enquiry.message && (
        <p className="text-sm text-[#5E5659] bg-[#FAF7F2] p-3 rounded-lg">
          Customer message: “{enquiry.message}”
        </p>
      )}

      <div>
        <label className="block text-xs font-medium text-[#5E5659] mb-1">
          Internal Owner Notes
        </label>
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add follow-up notes..."
          className="w-full px-3 py-2 rounded-lg border border-[#D8CDC3] text-xs"
        />
      </div>
    </div>
  );
}

function ServiceEditorCard({
  service,
  onSave,
  onDelete,
}: {
  service: ServiceItem;
  onSave: (updated: ServiceItem) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [draft, setDraft] = useState(service);

  return (
    <div className="bg-white border border-[#E4DAD0] rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#8A5A4D]">{draft.category}</span>
        <label className="inline-flex items-center gap-1.5 text-xs text-[#2B2729] cursor-pointer">
          <input
            type="checkbox"
            checked={draft.isConfirmedByOwner}
            onChange={(e) =>
              setDraft({ ...draft, isConfirmedByOwner: e.target.checked })
            }
            className="accent-[#4A1D2F]"
          />
          <span>Confirmed by Owner</span>
        </label>
      </div>

      <input
        type="text"
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        aria-label="Service name"
        className="w-full px-3 py-2 rounded-lg border border-[#D8CDC3] text-sm font-medium"
      />

      <textarea
        rows={2}
        value={draft.description}
        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        aria-label="Service description"
        className="w-full px-3 py-2 rounded-lg border border-[#D8CDC3] text-xs"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          value={draft.priceLabel}
          onChange={(e) => setDraft({ ...draft, priceLabel: e.target.value })}
          aria-label="Service price"
          placeholder="Contact for Pricing"
          className="px-3 py-2 rounded-lg border border-[#D8CDC3] text-xs"
        />
        <input
          type="text"
          value={draft.imageUrl}
          onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
          aria-label="Service image URL"
          className="px-3 py-2 rounded-lg border border-[#D8CDC3] text-xs"
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={() => onSave(draft)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-xs font-medium hover:bg-[#381423] cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label={`Delete ${draft.name}`}
          className="p-1.5 rounded-lg text-[#8C2626] hover:bg-[#FDF2F2] cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
