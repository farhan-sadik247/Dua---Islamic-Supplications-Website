import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/backend/database';

const db = new DatabaseService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = parseInt(params.id);
    const subcategories = await db.getSubcategories(categoryId);
    return NextResponse.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories' },
      { status: 500 }
    );
  }
}
