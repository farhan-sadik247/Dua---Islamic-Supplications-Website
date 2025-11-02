import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';

const router = express.Router();
const dbPath = path.join(__dirname, 'duas.db');
const db = new sqlite3.Database(dbPath);

// Add a new category
router.post('/categories', (req, res) => {
  const { name, icon } = req.body;
  
  db.run(
    'INSERT INTO categories (name, icon, duaCount) VALUES (?, ?, ?)',
    [name, icon, 0],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, name, icon, duaCount: 0 });
      }
    }
  );
});

// Update a category
router.put('/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, icon } = req.body;
  
  db.run(
    'UPDATE categories SET name = ?, icon = ? WHERE id = ?',
    [name, icon, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true, changes: this.changes });
      }
    }
  );
});

// Delete a category
router.delete('/categories/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true, changes: this.changes });
    }
  });
});

// Add a new subcategory
router.post('/subcategories', (req, res) => {
  const { categoryId, name } = req.body;
  
  db.run(
    'INSERT INTO subcategories (categoryId, name, duaCount) VALUES (?, ?, ?)',
    [categoryId, name, 0],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ id: this.lastID, categoryId, name, duaCount: 0 });
      }
    }
  );
});

// Update a subcategory
router.put('/subcategories/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  db.run(
    'UPDATE subcategories SET name = ? WHERE id = ?',
    [name, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true, changes: this.changes });
      }
    }
  );
});

// Delete a subcategory
router.delete('/subcategories/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM subcategories WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ success: true, changes: this.changes });
    }
  });
});

// Add a new dua
router.post('/duas', (req, res) => {
  const { subcategoryId, name, context, arabic, transliteration, translation, reference } = req.body;
  
  db.run(
    'INSERT INTO duas (subcategoryId, name, context, arabic, transliteration, translation, reference) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [subcategoryId, name, context || '', arabic || '', transliteration || '', translation || '', reference || ''],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        // Update subcategory dua count
        db.run(
          'UPDATE subcategories SET duaCount = duaCount + 1 WHERE id = ?',
          [subcategoryId]
        );
        
        // Update category dua count
        db.run(`
          UPDATE categories 
          SET duaCount = duaCount + 1 
          WHERE id = (SELECT categoryId FROM subcategories WHERE id = ?)
        `, [subcategoryId]);
        
        res.json({ 
          id: this.lastID, 
          subcategoryId, 
          name, 
          context,
          arabic, 
          transliteration, 
          translation, 
          reference 
        });
      }
    }
  );
});

// Update a dua
router.put('/duas/:id', (req, res) => {
  const { id } = req.params;
  const { name, context, arabic, transliteration, translation, reference } = req.body;
  
  db.run(
    'UPDATE duas SET name = ?, context = ?, arabic = ?, transliteration = ?, translation = ?, reference = ? WHERE id = ?',
    [name, context || '', arabic || '', transliteration || '', translation || '', reference || '', id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true, changes: this.changes });
      }
    }
  );
});

// Delete a dua
router.delete('/duas/:id', (req, res) => {
  const { id } = req.params;
  
  // First get the subcategoryId to update counts
  db.get('SELECT subcategoryId FROM duas WHERE id = ?', [id], (err, row: any) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const subcategoryId = row?.subcategoryId;
    
    db.run('DELETE FROM duas WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        // Update subcategory dua count
        if (subcategoryId) {
          db.run(
            'UPDATE subcategories SET duaCount = duaCount - 1 WHERE id = ?',
            [subcategoryId]
          );
          
          // Update category dua count
          db.run(`
            UPDATE categories 
            SET duaCount = duaCount - 1 
            WHERE id = (SELECT categoryId FROM subcategories WHERE id = ?)
          `, [subcategoryId]);
        }
        
        res.json({ success: true, changes: this.changes });
      }
    });
  });
});

export default router;
