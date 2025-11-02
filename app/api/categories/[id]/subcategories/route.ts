import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/backend/database-vercel';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = new DatabaseService();
    const categoryId = parseInt(params.id);
    const subcategories = db.getSubcategories(categoryId);
    return NextResponse.json(subcategories);
  } catch (error: any) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories', details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
