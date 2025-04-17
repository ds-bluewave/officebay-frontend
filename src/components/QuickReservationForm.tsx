'use client';

import { useState } from 'react';
import { checkAvailability, createReservation, Desk } from '@/api/apiClient';
import { DateTime, eobTime, formatDate } from '@/app/utilities/dateTime';
import { useUser } from '@/contexts/UserContext';

interface QuickReservationFormProps {
  selectedDesk: Desk | null;
  onReservationSuccess?: () => void;
  isModal?: boolean;
}

export default function QuickReservationForm({ selectedDesk, onReservationSuccess = () => {} }: QuickReservationFormProps) {
  const { currentUser } = useUser();
  const now = new DateTime();
  const [startDate, setStartDate] = useState(now.date);
  const [startTime, setStartTime] = useState(now.time);
  const [endTime, setEndTime] = useState(eobTime());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDesk) {
      setError('Wybierz biurko przed rezerwacją');
      return;
    }

    if (!startDate) {
      setError('Wybierz datę rozpoczęcia i zakończenia');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const startDateTime = `${startDate}T${startTime}:00`;
      const endDateTime = `${startDate}T${endTime}:00`; // reservation can be only for one day
      
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
      setStartDate(now.date);
      setStartTime(now.time);
      setEndTime(eobTime());
      
      // Powiadom rodzica o sukcesie
      onReservationSuccess();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił nieznany błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2">Data</label>
        <div className='flex space-x-2 mb-2 justify-between'>
          {
            [
              { label: 'Dziś', value: 0 },
              { label: 'Jutro', value: 1 },
              { label: 'Za tydzień', value: 7 }
            ].map((btn, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  const date = new Date();
                  date.setDate(date.getDate() + btn.value);
                  const formattedDate = formatDate(date);
                  setStartDate(formattedDate);
                }}
                className="flex-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {btn.label}
              </button>
            ))
          }
        </div>
        <input
          type="date"
          value={startDate}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 focus:border-gray-300 rounded dark:bg-gray-800 dark:text-gray-200 cursor-not-allowed"
          readOnly
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
        className={`w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Przetwarzanie...' : 'Zarezerwuj'}
      </button>
    </form>
  );
}
