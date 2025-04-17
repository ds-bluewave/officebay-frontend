'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

export default function LoginPage() {
  const { users } = useUser(); // Pobieramy listę użytkowników z UserContext
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("selectedUser", selectedUser);
  }, [selectedUser]);
    

  const handleLogin = () => {
    if (selectedUser) {
      document.cookie = `userId=${selectedUser}; path=/;`;
      router.push('/'); // Przekierowanie na stronę główną
    } else {
      alert('Proszę wybrać użytkownika');
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Logowanie</h1>
      <div className="mb-4">
        <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Wybierz użytkownika
        </label>
        <select
          id="userSelect"
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="" disabled>
            -- Wybierz użytkownika --
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Zaloguj się
      </button>
    </div>
  );
}
