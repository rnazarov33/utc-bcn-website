import React, { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import CompanyReferrals from './CompanyReferrals';
import { translations } from './translations';
import { getHashPageView, initAnalytics, trackPageView } from './lib/analytics';

export default function App() {
  const [view, setView] = useState('home');
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('lang');
    if (saved) return saved;
    const browserLang = navigator.language.split('-')[0];
    return (browserLang === 'uk' || browserLang === 'ru') ? 'uk' : 'en';
  });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useLayoutEffect(() => {
    localStorage.setItem('theme', theme);
    const isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const pagePath = view === 'home' ? '/' : '/referrals';
    const pageTitle = view === 'home' ? 'UTC Barcelona - Home' : 'UTC Barcelona - Referrals';

    trackPageView(pagePath, pageTitle);
  }, [view]);

  useEffect(() => {
    if (view !== 'home') {
      return undefined;
    }

    const trackHashChange = () => {
      const hashPageView = getHashPageView();
      if (hashPageView) {
        trackPageView(hashPageView.pagePath, hashPageView.pageTitle);
      }
    };

    window.addEventListener('hashchange', trackHashChange);
    trackHashChange();

    return () => {
      window.removeEventListener('hashchange', trackHashChange);
    };
  }, [view]);

  // Translation helper
  const t = useCallback((path) => {
    const keys = path.split('.');
    let value = translations[lang];
    for (const key of keys) {
      if (!value) return path;
      value = value[key];
    }
    return value || path;
  }, [lang]);

  const links = {
    join: "#community",
    events: "#events",
    referrals: "#referrals",
    rules: "#rules",
    about: "#about",
    telegram: "https://t.me/+sksFxTZOGEQ4MTQ6",
    instagram: "https://www.instagram.com/utc.barca/",
    linkedin: "https://www.linkedin.com/company/utc-barcelona/",
    luma: "https://lu.ma/utc-events",
    ideaForm: "https://tally.so/r/your-idea-form",
    issueForm: "https://tally.so/r/your-issue-form",
    referralForm: "https://docs.google.com/forms/d/e/1FAIpQLSdAH8n78Clqrqz9P7mjZ8qlViqQqu9nKsdoU8tAIdOmVnzCIw/viewform",
    email: "mailto:hello@utcbarcelona.com",
    chats: "#community",
    rulesRepo: "https://github.com/rnazarov33/utc-rules",
  };

  const communityRulesHref = links.rulesRepo;

  const stats = [
    { value: "2024", label: t('stats.founded') },
    { value: "60+", label: t('stats.events') },
    { value: "1200+", label: t('stats.people') },
    { value: "20%", label: t('stats.perEvent') },
  ];

  const features = [
    {
      title: t('features.networkTitle'),
      text: t('features.networkText'),
    },
    {
      title: t('features.eventsTitle'),
      text: t('features.eventsText'),
    },
    {
      title: t('features.adviceTitle'),
      text: t('features.adviceText'),
    },
    {
      title: t('features.perksTitle'),
      text: t('features.perksText'),
    },
  ];

  const communityChats = {
    main: {
      title: t('chats.mainTitle'),
      text: t('chats.mainText'),
      cta: t('chats.mainCta'),
      href: links.telegram,
    },
    channels: [
      {
        title: t('chats.designers'),
        text: t('chats.designersText'),
        href: "https://t.me/+epTOB0y6Xm5iYzgy",
      },
      {
        title: t('chats.engineers'),
        text: t('chats.engineersText'),
        href: "https://t.me/+9SwiupnOvOhkYmI6",
      },
      {
        title: t('chats.product'),
        text: t('chats.productText'),
        href: "https://t.me/+LHRi3Xw31o04MzZi",
      },
      {
        title: t('chats.chaos'),
        text: t('chats.chaosText'),
        href: "https://t.me/utcdiscuss",
        inviteOnly: true,
      },
      {
        title: t('chats.housing'),
        text: t('chats.housingText'),
        href: "https://t.me/+Vrbn21TcRyEwMGVi",
      },
      {
        title: t('chats.digest'),
        text: t('chats.digestText'),
        href: "https://t.me/utc_hub_digest",
      },
    ],
  };

  return (
    <div className={`${lang === 'uk' ? 'font-sansUk' : 'font-sansEn'} ${theme === 'dark' ? 'dark' : ''} min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 selection:bg-brand selection:text-white`}>
      <Header links={links} setView={setView} currentView={view} lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} t={t} />
      {view === 'home' ? (
        <main>
          <Hero links={links} t={t} />
          <StatsSection stats={stats} t={t} />
          <FeatureSection features={features} t={t} />
          <EventsSection links={links} t={t} />
          <JoinChatsSection chats={communityChats} communityRulesHref={communityRulesHref} t={t} />
          <ReferralsSection links={links} setView={setView} t={t} />
          <AboutSection t={t} lang={lang} />
          <FeedbackSection links={links} t={t} />
          <JoinSection links={links} t={t} />
        </main>
      ) : (
        <CompanyReferrals onBack={() => setView('home')} links={links} lang={lang} t={t} />
      )}
      <Footer links={links} communityRulesHref={communityRulesHref} t={t} />
    </div>
  );
}

