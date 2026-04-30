"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const router = (0, express_1.Router)();
// 👇 Pastikan tabel-tabel yang diperlukan sudah ada
database_1.default.exec(`
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
router.get('/', (req, res) => {
    try {
        const activities = [];
        // Ambil postingan terbaru
        const recentPosts = database_1.default.prepare(`
      SELECT 'postingan' AS type, date AS time, ('Postingan baru: ' || title) AS message, author AS user
      FROM posts
      ORDER BY date DESC
      LIMIT 5
    `).all();
        activities.push(...recentPosts);
        // Ambil kegiatan terbaru
        const recentEvents = database_1.default.prepare(`
      SELECT 'kegiatan' AS type, event_date || ' ' || COALESCE(event_time,'') AS time,
             ('Kegiatan: ' || title) AS message,
             NULL AS user
      FROM agendas
      ORDER BY event_date DESC
      LIMIT 5
    `).all();
        activities.push(...recentEvents);
        // Ambil pembayaran terbaru
        const recentPayments = database_1.default.prepare(`
      SELECT 'pembayaran' AS type, payment_date AS time,
             ('Pembayaran Rp ' || amount || ' oleh ' || resident_name) AS message,
             resident_name AS user
      FROM payments
      ORDER BY payment_date DESC
      LIMIT 5
    `).all();
        activities.push(...recentPayments);
        // Urutkan seluruh aktivitas berdasarkan waktu terbaru
        activities.sort((a, b) => b.time.localeCompare(a.time));
        res.json(activities.slice(0, 20)); // batasi 20 aktivitas terbaru
    }
    catch (error) {
        console.error('Error mengambil aktivitas:', error);
        res.status(500).json({ message: 'Gagal mengambil aktivitas' });
    }
});
exports.default = router;
