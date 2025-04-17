'use client';

import { useState, useEffect } from 'react';
import { getUserReservations, cancelReservation, Reservation } from '@/api/apiClient';
import { useUser } from '@/contexts/UserContext';

export default function UserProfile() {
  const { currentUser } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserReservations = async () => {
      try {
        setLoading(true);
        const data = await getUserReservations();
        setReservations(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError('Nie udało się pobrać rezerwacji');
      } finally {
        setLoading(false);
      }
    };

    fetchUserReservations();
  }, [currentUser?.id]);

  const handleCancelReservation = async (id: number) => {
    try {
      await cancelReservation(id);
      setReservations(reservations.filter(res => res.id !== id));
    } catch (err) {
      console.error('Error canceling reservation:', err);
      setError('Nie udało się anulować rezerwacji');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Moje rezerwacje</h1>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      
      {reservations.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Nie masz żadnych rezerwacji
        </div>
      ) : (
        <div className="grid gap-4">
          {reservations.map(reservation => (
            <div key={reservation.id} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{reservation.id}.{reservation.deskId ? `Desk ${reservation.deskId}` : ''}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(reservation.startTime).toLocaleDateString()} {new Date(reservation.startTime).toLocaleTimeString()} - {new Date(reservation.endTime).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => handleCancelReservation(reservation.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Anuluj
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
