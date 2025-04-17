'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: string;
  name: string;
};

const defaultUsers: User[] = [
  { id: 'anna_nowak', name: 'Anna Nowak' },
  { id: 'jan_kowalski', name: 'Jan Kowalski' },
  { id: 'user', name: 'Użytkownik testowy' },
  { id: 'admin', name: 'Admin' }
];

type UserContextType = {
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users] = useState<User[]>(defaultUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Funkcja do odczytu userId z cookies
  const getUserFromCookies = (): User | null => {
    const userId = document.cookie.match(/userId=([^;]*)/)?.[1];
    return users.find((user) => user.id === userId) || null;
  };

  // Synchronizacja currentUser z cookies
  useEffect(() => {
    const user = getUserFromCookies();
    setCurrentUser(user);
  }, []);

  // Funkcja do ustawiania currentUser i aktualizacji cookies
  const handleSetCurrentUser = (user: User | null) => {
    setCurrentUser(user);
    if (user) {
      document.cookie = `userId=${user.id}; path=/;`;
    } else {
      document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, users, setCurrentUser: handleSetCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
