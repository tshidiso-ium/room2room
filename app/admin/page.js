import Link from 'next/link';

export default function AdminPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Portal</h1>
        <p className="text-gray-600 mb-6">Manage listings and property content.</p>
        <Link
          href="/admin/login"
          className="inline-block rounded-xl bg-blue-700 px-5 py-3 text-white hover:bg-blue-800"
        >
          Go to Admin Login
        </Link>
      </div>
    </main>
  );
}
