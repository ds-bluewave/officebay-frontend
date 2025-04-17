'use client';

import { useState } from 'react';
import { checkAvailability, createReservation, Desk } from '@/api/apiClient';
import { useUser } from '@/contexts/UserContext';

interface ReservationFormProps {
  selectedDesk: Desk | null;
  onReservationSuccess?: () => void;
  isModal?: boolean;
}

export default function ReservationForm({ selectedDesk, onReservationSuccess = () => {}, isModal = false }: ReservationFormProps) {
  const { currentUser } = useUser();
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('17:00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDesk) {
      setError('Wybierz biurko przed rezerwacją');
      return;
    }

    if (!startDate || !endDate) {
      setError('Wybierz datę rozpoczęcia i zakończenia');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${endDate}T${endTime}:00`;
      
      // Sprawdź dostępność
      const availableDesks = await checkAvailability(startDateTime, endDateTime);
      const isDeskAvailable = availableDesks?.some((desk: Desk) => desk.id === selectedDesk.id);
      
      if (!isDeskAvailable) {
        setError('Wybrane biurko nie jest dostępne w podanym terminie');
        return;
      }

      if (!currentUser) {
        setError('Nie znaleziono użytkownika');
        return;
      }
      
      // Utwórz rezerwację
      await createReservation({
        deskId: selectedDesk.id,
        userId: currentUser.id,
        startTime: startDateTime,
        endTime: endDateTime
      });
      
      // Zresetuj formularz
      setStartDate('');
      setEndDate('');
      setStartTime('09:00');
      setEndTime('17:00');
      
      // Powiadom rodzica o sukcesie
      onReservationSuccess();
      
    } catch (err) {
      console.error('Error creating reservation:', err);
      setError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd');
    } finally {
      setLoading(false);
    }
  };

  // Ustaw minimalną datę na dzisiaj
  const today = new Date().toISOString().split('T')[0];

  // Uproszczony formularz dla modalu
  if (isModal) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Data</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Data zakończenia</label>
          <input
            type="date"
            min={startDate || today}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Od</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">Do</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        {error && <div>{error}</div>}
        
        <button
          type="submit"
          disabled={loading || !selectedDesk?.isAvailable}
        >
          {loading ? 'Przetwarzanie...' : 'Zarezerwuj'}
        </button>
      </form>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Zarezerwuj biurko</h2>
      
      {!selectedDesk ? (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          Wybierz biurko na mapie, aby dokonać rezerwacji
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Data rozpoczęcia</label>
              <input
                type="date"
                min={today}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Godzina rozpoczęcia</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Data zakończenia</label>
              <input
                type="date"
                min={startDate || today}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Godzina zakończenia</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || !selectedDesk.isAvailable}
              className={`w-full py-2 px-4 rounded font-medium ${
                loading || !selectedDesk.isAvailable
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {loading ? 'Przetwarzanie...' : 'Zarezerwuj biurko'}
            </button>
            {!selectedDesk.isAvailable && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-2">
                To biurko jest obecnie zarezerwowane. Wybierz inne biurko lub zwolnij to biurko.
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
