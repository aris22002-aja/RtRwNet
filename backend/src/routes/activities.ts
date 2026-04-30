import { Router, Request, Response } from 'express';
import db from '../database';

const router = Router();

// 👇 Pastikan tabel-tabel yang diperlukan sudah ada
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
  );

  CREATE TABLE IF NOT EXISTS agendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    event_date TEXT NOT NULL,
    event_time TEXT,
    location TEXT,
    status TEXT DEFAULT 'akan datang'
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    resident_name TEXT,
    amount REAL,
    payment_date TEXT,
    month INTEGER,
    year INTEGER
  );
`);

// GET /api/activities
router.get('/', (req: Request, res: Response) => {
  try {
    // Definisikan tipe item aktivitas
    type ActivityItem = {
      type: string;
      time: string;
      message: string;
      user?: string;
    };

    const activities: ActivityItem[] = [];

    // Ambil postingan terbaru
    const recentPosts = db.prepare(`
      SELECT 'postingan' AS type, date AS time, ('Postingan baru: ' || title) AS message, author AS user
      FROM posts
      ORDER BY date DESC
      LIMIT 5
    `).all() as ActivityItem[];
    activities.push(...recentPosts);

    // Ambil kegiatan terbaru
    const recentEvents = db.prepare(`
      SELECT 'kegiatan' AS type, event_date || ' ' || COALESCE(event_time,'') AS time,
             ('Kegiatan: ' || title) AS message,
             NULL AS user
      FROM agendas
      ORDER BY event_date DESC
      LIMIT 5
    `).all() as ActivityItem[];
    activities.push(...recentEvents);

    // Ambil pembayaran terbaru
    const recentPayments = db.prepare(`
      SELECT 'pembayaran' AS type, payment_date AS time,
             ('Pembayaran Rp ' || amount || ' oleh ' || resident_name) AS message,
             resident_name AS user
      FROM payments
      ORDER BY payment_date DESC
      LIMIT 5
    `).all() as ActivityItem[];
    activities.push(...recentPayments);

    // Urutkan seluruh aktivitas berdasarkan waktu terbaru
    activities.sort((a, b) => b.time.localeCompare(a.time));

    res.json(activities.slice(0, 20)); // batasi 20 aktivitas terbaru
  } catch (error) {
    console.error('Error mengambil aktivitas:', error);
    res.status(500).json({ message: 'Gagal mengambil aktivitas' });
  }
});

export default router;