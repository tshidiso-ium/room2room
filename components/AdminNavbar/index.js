'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '@/app/lib/firebaseClient';
import {
  LayoutDashboard,
  Upload,
  PencilLine,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Upload',
    href: '/admin/upload',
    icon: Upload,
  },
//   {
//     label: 'Edit',
//     href: '/admin/edit',
//     icon: PencilLine,
//   },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = getAuth(app);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoggingOut(false);
      setMenuOpen(false);
    }
  };

  const isActive = (href) => pathname === href;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-xl dark:bg-slate-800/90 ">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 dark:text-white">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl dark:bg-white">
            <Image
            src="https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/assets%2FRoomFindersLogoV4.png?alt=media&token=8ce08260-01c7-4f8e-b5f1-dee7b87cdf20"
            alt="Room Finders Logo"
            width={45}
            height={45}
            className="object-contain"
            />
          </div>

          <div className="leading-tight">
            <p className="text-sm text-yellow-500 font-bold">Room
                <span className="text-sm text-blue-900 dark:text-white font-bold"> Finders</span></p>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">Admin Portal</h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-blue-700 text-white shadow-md dark:bg-blue-600 dark:text-white'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:text-white dark:hover:bg-slate-700/50 dark:border-slate-600"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? 'Signing out...' : 'Logout'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle admin menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden dark:bg-slate-800/90">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-blue-700 text-white dark:bg-blue-600 dark:text-white'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:text-white dark:hover:bg-slate-700/50"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}