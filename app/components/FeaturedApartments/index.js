'use client';
// FeaturedApartments.js
import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";

const initialApartments = [
  {
    id: "bachelor-birch-acres-1",
    title: "Birch Acres",
    price: "4,000",
    location: "Birch Acres",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmidrand%2FNoordwyk%2Fnoordwyk-bachelor-2.jpeg?alt=media&token=e1ceba16-d2aa-416d-bf99-c992e1339606",
    bedrooms: '1 bedroom'
  },
  {
    id: "bachelor-Noordwyk-midrand-1",
    title: "Noordwyk bachelor",
    price: "6,500",
    location: "Midrand",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fmidrand%2FNoordwyk%2Fnoordwyk-bachelor-2.jpeg?alt=media&token=e1ceba16-d2aa-416d-bf99-c992e1339606",
     bedrooms: '1 bedroom'
  },
  {
    id: "bachelor-Kempton-park-1",
    title: "Kempton bachelor",
    price: "5,500",
    location: "Kempton Park",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fkempton-park%2Fkempton-park-bachelor-1.jpeg?alt=media&token=fdfa830e-ed60-48e4-831f-cbe2fffaa8c6",
    bedrooms: '1 bedroom'
  },
  {
    id: 'hospital-view-bachelor-1',
    title: 'hospital View Bachelor',
    price: '3,000',
    location: 'Hospital View',
    image: 'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fbachelor-id001%2Fhospitav-view-bachelor-1.jpeg?alt=media&token=e7483557-216a-44ad-9eb6-8c9222cbda4b',
    bedrooms: '1 bedroom'
  },
  {
    id: '1-Room-Mayibuye',
    title: 'Mayibuye Bachelor',
    price: '2,500',
    location: 'Mayibuye',
    image: 'https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fbanner_hero.jpeg?alt=media&token=83011ded-d699-4af7-a74c-5c930c19870d',
    bedrooms: '1 bedroom'
  },
  {
    id: "1-Room-Winnie",
    title: "Winnie 1 Room",
    price: "1,350",
    location: "Winnie",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fwinnie-zone-1%2Fwinnie-zone-1-picture-1.webp?alt=media&token=09b519ff-8879-4271-bf50-e22e63bfcf85",
     bedrooms: '1 bedroom'
  },
  {
    id: "1-Room-eNtshonalanga",
    title: "eNtshonalanga Bachelor",
    price: "2,800",
    location: "eNtshonalanga",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-picture-1.webp?alt=media&token=5ebb8f40-35a3-4ca8-b45a-3d942a317584",
     bedrooms: '1 bedroom'
  },
  {
    id: "endulwini-cottage",
    title: "eNdulwini Cottage",
    price: "3,000",
    location: "eNdulwini",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fendulwini%2Fendulwini-cottage-picture-1.webp?alt=media&token=69f4a41e-974a-4f0c-b16a-7dce9671ce8f",
     bedrooms: '1 bedroom'
  },
  {
    id: "hospital-view-1-room",
    title: "Hospital View 1 Room",
    price: "1,800",
    location: "Hospital View",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fhospital-view%2Fhospital-view-picture-1.png?alt=media&token=77ad973c-c51a-4a30-a8c1-96ed2d438071",
     bedrooms: '1 bedroom'
  },
  {
    id: "thlamathlama-bachelor",
    title: "thlamathlama bachelor",
    price: "3,500",
    location: "Thlamathlama",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fthlamathlama%2Fthlamathlama-bachelor-picture-3.png?alt=media&token=778a2d82-8f91-4b81-882f-01014c62ad0c",
     bedrooms: '1 bedroom'
  },
    {
    id: "1-Room-eNtshonalanga-2",
    title: "eNtshonalanga 1 Room",
    price: "1,300",
    location: "eNtshonalanga",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FeNtshonalanga%2FeNtshonalanga-1-room-id1-pic-1.jpeg?alt=media&token=d04f4071-321d-496e-b4a8-c09626d84300",
     bedrooms: '1 bedroom'
  },
  {
    id: "1-Room-difateng-id1",
    title: "Difateng 1 Room",
    price: "1,300",
    location: "Difateng",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2Fdifateng%2Fdifateng-1-room-id1-pic-4.jpeg?alt=media&token=0c70a68b-0117-44ec-ab31-f53581cd4cb3",
     bedrooms: '1 bedroom'
  },
  {
    id: "bachelor-Makhulong-1",
    title: "Makhulong bachelor",
    price: "3,500",
    location: "Makhulong",
    image: "https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/demo%2FMakhulong%2Fmakhulong-bachelor-5.jpeg?alt=media&token=0e000623-905e-49e9-8d69-3847b0d735ac",
     bedrooms: '1 bedroom'
  }
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
          return  parseInt((apartment.price).replace(/,/g, ''), 10) >= min &&  parseInt((apartment.price).replace(/,/g, ''), 10)<= max;
        })();
      console.log("filter Bedrooms: ", filters.bedrooms);
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
