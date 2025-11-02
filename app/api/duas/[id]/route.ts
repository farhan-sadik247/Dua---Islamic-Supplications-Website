import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/backend/database-vercel';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = new DatabaseService();
    const duaId = parseInt(params.id);
    const dua = db.getDuaById(duaId);
    
    if (dua) {
      return NextResponse.json(dua);
    } else {
      return NextResponse.json(
        { error: 'Dua not found' },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error('Error fetching dua:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dua', details: error.message },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
