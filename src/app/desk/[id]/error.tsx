'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Coś poszło nie tak!</h2>
      <p>Nie udało się załadować szczegółów biurka</p>
      <button onClick={() => reset()}>Spróbuj ponownie</button>
      <div>
        <Link href="/">Powrót do mapy biura</Link>
      </div>
    </div>
  );
}