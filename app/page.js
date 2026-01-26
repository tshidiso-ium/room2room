'use client';

import { useState, useEffect } from "react";
import AppHeader from "@/app/components/header";
import SearchBar from "@/app/components/SearchBar";
import FeaturedApartments from "@/app/components/FeaturedApartments";
import AppFooter from "@/app/components/footer";
import { db } from "@/app/lib/firebaseClient";
import { doc, setDoc, increment, serverTimestamp } from "firebase/firestore";

export default function HomePage() {
  const [filters, setFilters] = useState({
    location: '',
    price: '',
    bedrooms: ''
  });

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };


  useEffect(() => {
    const trackVisit = async () => {
      const ref = doc(db, "stats", "site");
      await setDoc(
        ref,
        {
          visitCount: increment(1),
          lastVisitedAt: serverTimestamp(),
        },
        { merge: true }
      );
    };

    trackVisit().catch((err) => {
      console.error("Failed to track visit:", err);
    });
  }, []);

  
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
