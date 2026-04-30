// backend/src/routes/kegiatan.ts
import { Router, Request, Response } from 'express';
import db from '../database';

const router = Router();

db.exec(`
  CREATE TABLE IF NOT EXISTS kegiatan (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT,
    time TEXT,
    location TEXT,
    participants INTEGER DEFAULT 0,
    status TEXT DEFAULT 'akan datang',
    image TEXT
  )
`);

// GET semua kegiatan
router.get('/', (req: Request, res: Response) => {
  try {
    const kegiatan = db.prepare('SELECT * FROM kegiatan ORDER BY date ASC').all();
    res.json(kegiatan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data kegiatan' });
  }
});

// POST tambah kegiatan
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, description, date, time, location, participants, status, image } = req.body;
    if (!title) {
      return res.status(400).json({ message: 'Judul kegiatan wajib diisi' });
    }
    const stmt = db.prepare(
      'INSERT INTO kegiatan (title, description, date, time, location, participants, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    const result = stmt.run(
      title,
      description || '',
      date || '',
      time || '',
      location || '',
      participants || 0,
      status || 'akan datang',
      image || ''
    );
    res.status(201).json({
      id: result.lastInsertRowid,
      title,
      description,
      date,
      time,
      location,
      participants,
      status,
      image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menambah kegiatan' });
  }
});

// DELETE hapus kegiatan
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM kegiatan WHERE id = ?').run(id);
    res.json({ message: 'Kegiatan berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus kegiatan' });
  }
});

export default router;