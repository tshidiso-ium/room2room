'use client';
import { AuthProvider } from '@/context/AuthContext';
import AdminNavbar from '@/components/AdminNavbar';


export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <AdminNavbar />
      <main className="flex-1">{children}</main>
    </AuthProvider>
  );
}