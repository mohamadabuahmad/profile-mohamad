/* Runs after `npm run build` (npm "postbuild").
 *
 * The site is a client-side React app, so every URL would otherwise be served the same
 * index.html and non-JavaScript crawlers (Google's first pass, WhatsApp, LinkedIn, Facebook)
 * would only ever see one generic title. For every page in every language this writes a
 * static HTML file with that page's <html lang/dir>, title, description, canonical,
 * hreflang alternates, social tags, JSON-LD, web font and chunk preloads.
 * Vercel and GitHub Pages serve these files before falling back to the SPA.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const build = path.join(root, 'build');

// Mirrors src/i18n/locales.js (that file is an ES module, this script is CommonJS).
const LOCALES = {
  en: { dir: 'ltr', prefix: '', ogLocale: 'en_US' },
  ar: { dir: 'rtl', prefix: '/ar', ogLocale: 'ar_AR' },
  he: { dir: 'rtl', prefix: '/he', ogLocale: 'he_IL' },
};
const ORDER = ['en', 'ar', 'he'];
const PAGES = { home: '', services: 'services', work: 'work', about: 'about', contact: 'contact' };
const SITE_URL = 'https://www.mohamaddev.com';
const EMAIL = 'mohamdadm25@gmail.com';
const PHONE = '+972542366982';
const SAME_AS = ['https://www.linkedin.com/in/mohamad-abu-ahmad-817a82262/', 'https://github.com/mohamadabuahmad'];
const FONTS = {
  ar: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap',
  he: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Hebrew:wght@400;500;600;700&display=swap',
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const shell = fs.readFileSync(path.join(build, 'index.html'), 'utf8');
const manifest = require(path.join(build, 'asset-manifest.json')).files;
const content = Object.fromEntries(ORDER.map((l) => [l, require(path.join(root, `src/content/${l}.json`))]));
const services = Object.fromEntries(ORDER.map((l) => [l, require(path.join(root, `src/pages/services/locales/${l}.json`))]));

const urlFor = (page, locale) => `${SITE_URL}${`${LOCALES[locale].prefix}/${PAGES[page]}`.replace(/\/$/, '')}` || SITE_URL;

const person = (locale) => ({
  '@type': 'Person',
  '@id': `${SITE_URL}/#mohamad`,
  name: 'Mohamad Abu Ahmad',
  brand: { '@type': 'Brand', name: 'MohamadDev' },
  jobTitle: 'Software Engineer',
  url: SITE_URL,
  email: `mailto:${EMAIL}`,
  telephone: PHONE,
  image: `${SITE_URL}/profile_pic.jpg`,
  sameAs: SAME_AS,
  knowsLanguage: ORDER,
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'ORT Braude College' },
  knowsAbout: ['Artificial intelligence', 'Business automation', 'Web development', 'Mobile app development', 'System integration'],
  inLanguage: locale,
});

const webPage = (page, locale, t) => ({
  '@type': 'WebPage',
  '@id': urlFor(page, locale),
  url: urlFor(page, locale),
  name: t.title,
  description: t.description,
  inLanguage: locale,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#mohamad` },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'MohamadDev', item: `${SITE_URL}${LOCALES[locale].prefix}/` },
      ...(page === 'home' ? [] : [{ '@type': 'ListItem', position: 2, name: t.title.split(/[—|]/)[0].trim(), item: urlFor(page, locale) }]),
    ],
  },
});

const website = (locale) => ({
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  url: SITE_URL,
  name: 'MohamadDev',
  inLanguage: locale,
  publisher: { '@id': `${SITE_URL}/#mohamad` },
});

const metaFor = (page, locale) =>
  page === 'services'
    ? {
        title: services[locale].meta.title,
        description: services[locale].meta.description,
        image: services[locale].meta.ogImage,
        alt: services[locale].meta.ogImageAlt,
      }
    : { ...content[locale].meta[page], alt: content[locale].meta[page].title };

const graphFor = (page, locale) => {
  const site = content[locale];
  const meta = metaFor(page, locale);
  const nodes = [person(locale), website(locale), webPage(page, locale, meta)];

  if (page === 'home') {
    nodes.push({
      '@type': 'ItemList',
      name: site.home.capabilities.title,
      itemListElement: site.home.capabilities.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        description: item.text,
        url: `${urlFor('services', locale)}#solution-${item.id}`,
      })),
    });
  }

  if (page === 'services') {
    const t = services[locale];
    nodes.push(
      ...t.solutions.map((s) => ({
        '@type': 'Service',
        name: s.label,
        serviceType: s.label,
        description: s.body,
        provider: { '@id': `${SITE_URL}/#mohamad` },
        availableLanguage: ORDER,
        url: `${urlFor('services', locale)}#solution-${s.id}`,
      })),
      {
        '@type': 'FAQPage',
        '@id': `${urlFor('services', locale)}#faq`,
        inLanguage: locale,
        mainEntity: t.faq.items.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    );
  }

  if (page === 'work') {
    nodes.push({
      '@type': 'ItemList',
      name: site.work.hero.title,
      itemListElement: site.work.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'CreativeWork',
          name: item.name,
          description: item.challenge,
          creator: { '@id': `${SITE_URL}/#mohamad` },
          url: item.links[0]?.href,
          keywords: item.technology.join(', '),
        },
      })),
    });
  }

  if (page === 'contact') {
    nodes.push({
      '@type': 'ContactPage',
      '@id': `${urlFor('contact', locale)}#contact`,
      mainEntity: {
        '@id': `${SITE_URL}/#mohamad`,
        contactPoint: { '@type': 'ContactPoint', email: EMAIL, telephone: PHONE, contactType: 'sales', availableLanguage: ORDER },
      },
    });
  }

  return { '@context': 'https://schema.org', '@graph': nodes };
};

const render = (page, locale) => {
  const meta = metaFor(page, locale);
  const { dir } = LOCALES[locale];
  const url = urlFor(page, locale);
  const image = `${SITE_URL}${meta.image}`;
  let html = shell;

  const replace = (pattern, value, label) => {
    if (!pattern.test(html)) throw new Error(`prerender-seo: could not find ${label} in build/index.html`);
    html = html.replace(pattern, (_, start, end) => `${start}${esc(value)}${end}`);
  };

  if (!/<html lang="en">/.test(html)) throw new Error('prerender-seo: could not find <html lang="en">');
  html = html.replace('<html lang="en">', `<html lang="${locale}" dir="${dir}">`);
  replace(/(<title>)[^<]*(<\/title>)/, meta.title, '<title>');
  replace(/(<meta name="description" content=")[^"]*(")/, meta.description, 'meta description');
  replace(/(<meta property="og:title" content=")[^"]*(")/, meta.title, 'og:title');
  replace(/(<meta property="og:description" content=")[^"]*(")/, meta.description, 'og:description');
  replace(/(<meta property="og:url" content=")[^"]*(")/, url, 'og:url');
  replace(/(<meta property="og:image" content=")[^"]*(")/, image, 'og:image');
  replace(/(<meta name="twitter:title" content=")[^"]*(")/, meta.title, 'twitter:title');
  replace(/(<meta name="twitter:description" content=")[^"]*(")/, meta.description, 'twitter:description');
  replace(/(<meta name="twitter:image" content=")[^"]*(")/, image, 'twitter:image');

  // Preload exactly the chunks this page and language need.
  const chunkKeys = [`page-${page}.js`, `page-${page}.css`, `content-${locale}.js`];
  if (page === 'services') chunkKeys.push(`services-${locale}.js`);
  const preloads = chunkKeys
    .filter((key) => manifest[key])
    .map((key) => `<link rel="preload" as="${key.endsWith('.css') ? 'style' : 'script'}" href="${manifest[key]}"/>`);
  if (preloads.length < chunkKeys.length) console.warn(`prerender-seo: missing chunks for ${page}/${locale}`);

  // The Arabic/Hebrew face is on the critical path for those pages: appended to
  // the end of <head> it only starts fetching after the app CSS and every chunk
  // preload, which pushes the headline's final paint (and so LCP) late. It is
  // preloaded next to the existing preconnects instead, so the fetch starts at
  // once — but it is still applied non-blockingly, or it delays first paint.
  if (FONTS[locale]) {
    html = html.replace(
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>',
      `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link rel="preload" as="style" href="${FONTS[locale]}"/><link rel="stylesheet" href="${FONTS[locale]}" media="print" onload="this.media='all'"/>`
    );
  }

  const head = [
    ...preloads,
    `<link rel="canonical" href="${esc(url)}"/>`,
    ...ORDER.map((l) => `<link rel="alternate" hreflang="${l}" href="${urlFor(page, l)}"/>`),
    `<link rel="alternate" hreflang="x-default" href="${urlFor(page, 'en')}"/>`,
    `<meta property="og:locale" content="${LOCALES[locale].ogLocale}"/>`,
    ...ORDER.filter((l) => l !== locale).map((l) => `<meta property="og:locale:alternate" content="${LOCALES[l].ogLocale}"/>`),
    `<meta property="og:image:width" content="1200"/>`,
    `<meta property="og:image:height" content="630"/>`,
    `<meta property="og:image:alt" content="${esc(meta.alt)}"/>`,
    `<script type="application/ld+json">${JSON.stringify(graphFor(page, locale)).replace(/</g, '\\u003c')}</script>`,
  ].filter(Boolean);
  html = html.replace('</head>', `${head.join('')}</head>`);

  const relative = `${LOCALES[locale].prefix}/${PAGES[page]}`.replace(/\/$/, '');
  const outDir = path.join(build, relative);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  return relative || '/';
};

const written = [];
ORDER.forEach((locale) => Object.keys(PAGES).forEach((page) => written.push(render(page, locale))));
console.log(`prerender-seo: wrote ${written.length} pages — ${written.join(', ')}`);
