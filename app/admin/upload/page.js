'use client';

import { storage, db } from '../../lib/firebaseClient';
import { useAuth } from '@/context/AuthContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [listingId, setListingId] = useState(null);
  const [pageReady, setPageReady] = useState(false);

  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    images: [],
    features: {
      wifi: false,
      geyser: false,
      petsAllowed: false,
      parking: false,
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    setListingId(id);
    setPageReady(true);
  }, []);

  useEffect(() => {
    if (pageReady && user === null) {
      router.push('/admin/login');
    }
  }, [user, pageReady, router]);

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) return;

      try {
        const docRef = doc(db, 'apartments', listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            title: data.title || '',
            location: data.location || '',
            price: data.price || '',
            description: data.description || '',
            images: data.images || [],
            features: {
              wifi: data.features?.wifi || false,
              geyser: data.features?.geyser || false,
              petsAllowed: data.features?.petsAllowed || false,
              parking: data.features?.parking || false,
            },
          });
        } else {
          alert('Listing not found');
          router.push('/admin/dashboard');
        }
      } catch (error) {
        console.error('Error loading listing:', error);
        alert('Failed to load listing');
      }
    };

    if (pageReady) {
      fetchListing();
    }
  }, [listingId, pageReady, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 3);

    try {
      const uploadedUrls = [];

      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const storageRef = ref(storage, `apartments/${Date.now()}-${file.name}`);

        await uploadBytes(storageRef, arrayBuffer, {
          contentType: file.type,
        });

        const downloadURL = await getDownloadURL(storageRef);
        uploadedUrls.push(downloadURL);
      }

      setForm((prev) => ({
        ...prev,
        images: uploadedUrls,
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Image upload failed');
    }
  };

  const handleFeatureToggle = (feature) => {
    setForm((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (listingId) {
        await updateDoc(doc(db, 'apartments', listingId), {
          ...form,
          updatedAt: new Date(),
        });
        alert('Listing updated successfully!');
      } else {
        await addDoc(collection(db, 'apartments'), {
          ...form,
          createdAt: new Date(),
        });
        alert('Listing created successfully!');
      }

      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('Something went wrong. Check console.');
    } finally {
      setLoading(false);
    }
  };

  if (!pageReady || !user) {
    return <div className="p-10 text-center">Redirecting...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">
        {listingId ? 'Edit' : 'Add'} Apartment Listing
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price (e.g., R1,500/month)"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded"
          rows={4}
          required
        />

        <div>
          <label className="block font-medium mb-1">Upload Images (max 3)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full border p-2 rounded mb-2"
          />
          {form.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {form.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.entries(form.features).map(([key, val]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={val}
                onChange={() => handleFeatureToggle(key)}
                className="accent-blue-600"
              />
              <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading
            ? 'Saving...'
            : listingId
            ? 'Update Listing'
            : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}