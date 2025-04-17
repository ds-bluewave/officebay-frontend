"use client";

import { useEffect, useState } from "react";
import { checkAvailability, fetchDesks, reserveDesk } from "@/api/apiClient";
import type { Desk } from "@/api/apiClient";
import OfficeMap from "@/components/OfficeMap";
import ReservationForm from "@/components/ReservationForm";
import HowToAccordion from "@/components/HowToAccordion";

const getCurrentTimeAndOneMinuteLater = (): string => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes() + 1).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function OfficeMapLayout() {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [selectedDesk, setSelectedDesk] = useState<Desk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>(
    getCurrentTimeAndOneMinuteLater()
  );
  const [endTime, setEndTime] = useState<string>("17:00");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
  }, []);

  const fetchDesksData = async () => {
    try {
      setLoading(true);
      const data = await fetchDesks();
      setDesks(data);

      // Jeśli biurko było wybrane, zaktualizuj jego stan
      if (selectedDesk) {
        const updatedDesk = data.find((desk) => desk.id === selectedDesk.id);
        if (updatedDesk) {
          setSelectedDesk(updatedDesk);
        }
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching desks:", error);
      setError("Nie udało się pobrać danych o biurkach");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailabilityData = async () => {
    if (!selectedDate) return;

    try {
      setLoading(true);
      const startDateTime = `${selectedDate}T${startTime}:00`;
      const endDateTime = `${selectedDate}T${endTime}:00`;

      const availableDesks = await checkAvailability(
        startDateTime,
        endDateTime
      );

      // Aktualizuj status biurek na podstawie dostępności
      const updatedDesks = desks.map((desk) => {
        const isAvailable = availableDesks.some(
          (availableDesk) => availableDesk.id === desk.id
        );
        return { ...desk, isAvailable };
      });

      setDesks(updatedDesks);

      if (selectedDesk) {
        const updatedDesk = updatedDesks.find(
          (desk) => desk.id === selectedDesk.id
        );
        if (updatedDesk) {
          setSelectedDesk(updatedDesk);
        }
      }

      setError(null);
    } catch (error) {
      setError(`Nie udało się sprawdzić dostępności biurek: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesksData();
  }, []);

  // Sprawdź dostępność biurek gdy zmieni się data lub godziny
  const handleCheckAvailability = () => {
    if (selectedDate) {
      fetchAvailabilityData();
    }
  };

  const handleReserve = async () => {
    if (selectedDesk) {
      try {
        await reserveDesk(selectedDesk.id);
        await fetchDesksData();
      } catch (error) {
        console.error("Error reserving desk:", error);
        setError("Nie udało się zarezerwować biurka");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="space-y-6">
      <HowToAccordion />
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Office Map
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex flex-col justify-center">
            <div className="flex ">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Od godziny
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    Do godziny
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2">
                    &nbsp;
                  </label>
                  <button
                    onClick={handleCheckAvailability}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Sprawdź dostępność
                  </button>
                </div>
              </div>
            </div>
            <div className="w-[350] bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-6 transition-shadow duration-300 hover:shadow-pink-400/40">
              <OfficeMap desks={desks} onDeskSelect={setSelectedDesk} />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Błąd! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Wybrane biurko
        </h2>
        {selectedDesk ? (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  ID
                </span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedDesk.id}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Nazwa
                </span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedDesk.name}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Typ
                </span>
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedDesk.type}
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Status
                </span>
                <p
                  className={`font-medium ${
                    selectedDesk.isAvailable
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {selectedDesk.isAvailable ? "Dostępne" : "Zarezerwowane"}
                </p>
              </div>
            </div>
            <div className="pt-4">
              {selectedDesk.isAvailable ? (
                <button
                  onClick={() => handleReserve()}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Zarezerwuj teraz
                </button>
              ) : (
                <button
                  onClick={fetchDesksData}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Odśwież
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Wybierz biurko na mapie, aby zobaczyć szczegóły</p>
          </div>
        )}
      </div>

      {selectedDesk && (
        <ReservationForm
          selectedDesk={selectedDesk}
          onReservationSuccess={fetchDesksData}
          isModal={false}
        />
      )}
    </div>
  );
}
