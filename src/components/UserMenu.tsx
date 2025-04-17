'use client';

import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

type User = {
  id: string;
  name: string;
};

export default function UserMenu() {
  const { currentUser, users, setCurrentUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const switchUser = (newUser: User) => {
    setCurrentUser(newUser);
    document.cookie = `userId=${newUser.id}; path=/;`;
    setIsOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center space-x-2"
      >
        <span>{currentUser ? currentUser.name : 'Nie zalogowany'}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
          <div className="py-1">
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => switchUser(user)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  currentUser?.id === user.id
                    ? 'bg-gray-200 dark:bg-gray-700'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {user.name}
              </button>
            ))}
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700"
            >
              Wyloguj się
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
