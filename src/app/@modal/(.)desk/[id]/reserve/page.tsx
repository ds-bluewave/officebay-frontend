'use client';

import { useRouter } from 'next/navigation';
import { Desk, fetchDeskById } from '@/api/apiClient';
import { use, useEffect, useState } from 'react';
import QuickReservationForm from '@/components/QuickReservationForm';

export default function ReserveDeskModal({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [desk, setDesk] = useState<Desk | null>(null);
  const deskId = parseInt(use(params).id);
  
  useEffect(() => {
    async function loadDesk() {
      const deskData = await fetchDeskById(deskId);
      setDesk(deskData);
    }
    loadDesk();
  }, [deskId]);

  if (!desk) return <div>Ładowanie...</div>;
  
  return (
    <div className="fixed inset-0 bg-sky-50/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Szybka rezerwacja: {desk.name}</h2>
          <button 
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>
        <QuickReservationForm
          selectedDesk={desk} 
          onReservationSuccess={() => router.back()}
          isModal={true}
        />
      </div>
    </div>
  );
}