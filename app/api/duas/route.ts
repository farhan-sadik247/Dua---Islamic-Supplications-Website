import { NextResponse } from 'next/server';
import { DatabaseService } from '@/backend/database-vercel';

export async function GET() {
  try {
    const db = new DatabaseService();
    const duas = db.getAllDuas();
    return NextResponse.json(duas);
  } catch (error: any) {
    console.error('Error fetching duas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch duas', details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
