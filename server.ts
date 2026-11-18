import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import type {
  AppointmentEnquiry,
  EnquiryStatus,
  GalleryCategory,
  SalonDataStore,
  ServiceCategory,
} from './src/lib/salonLogic.ts';
import {
  DEFAULT_SALON_DATA,
  sanitizeText,
  validateEnquiryInput,
} from './src/lib/salonLogic.ts';
import { PUBLIC_ROUTES } from './src/lib/routes.ts';

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'salon-data.json');
const OWNER_ACCESS_CODE = process.env.OWNER_ACCESS_CODE || 'eves-tinsukia-2026';

const activeTokens = new Set<string>();

function ensureDataFile(): SalonDataStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SALON_DATA, null, 2), 'utf-8');
    return structuredClone(DEFAULT_SALON_DATA);
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<SalonDataStore>;
    return {
      config: { ...DEFAULT_SALON_DATA.config, ...(parsed.config || {}) },
      services: Array.isArray(parsed.services) ? parsed.services : DEFAULT_SALON_DATA.services,
      packages: Array.isArray(parsed.packages) ? parsed.packages : DEFAULT_SALON_DATA.packages,
      gallery: Array.isArray(parsed.gallery) ? parsed.gallery : DEFAULT_SALON_DATA.gallery,
      reviews: Array.isArray(parsed.reviews) ? parsed.reviews : DEFAULT_SALON_DATA.reviews,
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [],
    };
  } catch {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULT_SALON_DATA, null, 2), 'utf-8');
    return structuredClone(DEFAULT_SALON_DATA);
  }
}

function saveDataFile(store: SalonDataStore): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

function requireOwnerAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Owner authentication required.' });
  }
  const token = authHeader.slice('Bearer '.length).trim();
  if (!activeTokens.has(token)) {
    return res.status(401).json({ error: 'Invalid or expired owner session.' });
  }
  next();
}

