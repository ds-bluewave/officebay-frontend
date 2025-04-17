"use client";

import { useEffect, useState } from 'react';
import { fetchUserReservations, Reservation } from '@/api/apiClient';
import { useUser } from '@/contexts/UserContext';

export default function UserReservationsPage() {
  const { currentUser } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchUserReservations(currentUser.id).then(setReservations).catch(console.error);
    }
  }, [currentUser]);

  if (!currentUser) {
    return <div>Nie znaleziono użytkownika. Zaloguj się!</div>;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Rezerwacje użytkownika</h1>
      {reservations.length === 0 ? (
        <p>Brak rezerwacji</p>
      ) : (
        <ul className="list-disc pl-6">
          {reservations.map(res => (
            <li key={res.id}>
              Biurko: {res.deskId}, od {new Date(res.startTime).toLocaleString()} do{' '}
              {new Date(res.endTime).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}