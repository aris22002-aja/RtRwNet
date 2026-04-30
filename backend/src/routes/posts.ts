import { Router, Request, Response } from 'express';
import db from '../database';

const router = Router();

// Buat tabel posts jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    author TEXT DEFAULT 'Anonim',
    role TEXT DEFAULT 'Warga',
    date TEXT DEFAULT (datetime('now','localtime')),
    image TEXT,
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0
  )
`);

// GET /api/posts
router.get('/', (req: Request, res: Response) => {
  try {
    const posts = db.prepare(`SELECT * FROM posts ORDER BY date DESC`).all();
    res.json(posts);
  } catch (error) {
    console.error('Error mengambil postingan:', error);
    res.status(500).json({ message: 'Gagal mengambil postingan' });
  }
});

// POST /api/posts (opsional, untuk menambah data)
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, content, author, role, image } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Judul dan konten wajib diisi' });
    }

    const stmt = db.prepare(`
      INSERT INTO posts (title, content, author, role, image)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, content, author || 'Anonim', role || 'Warga', image);
    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambah postingan' });
  }
});

export default router;