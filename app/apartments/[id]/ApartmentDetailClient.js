'use client';

import { useState } from 'react';
import Image from 'next/image';
import AppHeader from '@/app/components/header';
import AppFooter from '@/app/components/footer';
import { FaWifi, FaShower, FaDog, FaParking, FaWhatsapp } from 'react-icons/fa';

export default function ApartmentDetailClient({ apartment }) {
  const [currentImg, setCurrentImg] = useState(0);

  const message = encodeURIComponent(
    `Hello, I'm interested in the listing: ${apartment.title}\nLocation: ${apartment.location}\nPrice: ${apartment.price}\nCould you provide more details?`
  );

  return (
    <div className="bg-white min-h-screen text-black flex flex-col justify-between">
      <AppHeader />
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="relative w-full h-72 mb-6">
                <Image
                    src={apartment.images[currentImg]}
                    alt={`${apartment.title} image ${currentImg + 1}`}
                    width={800}           // Set a reasonable width
                    height={500}          // Set a reasonable height
                    className="w-full h-full object-cover rounded-lg shadow-md"
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <div className="absolute inset-y-0 left-0 flex items-center">
                    <button
                    onClick={() => setCurrentImg((prev) => (prev === 0 ? apartment.images.length - 1 : prev - 1))}
                    className="bg-white/70 hover:bg-white text-black font-bold px-3 py-1 m-2 rounded"
                    >&lt;</button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                    onClick={() => setCurrentImg((prev) => (prev === apartment.images.length - 1 ? 0 : prev + 1))}
                    className="bg-white/70 hover:bg-white text-black font-bold px-3 py-1 m-2 rounded"
                    >&gt;</button>
                </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">{apartment.title}</h1>
            <p className="text-blue-700 font-medium text-xl mb-1">{apartment.price}</p>
            <p className="text-gray-600 mb-4">{apartment.location}</p>
            <p className="text-base text-gray-700 leading-relaxed mb-6">{apartment.description}</p>
    
            <div className="border-t pt-8">
                <h2 className="text-xl font-semibold mb-6">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded shadow-sm">
                    <FaWifi className="text-blue-500 text-xl" />
                    <span className="text-gray-700">WiFi: <strong>{apartment.features.wifi ? 'Available' : 'Not available'}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded shadow-sm">
                    <FaShower className="text-blue-500 text-xl" />
                    <span className="text-gray-700">Geyser: <strong>{apartment.features.geyser ? 'Available' : 'Not available'}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded shadow-sm">
                    <FaDog className="text-blue-500 text-xl" />
                    <span className="text-gray-700">Pets Allowed: <strong>{apartment.features.petsAllowed ? 'Yes' : 'No'}</strong></span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded shadow-sm">
                    <FaParking className="text-blue-500 text-xl" />
                    <span className="text-gray-700">Parking: <strong>{apartment.features.parking ? 'Available' : 'Not available'}</strong></span>
                    </div>
                </div>
            </div>
            <div className="mt-12 flex justify-center">
                <a
                    href={`https://wa.me/+27711572045?text=${message}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-green-700 transition-colors duration-300 shadow-md"
                >
                    <FaWhatsapp className="text-xl" /> Contact Agent on WhatsApp
                </a>
            </div>
        </main>
      <AppFooter />
    </div>
  );
}