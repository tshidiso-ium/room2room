'use client';
// FeaturedApartments.js
import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";

const initialApartments = [
  {
    id: "modern-loft",
    title: "Modern Loft",
    price: "1,500",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "downtown-apartment",
    title: "Downtown Apartment",
    price: "2,000",
    location: "Los Angeles, CA",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "cozy-studio",
    title: "Cozy Studio",
    price: "1,200",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: "spacious-apartment",
    title: "Spacious Apartment",
    price: "2,200",
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80",
  },
];

export default function FeaturedApartments({ filters }) {
  const [apartments, setApartments] = useState(initialApartments);
  const [filteredApartments, setFilteredApartments] = useState(initialApartments);

  useEffect(() => {
    const result = apartments.filter(apartment => {
      const matchesLocation = !filters.location || apartment.location === filters.location;
      const matchesPrice = !filters.price ||
        (() => {
          const [min, max] = filters.price.split('-').map(Number);
          return parseInt(apartment.price) >= min && parseInt(apartment.price) <= max;
        })();
      const matchesBedrooms = !filters.bedrooms || apartment.bedrooms === filters.bedrooms;
      return matchesLocation && matchesPrice && matchesBedrooms;
    });
    setFilteredApartments(result);
  }, [filters, apartments]);

  return (
    // <section className="px-4 py-10">
    //   <h2 className="text-2xl font-bold mb-8 text-center">Featured Apartments</h2>
    //   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    //     {apartments.map((apt, index) => (
    //       <Link
    //         key={index}
    //         href={`/apartments/${apt.id}`}
    //         className="rounded overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white cursor-pointer transform hover:-translate-y-1"
    //       >
    //         <img
    //           src={apt.image}
    //           alt={apt.title}
    //           className="w-full h-48 object-cover"
    //         />
    //         <div className="p-4">
    //           <h3 className="font-semibold text-lg mb-1">{apt.title}</h3>
    //           <p className="text-blue-900 font-medium mb-1">{apt.price}</p>
    //           <p className="text-sm text-gray-600">{apt.location}</p>
    //         </div>
    //       </Link>
    //     ))}
    //   </div>
    // </section>

    <section className="py-10 px-4 max-w-7xl mx-auto">
    <h2 className="text-2xl font-semibold mb-6 text-center">Featured Apartments</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {filteredApartments.map((apt, index) => (
        // <div key={apt.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <Link
            key={index}
            href={`/apartments/${apt.id}`}
            className="rounded overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white cursor-pointer transform hover:-translate-y-1"
          >
          {/* <img src={apt.image} alt={apt.title} className="w-full h-48 object-cover" /> */}
          <Image
            src={apt.image}
            alt={apt.title}
            width={400}
            height={200}
            className="w-full h-48 object-cover"
            style={{ objectFit: 'cover' }}
          />
          <div className="p-4">
            <h3 className="text-lg font-bold mb-1">{apt.title}</h3>
            <p className="text-sm text-gray-600">{apt.location}</p>
            <p className="text-sm text-gray-600">{apt.bedrooms}</p>
            <p className="text-blue-700 font-semibold">R{apt.price}/month</p>
          </div>
        </Link>
      ))}
      {filteredApartments.length === 0 && (
        <div className="col-span-full text-center text-gray-500">No apartments match your search criteria.</div>
      )}
    </div>
  </section>
  );
}
