import { NextResponse } from 'next/server';

const SPRING_API_URL = process.env.SPRING_API_URL || 'http://localhost:9090';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Basic dXNlcjpwYXNzd29yZA=='
};

export async function GET() {
  const res = await fetch(`${SPRING_API_URL}/api/settings`, {
    method: 'GET',
    headers,
  });

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}