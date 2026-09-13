// The three languages the site is published in, and how routes map between them.

export const LOCALES = {
  en: { dir: 'ltr', name: 'English', short: 'EN', prefix: '', ogLocale: 'en_US' },
  ar: { dir: 'rtl', name: 'العربية', short: 'ع', prefix: '/ar', ogLocale: 'ar_AR' },
  he: { dir: 'rtl', name: 'עברית', short: 'ע', prefix: '/he', ogLocale: 'he_IL' },
};

export const LOCALE_ORDER = ['en', 'ar', 'he'];
export const DEFAULT_LOCALE = 'en';

// Page id → path segment. The home page has none.
export const PAGES = {
  home: '',
  services: 'services',
  work: 'work',
  about: 'about',
  contact: 'contact',
};

export const pathFor = (page, locale = DEFAULT_LOCALE) => {
  const segment = PAGES[page] ?? '';
  const { prefix } = LOCALES[locale] || LOCALES.en;
  return `${prefix}/${segment}`.replace(/\/$/, '') || '/';
};

export const localeFromPath = (pathname) => {
  const first = pathname.split('/')[1];
  return first === 'ar' || first === 'he' ? first : 'en';
};

// "/ar/work" → "work"; unknown paths return null so the 404 page can take over.
export const pageFromPath = (pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  const rest = parts[0] === 'ar' || parts[0] === 'he' ? parts.slice(1) : parts;
  const segment = rest[0] || '';
  const entry = Object.entries(PAGES).find(([, value]) => value === segment);
  return entry ? entry[0] : null;
};

// Fonts: Latin uses Inter/Space Grotesk from index.html; these cover Arabic and Hebrew
// (both families include Latin, so mixed text stays in one type system).
export const LOCALE_FONTS = {
  ar: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
  he: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700&display=swap',
};

export const SITE = {
  url: 'https://www.mohamaddev.com',
  email: 'mohamdadm25@gmail.com',
  phone: { label: '+972 54-236-6982', href: 'tel:+972542366982' },
  social: {
    linkedin: 'https://www.linkedin.com/in/mohamad-abu-ahmad-817a82262/',
    github: 'https://github.com/mohamadabuahmad',
    instagram: 'https://instagram.com/mohamadaa.dev',
  },
};
