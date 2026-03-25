'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebaseClient';

export default function EditApartmentPage() {
  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState(null);
  const [apartmentId, setApartmentId] = useState('');

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) {
          alert('Missing listing ID');
          window.location.href = '/admin/dashboard';
          return;
        }

        setApartmentId(id);

        const docRef = doc(db, 'apartments', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setApartment(docSnap.data());
          setLoading(false);
        } else {
          alert('Listing not found');
          window.location.href = '/admin/dashboard';
        }
      } catch (error) {
        console.error('Error fetching apartment:', error);
        alert('Failed to load listing');
        window.location.href = '/admin/dashboard';
      }
    };

    fetchApartment();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApartment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, 'apartments', apartmentId), apartment);
      alert('Listing updated!');
      window.location.href = '/admin/dashboard';
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Failed to update listing');
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!apartment) {
    return <div className="p-10 text-center">Listing not found.</div>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">
        Edit Listing: {apartment.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={apartment.title || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Title"
          required
        />

        <input
          type="text"
          name="location"
          value={apartment.location || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Location"
          required
        />

        <input
          type="text"
          name="price"
          value={apartment.price || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Price"
          required
        />

        <textarea
          name="description"
          value={apartment.description || ''}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Description"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}