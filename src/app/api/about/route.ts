import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    "name": "OfficeBay",
    "description": "OfficeBay is a modern desk reservation system for offices, built as a fullstack demo project. It allows users to browse available desks, make and manage reservations, and provides an admin panel for desk management. The app demonstrates advanced Next.js App Router features and integration with a Spring Boot backend.",
    "stack": [
      "Next.js App Router (React 18+)",
      "React Server and Client Components",
      "Spring Boot (REST API backend)",
      "Tailwind CSS for styling",
      "Context API for user state management",
      "Parallel routes, intercepting routes, and middleware"
    ],
    "features": [
      "Dynamic routing for desk details and reservation modals using App Router",
      "Parallel routes: office map and reservation calendar displayed side by side",
      "Intercepting routes: modals for quick reservation and reservation details",
      "Middleware for authentication and access control based on cookies",
      "User context and user switching in the UI",
      "Integration with a real backend (Spring Boot)",
      "Error boundaries and loading states for robust UX",
      "Proxying backend endpoints (e.g., /api/settings) through Next.js API routes to hide backend URLs and enable additional logic."
    ],
    "learned": [
      "How to structure a Next.js project using App Router and parallel routes",
      "Differences between slot-based layouts and classic file-based routing",
      "Implementing modals with intercepting routes for better UX",
      "Synchronizing user state between cookies and React Context",
      "Practical use of Next.js middleware for authentication and route protection",
      "Integrating Next.js frontend with an external REST API backend"
    ],
    author: "ds"
  });
}