'use client';

import { useState } from 'react';
import AppFooter from '@/app/components/footer';
import AppHeader from '@/app/components/header';
import Image from 'next/image';


export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white min-h-screen text-black flex flex-col justify-between">
      <AppHeader />
      <main className="flex flex-col lg:flex-row px-6 py-16 gap-12 max-w-7xl mx-auto w-full">
        {/* Left section: Contact form and details */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 mb-8">
            Have questions or need to schedule a viewing? Feel free to contact us using the form below or reach out directly via phone or email.
          </p>
          <form className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            />
            <textarea
              name="message"
              placeholder="Message"
              rows="4"
              value={form.message}
              onChange={handleChange}
              className="border p-3 rounded w-full"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>
          <div className="mt-8 text-sm text-gray-700 space-y-2">
            <p>📞 (123) 456-7690</p>
            <p>📧 info@apartmentrental.com</p>
            <p>📍 123 Main Street, Anytown, USA</p>
          </div>
        </div>

        {/* Right section: Image */}
        <div className="flex-1">
        <Image
          src="https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1000&q=80"
          alt="Contact location"
          width={1000}
          height={600}
          className="w-full h-full object-cover rounded-lg shadow-md"
          style={{ objectFit: 'cover' }}
          priority
        />
        </div>
      </main>
      <AppFooter />
    </div>
  );
}