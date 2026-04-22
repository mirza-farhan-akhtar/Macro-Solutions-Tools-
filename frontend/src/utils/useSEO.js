import { useEffect } from 'react';

const SITE_URL = 'https://macrosolutionstools.com';
const SITE_NAME = 'MACRO Solutions Tools Ltd';
const DEFAULT_TITLE = 'MACRO Solutions Tools Ltd | Global Software Development Company';
const DEFAULT_DESC = 'MACRO Solutions Tools Ltd is a global software development company with offices in the UK, Pakistan, Somaliland, Ethiopia, and Dubai. Custom software, AI, cloud, and cybersecurity worldwide.';
const DEFAULT_IMAGE = 'https://macrosolutionstools.com/og-image.png';

/**
 * useSEO — sets document.title and all SEO meta tags for each page.
 * Canonical and og:url are made absolute using SITE_URL.
 *
 * @param {Object} opts
 * @param {string} opts.title       - Page title
 * @param {string} opts.description - Meta description (≤160 chars)
 * @param {string} [opts.keywords]  - Comma-separated keywords
 * @param {string} [opts.canonical] - Path e.g. '/about' — converted to full URL
 * @param {string} [opts.ogImage]   - Absolute image URL for og:image
 * @param {string} [opts.ogType]    - og:type e.g. 'article', defaults to 'website'
 */
export function useSEO({ title, description, keywords = '', canonical = '', ogImage = '', ogType = 'website' }) {
  useEffect(() => {
    const fullCanonical = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
    const currentUrl = `${SITE_URL}${window.location.pathname}`;
    const image = ogImage || DEFAULT_IMAGE;

    // ── Title ───────────────────────────────────────────────────────
    document.title = title;

    // ── Helper: upsert <meta> ────────────────────────────────────────
    const setMeta = (selector, attrPair, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const [k, v] = attrPair.split('=');
        el.setAttribute(k.trim(), v.replace(/['"]/g, '').trim());
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // ── Standard meta ────────────────────────────────────────────────
    setMeta('meta[name="description"]',         'name=description',         description);
    if (keywords) setMeta('meta[name="keywords"]', 'name=keywords',         keywords);

    // ── Open Graph ───────────────────────────────────────────────────
    setMeta('meta[property="og:type"]',         'property=og:type',         ogType);
    setMeta('meta[property="og:site_name"]',    'property=og:site_name',    SITE_NAME);
    setMeta('meta[property="og:title"]',        'property=og:title',        title);
    setMeta('meta[property="og:description"]',  'property=og:description',  description);
    setMeta('meta[property="og:url"]',          'property=og:url',          currentUrl);
    setMeta('meta[property="og:image"]',        'property=og:image',        image);
    setMeta('meta[property="og:image:alt"]',    'property=og:image:alt',    title);

    // ── Twitter Card ─────────────────────────────────────────────────
    setMeta('meta[name="twitter:title"]',       'name=twitter:title',       title);
    setMeta('meta[name="twitter:description"]', 'name=twitter:description', description);
    setMeta('meta[name="twitter:image"]',       'name=twitter:image',       image);
    setMeta('meta[name="twitter:image:alt"]',   'name=twitter:image:alt',   title);

    // ── Canonical link ───────────────────────────────────────────────
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', fullCanonical);

    // ── Cleanup: restore defaults on unmount ─────────────────────────
    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('meta[name="description"]',         'name=description',         DEFAULT_DESC);
      setMeta('meta[property="og:type"]',         'property=og:type',         'website');
      setMeta('meta[property="og:title"]',        'property=og:title',        DEFAULT_TITLE);
      setMeta('meta[property="og:description"]',  'property=og:description',  DEFAULT_DESC);
      setMeta('meta[property="og:url"]',          'property=og:url',          SITE_URL);
      setMeta('meta[property="og:image"]',        'property=og:image',        DEFAULT_IMAGE);
      setMeta('meta[name="twitter:title"]',       'name=twitter:title',       DEFAULT_TITLE);
      setMeta('meta[name="twitter:description"]', 'name=twitter:description', DEFAULT_DESC);
      setMeta('meta[name="twitter:image"]',       'name=twitter:image',       DEFAULT_IMAGE);
      const canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) canonical.setAttribute('href', SITE_URL);
    };
  }, [title, description, keywords, canonical, ogImage, ogType]);
}

/**
 * injectJSONLD — injects a JSON-LD script into <head> and removes it on unmount.
 * Use inside a useEffect in page components.
 */
export function injectJSONLD(id, schema) {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = id;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
  return () => {
    const el = document.getElementById(id);
    if (el) el.remove();
  };
}
