import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ service: 'ezlancing', status: 'ok', database: 'not_checked', phase: 'sprint-0' });
}
