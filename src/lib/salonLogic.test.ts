import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_SALON_DATA,
  buildProvisionalWhatsAppUrl,
  buildTelUrl,
  buildWhatsAppUrl,
  filterGallery,
  filterServices,
  getExternalHref,
  validateEnquiryInput,
} from './salonLogic';

test('default salon data contains no fabricated prices, hours, or reviews', () => {
  assert.equal(DEFAULT_SALON_DATA.config.businessName, 'Eve’s Beauty Parlour');
  assert.equal(DEFAULT_SALON_DATA.config.openingHours, '');
  assert.equal(DEFAULT_SALON_DATA.config.hoursConfirmed, false);
  assert.equal(DEFAULT_SALON_DATA.config.phoneConfirmed, false);
  assert.equal(DEFAULT_SALON_DATA.config.ashrafWebsiteUrl, '[ASHRAF_WEBSITE_URL]');
  assert.equal(DEFAULT_SALON_DATA.reviews.length, 0);
  for (const service of DEFAULT_SALON_DATA.services) {
    assert.equal(service.priceLabel, 'Contact for Pricing');
  }
});

test('validateEnquiryInput catches missing fields and past dates', () => {
  const result = validateEnquiryInput(
    {
      customerName: 'A',
      mobileNumber: '123',
      serviceRequired: '',
      preferredDate: '2020-01-01',
      preferredTime: '',
      message: '',
      privacyConsent: false,
    },
    new Date('2026-11-18T10:00:00Z')
  );

  assert.equal(result.valid, false);
  assert.ok(result.errors.customerName);
  assert.ok(result.errors.mobileNumber);
  assert.ok(result.errors.serviceRequired);
  assert.ok(result.errors.preferredDate);
  assert.ok(result.errors.preferredTime);
  assert.ok(result.errors.privacyConsent);
});

test('validateEnquiryInput accepts valid enquiry submission', () => {
  const result = validateEnquiryInput(
    {
      customerName: 'Ananya Borah',
      mobileNumber: '+91 98765 43210',
      serviceRequired: 'Haircut and Trimming',
      preferredDate: '2026-11-25',
      preferredTime: 'Morning (10:00 AM – 1:00 PM)',
      message: 'Looking for a trim consultation.',
      privacyConsent: true,
    },
    new Date('2026-11-18T10:00:00Z')
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});

test('WhatsApp URL respects confirmation gate and formats prefilled text', () => {
  const msg = 'Hello Eve’s Beauty Parlour';
  assert.equal(buildWhatsAppUrl('+91 94353 35087', msg, false), null);
  assert.equal(
    buildWhatsAppUrl('+91 94353 35087', msg, true),
    'https://wa.me/919435335087?text=Hello%20Eve%E2%80%99s%20Beauty%20Parlour'
  );
  assert.equal(
    buildProvisionalWhatsAppUrl('+91 94353 35087', msg),
    'https://wa.me/919435335087?text=Hello%20Eve%E2%80%99s%20Beauty%20Parlour'
  );
  assert.equal(buildTelUrl('+91 94353 35087'), 'tel:+919435335087');
});

test('filterServices and filterGallery narrow items accurately', () => {
  const grooming = filterServices(DEFAULT_SALON_DATA.services, 'Grooming', '');
  assert.equal(grooming.length, 4);
  const threading = filterServices(DEFAULT_SALON_DATA.services, 'All', 'threading');
  assert.equal(threading.length, 1);
  assert.equal(threading[0]?.id, 'srv-threading');

  const interior = filterGallery(DEFAULT_SALON_DATA.gallery, 'Salon Interior');
  assert.equal(interior.length, 1);
});

test('getExternalHref preserves [ASHRAF_WEBSITE_URL] placeholder cleanly', () => {
  assert.equal(getExternalHref('[ASHRAF_WEBSITE_URL]'), null);
  assert.equal(getExternalHref('ashraf.dev'), 'https://ashraf.dev');
  assert.equal(getExternalHref('https://ashraf.dev'), 'https://ashraf.dev');
});
