import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import path from 'path';

// Helper function to get database connection
const getDb = () => {
  const dbPath = path.join(process.cwd(), 'backend', 'duas.db');
  return new sqlite3.Database(dbPath);
};

// Helper function to promisify database operations
const runQuery = (db: sqlite3.Database, query: string, params: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

// GET - Get all categories
export async function GET(): Promise<NextResponse> {
  const db = getDb();
  
  return new Promise((resolve) => {
    db.all('SELECT * FROM categories', [], (err, rows) => {
      db.close();
      
      if (err) {
        resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      } else {
        resolve(NextResponse.json(rows));
      }
    });
  });
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  const db = getDb();
  
  try {
    const { name, icon } = await request.json();
    const result = await runQuery(
      db,
      'INSERT INTO categories (name, icon, duaCount) VALUES (?, ?, ?)',
      [name, icon, 0]
    );
    
    db.close();
    return NextResponse.json({
      id: result.lastID,
      name,
      icon,
      duaCount: 0
    });
  } catch (error: any) {
    db.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update a category
export async function PUT(request: NextRequest) {
  const db = getDb();
  
  try {
    const { id, name, icon } = await request.json();
    const result = await runQuery(
      db,
      'UPDATE categories SET name = ?, icon = ? WHERE id = ?',
      [name, icon, id]
    );
    
    db.close();
    return NextResponse.json({ success: true, changes: result.changes });
  } catch (error: any) {
    db.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Delete a category
export async function DELETE(request: NextRequest) {
  const db = getDb();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    const result = await runQuery(
      db,
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
    
    db.close();
    return NextResponse.json({ success: true, changes: result.changes });
  } catch (error: any) {
    db.close();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
