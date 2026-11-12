'use client';

import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import AppHeader from '@/components/header';
import SearchBar from '@/components/SearchBar';
import FeaturedApartments from '@/components/FeaturedApartments';
import AppFooter from '@/components/footer';
import { Moon, Sun, ShieldCheck, MapPinHouse, Sparkles, UserPlus, Building2, Eye, ArrowRight } from 'lucide-react';

const SITE_URL = 'https://www.tembisaroomfinders.co.za';
const SITE_NAME = 'Tembisa Room Finders';
const SITE_TITLE = 'Tembisa Room Finders | Rooms, Cottages & Bachelor Rentals';
const SITE_DESCRIPTION =
  'Find affordable rooms, bachelor units, cottages, and rental spaces across Tembisa. Fast, reliable, and convenient rental matching with relocation transport available.';
const OG_IMAGE = `${SITE_URL}/og-image.png`;

export default function HomePage() {
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });
  const [darkMode, setDarkMode] = useState(false);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const storedTheme =
      typeof window !== 'undefined' ? localStorage.getItem('site-theme') : null;

    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      return;
    }

    if (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);

    if (typeof window !== 'undefined') {
      localStorage.setItem('site-theme', next ? 'dark' : 'light');
    }

    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const structuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'RealEstateAgent',
          '@id': `${SITE_URL}/#organization`,
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/apple-touch-icon.png`,
          image: OG_IMAGE,
          description: SITE_DESCRIPTION,
          areaServed: ['Tembisa', 'Johannesburg', 'Gauteng'],
          sameAs: [
            'https://instagram.com/tshidiso_modiko',
            'https://facebook.com/tshidiso.modiko.3',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          publisher: {
            '@id': `${SITE_URL}/#organization`,
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${SITE_URL}/?location={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        },
        {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/#webpage`,
          url: SITE_URL,
          name: SITE_TITLE,
          description: SITE_DESCRIPTION,
          isPartOf: {
            '@id': `${SITE_URL}/#website`,
          },
          about: {
            '@id': `${SITE_URL}/#organization`,
          },
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: OG_IMAGE,
          },
        },
      ],
    }),
    []
  );

  return (
    <>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta charSet="UTF-8" />
        <meta name="title" content={SITE_TITLE} />
        <meta name="description" content={SITE_DESCRIPTION} />
        <meta
          name="keywords"
          content="Tembisa Room Finders, Tembisa rentals, rooms in Tembisa, bachelor rentals, cottages in Tembisa, room finders, affordable rooms, rental property South Africa"
        />
        <meta name="author" content="Tshidiso Modiko" />
        <meta name="theme-color" content={darkMode ? '#020617' : '#ffffff'} />
        <meta name="application-name" content={SITE_NAME} />
        <meta name="format-detection" content="telephone=yes" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:alt" content="Tembisa Room Finders property search" />
        <meta property="og:locale" content="en_ZA" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SITE_TITLE} />
        <meta name="twitter:description" content={SITE_DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <link rel="canonical" href={`${SITE_URL}/`} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
      </Head>

      <Script
        id="home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
        <AppHeader />

        <main>
          <section className="fixed bottom-4 right-4 z-40 hidden">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-3 text-sm font-medium text-slate-700 shadow-lg backdrop-blur transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">{darkMode ? 'Light mode' : 'Dark mode'}</span>
            </button>
          </section>

          <SearchBar onSearch={handleSearch} />

          <section className="border-y border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/40">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-5 sm:grid-cols-3 sm:px-6 lg:px-8">
              <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Verified listings</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Browse quality rental listings with clear pricing and details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <MapPinHouse className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Local expertise</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Find rooms, cottages, and apartments across Tembisa and nearby areas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm dark:bg-slate-900 dark:ring-1 dark:ring-slate-800">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">Smarter search</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    Filter by location, price, bedrooms, and property type in seconds.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section aria-labelledby="become-agent-heading" className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-blue-800 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 px-6 py-10 text-white shadow-xl dark:border-blue-700/50 sm:px-10 sm:py-12 lg:px-14">
              <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />

              <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-400/10 px-3 py-1 text-sm font-semibold text-yellow-200">
                    <UserPlus className="h-4 w-4" />
                    For property agents
                  </span>
                  <h2 id="become-agent-heading" className="mt-5 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                    Have a place to rent? Become an agent.
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
                    Create your agent profile, share your available rooms and properties, and connect with renters looking in Tembisa.
                  </p>

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      href="/admin/login?mode=signup"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-blue-900 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Become an agent
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/admin/login"
                      className="inline-flex items-center rounded-2xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                      Already an agent? Sign in
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <UserPlus className="mt-0.5 h-5 w-5 shrink-0 text-yellow-300" />
                    <div>
                      <p className="font-semibold">Create your profile</p>
                      <p className="mt-1 text-sm text-slate-300">Add your name and contact details.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-yellow-300" />
                    <div>
                      <p className="font-semibold">Post your listings</p>
                      <p className="mt-1 text-sm text-slate-300">Show photos, prices, and property details.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Eye className="mt-0.5 h-5 w-5 shrink-0 text-yellow-300" />
                    <div>
                      <p className="font-semibold">See listing interest</p>
                      <p className="mt-1 text-sm text-slate-300">Check page views in your agent dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <FeaturedApartments filters={filters} />

          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-900 to-slate-900 px-6 py-10 text-white shadow-xl dark:border-slate-800">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="text-2xl font-bold sm:text-3xl">
                  Can’t find what you’re looking for?
                </h2>
                <p className="mt-3 text-sm text-white/80 sm:text-base">
                  Tell us what kind of place you need using our contact form, and we’ll help you with your search.
                </p>
                <Link
                  href="/contact#contact-form"
                  className="mt-6 inline-flex items-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </section>
        </main>

        <AppFooter />
      </div>
    </>
  );
}
