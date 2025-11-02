import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

const getDb = () => {
  const dbPath = path.join(process.cwd(), 'backend', 'duas.db');
  return new sqlite3.Database(dbPath);
};

const runQuery = (db: sqlite3.Database, query: string, params: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export async function POST(request: NextRequest) {
  const db = getDb();
  
  try {
    const { categoryId, name } = await request.json();
    const result = await runQuery(
      db,
      'INSERT INTO subcategories (categoryId, name, duaCount) VALUES (?, ?, ?)',
      [categoryId, name, 0]
    );
    
    db.close();
    return NextResponse.json({
      id: result.lastID,
      categoryId,
      name,
      duaCount: 0
    });
  } catch (error: any) {
    db.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const db = getDb();
  
  try {
    const { id, name } = await request.json();
    const result = await runQuery(
      db,
      'UPDATE subcategories SET name = ? WHERE id = ?',
      [name, id]
    );
    
    db.close();
    return NextResponse.json({ success: true, changes: result.changes });
  } catch (error: any) {
    db.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const db = getDb();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const result = await runQuery(
      db,
      'DELETE FROM subcategories WHERE id = ?',
      [id]
    );
    
    db.close();
    return NextResponse.json({ success: true, changes: result.changes });
  } catch (error: any) {
    db.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
