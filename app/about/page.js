'use client';

import { useEffect, useState } from 'react';
import { FaBullseye, FaHandsHelping, FaHome } from 'react-icons/fa';
import { Moon, Sun, ArrowRight, ShieldCheck, MapPinHouse, Sparkles } from 'lucide-react';
import Link from 'next/link';
import AppFooter from '@/components/footer';
import AppHeader from '@/components/header';

const sections = [
  {
    icon: <FaBullseye className="text-4xl text-blue-700 dark:text-blue-300" />,
    title: 'Our Mission',
    description:
      'To simplify the apartment hunting process with reliable listings, transparent information, and tools that help people make confident rental decisions.',
  },
  {
    icon: <FaHandsHelping className="text-4xl text-blue-700 dark:text-blue-300" />,
    title: 'Our Support',
    description:
      'We guide renters through every stage of the journey with responsive assistance, clear communication, and practical local knowledge.',
  },
  {
    icon: <FaHome className="text-4xl text-blue-700 dark:text-blue-300" />,
    title: 'Our Listings',
    description:
      'We focus on quality rooms, apartments, and rental spaces across Tembisa and nearby areas for different budgets and lifestyles.',
  },
];

const highlights = [
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: 'Trusted local platform',
    description: 'Built to help renters find quality spaces with less stress and more clarity.',
  },
  {
    icon: <MapPinHouse className="h-5 w-5" />,
    title: 'Area-focused expertise',
    description: 'We understand the neighborhoods, pricing, and rental patterns that matter most.',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Better search experience',
    description: 'Modern tools and filters make it easier to find the right home faster.',
  },
];

export default function AboutPage() {
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <AppHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fbanner_hero.jpeg?alt=media&token=83011ded-d699-4af7-a74c-5c930c19870d')",
            }}
          />
          <div className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/75" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                  About Tembisa Room Finders
                </span>

                <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  We help people find more than a rental.
                </h1>

                <p className="mt-5 max-w-2xl text-base text-white/85 sm:text-lg">
                  We help people find comfort, convenience, and confidence in the place they choose
                  to call home.
                </p>
              </div>

              <div className="justify-start lg:justify-end hidden">
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
                >
                  {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {darkMode ? 'Light mode' : 'Dark mode'}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                  {item.icon}
                </div>
                <h2 className="mt-4 text-lg font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Who we are</h2>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                At Tembisa Room Finders, we are committed to transforming the rental journey into
                something simpler, more transparent, and more human. We combine quality listings,
                practical local insight, and responsive support to help renters find the right fit
                faster.
              </p>
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-400">
                Whether you are searching for a room, a cottage, or a bachelor unit, our goal is
                to make the process easier and more trustworthy from search to enquiry.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-12 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] bg-blue-50 p-6 dark:bg-slate-900/70 sm:p-8">
            <div className="mb-8 flex flex-col gap-3 text-center">
              <span className="mx-auto inline-flex rounded-full bg-white px-3 py-1 text-sm font-medium text-blue-700 shadow-sm dark:bg-slate-800 dark:text-blue-300">
                What makes us different
              </span>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built around renter needs</h2>
              <p className="mx-auto max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                Everything we do is focused on making property discovery more practical, accessible,
                and trustworthy.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {sections.map(({ icon, title, description }) => (
                <div
                  key={title}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-500/10">
                    {icon}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-blue-900 to-slate-900 px-6 py-10 text-white shadow-xl dark:border-slate-800">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to start your rental search?
              </h2>
              <p className="mt-3 text-sm text-white/80 sm:text-base">
                Speak to us directly and let us help you find the right place with less stress and
                better information.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Contact us
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                >
                  Browse listings
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}