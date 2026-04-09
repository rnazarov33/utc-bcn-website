import React, { useState, useMemo } from 'react';
import { referralsData } from './data/referralsData';

export default function CompanyReferrals({ onBack, links, lang, t }) {
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');

  // Sort and filter data
  const filteredData = useMemo(() => {
    let data = [...referralsData].sort((a, b) => a.company.localeCompare(b.company));

    if (search) {
      const s = search.toLowerCase();
      data = data.filter(item => 
        item.company.toLowerCase().includes(s) ||
        item.pointOfContact.toLowerCase().includes(s) ||
        item.contact.toLowerCase().includes(s)
      );
    }

    if (filterMethod !== 'All') {
      data = data.filter(item => item.wayToContact === filterMethod);
    }

    return data;
  }, [search, filterMethod]);

  const clearFilters = () => {
    setSearch('');
    setFilterMethod('All');
  };

  const formatContactLink = (type, value) => {
    // Handle multiple contacts split by /
    const parts = value.split(' / ').map(p => p.trim());
    
    return parts.map((part, idx) => {
      let href = '';
      let displayValue = part;

      if (part.includes('@') && !part.startsWith('t.me') && !part.includes('gmail')) {
        // Likely telegram handle
        const handle = part.replace('@', '');
        href = `https://t.me/${handle}`;
      } else if (part.includes('gmail.com') || part.includes('@')) {
        // Likely email
        href = `mailto:${part}`;
      } else if (part.startsWith('t.me/')) {
        href = `https://${part}`;
      } else if (/^\+?[\d\s]+$/.test(part.replace(/\s/g, ''))) {
        // Likely phone/whatsapp
        const clean = part.replace(/[^\d]/g, '');
        // If it starts with 6 or 7 and has 9 digits, it's likely a Spanish number without prefix
        const phone = (clean.length === 9 && (clean.startsWith('6') || clean.startsWith('7'))) 
          ? `34${clean}` 
          : clean;
        href = `https://wa.me/${phone}`;
      }

      if (!href) return <span key={idx}>{part}{idx < parts.length - 1 ? ' / ' : ''}</span>;

      return (
        <React.Fragment key={idx}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:text-brand-dark hover:underline"
          >
            {displayValue}
          </a>
          {idx < parts.length - 1 ? <span className="text-slate-400"> / </span> : ''}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 transition-colors dark:bg-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black py-16 text-white lg:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.15),_transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-medium text-brand-light transition hover:text-brand/80"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('nav.backToHome')}
            </button>
            <a
              href={links?.referralForm}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              {t('nav.submitCompany')}
            </a>
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              {t('referralsPage.title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              {t('referralsPage.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-8 mb-12 rounded-[2rem] border border-gray-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-10">
          <div className="grid gap-6 md:grid-cols-2 lg:items-center">
            <p className="text-base leading-7 text-slate-600 dark:text-slate-300">
              {t('referralsPage.description')}
            </p>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 dark:border-amber-900/70 dark:bg-amber-950/40">
              <p className="text-sm leading-6 text-amber-900 dark:text-amber-100">
                {t('referralsPage.proTip')}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={t('referralsPage.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500"
              />
            </div>
            
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="rounded-xl border border-gray-100 bg-gray-50 py-3 pl-4 pr-10 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            >
              <option value="All">{t('referralsPage.allMethods')}</option>
              <option value="Telegram">Telegram</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Email">Email</option>
            </select>

            {(search || filterMethod !== 'All') && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium text-brand hover:text-brand-dark"
              >
                {t('referralsPage.clearFilters')}
              </button>
            )}
          </div>

          <div className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            {t('referralsPage.showing').replace('{count}', filteredData.length)}
          </div>

          {/* Table / Card List */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-50 shadow-sm dark:border-slate-800">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full divide-y divide-stone-200 dark:divide-slate-800">
                <thead className="bg-gray-50 dark:bg-slate-950">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('referralsPage.colCompany')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('referralsPage.colPositions')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('referralsPage.colContactPerson')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('referralsPage.colWay')}</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">{t('referralsPage.colContact')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 bg-white dark:divide-slate-800 dark:bg-slate-900">
                  {filteredData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-950/60">
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-950 dark:text-white">
                        {item.company}
                      </td>
                      <td className="px-6 py-5 text-sm">
                        {item.positionsOpen ? (
                          <a
                            href={item.positionsOpen}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-brand hover:text-brand-dark hover:underline"
                          >
                            {t('referralsPage.viewPositions')}
                          </a>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">—</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {item.pointOfContact}
                      </td>
                      <td className="whitespace-nowrap px-6 py-5 text-sm">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.wayToContact === 'Telegram' ? 'bg-sky-50 text-brand-dark' :
                          item.wayToContact === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700' :
                          'bg-indigo-50 text-indigo-700'
                        }`}>
                          {item.wayToContact}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                        {formatContactLink(item.wayToContact, item.contact)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid gap-4 md:hidden">
              {filteredData.map((item, idx) => (
                <div key={idx} className="border-b border-gray-50 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 last:border-0">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-lg font-semibold text-slate-950 dark:text-white">{item.company}</div>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      item.wayToContact === 'Telegram' ? 'bg-sky-50 text-brand-dark' :
                      item.wayToContact === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700' :
                      'bg-indigo-50 text-indigo-700'
                    }`}>
                      {item.wayToContact}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <span className="mb-1 text-xs font-bold uppercase text-slate-400 dark:text-slate-500">{t('referralsPage.colContactPerson')}</span>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.pointOfContact}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-1 text-xs font-bold uppercase text-slate-400 dark:text-slate-500">{t('referralsPage.colContact')}</span>
                      <span className="text-sm">{formatContactLink(item.wayToContact, item.contact)}</span>
                    </div>
                    <div>
                      {item.positionsOpen ? (
                        <a
                          href={item.positionsOpen}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center text-sm font-semibold text-brand"
                        >
                          {t('referralsPage.viewPositions')}
                          <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-sm italic text-slate-400 dark:text-slate-500">{t('referralsPage.noPositions')}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredData.length === 0 && (
              <div className="bg-white py-12 text-center text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                {t('referralsPage.noResults')}
              </div>
            )}
          </div>

          <div className="mt-12 border-t border-gray-50 pt-8 text-center dark:border-slate-800 sm:text-left">
            <p className="max-w-3xl text-sm italic leading-6 text-slate-500 dark:text-slate-400">
              {t('referralsPage.disclaimer')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
