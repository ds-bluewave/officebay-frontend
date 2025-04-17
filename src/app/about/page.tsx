'use client';

import { useEffect, useState } from "react";
import Image from 'next/image'

type AboutData = {
  name: string;
  description: string;
  stack: string[];
  features: string[];
  learned: string[];
  author: string;
};

export default function AboutPage() {
  const [data, setData] = useState<AboutData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/about")
      .then(res => res.json())
      .then(setData);
  }, []);

  useEffect(() => {
    fetch('/api/proxy/settings')
    .then(res => {
      if (!res.ok) {
        throw new Error('Failed to fetch settings');
      }
      res.json()
        .then(setSettings);
    })
    .catch(err => {
      console.error('Error fetching settings:', err);
      setSettings(null);
    });
  }, []);

  if (!data) return <div>Ładowanie...</div>;

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-2">{data.name}</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">
        <Image
          src="/officebay-logo.svg"
          alt="OfficeBay"
          width={128}
          height={128}
          className="mb-4 float-left mr-4"
        />
        {data.description}</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Tech Stack</h2>
      <ul className="list-disc pl-6 mb-4">
        {data.stack.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Funcionalities</h2>
      <ul className="list-disc pl-6 mb-4">
        {data.features.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <h2 className="text-xl font-semibold mt-6 mb-2">Lessons learned</h2>
      <ul className="list-disc pl-6 mb-4">
        {data.learned.map((item) => <li key={item}>{item}</li>)}
      </ul>
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        Author: {data.author}
      </div>

      {settings && (
        <div className="mt-6 p-4 bg-gray-700 dark:bg-gray-900 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">Settings</h2>
          <pre className="text-sm text-gray-800 dark:text-gray-600">
            {JSON.stringify(settings, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}