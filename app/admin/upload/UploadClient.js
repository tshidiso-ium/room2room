'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { storage, db } from '../../lib/firebaseClient';
import { useAuth } from '@/context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  buildAgentSnapshot,
  upsertAgentProfile,
} from '@/app/lib/agentProfile';
import {
  UploadCloud,
  MapPin,
  BedDouble,
  Bath,
  Wifi,
  Car,
  Dog,
  Flame,
  Save,
  ArrowLeft,
  Home,
  ImagePlus,
  X,
  Moon,
  Sun,
} from 'lucide-react';
import Link from 'next/link';

const initialForm = {
  title: '',
  location: '',
  suburb: '',
  city: '',
  price: '',
  bedrooms: '',
  bathrooms: '',
  propertyType: '',
  description: '',
  images: [],
  isAvailable: true,
  features: {
    wifi: false,
    geyser: false,
    petsAllowed: false,
    parking: false,
  },
};

function splitLocationText(value) {
  const location = String(value || '').trim();
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    location,
    suburb: parts[0] || '',
    city: parts.slice(1).join(', '),
  };
}

function getLocationFields(location) {
  if (typeof location === 'string') {
    return splitLocationText(location);
  }

  const suburb = location?.suburb || '';
  const city = location?.city || '';
  const locationText = location?.address || location?.label || '';

  if (!suburb && !city && locationText) {
    return splitLocationText(locationText);
  }

  return {
    location: locationText,
    suburb,
    city,
  };
}

