import { Router, Request, Response } from 'express';
import db from '../database';
import fs from 'fs';
import path from 'path';

const router = Router();

// Buat tabel jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS komunitas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'lainnya',
    memberCount INTEGER DEFAULT 0,
    location TEXT DEFAULT 'GH5'
  )
`);

// Helper: membaca JSON fallback
const readJSONFallback = (): any[] => {
  const filePath = path.join(__dirname, '../data', 'komunitas.json');
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Gagal membaca fallback komunitas.json:', error);
    return [];
  }
};

// GET semua komunitas
router.get('/', (req: Request, res: Response) => {
  try {
    let komunitas = db.prepare('SELECT * FROM komunitas ORDER BY name ASC').all() as any[];

    // Jika tabel kosong, ambil dari JSON
    if (komunitas.length === 0) {
      console.log('Tabel komunitas kosong, mengambil dari JSON...');
      komunitas = readJSONFallback();
    }

    res.json(komunitas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data komunitas' });
  }
});

// POST tambah komunitas
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, description, category, memberCount, location } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Nama komunitas wajib diisi' });
    }
    const stmt = db.prepare(
      'INSERT INTO komunitas (name, description, category, memberCount, location) VALUES (?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      name,
      description || '',
      category || 'lainnya',
      memberCount || 0,
      location || 'GH5'
    );
    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      description,
      category,
      memberCount,
      location,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambah komunitas' });
  }
});

// DELETE hapus komunitas
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM komunitas WHERE id = ?').run(id);
    res.json({ message: 'Komunitas berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus komunitas' });
  }
});

export default router;