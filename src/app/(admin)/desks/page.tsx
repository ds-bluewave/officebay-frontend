import { fetchAllDesks } from '@/api/apiClient';

export default async function AdminDesksPage() {
  const desks = await fetchAllDesks();

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Zarządzanie biurkami</h1>
      <ul className="list-disc pl-6">
        {desks.map(desk => (
          <li key={desk.id}>
            {desk.name} ({desk.type})
          </li>
        ))}
      </ul>
    </div>
  );
}