export default function UploadPage({ requireListingId = false } = {}) {
  const { user, agentProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [listingId, setListingId] = useState(null);
  const [missingListingId, setMissingListingId] = useState(false);
  const [loadingListing, setLoadingListing] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const [form, setForm] = useState(initialForm);
  const isEditMode = requireListingId || Boolean(listingId);
  const activeAgent = user ? buildAgentSnapshot(user, agentProfile || {}) : null;

  useEffect(() => {
    const id = searchParams.get('id');
    setListingId(id);
    setMissingListingId(requireListingId && !id);
    setPageReady(true);
  }, [requireListingId, searchParams]);

  useEffect(() => {
    const storedTheme =
      typeof window !== 'undefined' ? localStorage.getItem('admin-theme') : null;

    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (!pageReady) return;
    if (user === null) {
      router.push('/admin/login');
    }
  }, [user, pageReady, router]);

  useEffect(() => {
    if (!pageReady || !missingListingId) return;

    setError('Missing listing ID.');
    router.push('/admin/dashboard');
  }, [missingListingId, pageReady, router]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!pageReady || user === undefined || !user) return;
      if (!listingId) return;

      try {
        setLoadingListing(true);
        setError('');

        const docRef = doc(db, 'apartments', listingId);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setError('Listing not found.');
          router.push('/admin/dashboard');
          return;
        }

        const data = docSnap.data();

        if (data.agentId && data.agentId !== user.uid) {
          setError('You can only edit listings posted from your agent profile.');
          router.push('/admin/dashboard');
          return;
        }

        const locationFields = getLocationFields(data.location);

        setForm({
          title: data.title || '',
          location: locationFields.location,
          suburb: locationFields.suburb,
          city: locationFields.city,
          price: data.price || '',
          bedrooms: data.bedrooms || '',
          bathrooms: data.bathrooms || '',
          propertyType: data.propertyType || '',
          description: data.description || '',
          images: data.images || [],
          isAvailable: data.isAvailable ?? true,
          features: {
            wifi: data.features?.wifi || false,
            geyser: data.features?.geyser || false,
            petsAllowed: data.features?.petsAllowed || false,
            parking: data.features?.parking || false,
          },
        });
      } catch (err) {
        console.error('Error loading listing:', err);
        setError('Failed to load listing.');
      } finally {
        setLoadingListing(false);
      }
    };

    if (pageReady) {
      fetchListing();
    }
  }, [listingId, pageReady, router, user]);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setError('');
    setSuccessMessage('');

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFeatureToggle = (feature) => {
    setForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 8 - form.images.length;
    const filesToUpload = files.slice(0, remainingSlots);

    if (remainingSlots <= 0) {
      setError('You can upload a maximum of 8 images.');
      return;
    }

    try {
      setUploadingImages(true);
      setError('');
      const uploadedUrls = [];

      for (const file of filesToUpload) {
        const arrayBuffer = await file.arrayBuffer();
        const storageRef = ref(storage, `apartments/${Date.now()}-${file.name}`);

        await uploadBytes(storageRef, arrayBuffer, {
          contentType: file.type,
        });

        const downloadURL = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadURL);
      }

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Image upload failed. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const generateSlug = (title) =>
    String(title || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

  const normalizedPayload = useMemo(() => {
    const address = form.location.trim();
    const fallbackLocation = splitLocationText(address);
    const suburb = form.suburb.trim() || fallbackLocation.suburb || address;
    const city = form.city.trim() || fallbackLocation.city;
    const locationLabel = [suburb, city].filter(Boolean).join(', ') || address;

    return {
      title: form.title.trim(),
      location: {
        address,
        suburb,
        city,
        label: locationLabel,
      },
      price: Number(form.price) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 1,
      propertyType: form.propertyType || 'apartment',
      description: form.description.trim(),
      images: form.images,
      isAvailable: form.isAvailable,
      slug: generateSlug(form.title),
      features: form.features,
    };
  }, [form]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    if (!user) {
      setError('Please sign in with an agent profile before saving listings.');
      setLoading(false);
      return;
    }

    if (requireListingId && !listingId) {
      setError('Missing listing ID.');
      setLoading(false);
      return;
    }

    if (!form.suburb.trim() && !form.location.trim()) {
      setError('Please add a suburb, area, address, or landmark.');
      setLoading(false);
      return;
    }

    if (!form.images.length) {
      setError('Please upload at least one property image.');
      setLoading(false);
      return;
    }

    try {
      const savedAgentProfile = await upsertAgentProfile(user, agentProfile || {});
      const agent = buildAgentSnapshot(user, savedAgentProfile);
      const listingPayload = {
        ...normalizedPayload,
        agentId: agent.id,
        agentName: agent.name,
        agentEmail: agent.email,
        agentPhone: agent.phone,
        agentAgency: agent.agency,
        agent,
      };

      if (listingId) {
        await updateDoc(doc(db, 'apartments', listingId), {
          ...listingPayload,
          updatedAt: serverTimestamp(),
        });
        setSuccessMessage('Listing updated successfully.');
      } else {
        await addDoc(collection(db, 'apartments'), {
          ...listingPayload,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setSuccessMessage('Listing created successfully.');
      }

      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 700);
    } catch (err) {
      console.error('Error saving listing:', err);
      setError('Something went wrong while saving the listing.');
    } finally {
      setLoading(false);
    }
  };

  if (!pageReady || user === undefined) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 text-center text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Loading admin workspace...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 text-center text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Redirecting...
      </div>
    );
  }

  if (missingListingId) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-12 text-center text-slate-600 dark:bg-slate-950 dark:text-slate-300">
        Missing listing ID. Redirecting...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
              Listing management
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {isEditMode ? 'Edit property listing' : 'Create a new property listing'}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Add high-quality listing details, upload strong visuals, and keep your
              real-estate inventory market-ready.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>

            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {darkMode ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </section>

        {(loadingListing || uploadingImages || loading) && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
            {loadingListing
              ? 'Loading listing data...'
              : uploadingImages
              ? 'Uploading images...'
              : 'Saving listing...'}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12">
          <section className="space-y-8 lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold">Property details</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Enter the core listing information that buyers or renters will see first.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Listing title">
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g. Modern 2 Bedroom Apartment in Midrand"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Property type">
                  <div className="relative">
                    <Home className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                    <select
                      name="propertyType"
                      value={form.propertyType}
                      onChange={handleChange}
                      className={`${inputClass} pl-10`}
                      required
                    >
                      <option value="">Select property type</option>
                      <option value="room">Room</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="townhouse">Townhouse</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                </Field>

                <Field label="Suburb / area">
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      name="suburb"
                      value={form.suburb}
                      onChange={handleChange}
                      placeholder="e.g. Ebony Park"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </Field>

                <Field label="City">
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="e.g. Johannesburg"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </Field>

                <Field label="Address or landmark">
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Near Mall of Tembisa"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </Field>

                <Field label="Monthly price (R)">
                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="e.g. 5500"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Bedrooms">
                  <div className="relative">
                    <BedDouble className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                    <input
                      type="number"
                      name="bedrooms"
                      min="0"
                      value={form.bedrooms}
                      onChange={handleChange}
                      placeholder="e.g. 2"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </Field>

                <Field label="Bathrooms">
                  <div className="relative">
                    <Bath className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                    <input
                      type="number"
                      name="bathrooms"
                      min="0"
                      value={form.bathrooms}
                      onChange={handleChange}
                      placeholder="e.g. 1"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </Field>
              </div>

              <div className="mt-5">
                <Field label="Description">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Describe the property, lifestyle benefits, nearby amenities, and standout features."
                    className={inputClass}
                    required
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold">Media gallery</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Upload up to 8 high-quality images to improve listing engagement.
              </p>

              <div className="mt-6 rounded-3xl border-2 border-dashed border-slate-300 p-6 dark:border-slate-700">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Upload property images</h3>
                  <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
                    Add cover shots, bedroom views, bathroom images, and exterior angles.
                  </p>

                  <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800">
                    <UploadCloud className="h-4 w-4" />
                    {uploadingImages ? 'Uploading...' : 'Choose images'}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {form.images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {form.images.map((img, index) => (
                    <div
                      key={`${img}-${index}`}
                      className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="relative h-36 w-full">
                        <Image
                          src={img}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="240px"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white opacity-100 transition hover:bg-black"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>

                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-white">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <aside className="space-y-8 lg:col-span-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold">Agent profile</h2>

              <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {activeAgent?.name || 'Agent profile'}
                </p>
                {activeAgent?.agency && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                    {activeAgent.agency}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {activeAgent?.email || 'Signed-in agent'}
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold">Listing options</h2>

              <div className="mt-5 space-y-4">
                <label className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium">Available for enquiries</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Show this property as currently available
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="h-5 w-5 accent-blue-600"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold">Amenities</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Highlight the key features that matter most to renters and buyers.
              </p>

              <div className="mt-6 space-y-3">
                <FeatureToggle
                  label="WiFi"
                  icon={<Wifi className="h-4 w-4" />}
                  checked={form.features.wifi}
                  onChange={() => handleFeatureToggle('wifi')}
                />
                <FeatureToggle
                  label="Geyser"
                  icon={<Flame className="h-4 w-4" />}
                  checked={form.features.geyser}
                  onChange={() => handleFeatureToggle('geyser')}
                />
                <FeatureToggle
                  label="Pets allowed"
                  icon={<Dog className="h-4 w-4" />}
                  checked={form.features.petsAllowed}
                  onChange={() => handleFeatureToggle('petsAllowed')}
                />
                <FeatureToggle
                  label="Parking"
                  icon={<Car className="h-4 w-4" />}
                  checked={form.features.parking}
                  onChange={() => handleFeatureToggle('parking')}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold">Publishing summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <SummaryRow label="Title" value={form.title || 'Not set'} />
                <SummaryRow
                  label="Location"
                  value={
                    [form.suburb, form.city].filter(Boolean).join(', ') ||
                    form.location ||
                    'Not set'
                  }
                />
                <SummaryRow
                  label="Price"
                  value={form.price ? `R${Number(form.price).toLocaleString()}` : 'Not set'}
                />
                <SummaryRow label="Images" value={`${form.images.length} uploaded`} />
                <SummaryRow
                  label="Status"
                  value={form.isAvailable ? 'Available' : 'Unavailable'}
                />
                <SummaryRow label="Agent" value={activeAgent?.name || 'Not set'} />
              </div>

              <button
                type="submit"
                disabled={loading || uploadingImages}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                {loading
                  ? 'Saving...'
                  : isEditMode
                  ? 'Update listing'
                  : 'Publish listing'}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function FeatureToggle({ label, icon, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-blue-600"
      />
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-medium text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}

const inputClass =
  'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500/20';
