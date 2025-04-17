import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Pobierz userId z cookies (lub innego źródła)
  const userId = request.headers.get('cookie')?.match(/userId=([^;]*)/)?.[1];

  console.log(`Request Path: ${path}, User ID: ${userId}`);

  // Skip authentication checks for static files and public assets
  if (
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  // Skip authentication checks for /login
  if (path === '/login') {
    console.log('Skipping authentication for /login');
    
    return NextResponse.next();
  }

  // Autoryzacja dla grupy "admin"
  if (path.startsWith('/desks') || path.startsWith('/settings')) {
    if (!userId || userId !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Autoryzacja dla grupy "user"
  if (path.startsWith('/profile') || path.startsWith('/reservations') || path.startsWith('/user')) {
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  // Przekierowanie na /login dla niezalogowanych użytkowników
  if (!userId) {
    console.log('Redirecting to /login due to missing userId');
    return NextResponse.redirect(new URL('/login', request.url), { status: 303 });
  }

  return NextResponse.next();
}
