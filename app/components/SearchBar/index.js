'use client';
// SearchBar.js
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState({
    location: "",
    price: "",
    bedrooms: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const emptyFilters = { location: '', price: '', bedrooms: '' };
    setFilters(emptyFilters);
    onSearch(emptyFilters); // clear results
  };

  return (
<section
  className="flex justify-center text-center mb-10 px-4 min-h-[30vh] sm:min-h-[100vh] md:min-h-[50vh] bg-cover bg-[position:50%_30%]"
  style={{
    backgroundImage:
      "url('https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fbanner_hero.jpeg?alt=media&token=83011ded-d699-4af7-a74c-5c930c19870d')"
  }}
>
    <div className="lg:my-auto my-10 sm:my-10 backdrop-blur-xl w-full max-w-3xl px-6 py-8 flex flex-col justify-center items-center rounded-lg shadow-md">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 transition-opacity duration-500 ease-in-out text-white drop-shadow">
        Find Your New Room
      </h1>
      <div className="flex flex-col sm:flex-row justify-center items-center bg-white border rounded-lg shadow-sm overflow-hidden w-full lg:w-auto md:w-auto sm:w-full animate-fade-in">
        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="p-3 border-b sm:border-b-0 sm:border-r outline-none text-sm w-full sm:w-40 hover:bg-gray-100 focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
        >
          <option disabled value="">Location</option>
          <option>Hospital View</option>
          <option>eNtshonalanga</option>
          <option>Winnie</option>
          <option>Mayibuye</option>
          <option>Midrand</option>
        </select>

        <select
          name="price"
          value={filters.price}
          onChange={handleChange}
          className="p-3 border-b sm:border-b-0 sm:border-r outline-none text-sm w-full sm:w-40 hover:bg-gray-100 focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
        >
          <option disabled value="">Price</option>
          <option>1000-2000</option>
          <option>2000-3000</option>
          <option>3000-4000</option>
          <option>4000-5000</option>
          <option>5000-10000</option>
        </select>

        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
          className="p-3 border-b sm:border-b-0 sm:border-r outline-none text-sm w-full sm:w-40 hover:bg-gray-100 focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
        >
          <option disabled value="">Bedrooms</option>
          <option>1 bedroom</option>
          <option>2 bedroom</option>
          <option>3 bedroom</option>
          <option>4 bedroom</option>
        </select>

        <button
          className="bg-blue-900 text-white px-6 py-3 text-sm font-medium w-full sm:w-32 hover:bg-blue-800 focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <button
          onClick={handleClear}
          className="mt-4 text-md text-white hover:underline"
        >
          Clear Filters
        </button>
    </div>
  </section>
  );
}
