import { useState } from "react";

export default function HowToAccordion() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-lg shadow-lg text-white font-bold text-lg focus:outline-none"
        aria-expanded={open}
      >
        <span>🚀 How to use the Office Map</span>
        <span className="text-2xl">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg shadow-inner text-gray-800 dark:text-gray-100 animate-fade-in">
          <ul className="list-disc pl-6">
            <li>Select a date and time range to check desk availability.</li>
            <li>Click on a desk to see its details and reserve it if available.</li>
            <li>Double-click an available desk for instant reservation.</li>
            <li>Use the calendar on the right to view your reservations.</li>
            <li>Switch user or log out from the top menu.</li>
          </ul>
        </div>
      )}
    </div>
  );
}
