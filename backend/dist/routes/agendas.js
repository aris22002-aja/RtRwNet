"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const router = (0, express_1.Router)();
// Inisialisasi tabel agendas jika belum ada
database_1.default.exec(`
  CREATE TABLE IF NOT EXISTS agendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    event_date TEXT NOT NULL,   -- format YYYY-MM-DD
    event_time TEXT,            -- format HH:mm
    location TEXT,
    status TEXT DEFAULT 'akan datang'
  )
`);
// GET /api/agendas?month=...&year=...
router.get('/', (req, res) => {
    try {
        const { month, year } = req.query;
        if (!month || !year) {
            return res.status(400).json({ message: 'Parameter month dan year diperlukan' });
        }
        // Query agenda untuk bulan dan tahun tertentu, diurutkan berdasarkan tanggal
        const agendas = database_1.default.prepare(`
      SELECT 
        id,
        title,
        description,
        CAST(strftime('%d', event_date) AS INTEGER) AS day,
        event_time AS time,
        location,
        status
      FROM agendas
      WHERE strftime('%m', event_date) = ? AND strftime('%Y', event_date) = ?
      ORDER BY event_date ASC
    `).all(month.toString().padStart(2, '0'), year.toString());
        res.json(agendas);
    }
    catch (error) {
        console.error('Error mengambil agenda:', error);
        res.status(500).json({ message: 'Gagal mengambil data agenda' });
    }
});
// Optional: endpoint untuk menambah agenda (bisa dipakai nanti)
router.post('/', (req, res) => {
    try {
        const { title, description, event_date, event_time, location } = req.body;
        if (!title || !event_date) {
            return res.status(400).json({ message: 'Judul dan tanggal wajib diisi' });
        }
        const stmt = database_1.default.prepare(`
      INSERT INTO agendas (title, description, event_date, event_time, location)
      VALUES (?, ?, ?, ?, ?)
    `);
        const result = stmt.run(title, description, event_date, event_time, location);
        res.status(201).json({ id: result.lastInsertRowid, ...req.body });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambah agenda' });
    }
});
exports.default = router;
