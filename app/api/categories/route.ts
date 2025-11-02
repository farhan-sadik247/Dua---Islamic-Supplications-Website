import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/backend/database';

const db = new DatabaseService();

export async function GET() {
  try {
    const categories = await db.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
