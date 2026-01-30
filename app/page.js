'use client';
import Head from 'next/head'
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
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="UTF-8" />

        {/* <!-- Primary Meta Tags --> */}
        <title>Tembisa Room Finders | Rooms, Cottages & Bachelor Rentals</title>
        <meta name="title" content="Tembisa Room Finders |  Rooms, Cottages & Bachelor Rentals" />
        <meta name="description" content="Find affordable rooms, bachelor units, cottages, and rental spaces across Tembisa. Fast, reliable, and convenient rental matching with relocation transport available." />
        <meta name="keywords" content="Tembisa Room Finders, Tembisa, Rooms, romm finders, rent tembisa, back room, bachelor, 2 room, tembisa room available" />
        <meta name="author" content="Tshidiso Modiko" />
        <meta name="theme-color" content="#0a0a0a" />

        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tembisaroomfinders.co.za" />
        <meta property="og:title" content="Tembisa Room Finders | Rooms, Cottages & Bachelor Rentals" />
        <meta property="og:description" content="Find affordable rooms, bachelor units, cottages, and rental spaces across Tembisa. Fast, reliable, and convenient rental matching with relocation transport available." />
        <meta property="og:image" content="https://www.tembisaroomfinders.co.za/og-image.png" />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.tembisaroomfinders.co.za" />
        <meta property="twitter:title" content="Tembisa Room Finders | Rooms, Cottages & Bachelor Rentals" />
        <meta property="twitter:description" content="Find affordable rooms, bachelor units, cottages, and rental spaces across Tembisa. Fast, reliable, and convenient rental matching with relocation transport available." />
        <meta property="twitter:image" content="https://www.tembisaroomfinders.co.za/og-image.png" />

        {/* <!-- Favicon --> */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* <!-- Canonical Link --> */}
        <link rel="canonical" href="https://www.tembisaroomfinders.co.za/" />

        {/* <!-- Robots --> */}
        <meta name="robots" content="index, follow" />
      </Head>
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
    </>
  );
}
