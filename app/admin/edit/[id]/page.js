'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useParams, useRouter } from 'next/navigation';

export default function EditApartmentPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState(null);

  useEffect(() => {
    const fetchApartment = async () => {
      const docRef = doc(db, 'apartments', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setApartment(docSnap.data());
        setLoading(false);
      } else {
        alert('Listing not found');
        router.push('/admin/dashboard');
      }
    };
    fetchApartment();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApartment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(doc(db, 'apartments', id), apartment);
    alert('Listing updated!');
    router.push('/admin/dashboard');
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Listing: {apartment.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={apartment.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Title"
          required
        />
        <input
          type="text"
          name="location"
          value={apartment.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Location"
          required
        />
        <input
          type="text"
          name="price"
          value={apartment.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Price"
          required
        />
        <textarea
          name="description"
          value={apartment.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          placeholder="Description"
        />
        {/* You could add dynamic image/feature editing here too */}
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