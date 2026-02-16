import Link from 'next/link';
import Image from 'next/image';
export default function AppHeader() {
    return (
        <header className="flex flex-col sm:flex-row justify-between items-center px-4 py-4 shadow gap-4">
            


            <div className="flex flex-nowrap items-center text-xl font-bold text-[#1e3a8a]">
                <Image
                    src="https://firebasestorage.googleapis.com/v0/b/custom-made-c27a9.firebasestorage.app/o/assets%2FRoomFindersLogoV4.png?alt=media&token=8ce08260-01c7-4f8e-b5f1-dee7b87cdf20"     // <-- update this path to where your logo is stored
                    alt="Room Finders Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                />
                <span className="text-xl font-bold text-yellow-400 pr-2">Room</span>
                Finders
            </div>

            <nav className="flex flex-wrap justify-center gap-4 text-gray-700 text-sm">
                <Link href="/">Rentals</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
            </nav>
        </header>
    );
  }