'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query as firestoreQuery,
  where,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  BedDouble,
  Bath,
  Trash2,
  PencilLine,
  RefreshCw,
  Home,
  Eye,
  CircleDollarSign,
  Filter,
  Moon,
  Sun,
  UserRound,
} from 'lucide-react';

import { db } from '../../lib/firebaseClient';
import { useAuth } from '@/context/AuthContext';
import { buildAgentSnapshot, getListingAgent } from '@/app/lib/agentProfile';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop';

export default function AdminDashboard() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [darkMode, setDarkMode] = useState(false);

  const { user, agentProfile } = useAuth();
  const router = useRouter();
  const activeAgent = user ? buildAgentSnapshot(user, agentProfile || {}) : null;

  useEffect(() => {
    const storedTheme =
      typeof window !== 'undefined' ? localStorage.getItem('admin-theme') : null;

    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);

    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-theme', next ? 'dark' : 'light');
    }

    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const fetchListings = useCallback(async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);
      setError('');

      const listingsQuery = firestoreQuery(
        collection(db, 'apartments'),
        where('agentId', '==', user.uid)
      );
      const querySnapshot = await getDocs(listingsQuery);
      const listings = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setApartments(listings);
    } catch (err) {
      console.error('Failed to fetch listings:', err);
      setError('Unable to load listings right now.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user === undefined) return;

    if (!user) {
      router.push('/admin/login');
      return;
    }

    fetchListings();
  }, [fetchListings, user, router]);

  const handleDelete = async (id) => {
    const listing = apartments.find((item) => item.id === id);

    if (!user?.uid || listing?.agentId !== user.uid) {
      alert('You can only delete listings posted from your agent profile.');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this listing?'
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      await deleteDoc(doc(db, 'apartments', id));
      setApartments((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setDeletingId('');
    }
  };

  const filteredApartments = useMemo(() => {
    const query = search.trim().toLowerCase();

    let results = apartments.filter((apt) => {
      const title = apt.title?.toLowerCase() || '';
      const city = apt.location?.city?.toLowerCase?.() || '';
      const suburb = apt.location?.suburb?.toLowerCase?.() || '';
      const locationString =
        typeof apt.location === 'string' ? apt.location.toLowerCase() : '';

      const matchesSearch =
        !query ||
        title.includes(query) ||
        city.includes(query) ||
        suburb.includes(query) ||
        locationString.includes(query);

      const available = apt.isAvailable === true;

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'available' && available) ||
        (statusFilter === 'unavailable' && !available);

      return matchesSearch && matchesStatus;
    });

    results.sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.price || 0) - Number(b.price || 0);
      if (sortBy === 'price-high') return Number(b.price || 0) - Number(a.price || 0);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return (
        new Date(b.createdAt?.seconds ? b.createdAt.seconds * 1000 : 0) -
        new Date(a.createdAt?.seconds ? a.createdAt.seconds * 1000 : 0)
      );
    });

    return results;
  }, [apartments, search, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = apartments.length;
    const available = apartments.filter((apt) => apt.isAvailable === true).length;
    const unavailable = total - available;

    const avgPrice =
      total > 0
        ? Math.round(
            apartments.reduce((sum, apt) => sum + Number(apt.price || 0), 0) / total
          )
        : 0;

    return { total, available, unavailable, avgPrice };
  }, [apartments]);

  if (!user && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Checking access...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              Agent dashboard
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Manage your posted listings
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Monitor your listings, update your inventory, and keep your agent
              profile connected to every property you post.
            </p>
            {activeAgent && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <UserRound className="h-4 w-4 text-blue-700 dark:text-blue-300" />
                Signed in as{' '}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {activeAgent.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {darkMode ? 'Light mode' : 'Dark mode'}
            </button>

            <button
              type="button"
              onClick={fetchListings}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>

            <Link
              href="/admin/upload"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800"
            >
              <Plus className="h-4 w-4" />
              Add listing
            </Link>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Your listings"
            value={stats.total}
            icon={<Building2 className="h-5 w-5" />}
          />
          <StatCard
            title="Available"
            value={stats.available}
            icon={<Home className="h-5 w-5" />}
          />
          <StatCard
            title="Unavailable"
            value={stats.unavailable}
            icon={<Eye className="h-5 w-5" />}
          />
          <StatCard
            title="Average price"
            value={`R${stats.avgPrice.toLocaleString()}`}
            icon={<CircleDollarSign className="h-5 w-5" />}
          />
        </section>

        <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Search listings
              </label>
              <div className="flex items-center rounded-2xl border border-slate-300 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:ring-blue-500/20">
                <Search className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, city, suburb, or location"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Status
              </label>
              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-500/20"
                >
                  <option value="all">All listings</option>
                  <option value="available">Available only</option>
                  <option value="unavailable">Unavailable only</option>
                </select>
              </div>
            </div>

            <div className="lg:col-span-3">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-blue-500/20"
              >
                <option value="newest">Newest first</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="title">Title: A to Z</option>
              </select>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-56 animate-pulse bg-slate-200 dark:bg-slate-800" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </section>
        ) : filteredApartments.length === 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Building2 className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" />
            <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
              No listings found
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Try adjusting your search or filters, or add a new property listing.
            </p>
            <Link
              href="/admin/upload"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800"
            >
              <Plus className="h-4 w-4" />
              Add listing
            </Link>
          </section>
        ) : (
          <>
            <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Showing {filteredApartments.length} of {apartments.length} listings
            </div>

            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredApartments.map((apt) => {
                const locationLabel =
                  typeof apt.location === 'string'
                    ? apt.location
                    : [apt.location?.suburb, apt.location?.city].filter(Boolean).join(', ');

                const imageSrc = apt.images?.[0] || FALLBACK_IMAGE;
                const listingAgent = getListingAgent(apt);

                return (
                  <article
                    key={apt.id}
                    className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="relative h-56">
                      <Image
                        src={imageSrc}
                        alt={apt.title || 'Listing image'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />

                      <div className="absolute left-4 top-4 flex gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold text-white shadow ${
                            apt.isAvailable ? 'bg-emerald-500' : 'bg-slate-500'
                          }`}
                        >
                          {apt.isAvailable ? 'Available' : 'Unavailable'}
                        </span>

                        {apt.propertyType && (
                          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-800 dark:bg-slate-900/90 dark:text-slate-100">
                            {apt.propertyType}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="line-clamp-1 text-lg font-semibold text-slate-900 dark:text-white">
                            {apt.title || 'Untitled listing'}
                          </h2>
                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <MapPin className="h-4 w-4" />
                            <span className="line-clamp-1">
                              {locationLabel || 'Location unavailable'}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                            <UserRound className="h-4 w-4" />
                            <span className="line-clamp-1">
                              Posted by {listingAgent.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                          <BedDouble className="h-4 w-4" />
                          {apt.bedrooms ?? 0} bed
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">
                          <Bath className="h-4 w-4" />
                          {apt.bathrooms ?? 1} bath
                        </span>
                      </div>

                      <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Monthly price
                        </p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                          R{Number(apt.price || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-2">
                        <Link
                          href={`/apartments/${apt.slug || apt.id}`}
                          target="_blank"
                          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>

                        <Link
                          href={`/admin/edit?id=${apt.id}`}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleDelete(apt.id)}
                          disabled={deletingId === apt.id}
                          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          <Trash2 className="h-4 w-4" />
                          {deletingId === apt.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          {icon}
        </div>
      </div>
    </div>
  );
}
