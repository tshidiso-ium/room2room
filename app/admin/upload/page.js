'use client';

import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    images: ['', '', ''],
    features: {
      wifi: false,
      geyser: false,
      petsAllowed: false,
      parking: false
    }
  });
  useEffect(() => {
    if (user === null) {
        router.push('/admin/login');
    }
  }, [user]);

  // Load listing data if editing
  useEffect(() => {
    if (id) {
      // Simulated fetch logic (replace with DB call)
      const listing = {}; // e.g., getApartmentById(id)
      if (listing) {
        setForm(listing);
      }
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(id ? 'Updating:' : 'Creating:', form);
    // Add create/update logic here
  };
    
  if (!user) {
    return <div className="p-10 text-center">Redirecting...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Edit' : 'Add'} Apartment Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
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

        {/* Image URLs */}
        <div>
          <label className="block font-medium mb-1">Image URLs (max 3)</label>
          {form.images.map((img, index) => (
            <input
              key={index}
              type="url"
              placeholder={`Image URL ${index + 1}`}
              value={img}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className="w-full border p-2 rounded mb-2"
            />
          ))}
        </div>

        {/* Features */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {id ? 'Update Listing' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
}
