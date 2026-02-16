'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import AppHeader from '@/app/components/header';
import AppFooter from '@/app/components/footer';
import ApartmentDescription from '@/app/components/ApartmentDescription';
import { FaWifi, FaShower, FaDog, FaParking, FaWhatsapp } from 'react-icons/fa';
import { db } from "@/app/lib/firebaseClient";
import { doc, setDoc, addDoc, collection, increment, serverTimestamp } from "firebase/firestore";

export default function ApartmentDetailClient({ apartment }) {
  const [currentImg, setCurrentImg] = useState(0);

  // ⭐ NEW STATE: Show Form Modal
  const [showForm, setShowForm] = useState(false);

  // ⭐ NEW STATE: Form Fields
  const [form, setForm] = useState({
    name: "",
    address: "",
    budget: "",
  });


  const message = encodeURIComponent(
    `Hello, I'm interested in the listing: ${apartment.title}\nLocation: ${apartment.location}\nPrice: ${apartment.price}\nCould you provide more details?`
  );

  useEffect(() => {
    trackVisit().catch((err) => {
      console.error("Failed to track visit:", err);
    });
  }, []);

  const trackVisit = async () => {
    // Path: appartment / {location} / rooms / {title}
    const ref = doc(
      db,
      "appartment",
      firestoreSafeKey(apartment.location),   // document
      "rooms",              // subcollection
      firestoreSafeKey(apartment.title)       // sub-document
    );

    await setDoc(
      ref,
      {
        visitCount: increment(1),
        lastVisitedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

    const trackContact = async () => {
    // Path: appartment / {location} / rooms / {title}
    const ref = doc(
      db,
      "appartment",
      firestoreSafeKey(apartment.location),   // document
      "rooms",              // subcollection
      firestoreSafeKey(apartment.title)       // sub-document
    );

    await setDoc(
      ref,
      {
        // visitCount: increment(1),
        // lastVisitedAt: serverTimestamp(),
        contactClick: increment(1)
      },
      { merge: true }
    );
  };

  function firestoreSafeKey(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')   // remove special characters
      .replace(/\s+/g, '-')       // convert spaces to hyphens
      .replace(/-+/g, '-');       // collapse multiple hyphens
  }


  const countEventClick = async () => {
    try{
      const res = await trackContact();
      setShowForm(true); // ⭐ SHOW FORM WHEN CONTACT IS CLICKED
      console.log("countEventClick", res)
    }
    catch(err){
      console.log("countEventClick: ", err)
      throw new Error(err);
    }
  }

  // ⭐ NEW FUNCTION: FORM HANDLERS
  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const pageUrl = typeof window !== "undefined" ? window.location.href : "";

    const result = await storeLead(pageUrl);

    if (result.success) {
      // Build WhatsApp message
      const userMessage = encodeURIComponent(
        `Hello, I'm interested in the listing:\n` +
        `• ${apartment.title}\n` +
        `• Location: ${apartment.location}\n` +
        `• Price: ${apartment.price}\n\n` +
        `My Details:\n` +
        `• Name: ${form.name}\n` +
        `• Address: ${form.address}\n` +
        `• Budget: R${form.budget}\n\n` +
        `Listing Link:\n${pageUrl}\n\n` +
        `Please contact me with more information.`
      );

      // Redirect to WhatsApp
      window.open(`https://wa.me/27796849423?text=${userMessage}`, "_blank");
    } else {
      alert("Failed to save your request. Please try again.");
    }
  };

  const storeLead = async (pageUrl) => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];

      await addDoc(
        collection(db, "leads", currentDate, "items"),
        {
          name: form.name,
          address: form.address,
          budget: form.budget,

          listingTitle: apartment.title,
          listingLocation: apartment.location,
          listingPrice: apartment.price,
          listingUrl: pageUrl,

          createdAt: serverTimestamp(),
        }
      );

      console.log("Lead saved in Firestore under date:", currentDate);

      return { success: true };  // ⭐ return success status

    } catch (error) {
      console.error("Error saving lead:", error);
      return { success: false, error };  // ⭐ return failure status
    }
  };

  return (
    <div className="bg-white min-h-screen text-black flex flex-col justify-between">
      <AppHeader />
        <main className="max-w-4xl mx-auto px-4 py-10">
            <div className="relative w-full h-96 mb-6">
                <Image
                    src={apartment.images[currentImg]}
                    alt={`${apartment.title} image ${currentImg + 1}`}
                    width={800}           // Set a reasonable width
                    height={900}          // Set a reasonable height
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
            {/* <p className="text-base text-gray-700 leading-relaxed mb-6">{apartment.description}</p> */}
            <ApartmentDescription apartment={apartment} />
    
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
                <button
                    onClick={async () => {await countEventClick()}}
                    //href={`https://wa.me/+27796849423?text=${message}`}
                    //target="_blank"
                    //rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-green-700 transition-colors duration-300 shadow-md"
                >
                    <FaWhatsapp className="text-xl" /> Contact Agent on WhatsApp
                </button>
            </div>
        </main>
      <AppFooter />


        {/* ⭐ ------------------ CONTACT FORM MODAL ------------------ ⭐ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">

            <h2 className="text-xl font-semibold mb-4">Quick Contact Form</h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  name="address"
                  required
                  value={form.address}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium">Budget (R)</label>
                <input
                  name="budget"
                  type="number"
                  required
                  value={form.budget}
                  onChange={handleFormChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                    // onClick={async () => {await countEventClick()}}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-green-700 transition-colors duration-300 shadow-md"
                >
                    <FaWhatsapp className="text-xl" /> Contact Agent on WhatsApp
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
}