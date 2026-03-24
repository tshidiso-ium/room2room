'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const [apartments, setApartments] = useState([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/admin/login');
    } else {
      fetchListings();
    }
  }, [user]);

  const fetchListings = async () => {
    const querySnapshot = await getDocs(collection(db, 'apartments'));
    const listings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setApartments(listings);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this listing?');
    if (!confirm) return;
    await deleteDoc(doc(db, 'apartments', id));
    setApartments(apartments.filter(item => item.id !== id));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {apartments.map((apt) => (
          <div key={apt.id} className="bg-white rounded shadow p-4 flex flex-col">
            <img
              src={apt.images?.[0]}
              alt={apt.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-semibold">{apt.title}</h2>
            <p className="text-gray-600">{apt.location}</p>
            <p className="text-blue-600 font-medium">{apt.price}</p>

            <div className="mt-auto pt-4 flex justify-between gap-2">
              <Link
                href={`/admin/edit?id=${apt.id}`}
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(apt.id)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}