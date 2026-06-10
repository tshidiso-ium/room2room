'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AppHeader from '@/components/header';
import AppFooter from '@/components/footer';
import ApartmentDescription from '@/components/ApartmentDescription';
import {
  FaWifi,
  FaShower,
  FaDog,
  FaParking,
  FaWhatsapp,
} from 'react-icons/fa';
import {
  MapPin,
  BedDouble,
  Bath,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  Moon,
  Sun,
  UserRound,
} from 'lucide-react';
import { db } from '@/app/lib/firebaseClient';
import { getListingAgent, getWhatsappNumber } from '@/app/lib/agentProfile';
import {
  doc,
  setDoc,
  addDoc,
  collection,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop';

export default function ApartmentDetailClient({ apartment }) {
  const images =
    apartment?.images?.length > 0 ? apartment.images : [FALLBACK_IMAGE];

  const [currentImg, setCurrentImg] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTrackingContact, setIsTrackingContact] = useState(false);
  const [formError, setFormError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [form, setForm] = useState({
    name: '',
    address: '',
    budget: '',
  });

  const safeTitle = apartment?.title || 'Property';
  const safeLocation =
    typeof apartment?.location === 'string'
      ? apartment.location
      : [apartment?.location?.suburb, apartment?.location?.city]
          .filter(Boolean)
          .join(', ') || 'Location unavailable';

  const safePrice = useMemo(() => {
    if (typeof apartment?.price === 'number') {
      return `R${apartment.price.toLocaleString()}`;
    }
    return apartment?.price || 'Price on request';
  }, [apartment?.price]);
  const listingAgent = getListingAgent(apartment);
  const whatsappNumber = getWhatsappNumber(listingAgent.phone);

  const whatsappPrefill = useMemo(() => {
    return encodeURIComponent(
      `Hello, I'm interested in the listing:\n` +
        `• ${safeTitle}\n` +
        `• Location: ${safeLocation}\n` +
        `• Price: ${safePrice}\n\n` +
        `Could you provide more details?`
    );
  }, [safeTitle, safeLocation, safePrice]);

  useEffect(() => {
    const storedTheme =
      typeof window !== 'undefined' ? localStorage.getItem('site-theme') : null;

    if (storedTheme === 'dark') {
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

  const nextImage = () => {
    setCurrentImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  function firestoreSafeKey(value) {
    return String(value || 'unknown')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  const analyticsRef = useMemo(
    () =>
      doc(
        db,
        'appartment',
        firestoreSafeKey(safeLocation),
        'rooms',
        firestoreSafeKey(safeTitle)
      ),
    [safeLocation, safeTitle]
  );

  const trackVisit = useCallback(async () => {
    await setDoc(
      analyticsRef,
      {
        visitCount: increment(1),
        lastVisitedAt: serverTimestamp(),
        listingTitle: safeTitle,
        listingLocation: safeLocation,
      },
      { merge: true }
    );
  }, [analyticsRef, safeLocation, safeTitle]);

  useEffect(() => {
    if (!apartment) return;

    trackVisit().catch((err) => {
      console.error('Failed to track visit:', err);
    });
  }, [apartment, trackVisit]);

  const trackContact = async () => {
    await setDoc(
      analyticsRef,
      {
        contactClick: increment(1),
        lastContactedAt: serverTimestamp(),
        listingTitle: safeTitle,
        listingLocation: safeLocation,
      },
      { merge: true }
    );
  };

  const countEventClick = async () => {
    try {
      setIsTrackingContact(true);
      await trackContact();
      setShowForm(true);
    } catch (err) {
      console.error('countEventClick:', err);
      setShowForm(true);
    } finally {
      setIsTrackingContact(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const storeLead = async (pageUrl) => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];

      await addDoc(collection(db, 'leads', currentDate, 'items'), {
        name: form.name,
        address: form.address,
        budget: form.budget,
        listingTitle: safeTitle,
        listingLocation: safeLocation,
        listingPrice: apartment?.price ?? safePrice,
        listingUrl: pageUrl,
        agentId: listingAgent.id,
        agentName: listingAgent.name,
        agentEmail: listingAgent.email,
        agentPhone: listingAgent.phone,
        createdAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error saving lead:', error);
      return { success: false, error };
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    try {
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      const result = await storeLead(pageUrl);

      if (!result.success) {
        setFormError('Failed to save your request. Please try again.');
        return;
      }

      const userMessage = encodeURIComponent(
        `Hello, I'm interested in the listing:\n` +
          `• ${safeTitle}\n` +
          `• Location: ${safeLocation}\n` +
          `• Price: ${safePrice}\n\n` +
          `My Details:\n` +
          `• Name: ${form.name}\n` +
          `• Address: ${form.address}\n` +
          `• Budget: R${form.budget}\n\n` +
          `Listing Link:\n${pageUrl}\n\n` +
          `Please contact me with more information.`
      );

      window.open(`https://wa.me/${whatsappNumber}?text=${userMessage}`, '_blank');

      setShowForm(false);
      setForm({
        name: '',
        address: '',
        budget: '',
      });
    } catch (error) {
      console.error(error);
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const amenities = [
    {
      label: 'WiFi',
      value: apartment?.features?.wifi ? 'Available' : 'Not available',
      icon: <FaWifi className="text-lg" />,
    },
    {
      label: 'Geyser',
      value: apartment?.features?.geyser ? 'Available' : 'Not available',
      icon: <FaShower className="text-lg" />,
    },
    {
      label: 'Pets Allowed',
      value: apartment?.features?.petsAllowed ? 'Yes' : 'No',
      icon: <FaDog className="text-lg" />,
    },
    {
      label: 'Parking',
      value: apartment?.features?.parking ? 'Available' : 'Not available',
      icon: <FaParking className="text-lg" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <AppHeader />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:mb-6 sm:px-0"
        >
          <ol className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400 sm:gap-2 sm:text-sm">
            <li className="shrink-0">
              <Link
                href="/"
                className="transition hover:text-blue-700 dark:hover:text-blue-400"
              >
                Home
              </Link>
            </li>

            <li className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
              <Link
                href="/#featured-listings"
                className="transition hover:text-blue-700 dark:hover:text-blue-400"
              >
                Apartments
              </Link>
            </li>

            {safeLocation && (
              <li className="hidden items-center gap-1.5 sm:flex sm:gap-2">
                <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                <span className="max-w-[140px] truncate md:max-w-[180px]">
                  {safeLocation}
                </span>
              </li>
            )}

            <li className="flex min-w-0 items-center gap-1.5 text-slate-900 dark:text-white sm:gap-2">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-400 dark:text-slate-500 sm:h-4 sm:w-4" />
              <span className="max-w-[150px] truncate font-medium xs:max-w-[180px] sm:max-w-[260px] md:max-w-md">
                {safeTitle}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mb-6  justify-end hidden">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="relative h-[300px] sm:h-[420px] lg:h-[520px]">
                <Image
                  src={images[currentImg]}
                  alt={`${safeTitle} image ${currentImg + 1}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevImage}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-900 shadow-md transition hover:bg-white dark:bg-slate-900/90 dark:text-white dark:hover:bg-slate-900"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-900 shadow-md transition hover:bg-white dark:bg-slate-900/90 dark:text-white dark:hover:bg-slate-900"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}

                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow">
                    Available now
                  </span>
                  {apartment?.propertyType && (
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-800 backdrop-blur dark:bg-slate-900/90 dark:text-slate-100">
                      {apartment.propertyType}
                    </span>
                  )}
                </div>
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3 border-t border-slate-200 p-4 dark:border-slate-800 sm:grid-cols-5">
                  {images.map((img, index) => (
                    <button
                      key={`${img}-${index}`}
                      type="button"
                      onClick={() => setCurrentImg(index)}
                      className={`relative h-20 overflow-hidden rounded-2xl border transition ${
                        currentImg === index
                          ? 'border-blue-700 ring-2 ring-blue-200 dark:ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${safeTitle} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <div className="flex flex-col gap-5 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    {safeTitle}
                  </h1>

                  <div className="mt-3 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span>{safeLocation}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <UserRound className="h-4 w-4" />
                    <span>
                      Posted by{' '}
                      <span className="font-medium text-slate-900 dark:text-white">
                        {listingAgent.name}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-50 px-5 py-4 dark:bg-blue-500/10 sm:min-w-[220px]">
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
                    Monthly rent
                  </p>
                  <p className="mt-1 text-2xl font-bold text-blue-800 dark:text-blue-400">
                    {safePrice}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <BedDouble className="h-4 w-4" />
                  {apartment?.bedrooms ?? 0}{' '}
                  {Number(apartment?.bedrooms) === 1 ? 'Bedroom' : 'Bedrooms'}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <Bath className="h-4 w-4" />
                  {apartment?.bathrooms ?? 1}{' '}
                  {Number(apartment?.bathrooms) === 1 ? 'Bathroom' : 'Bathrooms'}
                </div>

                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <ShieldCheck className="h-4 w-4" />
                  Verified listing
                </div>
              </div>

              <div className="mt-8">
                <ApartmentDescription apartment={apartment} />
              </div>
            </div>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
              <h2 className="text-2xl font-semibold">Amenities</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Everything you need to know about this property at a glance.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {amenities.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {item.label}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Interested in this property?
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  Contact the agent
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Send an enquiry and continue the conversation on WhatsApp.
                </p>
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Posted by
                </p>
                <div className="mt-2 flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {listingAgent.name}
                    </p>
                    {listingAgent.agency && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {listingAgent.agency}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <button
                  type="button"
                  onClick={countEventClick}
                  disabled={isTrackingContact}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FaWhatsapp className="text-lg" />
                  {isTrackingContact ? 'Preparing contact...' : 'Contact Agent on WhatsApp'}
                </button>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappPrefill}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Quick WhatsApp message
                </a>
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                We’ll collect your enquiry details first so the agent can respond
                faster and with the right options.
              </div>
            </div>
          </aside>
        </div>
      </main>

      <AppFooter />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 sm:p-8">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Close contact form"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Quick contact form
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Complete your details and continue to WhatsApp.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Current address
                </label>
                <input
                  id="address"
                  name="address"
                  required
                  value={form.address}
                  onChange={handleFormChange}
                  placeholder="Enter your current address"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Budget (R)
                </label>
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  min="0"
                  required
                  value={form.budget}
                  onChange={handleFormChange}
                  placeholder="Enter your budget"
                  className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                />
              </div>

              {formError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <FaWhatsapp className="text-lg" />
                  {isSubmitting ? 'Saving...' : 'Continue to WhatsApp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
