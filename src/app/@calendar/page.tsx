"use client";

import { fetchUserReservations, Reservation } from "@/api/apiClient";
import { useUser } from "@/contexts/UserContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CalendarPage() {
  const { currentUser } = useUser();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  useEffect(() => {
    const fetchReservations = async () =>
      currentUser &&
      setReservations(await fetchUserReservations(currentUser.id));

    fetchReservations();
  }, [currentUser]);

  const uniqueDates = Array.from(
    new Set(
      reservations.map(
        (res) => new Date(res.startTime).toISOString().split("T")[0]
      )
    )
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Kalendarz rezerwacji</h1>
      {currentUser ? (
        <>
          {uniqueDates.length > 0 ? (
            <>
              <p>Wybierz dzień, aby zobaczyć szczegóły rezerwacji.</p>
              <ul className="list-disc pl-6">
                {uniqueDates.map((date) => (
                  <li key={date}>
                    <Link
                      scroll={false}
                      className="text-blue-500 hover:underline"
                      href={`/calendar/${date}`}
                    >
                      {new Date(date).toLocaleDateString()}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p>Nie masz żadnych rezerwacji.</p>
          )}
        </>
      ) : (
        <p>Login to check your reservations</p>
      )}
    </div>
  );
}