function Header({ links, setView, currentView, lang, setLang, theme, setTheme, t }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { label: t('nav.events'), href: links.events, type: 'anchor' },
    { label: t('nav.referrals'), href: '#', type: 'route', view: 'referrals' },
    { label: t('nav.chats'), href: links.chats, type: 'anchor' },
    { label: t('nav.rules'), href: links.rules, type: 'anchor' },
    { label: t('nav.about'), href: links.about, type: 'anchor' },
  ];

  const handleNavClick = (e, item) => {
    if (item.type === 'route') {
      e.preventDefault();
      setMobileMenuOpen(false);
      setView(item.view);
    } else if (currentView !== 'home') {
      e.preventDefault();
      setMobileMenuOpen(false);
      setView('home');
      requestAnimationFrame(() => {
        const target = document.querySelector(item.href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } else {
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a
          href="#top"
          onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setView('home'); window.scrollTo(0, 0); }}
          className="flex items-center"
        >
          <img
            src="/images/logo-light.png"
            alt="UTC Barcelona"
            className="h-10 w-auto"
          />
        </a>

        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`text-sm font-medium transition hover:text-slate-950 dark:hover:text-white ${item.type === 'route' && currentView === item.view ? 'text-brand' : 'text-slate-500 dark:text-slate-400'
                  }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <LanguageSelector lang={lang} setLang={setLang} />
          <ThemeToggle theme={theme} setTheme={setTheme} t={t} />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-2 text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900 lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {mobileMenuOpen ? (
                <path d="M6 6L18 18M18 6L6 18" />
              ) : (
                <path d="M4 7H20M4 12H20M4 17H20" />
              )}
            </svg>
          </button>

          <a
            href={links.join}
            className="hidden rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark sm:block"
          >
            {t('nav.joinCommunity')}
          </a>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="mobile-nav" className="border-t border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-slate-50 dark:hover:bg-slate-900 ${
                  item.type === 'route' && currentView === item.view ? 'text-brand' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href={links.join}
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 rounded-lg bg-brand px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              {t('nav.joinCommunity')}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

function LanguageSelector({ lang, setLang }) {
  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-gray-300 dark:border-slate-700">
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
          lang === 'en' ? 'bg-brand text-white' : 'bg-white text-slate-600 hover:bg-gray-50 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900'
        }`}
      >
        EN
      </button>
      <div className="h-5 w-px bg-gray-300 dark:bg-slate-700" />
      <button
        onClick={() => setLang('uk')}
        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${
          lang === 'uk' ? 'bg-brand text-white' : 'bg-white text-slate-600 hover:bg-gray-50 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900'
        }`}
      >
        UA
      </button>
    </div>
  );
}

function ThemeToggle({ theme, setTheme, t }) {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
      aria-label={isDark ? t('nav.themeToLight') : t('nav.themeToDark')}
      title={isDark ? t('nav.themeToLight') : t('nav.themeToDark')}
    >
      {isDark ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
        </svg>
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}

function Hero({ links, t }) {
  return (
    <section id="top" className="relative overflow-hidden bg-white transition-colors dark:bg-slate-950">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="flex flex-col justify-center">
          <div className="mb-4 inline-flex w-fit items-center rounded-lg border border-brand/20 bg-brand/5 px-3 py-1 text-sm text-brand font-medium">
            {t('hero.eyebrow')}
          </div>
          <h1 className="max-w-2xl text-5xl font-bold tracking-tighter text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
            {t('hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {t('hero.descriptionStart')}{' '}
            <span className="font-semibold text-slate-900 dark:text-white">
              {t('hero.descriptionHighlight')}
            </span>{' '}
            {t('hero.descriptionEnd')}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={links.join}
              className="rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
            >
              {t('hero.ctaJoin')}
            </a>
            <a
              href={links.events}
              className="rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:border-gray-300 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              {t('hero.ctaEvents')}
            </a>
          </div>
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
            {t('hero.badge')}
          </p>
        </div>

        <HeroCarousel t={t} />
      </div>
    </section>
  );
}

function HeroCarousel({ t }) {
  const slides = [
    {
      src: "/images/750F535C-DCCB-4EB4-8913-BFA8D762499E.JPG?v=3",
      alt: "UTC Barcelona community gathering",
      title: t('hero.photo1'),
      caption: t('hero.badge'),
      imageClassName: "",
    },
    {
      src: "/images/72DA8CD1-2E97-40BD-AFF8-D80222154375.JPG?v=3",
      alt: "UTC community",
      title: t('hero.photo3'),
      caption: t('hero.photo2text'),
      imageClassName: "rotate-180",
    },
    {
      src: "/images/0b33a600-84eb-4ef6-b9dc-3f30c1703799%20(1).avif",
      alt: "UTC Barcelona event moment",
      title: t('hero.photo1'),
      caption: t('hero.badge'),
      imageClassName: "",
    },
    {
      src: "/images/41544195-c405-4bb8-adc3-9c8ed5a2c14e.avif",
      alt: "UTC Barcelona meetup",
      title: t('hero.photo3'),
      caption: t('hero.photo2text'),
      imageClassName: "",
    },
    {
      src: "/images/721b14a7-3a26-4338-8b58-638109c0d88c.avif",
      alt: "UTC Barcelona community photo",
      title: t('hero.photo1'),
      caption: t('hero.badge'),
      imageClassName: "",
    },
    {
      src: "/images/A584953E-1C1E-40F8-A301-A6CC50D03F0B.JPG",
      alt: "UTC Barcelona community event",
      title: t('hero.photo3'),
      caption: t('hero.photo2text'),
      imageClassName: "",
    },
    {
      src: "/images/FB429EBB-3514-4D43-9268-794C877B0DC9.JPG",
      alt: "UTC Barcelona crowd",
      title: t('hero.photo1'),
      caption: t('hero.badge'),
      imageClassName: "",
    },
    {
      src: "/images/d5c39b39-1617-4e3f-990d-9c454a3e9ff3.avif",
      alt: "UTC Barcelona social gathering",
      title: t('hero.photo3'),
      caption: t('hero.photo2text'),
      imageClassName: "",
    },
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => setActiveSlide(index);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-[2rem] border border-gray-100 bg-white p-3 shadow-sm transition duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gray-50 dark:bg-slate-800">
          {slides.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-all duration-700 ${
                index === activeSlide ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-[1.03]'
              }`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className={`h-full w-full object-cover transition-transform duration-700 ${slide.imageClassName}`}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 pr-36 sm:pr-44">
                <p className="max-w-[16ch] text-xl font-semibold leading-tight text-white sm:max-w-[18ch] sm:text-2xl">
                  {slide.title}
                </p>
              </div>
              <div className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/50 px-3 py-2 backdrop-blur">
                {slides.map((item, dotIndex) => (
                  <button
                    key={item.src}
                    type="button"
                    onClick={() => goToSlide(dotIndex)}
                    className={`h-2.5 rounded-full transition-all ${
                      dotIndex === activeSlide ? 'w-8 bg-brand' : 'w-2.5 bg-white/45 hover:bg-white/75'
                    }`}
                    aria-label={`Go to slide ${dotIndex + 1}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsSection({ stats, t }) {
  return (
    <section className="border-t border-gray-200 bg-gray-50 transition-colors dark:border-slate-800 dark:bg-slate-900/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionIntro eyebrow={t('stats.eyebrow')} title={t('stats.title')} />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
              <div className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{stat.value}</div>
              <div className="mt-2 text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection({ features, t }) {
  return (
    <section className="border-t border-gray-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionIntro
          eyebrow={t('features.eyebrow')}
          title={t('features.title')}
          description={t('features.description')}
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 h-10 w-10 rounded-lg bg-brand/15 flex items-center justify-center">
                <div className="h-5 w-5 rounded bg-brand/40" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EventsSection({ links, t }) {
  const eventPosters = [
    {
      src: "/images/events/home-in-bcn.png",
      alt: "UTC Barcelona event poster, Home in BCN",
    },
    {
      src: "/images/events/utc-event-mobile-apps.avif",
      alt: "UTC Barcelona event poster, Mobile Apps",
    },
    {
      src: "/images/events/utc-event-data-decisions.avif",
      alt: "UTC Barcelona event poster, Data and Decisions",
    },
    {
      src: "/images/events/utc-event-dima-maleev.avif",
      alt: "UTC Barcelona event poster, Dima Maleev",
    },
    {
      src: "/images/events/utc-event-fuckup-night.avif",
      alt: "UTC Barcelona event poster, Fuckup Night",
    },
    {
      src: "/images/events/utc-event-product-marketing-ux.avif",
      alt: "UTC Barcelona event poster, Product Marketing UX",
    },
    {
      src: "/images/events/utc-event-generative-ai.avif",
      alt: "UTC Barcelona event poster, Generative AI",
    },
    {
      src: "/images/events/utc-event-leadership.avif",
      alt: "UTC Barcelona event poster, Leadership",
    },
    {
      src: "/images/events/utc-event-usyk-watchparty.avif",
      alt: "UTC Barcelona event poster, Usyk watch party",
    },
    {
      src: "/images/events/utc-event-community-photo-1.avif",
      alt: "UTC Barcelona event poster",
    },
    {
      src: "/images/events/utc-event-community-photo-2.avif",
      alt: "UTC Barcelona event poster",
    },
  ];
  const posterWall = [...eventPosters, ...eventPosters.slice(0, 6)];

  return (
    <section id="events" className="border-t border-gray-200 bg-gray-50 py-12 transition-colors dark:border-slate-800 dark:bg-slate-900/60 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro
          eyebrow={t('events.eyebrow')}
          title={t('events.title')}
          description={t('events.description')}
        />

        <div className="mt-6">
          <a
            href={links.luma}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            {t('events.ctaAll')}
          </a>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[2rem] border border-slate-800/90 bg-[#030712] shadow-[0_28px_80px_rgba(2,6,23,0.75)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 grid grid-cols-3 gap-3 p-4 sm:grid-cols-4 lg:grid-cols-6 lg:gap-4 lg:p-6">
              {posterWall.map((poster, index) => (
                <div key={`wall-${poster.src}-${index}`} className={`overflow-hidden rounded-xl ${index % 7 === 0 ? 'lg:col-span-2' : ''}`}>
                  <img
                    src={poster.src}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover [filter:brightness(.52)_saturate(.9)]"
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(99,91,255,0.24),transparent_52%)]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#02050d] via-[#02050df2] to-[#02050da8]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#02050d] via-[#02050d7a] to-transparent" />
            <div className="absolute inset-0 [box-shadow:inset_0_0_160px_rgba(2,6,23,0.95)]" />
          </div>

          <div className="relative z-10 px-4 py-5 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
            <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300 backdrop-blur sm:left-7 sm:top-7">
              {t('events.inspirationEyebrow')}
            </div>

            <div className="relative h-[360px] sm:h-[430px] lg:h-[520px]">
              <PosterCarousel posters={eventPosters} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PosterCarousel({ posters }) {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const lastFrameRef = useRef(0);
  const offsetRef = useRef(0);
  const pauseRef = useRef(false);
  const dragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startOffset: 0,
  });
  const [offset, setOffset] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!stageRef.current) return undefined;

    const observer = new ResizeObserver(([entry]) => {
      setStageWidth(entry.contentRect.width);
    });

    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const speed = 0.11;

    const animate = (timestamp) => {
      if (!lastFrameRef.current) {
        lastFrameRef.current = timestamp;
      }

      const deltaMs = Math.min(timestamp - lastFrameRef.current, 34);
      lastFrameRef.current = timestamp;

      if (!pauseRef.current && !dragRef.current.active) {
        const nextOffset = normalizePosterOffset(offsetRef.current + (deltaMs / 1000) * speed, posters.length);
        offsetRef.current = nextOffset;
        setOffset(nextOffset);
      }

      frameRef.current = window.requestAnimationFrame(animate);
    };

    frameRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, [posters.length]);

  const setPausedState = (nextPaused) => {
    pauseRef.current = nextPaused;
    lastFrameRef.current = performance.now();
  };

  const handlePointerDown = (event) => {
    if (!stageRef.current) return;

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetRef.current,
    };
    setIsDragging(true);
    setPausedState(true);
    stageRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const dragState = dragRef.current;
    if (!dragState.active || dragState.pointerId !== event.pointerId || !stageWidth) return;

    const spacing = Math.max(stageWidth * 0.23, 92);
    const deltaX = event.clientX - dragState.startX;
    const nextOffset = normalizePosterOffset(dragState.startOffset - deltaX / spacing, posters.length);
    offsetRef.current = nextOffset;
    setOffset(nextOffset);
  };

  const finishDrag = (pointerId) => {
    const dragState = dragRef.current;
    if (!dragState.active || dragState.pointerId !== pointerId) return;

    dragRef.current = {
      active: false,
      pointerId: null,
      startX: 0,
      startOffset: offsetRef.current,
    };
    setIsDragging(false);
    setPausedState(false);
  };

  const baseCardWidth = clamp(stageWidth * 0.46 || 260, 170, 320);
  const spacing = Math.max(stageWidth * 0.23 || 140, 92);
  const visiblePosters = posters
    .map((poster, index) => {
      const relativePosition = getWrappedPosterDelta(index, offset, posters.length);
      const distanceFromCenter = Math.abs(relativePosition);

      if (distanceFromCenter > 4.4) return null;

      const clampedDistance = Math.min(distanceFromCenter, 4);
      const scale = clamp(1.08 - clampedDistance * 0.15, 0.56, 1.08);
      const opacity = clamp(1 - clampedDistance * 0.16, 0, 1);
      const brightness = clamp(1.08 - clampedDistance * 0.14, 0.58, 1.08);
      const saturation = clamp(1.04 - clampedDistance * 0.07, 0.72, 1.08);
      const blur = distanceFromCenter > 2.7 ? (distanceFromCenter - 2.7) * 0.7 : 0;
      const translateX = relativePosition * spacing;
      const translateY = clampedDistance * 14 + Math.min(clampedDistance * clampedDistance * 4, 30);
      const rotation = relativePosition * 7;
      const zIndex = Math.round((10 - clampedDistance) * 10);

      return {
        ...poster,
        style: {
          left: '50%',
          top: '48%',
          width: `${baseCardWidth}px`,
          zIndex,
          opacity,
          filter: `brightness(${brightness}) saturate(${saturation}) blur(${blur}px)`,
          transform: `translate(-50%, -50%) translate3d(${translateX}px, ${translateY}px, 0) scale(${scale}) rotate(${rotation}deg)`,
        },
        isFocused: distanceFromCenter < 0.5,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.style.zIndex - b.style.zIndex);

  return (
    <div
      ref={stageRef}
      className={`absolute inset-0 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{ touchAction: 'pan-y' }}
      onMouseEnter={() => !dragRef.current.active && setPausedState(true)}
      onMouseLeave={() => !dragRef.current.active && setPausedState(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => finishDrag(event.pointerId)}
      onPointerCancel={(event) => finishDrag(event.pointerId)}
      onLostPointerCapture={(event) => finishDrag(event.pointerId)}
    >
      {visiblePosters.map((poster) => (
        <div
          key={poster.src}
          className={`absolute aspect-square overflow-hidden rounded-2xl border border-white/18 bg-[#020617] shadow-[0_22px_45px_rgba(2,6,23,0.62)] will-change-transform ${
            poster.isFocused ? 'shadow-[0_24px_56px_rgba(2,6,23,0.72)]' : ''
          }`}
          style={poster.style}
        >
          <img
            src={poster.src}
            alt={poster.alt}
            loading="lazy"
            draggable="false"
            className="h-full w-full bg-[#020617] object-contain p-2 select-none sm:p-3"
          />
        </div>
      ))}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#030712] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#030712] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#030712] to-transparent" />
    </div>
  );
}

function normalizePosterOffset(value, count) {
  return ((value % count) + count) % count;
}

function getWrappedPosterDelta(index, offset, count) {
  let delta = index - offset;
  if (delta > count / 2) delta -= count;
  if (delta < -count / 2) delta += count;
  return delta;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function JoinChatsSection({ chats, communityRulesHref, t }) {
  return (
    <section id="community" className="border-t border-gray-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionIntro
        eyebrow={t('chats.eyebrow')}
        title={t('chats.title')}
        description={t('chats.description')}
      />

      {/* Main Chat — prominent */}
      <a
        href={chats.main.href}
        target="_blank"
        rel="noreferrer"
        className="mt-8 block rounded-2xl border-2 border-brand/20 bg-gradient-to-br from-sky-50 to-white p-8 shadow-sm transition hover:border-brand/30 hover:shadow-md dark:from-slate-900 dark:to-slate-950"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">{chats.main.title}</h3>
            <p className="mt-2 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300">{chats.main.text}</p>
          </div>
          <span className="inline-flex shrink-0 items-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            {chats.main.cta} →
          </span>
        </div>
      </a>

      {/* Secondary chats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {chats.channels.map((ch) => (
          ch.inviteOnly ? (
            <div
              key={ch.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">{ch.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{ch.text}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t('chats.inviteOnly')}
              </span>
            </div>
          ) : (
            <a
              key={ch.title}
              href={ch.href}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-brand/20 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <h3 className="text-lg font-semibold tracking-tight text-slate-950 dark:text-white">{ch.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{ch.text}</p>
              <span className="mt-4 inline-flex text-sm font-semibold text-brand group-hover:text-brand-dark">
                {t('chats.join')} →
              </span>
            </a>
          )
        ))}
      </div>

      <CommunityRulesNotice communityRulesHref={communityRulesHref} t={t} />
      </div>
    </section>
  );
}

function CommunityRulesNotice({ communityRulesHref, t }) {
  const [expanded, setExpanded] = useState(false);
  const compactItems = t('rules.compactItems');

  useEffect(() => {
    const syncExpandedWithHash = () => {
      if (window.location.hash === '#rules') {
        setExpanded(true);
      }
    };

    syncExpandedWithHash();
    window.addEventListener('hashchange', syncExpandedWithHash);

    return () => window.removeEventListener('hashchange', syncExpandedWithHash);
  }, []);

  return (
    <div id="rules" className="mt-8 scroll-mt-24 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">{t('rules.eyebrow')}</div>
          <div className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-100">{t('rules.collapsedTitle')}</div>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{t('rules.collapsedDescription')}</p>
        </div>

        <div className="flex shrink-0 flex-row flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center justify-center text-sm font-medium text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            aria-expanded={expanded}
          >
            {expanded ? t('rules.collapse') : t('rules.expand')}
          </button>
          <a
            href={communityRulesHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center text-sm font-semibold text-slate-700 transition hover:text-slate-950 dark:text-slate-100 dark:hover:text-white"
          >
            {t('rules.cta')}
          </a>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-slate-200/80 pt-4 dark:border-slate-800">
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">{t('rules.title')}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('rules.description')}</p>
          <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300 md:grid-cols-2 xl:grid-cols-3">
            {compactItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {t('rules.housingNote')}{' '}
            <a
              href={communityRulesHref}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-950 hover:decoration-slate-500 dark:text-slate-100 dark:decoration-slate-600 dark:hover:text-white"
            >
              {t('rules.inlineLink')}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

function ReferralsSection({ links, setView, t }) {
  return (
    <section id="referrals" className="bg-black py-16 text-white lg:py-24">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <div className="text-sm font-medium uppercase tracking-[0.18em] text-brand/80">{t('homeReferrals.eyebrow')}</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{t('homeReferrals.title')}</h2>
        <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:mt-10 md:gap-x-12 md:gap-y-8 lg:mt-12">
          {["Amazon", "Apple", "Glovo", "Porsche Digital", "Rakuten", "Stripe", "Preply"].map((name) => (
            <div key={name} className="flex items-center justify-center">
              <img
                src={`/logos/${name.toLowerCase().replace(/\s+/g, '-')}.svg`}
                alt={name}
                className="h-6 w-auto opacity-50 grayscale brightness-0 invert transition hover:opacity-100 hover:grayscale-0 md:h-8"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-base leading-8 text-slate-300 lg:mt-12">
          {t('homeReferrals.description')}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setView('referrals')}
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            {t('homeReferrals.viewCta')}
          </button>
          <a
            href={links.referralForm}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            {t('homeReferrals.addCta')}
          </a>
        </div>
      </div>
    </section>
  );
}


function FeedbackSection({ t }) {
  const [activeForm, setActiveForm] = useState(null);

  return (
    <section className="border-t border-gray-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <SectionIntro
        eyebrow={t('feedback.eyebrow')}
        title={t('feedback.title')}
        description={t('feedback.description')}
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('feedback.ideaTitle')}</h3>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
            {t('feedback.ideaText')}
          </p>
          {activeForm === 'idea' ? (
            <FeedbackForm
              t={t}
              type="idea"
              webhook="https://n8n.productbootcamps.com/webhook/9dd6e623-d0a3-4e1b-a046-539830a3db5f"
              onCancel={() => setActiveForm(null)}
            />
          ) : (
            <button
              onClick={() => setActiveForm('idea')}
              className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              {t('feedback.ideaCta')}
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">{t('feedback.issueTitle')}</h3>
          <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
            {t('feedback.issueText')}
          </p>
          {activeForm === 'issue' ? (
            <FeedbackForm
              t={t}
              type="issue"
              webhook="https://n8n.productbootcamps.com/webhook/2205123d-43da-44f7-950f-c85951428060"
              onCancel={() => setActiveForm(null)}
            />
          ) : (
            <button
              onClick={() => setActiveForm('issue')}
              className="mt-6 inline-flex rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
            >
              {t('feedback.issueCta')}
            </button>
          )}
        </div>
      </div>
      </div>
    </section>
  );
}

function FeedbackForm({ t, type, webhook, onCancel }) {
  const [status, setStatus] = useState('idle');

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');

    const formData = new FormData(e.target);
    const data = {
      type,
      name: formData.get('name'),
      contact: formData.get('contact'),
      message: formData.get('message'),
      timestamp: new Date().toISOString()
    };

    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200">
        {t('feedback.formSuccess')}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
      <input
        required
        name="name"
        placeholder={t('feedback.formName')}
        className="w-full rounded-xl border border-gray-100 px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <input
        required
        name="contact"
        placeholder={t('feedback.formContact')}
        className="w-full rounded-xl border border-gray-100 px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <textarea
        required
        name="message"
        rows={4}
        placeholder={t('feedback.formMessage')}
        className="w-full resize-none rounded-xl border border-gray-100 px-4 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-1 focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
      />
      <div className="flex items-center gap-3 mt-2">
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white transition ${type === 'idea' ? 'bg-brand hover:bg-brand-dark' : 'bg-slate-700 hover:bg-slate-800'} disabled:opacity-50`}
        >
          {status === 'submitting' ? t('feedback.formSending') : t('feedback.formSubmit')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={status === 'submitting'}
          className="rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:text-slate-900 disabled:opacity-50 dark:text-slate-300 dark:hover:text-white"
        >
          {t('feedback.formCancel')}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-600">Failed to submit. Please try again.</p>
      )}
    </form>
  );
}
function AboutSection({ t, lang }) {
  const names = {
    roman: { en: "Roman Nazarov", uk: "Роман Назаров", url: "https://www.linkedin.com/in/roman-nazarov-28295893/" },
    oleksiy: { en: "Oleksiy Kupin", uk: "Олексій Купін", url: "https://www.linkedin.com/in/oleksiy-kupin-%F0%1F%87%BA%F0%1F%87%A6-188b05154/" },
    alina: { en: "Alina Nazarova", uk: "Аліна Назарова", url: "https://www.linkedin.com/in/alina-nazarova-9554552b/" },
    dima: { en: "Dima Drozd", uk: "Діма Дрозд", url: "https://www.linkedin.com/in/dm-drozd/" },
    volodymyr: { en: "Volodymyr Manoilo", uk: "Володимир Манойло", url: "https://www.linkedin.com/in/manoilo/" },
    sviat: { en: "Sviat Popov", uk: "Свят Попов", url: "https://www.linkedin.com/in/sviatpopov/" },
    anna: { en: "Anna Zabuha", uk: "Анна Забуга", url: "https://www.linkedin.com/in/anna-zabuha-9b525458/" },
    valentine: { en: "Valentyne Reshetniak", uk: "Валентин Решетняк", url: "https://www.linkedin.com/in/valentine-reshetniak/" },
    anton: { en: "Anton Leshchenko", uk: "Антон Лещенко", url: "https://www.linkedin.com/in/a-leshchenko/" }
  };

  const link = (key) => (
    <a href={names[key].url} target="_blank" rel="noreferrer" className="font-medium text-slate-950 underline decoration-brand/30 underline-offset-4 transition-colors hover:decoration-brand dark:text-white">
      {lang === 'en' ? names[key].en : names[key].uk}
    </a>
  );

  return (
    <section id="about" className="border-t border-gray-200 bg-gray-50 py-12 transition-colors dark:border-slate-800 dark:bg-slate-900/60 lg:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionIntro eyebrow={t('about.eyebrow')} title={t('about.title')} />
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-950">
          <p className="text-base leading-8 text-slate-700 dark:text-slate-300">
            {lang === 'en' ? (
              <>{link('roman')}, {link('oleksiy')}, and {link('alina')} — Ukrainian IT professionals in Barcelona — decided to gather people offline in April 2024. Their first event at Glovo brought together more than 120 people, and that moment became the start of UTC.</>
            ) : (
              <>{link('roman')}, {link('oleksiy')} та {link('alina')} — українські IT-фахівці в Барселоні — у квітні 2024 року вирішили зібрати людей офлайн. Їхня перша подія в Glovo зібрала понад 120 людей, і з цього моменту почалася історія UTC.</>
            )}
          </p>
          <p className="mt-5 text-base leading-8 text-slate-700 dark:text-slate-300">
            {t('about.p2')}
          </p>
          <p className="mt-5 text-base leading-8 text-slate-700 dark:text-slate-300">
            {t('about.p3')}{' '}
            {link('roman')} — {t('about.cofounderMale')},{' '}
            {link('alina')} — {t('about.cofounderFemale')},{' '}
            {link('dima')},{' '}
            {link('volodymyr')},{' '}
            {link('sviat')},{' '}
            {link('anna')},{' '}
            {link('valentine')}, {lang === 'en' ? 'and' : 'та'} {link('anton')}.
          </p>
        </div>
      </div>
    </section>
  );
}

function JoinSection({ links, t }) {
  return (
    <section id="join" className="py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-black px-6 py-10 text-white shadow-xl sm:px-10 sm:py-12 lg:px-14 lg:py-16">
          <div className="max-w-3xl">
            <div className="text-sm font-medium uppercase tracking-[0.18em] text-brand/80">{t('joinFooter.eyebrow')}</div>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t('joinFooter.title')}
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-300">
              {t('joinFooter.description')}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={links.join}
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              {t('joinFooter.ctaJoin')}
            </a>
            <a
              href={links.ideaForm}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {t('joinFooter.ctaIdea')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ links, communityRulesHref, t }) {
  return (
    <footer className="border-t border-gray-100 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="text-base font-semibold text-slate-950 dark:text-white">{t('footer.brand')}</div>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            {t('footer.tagline')}
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-950 dark:text-white">{t('footer.explore')}</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
            <a href={links.events}>{t('nav.events')}</a>
            <a href={links.referrals}>{t('nav.referrals')}</a>
            <a href={links.about}>{t('nav.about')}</a>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-950 dark:text-white">{t('footer.links')}</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
            <a href={links.telegram} target="_blank" rel="noreferrer">Telegram</a>
            <a href={links.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={links.luma} target="_blank" rel="noreferrer">Luma</a>
            <a href={communityRulesHref} target="_blank" rel="noreferrer">{t('footer.rules')}</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 px-4 py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:px-6 lg:px-8">
        {t('footer.builtWith')}
      </div>
    </footer>
  );
}

function SectionIntro({ eyebrow, title, description }) {
  return (
    <div>
      {eyebrow ? (
        <div className="text-sm font-medium uppercase tracking-[0.18em] text-brand">{eyebrow}</div>
      ) : null}
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p> : null}
    </div>
  );
}
