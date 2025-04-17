import { fetchDeskById, fetchDeskReservations } from "@/api/apiClient";
import Link from "next/link";

export default async function DeskDetailsPage({ params }: { params: { id: string } }) {
  const deskId = parseInt(params.id);
  const desk = await fetchDeskById(deskId);
  const reservations = await fetchDeskReservations(deskId);

  return (
    <div>
      <h1>Szczegóły biurka: {desk.name}</h1>
      <p>Typ: {desk.type}</p>
      <p>Status: {desk.isAvailable ? 'Dostępne' : 'Zarezerwowane'}</p>
      
      <h2>Rezerwacje</h2>
      {reservations.length === 0 ? (
        <p>Brak rezerwacji dla tego biurka</p>
      ) : (
        <ul>
          {reservations.map(res => (
            <li key={res.id}>
              {new Date(res.startTime).toLocaleDateString()} {new Date(res.startTime).toLocaleTimeString()} - 
              {new Date(res.endTime).toLocaleTimeString()}
            </li>
          ))}
        </ul>
      )}
      
      <div>
        <Link href={`/desk/${deskId}/reserve`}>Zarezerwuj biurko</Link>
      </div>
      <div>
        <Link href="/">Powrót do mapy biura</Link>
      </div>
    </div>
  );
}