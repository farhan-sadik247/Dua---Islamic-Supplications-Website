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
    const { subcategoryId, name, context, arabic, transliteration, translation, reference } = await request.json();
    const result = await runQuery(
      db,
      'INSERT INTO duas (subcategoryId, name, context, arabic, transliteration, translation, reference) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [subcategoryId, name, context, arabic, transliteration, translation, reference]
    );
    
    db.close();
    return NextResponse.json({
      id: result.lastID,
      subcategoryId,
      name,
      context,
      arabic,
      transliteration,
      translation,
      reference
    });
  } catch (error: any) {
    db.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const db = getDb();
  
  try {
    const { id, name, context, arabic, transliteration, translation, reference } = await request.json();
    const result = await runQuery(
      db,
      'UPDATE duas SET name = ?, context = ?, arabic = ?, transliteration = ?, translation = ?, reference = ? WHERE id = ?',
      [name, context, arabic, transliteration, translation, reference, id]
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
      'DELETE FROM duas WHERE id = ?',
      [id]
    );
    
    db.close();
    return NextResponse.json({ success: true, changes: result.changes });
  } catch (error: any) {
    db.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
