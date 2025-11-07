import Link from 'next/link';
export default function AppHeader() {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 shadow gap-4">
            <div className="text-xl font-bold text-blue-900">Apartment Rental</div>
            <nav className="flex flex-wrap justify-center gap-4 text-gray-700 text-sm">
                <Link href="/">Rentals</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                {/* <a href="#" className="font-semibold">Sign in</a> */}
            </nav>
      </header>
    );
  }