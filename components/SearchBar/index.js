'use client';

import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  BedDouble,
  Home,
  RotateCcw,
} from 'lucide-react';

const initialFilters = {
  location: '',
  propertyType: '',
  minPrice: '',
  maxPrice: '',
  bedrooms: '',
};

export default function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(filters);
  };

  const handleClear = () => {
    setFilters(initialFilters);
    onSearch?.(initialFilters);
  };

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fbanner_hero.jpeg?alt=media&token=83011ded-d699-4af7-a74c-5c930c19870d')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/80" />

      <div className="relative mx-auto flex min-h-[75vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="w-full">
          {/* Hero text */}
          <div className="mx-auto max-w-4xl text-center">
            <span className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm text-white backdrop-blur-md">
              Trusted property search
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find your next home with confidence
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base text-white/85 sm:text-lg">
              Search rooms, apartments, and family homes by location, price, and property features.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-10 max-w-6xl rounded-3xl border border-white/15 bg-white/90 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 sm:p-5"
          >
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
              {/* Location */}
              <div className="lg:col-span-4">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Location
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-3 focus-within:ring-2 focus-within:ring-blue-600 dark:border-slate-700 dark:bg-slate-950">
                  <MapPin className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <input
                    name="location"
                    value={filters.location}
                    onChange={handleChange}
                    placeholder="Search by suburb, city, or area"
                    className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Property Type */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Property type
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
                  <Home className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <select
                    name="propertyType"
                    value={filters.propertyType}
                    onChange={handleChange}
                    className="w-full bg-transparent px-3 py-3 text-sm outline-none dark:text-white"
                  >
                    <option value="">Any type</option>
                    <option value="room">Room</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
              </div>

              {/* Min Price */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Min price
                </label>
                <select
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">No minimum</option>
                  <option value="1000">R1,000</option>
                  <option value="2000">R2,000</option>
                  <option value="3000">R3,000</option>
                </select>
              </div>

              {/* Max Price */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Max price
                </label>
                <select
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">No maximum</option>
                  <option value="2000">R2,000</option>
                  <option value="5000">R5,000</option>
                  <option value="10000">R10,000</option>
                </select>
              </div>

              {/* Bedrooms */}
              <div className="lg:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Bedrooms
                </label>
                <div className="flex items-center rounded-2xl border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
                  <BedDouble className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleChange}
                    className="w-full bg-transparent px-3 py-3 text-sm outline-none dark:text-white"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:flex-row sm:justify-between">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear
                </button>
              </div>

              <button className="inline-flex items-center gap-2 rounded-2xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            {/* Advanced */}
            {showAdvanced && (
              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 dark:border-slate-800 sm:grid-cols-2 lg:grid-cols-4">
                <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                  <option>Furnished</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>

                <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                  <option>Bathrooms</option>
                  <option>1+</option>
                  <option>2+</option>
                </select>

                <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                  <option>Parking</option>
                  <option>1+</option>
                </select>

                <select className="rounded-2xl border border-slate-200 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white">
                  <option>Availability</option>
                  <option>Immediate</option>
                </select>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}