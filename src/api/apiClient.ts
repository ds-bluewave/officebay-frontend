const API_URL = 'http://localhost:9090'; // zmień na adres Twojego API
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Basic dXNlcjpwYXNzd29yZA=='
};

export interface Desk {
  id: number;
  name: string;
  type: string;
  isAvailable: boolean;
}

export interface ReservationRequest {
  deskId: number;
  userId: string;
  startTime: string;
  endTime: string;
}

export interface Reservation {
  id: number;
  deskId: number;
  userId: string;
  startTime: string;
  endTime: string;
}

export const fetchDesks = async (): Promise<Desk[]> => {
  const response = await fetch(`${API_URL}/api/desk`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch desks');
  }
  return response.json();
};

export const reserveDesk = async (id: number): Promise<Desk> => {
  const response = await fetch(`${API_URL}/api/desk/${id}/reserve`, {
    method: 'POST',
    headers
  });
  if (!response.ok) {
    throw new Error('Failed to reserve desk');
  }
  return response.json();
};

export const releaseDesk = async (id: number): Promise<Desk> => {
  const response = await fetch(`${API_URL}/api/desk/${id}/release`, {
    method: 'POST',
    headers
  });
  if (!response.ok) {
    throw new Error('Failed to release desk');
  }
  return response.json();
};

export const checkAvailability = async (startTime: string, endTime: string): Promise<Desk[]> => {
  const response = await fetch(`${API_URL}/api/availability?startTime=${startTime}&endTime=${endTime}`, { headers });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    if (errorData && errorData.error) {
      throw new Error(errorData.error);
    }
    throw new Error('Failed to check availability');
  }
  return response.json()
    .then((data) => data.desks || [])
    .catch(() => null);
};

export const checkAvailabilityAtTime = async (dateTime: string): Promise<Desk[]> => {
  // Używamy konkretnej godziny zamiast zakresu
  const response = await fetch(`${API_URL}/api/availability?startTime=${dateTime}&endTime=${addHour(dateTime)}`, { headers });
  if (!response.ok) {
    throw new Error('Failed to check availability');
  }
  return response.json();
};

export const createReservation = async (reservation: ReservationRequest): Promise<Reservation> => {
  const userId = getCurrentUserId();
  const response = await fetch(`${API_URL}/api/reservations`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      ...reservation,
      userId: reservation.userId || userId
    })
  });
  if (!response.ok) {
    throw new Error('Failed to create reservation');
  }
  return response.json();
};

export const getUserReservations = async (): Promise<Reservation[]> => {
  const userId = getCurrentUserId();
  const response = await fetch(`${API_URL}/api/reservations/user/${userId}`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch user reservations');
  }
  return response.json();
};

export const cancelReservation = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/api/reservations/${id}`, {
    method: 'DELETE',
    headers
  });
  if (!response.ok) {
    throw new Error('Failed to cancel reservation');
  }
};

export const fetchDeskById = async (id: number): Promise<Desk> => {
  const response = await fetch(`${API_URL}/api/desk/${id}`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch desk');
  }
  return response.json();
};

export const fetchDeskReservations = async (deskId: number): Promise<Reservation[]> => {
  const response = await fetch(`${API_URL}/api/reservations/desk/${deskId}`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch desk reservations');
  }
  return response.json();
};


export const getCurrentUserId = (): string => {
  // if (typeof window !== 'undefined') {
  //   return localStorage.getItem('currentUserId') || '' // 'jan_kowalski';
  // }
  // return '' // 'jan_kowalski'; // Domyślny użytkownik dla SSR

  try {
    const userId = document.cookie.match(/userId=([^;]*)/)?.[1];
    return userId || '';
  } catch (error) {
    console.error('Error reading userId from cookies:', error);
    return '';
  }
};


export const fetchUserProfile = async (userId: string): Promise<{ id: string; name: string }> => {
  // Placeholder dla profilu użytkownika
  return { id: userId, name: userId === 'jan_kowalski' ? 'Jan Kowalski' : 'Anna Nowak' };
};

export const fetchUserReservations = async (userId: string): Promise<Reservation[]> => {
  const response = await fetch(`${API_URL}/api/reservations/user/${userId}`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch user reservations');
  }
  return response.json();
};

export const fetchAllDesks = async (): Promise<Desk[]> => {
  const response = await fetch(`${API_URL}/api/desk`, { headers });
  if (!response.ok) {
    throw new Error('Failed to fetch desks');
  }
  return response.json();
};



const addHour = (dateTime: string): string => {
  const date = new Date(dateTime);
  date.setHours(date.getHours() + 1);
  return date.toISOString().replace('Z', '');
};