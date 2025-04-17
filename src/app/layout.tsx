import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";
import Navbar from "@/components/Navbar";
// import UserToggle from "@/components/UserToggle";
import { UserProvider } from "@/contexts/UserContext";
import UserMenu from "@/components/UserMenu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OfficeBay - System Rezerwacji Biurek",
  description: "Aplikacja do rezerwacji biurek w biurze",
};

export default function RootLayout({
  children,
  modal,
  map,
  calendar,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode;
  map: React.ReactNode;
  calendar: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <UserProvider>

          <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                OfficeBay
              </h1>
              <div className="flex items-center space-x-4">
                {/* <UserToggle /> */}
                <UserMenu />
                <ThemeToggle />
              </div>
            </div>
          </header>

          <Navbar />

          <main>{children}</main>

          {/* Pararell routes */}
          <main style={{ display: 'flex', gap: '20px' }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div style={{ flex: 1 }}>{map}</div>
            <div style={{ flex: 1 }}>{calendar}</div>
          </main>

          {modal}

          <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-gray-500 dark:text-gray-400">
              &copy; 2025 OfficeBay - System Rezerwacji Biurek
            </div>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
