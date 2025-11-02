import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { DatabaseService } from './database';
import adminRoutes from './admin-routes';

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
const db = new DatabaseService();

// Admin routes (for adding/updating/deleting data)
app.use('/api/admin', adminRoutes);

// Routes
app.get('/api/categories', async (req: Request, res: Response) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

app.get('/api/categories/:id/subcategories', async (req: Request, res: Response) => {
  try {
    const categoryId = parseInt(req.params.id);
    const subcategories = await db.getSubcategories(categoryId);
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

app.get('/api/subcategories/:id/duas', async (req: Request, res: Response) => {
  try {
    const subcategoryId = parseInt(req.params.id);
    const duas = await db.getDuas(subcategoryId);
    res.json(duas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch duas' });
  }
});

app.get('/api/duas', async (req: Request, res: Response) => {
  try {
    const duas = await db.getAllDuas();
    res.json(duas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch duas' });
  }
});

app.get('/api/duas/:id', async (req: Request, res: Response) => {
  try {
    const duaId = parseInt(req.params.id);
    const dua = await db.getDuaById(duaId);
    if (dua) {
      res.json(dua);
    } else {
      res.status(404).json({ error: 'Dua not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dua' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
