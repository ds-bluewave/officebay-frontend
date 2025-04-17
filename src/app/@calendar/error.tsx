"use client";

import Link from "next/link";
import { useEffect } from "react";

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
    <>
      <div>Oops! Błąd ładowania kalendarza...</div>
      <button onClick={() => reset()}>Spróbuj ponownie</button>
      <div>
        <Link href="/">Powrót do mapy biura</Link>
      </div>
    </>
  );
}
