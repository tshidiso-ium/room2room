'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { MapPin, BedDouble, Bath, ArrowRight, SearchX } from 'lucide-react';
import { db } from '@/app/lib/firebaseClient';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop';

export default function FeaturedApartments({ filters }) {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        setError('');

        const q = query(
          collection(db, 'apartments'),
          where('isAvailable', '==', true),
          orderBy('createdAt', 'desc'),
          limit(12)
        );

        const snapshot = await getDocs(q);

        const listings = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setApartments(listings);
      } catch (err) {
        console.error('Error fetching apartments:', err);
        setError('We could not load properties right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const filteredApartments = useMemo(() => {
    return apartments.filter((apartment) => {
      const locationQuery = filters?.location?.trim()?.toLowerCase();

      const apartmentCity = apartment.location?.city?.toLowerCase() || '';
      const apartmentSuburb = apartment.location?.suburb?.toLowerCase() || '';

      const matchesLocation =
        !locationQuery ||
        apartmentCity.includes(locationQuery) ||
        apartmentSuburb.includes(locationQuery);

      const matchesPropertyType =
        !filters?.propertyType || apartment.propertyType === filters.propertyType;

      const matchesMinPrice =
        !filters?.minPrice || Number(apartment.price) >= Number(filters.minPrice);

      const matchesMaxPrice =
        !filters?.maxPrice || Number(apartment.price) <= Number(filters.maxPrice);

      const matchesBedrooms =
        !filters?.bedrooms || Number(apartment.bedrooms) >= Number(filters.bedrooms);

      return (
        matchesLocation &&
        matchesPropertyType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesBedrooms
      );
    });
  }, [apartments, filters]);

  if (loading) {
    return (
      <section
        id="featured-listings"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-3 h-8 w-64 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-56 animate-pulse bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-6 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="featured-listings"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center dark:border-red-500/30 dark:bg-red-500/10">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Something went wrong
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="featured-listings"
      className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            Featured listings
          </span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Explore available properties
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Discover rooms, apartments, and homes that match your budget and lifestyle.
          </p>
        </div>

        <div className="text-sm text-slate-500 dark:text-slate-400">
          {filteredApartments.length}{' '}
          {filteredApartments.length === 1 ? 'property found' : 'properties found'}
        </div>
      </div>

      {filteredApartments.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800">
            <SearchX className="h-6 w-6 text-slate-500 dark:text-slate-400" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
            No properties match your search
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Try changing your location, price range, or bedroom filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredApartments.map((apt) => {
            const imageSrc = apt.images?.[0] || FALLBACK_IMAGE;
            const locationLabel =
              [apt.location?.suburb, apt.location?.city].filter(Boolean).join(', ') ||
              'Location unavailable';

            return (
              <Link
                key={apt.id}
                href={`/apartments/${apt.slug || apt.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={apt.title || 'Property image'}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />

                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    {apt.isAvailable && (
                      <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow">
                        Available now
                      </span>
                    )}
                    {apt.propertyType && (
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-800 backdrop-blur dark:bg-slate-900/90 dark:text-slate-100">
                        {apt.propertyType}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="line-clamp-1 text-lg font-semibold text-slate-900 dark:text-white">
                        {apt.title || 'Untitled property'}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="line-clamp-1">{locationLabel}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                      <BedDouble className="h-4 w-4" />
                      {apt.bedrooms || 0} {Number(apt.bedrooms) === 1 ? 'Bedroom' : 'Bedrooms'}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                      <Bath className="h-4 w-4" />
                      {apt.bathrooms || 1} {Number(apt.bathrooms) === 1 ? 'Bathroom' : 'Bathrooms'}
                    </span>
                  </div>

                  {apt.description && (
                    <p className="mt-4 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                      {apt.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        From
                      </p>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                        R{Number(apt.price || 0).toLocaleString()}
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                          {' '}
                          / month
                        </span>
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                      View details
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}