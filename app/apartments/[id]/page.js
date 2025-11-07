// 'use client';
// import { notFound } from 'next/navigation';
// import Image from 'next/image';
// import { usePathname } from 'next/navigation';
// import AppHeader from '@/app/components/header';
// import AppFooter from '@/app/components/footer';
// import { useEffect, useState } from 'react';
// import { FaWifi, FaShower, FaDog, FaParking,FaWhatsapp } from 'react-icons/fa';

// const apartmentData = {
//   'modern-loft': {
//     title: 'Modern Loft',
//     price: 'R1,500/month',
//     location: 'New York, NY',
//     images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80',
//            'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80', 
//            'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=8'],
//     description: 'A stylish modern loft in the heart of Manhattan with great amenities and skyline views.',
//     features: {
//       wifi: true,
//       geyser: true,
//       petsAllowed: false,
//       parking: true
//     }
//   },
//   'downtown-apartment': {
//     title: 'Downtown Apartment',
//     price: 'R2,000/month',
//     location: 'Los Angeles, CA',
//     images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80',
//       'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80', 
//       'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=8'],
//     description: 'Spacious downtown apartment close to nightlife and shopping.',
//     features: {
//       wifi: true,
//       geyser: false,
//       petsAllowed: true,
//       parking: false
//     }
//   },
//   'cozy-studio': {
//     title: 'Cozy Studio',
//     price: 'R1,200/month',
//     location: 'Austin, TX',
//     images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80',
//       'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80', 
//       'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=8'],
//     description: 'Comfortable and affordable studio in a quiet neighborhood, ideal for singles or students.',
//     features: {
//       wifi: true,
//       geyser: false,
//       petsAllowed: true,
//       parking: true
//     }
//   },
//   'spacious-apartment': {
//     title: 'Spacious Apartment',
//     price: 'R2,200/month',
//     location: 'Chicago, IL',
//     images: ['https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80',
//       'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80', 
//       'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=8'],
//     description: 'Large apartment with lots of natural light and modern design elements.',
//     features: {
//       wifi: true,
//       geyser: true,
//       petsAllowed: true,
//       parking: true
//     }
//   }
// };

// export default function ApartmentDetailPage() {
//   const pathName = usePathname();
//   const lastSegment = pathName.split("/").filter(Boolean).pop();
//   const [apartment, setApartment] = useState(null);
//   const [currentImg, setCurrentImg] = useState(0);


//   useEffect(() => {
//     if (lastSegment && apartmentData[lastSegment]) {
//       setApartment(apartmentData[lastSegment]);
//     }
//   }, [lastSegment]);

//   if (!apartment) return <div className="p-10 text-center">Loading...</div>;
  
//   const message = encodeURIComponent(
//     `Hello, I'm interested in the listing: ${apartment.title}\nLocation: ${apartment.location}\nPrice: ${apartment.price}\nCould you provide more details?`
//   );

//   if (!apartment) return notFound();

//   return (
//     <div className="bg-white min-h-screen text-black flex flex-col justify-between">
//       <AppHeader />
//       <main className="max-w-4xl mx-auto px-4 py-10">
//         {/* <img
//           src={apartment.image}
//           alt={apartment.title}
//           className="w-full h-72 object-cover rounded-lg shadow-md mb-6"
//         /> */}
//         <div className="relative w-full h-72 mb-6">
//           {/* <img
//             src={apartment.images[currentImg]}
//             alt={`${apartment.title} image ${currentImg + 1}`}
//             className="w-full h-full object-cover rounded-lg shadow-md"
//           /> */}
//           <Image
//             src={apartment.images[currentImg]}
//             alt={`${apartment.title} image ${currentImg + 1}`}
//             width={800}           // Set a reasonable width
//             height={500}          // Set a reasonable height
//             className="w-full h-full object-cover rounded-lg shadow-md"
//             style={{ objectFit: 'cover' }}
//             priority
//           />
//           <div className="absolute inset-y-0 left-0 flex items-center">
//             <button
//               onClick={() => setCurrentImg((prev) => (prev === 0 ? apartment.images.length - 1 : prev - 1))}
//               className="bg-white/70 hover:bg-white text-black font-bold px-3 py-1 m-2 rounded"
//             >&lt;</button>
//           </div>
//           <div className="absolute inset-y-0 right-0 flex items-center">
//             <button
//               onClick={() => setCurrentImg((prev) => (prev === apartment.images.length - 1 ? 0 : prev + 1))}
//               className="bg-white/70 hover:bg-white text-black font-bold px-3 py-1 m-2 rounded"
//             >&gt;</button>
//           </div>
//         </div>
//         <h1 className="text-3xl font-bold mb-2">{apartment.title}</h1>
//         <p className="text-blue-700 font-medium text-xl mb-1">{apartment.price}</p>
//         <p className="text-gray-600 mb-4">{apartment.location}</p>
//         <p className="text-base text-gray-700 leading-relaxed mb-6">{apartment.description}</p>

//         <div className="border-t pt-8">
//           <h2 className="text-xl font-semibold mb-6">Amenities</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div className="flex items-center gap-3 p-4 bg-gray-50 rounded shadow-sm">
//               <FaWifi className="text-blue-500 text-xl" />
//               <span className="text-gray-700">WiFi: <strong>{apartment.features.wifi ? 'Available' : 'Not available'}</strong></span>
//             </div>
//             <div className="flex items-center gap-3 p-4 bg-gray-50 rounded shadow-sm">
//               <FaShower className="text-blue-500 text-xl" />
//               <span className="text-gray-700">Geyser: <strong>{apartment.features.geyser ? 'Available' : 'Not available'}</strong></span>
//             </div>
//             <div className="flex items-center gap-3 p-4 bg-gray-50 rounded shadow-sm">
//               <FaDog className="text-blue-500 text-xl" />
//               <span className="text-gray-700">Pets Allowed: <strong>{apartment.features.petsAllowed ? 'Yes' : 'No'}</strong></span>
//             </div>
//             <div className="flex items-center gap-3 p-4 bg-gray-50 rounded shadow-sm">
//               <FaParking className="text-blue-500 text-xl" />
//               <span className="text-gray-700">Parking: <strong>{apartment.features.parking ? 'Available' : 'Not available'}</strong></span>
//             </div>
//           </div>
//         </div>



//         <div className="mt-12 flex justify-center">
//           <a
//             href={`https://wa.me/+27711572045?text=${message}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-green-700 transition-colors duration-300 shadow-md"
//           >
//             <FaWhatsapp className="text-xl" /> Contact Agent on WhatsApp
//           </a>
//         </div>
//       </main>
//       <AppFooter />
//     </div>
//   );
// }

// export async function generateStaticParams() {
//   return Object.keys(apartmentData).map(id => ({ id }));
// }

import apartmentData from '@/app/data/apartmentData'; // move the object to a reusable file
import ApartmentDetailClient from './ApartmentDetailClient';

export async function generateStaticParams() {
  return Object.keys(apartmentData).map(id => ({ id }));
}

export default async function ApartmentDetailPage({ params }) {
  const paramsVar = await params || {}; // Ensure params is defined
  const apartment = await apartmentData[paramsVar.id];

  if (!apartment) return <div className="p-10 text-center">Listing not found.</div>;

  return <ApartmentDetailClient apartment={apartment} />;
}