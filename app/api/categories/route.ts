import { NextResponse } from 'next/server';
import { DatabaseService } from '@/backend/database-vercel';

export async function GET() {
  try {
    const db = new DatabaseService();
    const categories = db.getCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
