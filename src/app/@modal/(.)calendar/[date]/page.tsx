'use client'

import { fetchUserReservations, Reservation } from "@/api/apiClient";
import { DateTime } from "@/app/utilities/dateTime";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from "react";

export default function DayDetailsPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  let { date } = use(params);
  const router = useRouter();
  const { currentUser } = useUser();
  const [ reservations, setReservations ] = useState<Reservation[]>([]);

  // Fallback date - today
  if (!date) {
    date = new DateTime().date;
  }

  useEffect(() => {
    const fetchReservations = async () => {
      if (currentUser) {
        const reservations = await fetchUserReservations(currentUser.id); // Tymczasowy ID użytkownika
        setReservations(reservations);
      }
    }
    fetchReservations();
  }, [currentUser]);

  const filteredReservations = reservations.filter((res) =>
    new Date(res.startTime).toISOString().startsWith(date)
  );

  return (
    <div className="fixed inset-0 bg-sky-50/30 flex items-center justify-center z-50">
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <button 
          onClick={() => router.back()}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
        >
          ×
        </button>
        <h1 className="text-2xl font-bold mb-4">Rezerwacje na dzień {date}</h1>
        {filteredReservations.length === 0 ? (
          <p>Brak rezerwacji na ten dzień.</p>
        ) : (
          <ul className="list-disc pl-6">
            {filteredReservations.map((reservation) => (
              <li key={reservation.id}>
                Biurko: {reservation.deskId}, od{" "}
                {new Date(reservation.startTime).toLocaleTimeString()} do{" "}
                {new Date(reservation.endTime).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
