import React, { useState, useEffect, useCallback } from 'react';
import CompanyReferrals from './CompanyReferrals';
import { translations } from './translations';

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

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
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
    <div className={`${lang === 'uk' ? 'font-sansUk' : 'font-sansEn'} theme-${theme} min-h-screen bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100 selection:bg-brand selection:text-white`}>
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
            className="h-10 w-auto dark:brightness-0 dark:invert"
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
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-gray-100 bg-white p-3 shadow-sm transition duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 aspect-[4/5] overflow-hidden rounded-[1rem]">
              <img
                src="/images/750F535C-DCCB-4EB4-8913-BFA8D762499E.JPG?v=3"
                alt="UTC Barcelona community gathering"
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <p className="px-2 pb-1 text-sm font-medium text-slate-700 dark:text-slate-200">{t('hero.photo1')}</p>
          </div>
          <div className="mt-8 rounded-[1.5rem] border border-gray-100 bg-white p-3 shadow-sm transition duration-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:mt-14">
            <div className="group relative mb-4 aspect-[4/5] overflow-hidden rounded-[1rem] bg-gray-50 dark:bg-slate-800">
              <img
                src="/images/72DA8CD1-2E97-40BD-AFF8-D80222154375.JPG?v=3"
                alt="UTC Community"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="absolute bottom-0 left-0 p-4 opacity-0 transition group-hover:opacity-100">
                <p className="text-sm font-semibold text-white">{t('hero.photo2')}</p>
                <p className="mt-1 text-xs text-white/80">{t('hero.photo2text')}</p>
              </div>
            </div>
            <p className="px-2 pb-1 text-sm font-medium text-slate-700 dark:text-slate-200">{t('hero.photo3')}</p>
          </div>
        </div>
      </div>
    </section>
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
  return (
    <section id="events" className="border-t border-gray-200 bg-gray-50 py-12 transition-colors dark:border-slate-800 dark:bg-slate-900/60 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <SectionIntro
              eyebrow={t('events.eyebrow')}
              title={t('events.title')}
              description={t('events.description')}
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="https://luma.com/utc-events?period=past"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-800"
              >
                {t('events.pastEvents')}
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <iframe
              src="https://luma.com/embed/calendar/cal-XVqyCLhYYcyGZ8v/events"
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: "none" }}
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
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
            {link('roman')} — {t('about.cofounder')},{' '}
            {link('alina')} — {t('about.cofounder')},{' '}
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
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
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
        <div>
          <div className="text-sm font-semibold text-slate-950 dark:text-white">{t('footer.contact')}</div>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
            <a href={links.email}>hello@utcbarcelona.com</a>
            <a href={links.ideaForm} target="_blank" rel="noreferrer">{t('feedback.ideaCta')}</a>
            <a href={links.issueForm} target="_blank" rel="noreferrer">{t('feedback.issueCta')}</a>
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
