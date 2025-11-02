import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/backend/database';

const db = new DatabaseService();

export async function GET() {
  try {
    const duas = await db.getAllDuas();
    return NextResponse.json(duas);
  } catch (error) {
    console.error('Error fetching duas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch duas' },
      { status: 500 }
    );
  }
}
