'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md mb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold">OfficeBay</Link>
            </div>
            <div className="ml-6 flex items-center space-x-4">
              <Link 
                href="/"
                className={`px-3 py-2 rounded-md ${
                  pathname === '/' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Mapa biura
              </Link>
              <Link 
                href="/user"
                className={`px-3 py-2 rounded-md ${
                  pathname === '/user' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Moje rezerwacje
              </Link>
              <Link href="/about" className="hover:underline">O aplikacji</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
