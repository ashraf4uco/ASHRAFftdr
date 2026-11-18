import { useEffect, useState } from 'react';
import { CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import {
  AppointmentEnquiryInput,
  SalonConfig,
  ServiceItem,
  buildProvisionalWhatsAppUrl,
  validateEnquiryInput,
} from '../lib/salonLogic';

interface AppointmentFormProps {
  services: ServiceItem[];
  config: SalonConfig;
  initialService?: string;
  onNavigate?: (path: string) => void;
  compact?: boolean;
}

const TIME_WINDOWS = [
  'Morning (10:00 AM – 1:00 PM)',
  'Afternoon (1:00 PM – 4:00 PM)',
  'Evening (4:00 PM – 7:00 PM)',
  'Flexible — Call to Coordinate',
];

export function AppointmentForm({
  services,
  config,
  initialService = '',
  onNavigate,
  compact = false,
}: AppointmentFormProps) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState<AppointmentEnquiryInput>({
    customerName: '',
    mobileNumber: '',
    serviceRequired: initialService,
    preferredDate: '',
    preferredTime: '',
    message: '',
    privacyConsent: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AppointmentEnquiryInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedResult, setSubmittedResult] = useState<{
    enquiryId: string;
    message: string;
    summary: AppointmentEnquiryInput;
  } | null>(null);

  useEffect(() => {
    if (initialService) {
      setForm((prev) => ({ ...prev, serviceRequired: initialService }));
    }
  }, [initialService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const validation = validateEnquiryInput(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch('/api/public/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) setErrors(data.errors);
        setSubmitError(data.error || 'Could not submit your enquiry. Please check the form.');
        return;
      }

      setSubmittedResult({
        enquiryId: data.enquiryId,
        message:
          data.message ||
          'Thank you for contacting Eve’s Beauty Parlour! Your appointment request has been received. Our team will contact you to confirm the details.',
        summary: { ...form },
      });
    } catch {
      setSubmitError('Network error while sending your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedResult) {
    const whatsappFollowUp = `Hello Eve’s Beauty Parlour, I just submitted an appointment enquiry (${submittedResult.enquiryId}) for ${submittedResult.summary.serviceRequired} on ${submittedResult.summary.preferredDate} (${submittedResult.summary.preferredTime}). Name: ${submittedResult.summary.customerName}.`;
    const waUrl = buildProvisionalWhatsAppUrl(config.phoneNumber, whatsappFollowUp);

    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl p-6 sm:p-8 space-y-5"
      >
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-[#4A1D2F] shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-semibold text-[#4A1D2F]">
              Enquiry Received — Pending Confirmation
            </h3>
            <p className="text-sm sm:text-base text-[#2B2729] leading-relaxed">
              {submittedResult.message}
            </p>
            <p className="text-xs text-[#5E5659] tabular-nums">
              Reference ID: {submittedResult.enquiryId} · Please note this request is not a confirmed slot until the salon contacts you directly.
            </p>
          </div>
        </div>

        <div className="bg-[#F3EDE4] rounded-lg p-4 text-sm text-[#2B2729] grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <span className="text-[#5E5659]">Service:</span>{' '}
            <span className="font-medium">{submittedResult.summary.serviceRequired}</span>
          </div>
          <div>
            <span className="text-[#5E5659]">Preferred Date:</span>{' '}
            <span className="font-medium tabular-nums">{submittedResult.summary.preferredDate}</span>
          </div>
          <div>
            <span className="text-[#5E5659]">Preferred Time:</span>{' '}
            <span className="font-medium">{submittedResult.summary.preferredTime}</span>
          </div>
          <div>
            <span className="text-[#5E5659]">Contact:</span>{' '}
            <span className="font-medium tabular-nums">{submittedResult.summary.mobileNumber}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {config.phoneConfirmed ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Continue Enquiry on WhatsApp
            </a>
          ) : (
            <div className="text-xs text-[#5E5659] bg-[#F3EDE4] px-3.5 py-2.5 rounded-lg">
              WhatsApp follow-up will activate once the salon owner confirms phone number{' '}
              <span className="tabular-nums font-medium">{config.phoneNumber}</span>.{' '}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#4A1D2F] font-medium"
              >
                Preview WhatsApp message
              </a>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setSubmittedResult(null);
              setForm({
                customerName: '',
                mobileNumber: '',
                serviceRequired: '',
                preferredDate: '',
                preferredTime: '',
                message: '',
                privacyConsent: false,
              });
            }}
            className="px-4 py-2.5 rounded-lg border border-[#E4DAD0] text-sm font-medium text-[#2B2729] hover:bg-[#F3EDE4] transition-colors"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`bg-[#FAF7F2] border border-[#E4DAD0] rounded-xl ${
        compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
      } space-y-5`}
    >
      {submitError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 rounded-lg bg-[#FDF2F2] border border-[#E5B8B8] text-sm text-[#7A2021]"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Customer Name */}
        <div>
          <label
            htmlFor="enquiry-name"
            className="block text-sm font-medium text-[#2B2729] mb-1.5"
          >
            Customer Name <span className="text-[#4A1D2F]">*</span>
          </label>
          <input
            id="enquiry-name"
            type="text"
            value={form.customerName}
            onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))}
            placeholder="Your full name"
            aria-invalid={Boolean(errors.customerName)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border border-[#D8CDC3] text-sm text-[#2B2729] placeholder:text-[#8A8084] focus:outline-none focus:border-[#4A1D2F]"
          />
          {errors.customerName && (
            <p className="mt-1 text-xs text-[#8C2626]">{errors.customerName}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div>
          <label
            htmlFor="enquiry-mobile"
            className="block text-sm font-medium text-[#2B2729] mb-1.5"
          >
            Mobile Number <span className="text-[#4A1D2F]">*</span>
          </label>
          <input
            id="enquiry-mobile"
            type="tel"
            value={form.mobileNumber}
            onChange={(e) => setForm((p) => ({ ...p, mobileNumber: e.target.value }))}
            placeholder="+91 98XXX XXXXX"
            aria-invalid={Boolean(errors.mobileNumber)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border border-[#D8CDC3] text-sm text-[#2B2729] tabular-nums placeholder:text-[#8A8084] focus:outline-none focus:border-[#4A1D2F]"
          />
          {errors.mobileNumber && (
            <p className="mt-1 text-xs text-[#8C2626]">{errors.mobileNumber}</p>
          )}
        </div>
      </div>

      {/* Service Required */}
      <div>
        <label
          htmlFor="enquiry-service"
          className="block text-sm font-medium text-[#2B2729] mb-1.5"
        >
          Service Required <span className="text-[#4A1D2F]">*</span>
        </label>
        <select
          id="enquiry-service"
          value={form.serviceRequired}
          onChange={(e) => setForm((p) => ({ ...p, serviceRequired: e.target.value }))}
          aria-invalid={Boolean(errors.serviceRequired)}
          className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border border-[#D8CDC3] text-sm text-[#2B2729] focus:outline-none focus:border-[#4A1D2F]"
        >
          <option value="">Select a service or consultation</option>
          <option value="General Beauty & Hair Consultation">
            General Beauty &amp; Hair Consultation
          </option>
          {services.map((srv) => (
            <option key={srv.id} value={srv.name}>
              {srv.category} — {srv.name}
            </option>
          ))}
        </select>
        {errors.serviceRequired && (
          <p className="mt-1 text-xs text-[#8C2626]">{errors.serviceRequired}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Preferred Date */}
        <div>
          <label
            htmlFor="enquiry-date"
            className="block text-sm font-medium text-[#2B2729] mb-1.5"
          >
            Preferred Appointment Date <span className="text-[#4A1D2F]">*</span>
          </label>
          <input
            id="enquiry-date"
            type="date"
            min={todayStr}
            value={form.preferredDate}
            onChange={(e) => setForm((p) => ({ ...p, preferredDate: e.target.value }))}
            aria-invalid={Boolean(errors.preferredDate)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border border-[#D8CDC3] text-sm text-[#2B2729] tabular-nums focus:outline-none focus:border-[#4A1D2F]"
          />
          {errors.preferredDate && (
            <p className="mt-1 text-xs text-[#8C2626]">{errors.preferredDate}</p>
          )}
        </div>

        {/* Preferred Time */}
        <div>
          <label
            htmlFor="enquiry-time"
            className="block text-sm font-medium text-[#2B2729] mb-1.5"
          >
            Preferred Time <span className="text-[#4A1D2F]">*</span>
          </label>
          <select
            id="enquiry-time"
            value={form.preferredTime}
            onChange={(e) => setForm((p) => ({ ...p, preferredTime: e.target.value }))}
            aria-invalid={Boolean(errors.preferredTime)}
            className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg bg-white border border-[#D8CDC3] text-sm text-[#2B2729] focus:outline-none focus:border-[#4A1D2F]"
          >
            <option value="">Choose preferred time window</option>
            {TIME_WINDOWS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.preferredTime && (
            <p className="mt-1 text-xs text-[#8C2626]">{errors.preferredTime}</p>
          )}
        </div>
      </div>

      {/* Additional Message */}
      <div>
        <label
          htmlFor="enquiry-message"
          className="block text-sm font-medium text-[#2B2729] mb-1.5"
        >
          Additional Message or Requirements
        </label>
        <textarea
          id="enquiry-message"
          rows={3}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          placeholder="Share any occasion date, hair/skin preference, or questions for the salon team."
          className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#D8CDC3] text-sm text-[#2B2729] placeholder:text-[#8A8084] focus:outline-none focus:border-[#4A1D2F]"
        />
      </div>

      {/* Privacy Consent */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            id="enquiry-consent"
            type="checkbox"
            checked={form.privacyConsent}
            onChange={(e) => setForm((p) => ({ ...p, privacyConsent: e.target.checked }))}
            aria-invalid={Boolean(errors.privacyConsent)}
            className="mt-1 w-4 h-4 accent-[#4A1D2F] rounded border-[#D8CDC3]"
          />
          <span className="text-xs sm:text-sm text-[#5E5659] leading-relaxed">
            I consent to Eve’s Beauty Parlour using my contact details to respond to this appointment enquiry. My details will not be displayed publicly.{' '}
            {onNavigate && (
              <a
                href="/privacy-policy"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/privacy-policy');
                }}
                className="underline text-[#4A1D2F] hover:text-[#381423]"
              >
                Privacy Policy
              </a>
            )}
          </span>
        </label>
        {errors.privacyConsent && (
          <p className="mt-1 text-xs text-[#8C2626]">{errors.privacyConsent}</p>
        )}
      </div>

      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-3 rounded-lg bg-[#4A1D2F] text-[#FAF7F2] text-sm font-medium hover:bg-[#381423] disabled:opacity-60 transition-colors cursor-pointer"
        >
          {submitting ? 'Sending Enquiry...' : 'Request Appointment'}
        </button>
        <p className="text-xs text-[#5E5659]">
          Appointments are confirmed only after our team contacts you.
        </p>
      </div>
    </form>
  );
}
