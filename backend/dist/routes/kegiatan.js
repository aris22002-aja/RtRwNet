"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/kegiatan.ts
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const router = (0, express_1.Router)();
database_1.default.exec(`
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
router.get('/', (req, res) => {
    try {
        const kegiatan = database_1.default.prepare('SELECT * FROM kegiatan ORDER BY date ASC').all();
        res.json(kegiatan);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data kegiatan' });
    }
});
// POST tambah kegiatan
router.post('/', (req, res) => {
    try {
        const { title, description, date, time, location, participants, status, image } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Judul kegiatan wajib diisi' });
        }
        const stmt = database_1.default.prepare('INSERT INTO kegiatan (title, description, date, time, location, participants, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(title, description || '', date || '', time || '', location || '', participants || 0, status || 'akan datang', image || '');
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambah kegiatan' });
    }
});
// DELETE hapus kegiatan
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        database_1.default.prepare('DELETE FROM kegiatan WHERE id = ?').run(id);
        res.json({ message: 'Kegiatan berhasil dihapus' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus kegiatan' });
    }
});
exports.default = router;
