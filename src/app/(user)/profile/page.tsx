"use client";

import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  
  const { currentUser } = useUser();

  useEffect(() => {
    setLoading(false);
  }, [currentUser]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!currentUser) {
    return <div>Nie znaleziono użytkownika. Zaloguj się!</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Profil użytkownika</h1>
      <p><strong>ID:</strong> {currentUser.id}</p>
      <p><strong>Imię:</strong> {currentUser.name}</p>
    </div>
  );
}