import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to OfficeBay</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Reserve your desk, manage your bookings, and explore the office map.
          </p>
        </div>
        <nav className="space-x-4">
          <Link href="/profile" className="text-blue-600 hover:underline">User Panel</Link>
          <Link href="/desks" className="text-blue-600 hover:underline">Admin Panel</Link>
        </nav>
      </div>
    </div>
  );
}