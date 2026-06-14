const SITE_NAME = 'UTC Barcelona';
const SITE_URL = 'https://utcbarcelona.com';
const DEFAULT_IMAGE_PATH = '/images/750F535C-DCCB-4EB4-8913-BFA8D762499E.JPG';
const DEFAULT_IMAGE_ALT = 'UTC Barcelona community event';
const SOCIAL_PROFILES = [
  'https://t.me/+VQtfbCdlbBk3YzI6',
  'https://www.instagram.com/utc.barca/',
  'https://www.linkedin.com/company/utc-barcelona/',
  'https://lu.ma/utc-events',
];

const SEO_COPY = {
  en: {
    locale: 'en_US',
    home: {
      title: 'UTC Barcelona | Ukrainian Community, Events, Chats and Referrals',
      description: 'UTC Barcelona is a Ukrainian community in Barcelona connecting people through curated events, professional chats, trusted referrals, and a place to feel at home.',
    },
    referrals: {
      title: 'UTC Barcelona Referrals | Community-Powered Company Introductions',
      description: 'Browse community-powered company referrals from UTC Barcelona members, discover open roles, and find the right point of contact for trusted introductions.',
    },
  },
  uk: {
    locale: 'uk_UA',
    home: {
      title: 'UTC Barcelona | Українська спільнота, події, чати та реферали',
      description: 'UTC Barcelona — це українська спільнота в Барселоні з живими подіями, професійними чатами, довіреними рефералами та місцем, де легше відчути себе як удома.',
    },
    referrals: {
      title: 'UTC Barcelona Реферали | Спільнотні контакти до компаній',
      description: 'Переглядайте список компаній, де учасники UTC Barcelona можуть допомогти з рефералом, дізнавайтеся про ролі та знаходьте релевантний контакт.',
    },
  },
};

function getPreferredOrigin() {
  if (typeof window === 'undefined') {
    return SITE_URL;
  }

  const { hostname, origin } = window.location;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return SITE_URL;
  }

  return origin;
}

function toAbsoluteUrl(path, origin = getPreferredOrigin()) {
  return new URL(path, origin).toString();
}

function upsertMetaTag({ name, property, content }) {
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let meta = document.head.querySelector(selector);

  if (!meta) {
    meta = document.createElement('meta');
    if (name) meta.setAttribute('name', name);
    if (property) meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }

  meta.setAttribute('content', content);
}

function upsertLinkTag({ rel, href }) {
  let link = document.head.querySelector(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }

  link.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let script = document.head.querySelector(`script[data-seo-id="${id}"]`);

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seoId = id;
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(data);
}

export function updateSeo({ lang = 'en', view = 'home' }) {
  if (typeof document === 'undefined') {
    return;
  }

  const copy = SEO_COPY[lang] ?? SEO_COPY.en;
  const page = view === 'referrals' ? copy.referrals : copy.home;
  const origin = getPreferredOrigin();
  const canonicalUrl = toAbsoluteUrl('/', origin);
  const currentUrl = view === 'referrals' ? `${canonicalUrl}#referrals` : canonicalUrl;
  const imageUrl = toAbsoluteUrl(DEFAULT_IMAGE_PATH, origin);

  document.title = page.title;
  document.documentElement.lang = lang === 'uk' ? 'uk' : 'en';

  upsertLinkTag({ rel: 'canonical', href: canonicalUrl });

  upsertMetaTag({ name: 'description', content: page.description });
  upsertMetaTag({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
  upsertMetaTag({ name: 'theme-color', content: '#020617' });
  upsertMetaTag({ name: 'twitter:card', content: 'summary_large_image' });
  upsertMetaTag({ name: 'twitter:title', content: page.title });
  upsertMetaTag({ name: 'twitter:description', content: page.description });
  upsertMetaTag({ name: 'twitter:image', content: imageUrl });

  upsertMetaTag({ property: 'og:type', content: 'website' });
  upsertMetaTag({ property: 'og:site_name', content: SITE_NAME });
  upsertMetaTag({ property: 'og:locale', content: copy.locale });
  upsertMetaTag({ property: 'og:title', content: page.title });
  upsertMetaTag({ property: 'og:description', content: page.description });
  upsertMetaTag({ property: 'og:url', content: currentUrl });
  upsertMetaTag({ property: 'og:image', content: imageUrl });
  upsertMetaTag({ property: 'og:image:alt', content: DEFAULT_IMAGE_ALT });

  upsertJsonLd('utc-website', {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${canonicalUrl}#website`,
    url: canonicalUrl,
    name: SITE_NAME,
    description: SEO_COPY.en.home.description,
    inLanguage: ['en', 'uk'],
    publisher: {
      '@id': `${canonicalUrl}#organization`,
    },
  });

  upsertJsonLd('utc-organization', {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${canonicalUrl}#organization`,
    name: SITE_NAME,
    url: canonicalUrl,
    email: 'hello@utcbarcelona.com',
    image: imageUrl,
    logo: toAbsoluteUrl('/images/logo-light.png', origin),
    sameAs: SOCIAL_PROFILES,
    areaServed: 'Barcelona',
  });
}
