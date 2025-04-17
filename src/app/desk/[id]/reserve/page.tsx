import { fetchDeskById } from '@/api/apiClient';
import ReservationForm from '@/components/ReservationForm';

export default async function ReserveDeskPage({ params }: { params: Promise<{ id: string }> }) {
  const deskId = parseInt((await params).id);
  const desk = await fetchDeskById(deskId);
  
  return (
    <div>
      <h1>Rezerwacja biurka: {desk.name}</h1>
      <ReservationForm selectedDesk={desk} />
    </div>
  );
}