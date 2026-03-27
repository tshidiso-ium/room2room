'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AppHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const storedTheme =
      typeof window !== 'undefined' ? localStorage.getItem('site-theme') : null;

    if (storedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);

    if (typeof window !== 'undefined') {
      localStorage.setItem('site-theme', next ? 'dark' : 'light');
    }

    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-lg transition-colors dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
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

        <nav className="hidden items-center gap-12 text-sm font-medium text-slate-700 dark:text-slate-200 md:flex">
          <Link href="/" className="transition hover:text-blue-900 dark:hover:text-blue-400">
            Rentals
          </Link>
          <Link href="/about" className="transition hover:text-blue-900 dark:hover:text-blue-400">
            About
          </Link>
          <Link href="/contact" className="transition hover:text-blue-900 dark:hover:text-blue-400">
            Contact
          </Link>
        </nav>

        <div className="hidden items-center  md:flex pl-24">
          <Link
            href="/admin/login"
            className="rounded-2xl bg-blue-900 px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          >
            Sign in
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {/* <button
            type="button"
            onClick={toggleDarkMode}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button> */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            aria-label="Toggle mobile menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Rentals
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>

            <div className="mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-800">
              {/* <Link
                href="/admin/login"
                className="rounded-xl px-4 py-2 transition hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link> */}

              {/* <Link
                href="/list-property"
                className="rounded-xl bg-blue-900 px-4 py-2 text-center text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                List property
              </Link> */}
              <Link
                href="/admin/login"
                className="rounded-xl bg-blue-900 px-4 py-2 text-center text-white transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link> 
            </div>
          </div>
        </div>
      )}
    </header>
  );
}