async function startServer() {
  ensureDataFile();
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // SEO endpoints
  app.get('/robots.txt', (req, res) => {
    const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    res.type('text/plain').send(
      [
        'User-agent: *',
        'Allow: /',
        'Disallow: /owner',
        'Disallow: /api/',
        `Sitemap: ${baseUrl.replace(/\/$/, '')}/sitemap.xml`,
      ].join('\n')
    );
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');
    const urls = PUBLIC_ROUTES.map(
      (route) => `  <url>\n    <loc>${baseUrl}${route.path}</loc>\n    <changefreq>weekly</changefreq>\n  </url>`
    ).join('\n');
    res
      .type('application/xml')
      .send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`);
  });

  // Public salon endpoint — strictly excludes customer enquiries / PII
  app.get('/api/public/salon', (_req, res) => {
    const store = ensureDataFile();
    res.json({
      config: store.config,
      services: store.services,
      packages: store.packages,
      gallery: store.gallery,
      reviews: store.reviews.filter((r) => r.isApproved),
    });
  });

  // Public enquiry submission
  app.post('/api/public/enquiries', (req, res) => {
    const body = req.body || {};
    const validation = validateEnquiryInput(body);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Please check the highlighted fields and try again.',
        errors: validation.errors,
      });
    }

    const store = ensureDataFile();
    const enquiry: AppointmentEnquiry = {
      id: `ENQ-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`,
      customerName: sanitizeText(body.customerName, 120),
      mobileNumber: sanitizeText(body.mobileNumber, 30),
      serviceRequired: sanitizeText(body.serviceRequired, 160),
      preferredDate: sanitizeText(body.preferredDate, 20),
      preferredTime: sanitizeText(body.preferredTime, 40),
      message: sanitizeText(body.message, 800),
      privacyConsent: true,
      status: 'Pending Salon Confirmation',
      ownerNotes: '',
      createdAt: new Date().toISOString(),
    };

    store.enquiries.unshift(enquiry);
    saveDataFile(store);

    res.status(201).json({
      success: true,
      enquiryId: enquiry.id,
      message:
        'Thank you for contacting Eve’s Beauty Parlour! Your appointment request has been received. Our team will contact you to confirm the details.',
    });
  });

  // Owner authentication
  app.post('/api/owner/login', (req, res) => {
    const code = typeof req.body?.accessCode === 'string' ? req.body.accessCode.trim() : '';
    if (!code || code !== OWNER_ACCESS_CODE) {
      return res.status(401).json({ error: 'Incorrect owner access code.' });
    }
    const token = crypto.randomBytes(24).toString('hex');
    activeTokens.add(token);
    res.json({ token });
  });

  app.post('/api/owner/logout', requireOwnerAuth, (req, res) => {
    const token = (req.headers.authorization || '').slice('Bearer '.length).trim();
    activeTokens.delete(token);
    res.json({ success: true });
  });

  // Private Owner Enquiry Management
  app.get('/api/owner/dashboard', requireOwnerAuth, (_req, res) => {
    const store = ensureDataFile();
    res.json(store);
  });

  app.patch('/api/owner/enquiries/:id', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    const target = store.enquiries.find((e) => e.id === req.params.id);
    if (!target) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }
    const allowedStatuses: EnquiryStatus[] = [
      'Pending Salon Confirmation',
      'Contacted',
      'Confirmed',
      'Completed',
      'Cancelled',
    ];
    if (allowedStatuses.includes(req.body?.status)) {
      target.status = req.body.status;
    }
    if (typeof req.body?.ownerNotes === 'string') {
      target.ownerNotes = sanitizeText(req.body.ownerNotes, 600);
    }
    saveDataFile(store);
    res.json({ enquiry: target });
  });

  app.delete('/api/owner/enquiries/:id', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    const before = store.enquiries.length;
    store.enquiries = store.enquiries.filter((e) => e.id !== req.params.id);
    if (store.enquiries.length === before) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }
    saveDataFile(store);
    res.json({ success: true });
  });

  // Owner Config Update
  app.put('/api/owner/config', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    const b = req.body || {};
    store.config = {
      ...store.config,
      businessName: sanitizeText(b.businessName, 100) || store.config.businessName,
      address: sanitizeText(b.address, 220) || store.config.address,
      phoneNumber: sanitizeText(b.phoneNumber, 30) || store.config.phoneNumber,
      phoneConfirmed: typeof b.phoneConfirmed === 'boolean' ? b.phoneConfirmed : store.config.phoneConfirmed,
      openingHours: typeof b.openingHours === 'string' ? sanitizeText(b.openingHours, 200) : store.config.openingHours,
      hoursConfirmed: typeof b.hoursConfirmed === 'boolean' ? b.hoursConfirmed : store.config.hoursConfirmed,
      bridalConfirmed: typeof b.bridalConfirmed === 'boolean' ? b.bridalConfirmed : store.config.bridalConfirmed,
      googleMapsUrl: sanitizeText(b.googleMapsUrl, 400) || store.config.googleMapsUrl,
      googleBusinessProfileUrl:
        typeof b.googleBusinessProfileUrl === 'string'
          ? sanitizeText(b.googleBusinessProfileUrl, 400)
          : store.config.googleBusinessProfileUrl,
      ashrafWebsiteUrl:
        typeof b.ashrafWebsiteUrl === 'string' && b.ashrafWebsiteUrl.trim()
          ? sanitizeText(b.ashrafWebsiteUrl, 300)
          : store.config.ashrafWebsiteUrl,
      whatsappPrefillMessage:
        sanitizeText(b.whatsappPrefillMessage, 400) || store.config.whatsappPrefillMessage,
      aboutIntro: sanitizeText(b.aboutIntro, 600) || store.config.aboutIntro,
      careApproach: sanitizeText(b.careApproach, 600) || store.config.careApproach,
      consultationNote: sanitizeText(b.consultationNote, 600) || store.config.consultationNote,
    };
    saveDataFile(store);
    res.json({ config: store.config });
  });

  // Owner Services CRUD
  app.post('/api/owner/services', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    const b = req.body || {};
    const validCategories: ServiceCategory[] = [
      'Hair Care',
      'Beauty & Skin Care',
      'Grooming',
      'Bridal & Special Occasion',
    ];
    const name = sanitizeText(b.name, 120);
    if (!name) return res.status(400).json({ error: 'Service name is required.' });
    const category: ServiceCategory = validCategories.includes(b.category) ? b.category : 'Beauty & Skin Care';
    const created = {
      id: `srv-${Date.now().toString(36)}`,
      name,
      category,
      description: sanitizeText(b.description, 320) || 'Personalized salon service tailored to your preferences.',
      priceLabel: sanitizeText(b.priceLabel, 60) || 'Contact for Pricing',
      imageUrl: sanitizeText(b.imageUrl, 500) || DEFAULT_SALON_DATA.services[0].imageUrl,
      imageAlt: sanitizeText(b.imageAlt, 180) || `${name} at Eve’s Beauty Parlour`,
      isConfirmedByOwner: Boolean(b.isConfirmedByOwner),
      isPlaceholderImage: Boolean(b.isPlaceholderImage ?? true),
    };
    store.services.push(created);
    saveDataFile(store);
    res.status(201).json({ service: created });
  });

  app.put('/api/owner/services/:id', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    const idx = store.services.findIndex((s) => s.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Service not found.' });
    const b = req.body || {};
    const current = store.services[idx];
    store.services[idx] = {
      ...current,
      name: sanitizeText(b.name, 120) || current.name,
      category: b.category || current.category,
      description: typeof b.description === 'string' ? sanitizeText(b.description, 320) : current.description,
      priceLabel: sanitizeText(b.priceLabel, 60) || 'Contact for Pricing',
      imageUrl: sanitizeText(b.imageUrl, 500) || current.imageUrl,
      imageAlt: sanitizeText(b.imageAlt, 180) || current.imageAlt,
      isConfirmedByOwner:
        typeof b.isConfirmedByOwner === 'boolean' ? b.isConfirmedByOwner : current.isConfirmedByOwner,
      isPlaceholderImage:
        typeof b.isPlaceholderImage === 'boolean' ? b.isPlaceholderImage : current.isPlaceholderImage,
    };
    saveDataFile(store);
    res.json({ service: store.services[idx] });
  });

  app.delete('/api/owner/services/:id', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    store.services = store.services.filter((s) => s.id !== req.params.id);
    saveDataFile(store);
    res.json({ success: true });
  });

  // Owner Packages CRUD
  app.post('/api/owner/packages', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    const b = req.body || {};
    const name = sanitizeText(b.name, 120);
    if (!name) return res.status(400).json({ error: 'Package name is required.' });
    const pkg = {
      id: `pkg-${Date.now().toString(36)}`,
      name,
      category:
        b.category === 'Bridal & Special Occasion'
          ? ('Bridal & Special Occasion' as const)
          : ('General Care' as const),
      description: sanitizeText(b.description, 320),
      priceLabel: sanitizeText(b.priceLabel, 60) || 'Contact for Pricing',
      isConfirmedByOwner: Boolean(b.isConfirmedByOwner),
    };
    store.packages.push(pkg);
    saveDataFile(store);
    res.status(201).json({ package: pkg });
  });

  app.delete('/api/owner/packages/:id', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    store.packages = store.packages.filter((p) => p.id !== req.params.id);
    saveDataFile(store);
    res.json({ success: true });
  });

  // Owner Gallery CRUD
  app.post('/api/owner/gallery', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    const b = req.body || {};
    const validCategories: GalleryCategory[] = [
      'Hair Styling',
      'Hair Treatments',
      'Beauty Services',
      'Bridal Looks',
      'Salon Interior',
    ];
    const title = sanitizeText(b.title, 120);
    const imageUrl = sanitizeText(b.imageUrl, 500);
    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Title and image URL are required.' });
    }
    const item = {
      id: `gal-${Date.now().toString(36)}`,
      title,
      category: validCategories.includes(b.category) ? b.category : 'Salon Interior',
      imageUrl,
      altText: sanitizeText(b.altText, 200) || title,
      isSalonSupplied: Boolean(b.isSalonSupplied),
    };
    store.gallery.unshift(item);
    saveDataFile(store);
    res.status(201).json({ item });
  });

  app.delete('/api/owner/gallery/:id', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    store.gallery = store.gallery.filter((g) => g.id !== req.params.id);
    saveDataFile(store);
    res.json({ success: true });
  });

  // Owner Verified Reviews CRUD
  app.post('/api/owner/reviews', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    const b = req.body || {};
    const authorName = sanitizeText(b.authorName, 100);
    const quote = sanitizeText(b.quote, 500);
    if (!authorName || !quote) {
      return res.status(400).json({ error: 'Customer name and genuine review text are required.' });
    }
    const review = {
      id: `rev-${Date.now().toString(36)}`,
      authorName,
      serviceNote: sanitizeText(b.serviceNote, 100),
      quote,
      dateLabel: sanitizeText(b.dateLabel, 40),
      isApproved: true,
    };
    store.reviews.unshift(review);
    saveDataFile(store);
    res.status(201).json({ review });
  });

  app.delete('/api/owner/reviews/:id', requireOwnerAuth, (req, res) => {
    const store = ensureDataFile();
    store.reviews = store.reviews.filter((r) => r.id !== req.params.id);
    saveDataFile(store);
    res.json({ success: true });
  });

  // Vite dev middleware or static dist serving
  const isProd = process.env.NODE_ENV === 'production' && fs.existsSync(path.resolve(process.cwd(), 'dist'));
  if (isProd) {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Eve’s Beauty Parlour server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
