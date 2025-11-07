'use client';

import { useState } from "react";
import AppHeader from "@/app/components/header";
import SearchBar from "@/app/components/SearchBar";
import FeaturedApartments from "@/app/components/FeaturedApartments";
import AppFooter from "@/app/components/footer";

export default function HomePage() {
  const [filters, setFilters] = useState({
    location: '',
    price: '',
    bedrooms: ''
  });

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-white min-h-screen text-black flex flex-col justify-between">
      <div>
        <AppHeader />
        <main>
          <SearchBar onSearch={handleSearch}/>
          <FeaturedApartments filters={filters}/>
        </main>
      </div>
      <AppFooter/>
    </div>
  );
}
