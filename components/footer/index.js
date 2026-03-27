'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export default function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 transition-colors dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/assets%2FRoomFindersLogoV4.png?alt=media&token=8ce08260-01c7-4f8e-b5f1-dee7b87cdf20"
                alt="Room Finders Logo"
                width={45}
                height={45}
                className="object-contain"
              />
              <div className="flex items-center text-lg font-semibold">
                <span className="text-yellow-400">Room</span>
                <span className="text-blue-900 dark:text-blue-400">Finders</span>
              </div>
            </Link>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Helping you find the perfect room, apartment, or home across South Africa.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/" className="hover:text-blue-900 dark:hover:text-blue-400">Rentals</Link></li>
              {/* <li><Link href="/buy" className="hover:text-blue-900 dark:hover:text-blue-400">Buy</Link></li> */}
              {/* <li><Link href="/list-property" className="hover:text-blue-900 dark:hover:text-blue-400">List Property</Link></li> */}
              <li><Link href="/about" className="hover:text-blue-900 dark:hover:text-blue-400">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/contact" className="hover:text-blue-900 dark:hover:text-blue-400">Contact</Link></li>
              {/* <li><Link href="/faq" className="hover:text-blue-900 dark:hover:text-blue-400">FAQ</Link></li>
              <li><Link href="/terms" className="hover:text-blue-900 dark:hover:text-blue-400">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-900 dark:hover:text-blue-400">Privacy Policy</Link></li> */}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Connect with us</h3>
            <div className="mt-4 flex gap-4 text-lg text-slate-600 dark:text-slate-400">

              <a
                href="https://wa.me/+2779689423"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-green-50 hover:text-green-600 dark:bg-slate-900 dark:hover:bg-green-500/10 dark:hover:text-green-400"
              >
                <FaWhatsapp />
              </a>

              <a
                href="https://instagram.com/tshidiso_modiko"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-pink-50 hover:text-pink-500 dark:bg-slate-900 dark:hover:bg-pink-500/10 dark:hover:text-pink-400"
              >
                <FaInstagram />
              </a>

              <a
                href="https://facebook.com/tshidiso.modiko.3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-blue-50 hover:text-blue-600 dark:bg-slate-900 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
              >
                <FaFacebook />
              </a>

              {/* Optional X (Twitter) */}
              {/* 
              <a
                href="https://x.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-slate-100 hover:text-black dark:bg-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <FaXTwitter />
              </a>
              */}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          © {new Date().getFullYear()} RoomFinders. All rights reserved.
        </div>
      </div>
    </footer>
  );
}