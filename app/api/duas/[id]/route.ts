import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/backend/database';

const db = new DatabaseService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const duaId = parseInt(params.id);
    const dua = await db.getDuaById(duaId);
    
    if (dua) {
      return NextResponse.json(dua);
    } else {
      return NextResponse.json(
        { error: 'Dua not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error fetching dua:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dua' },
      { status: 500 }
    );
  }
}
