"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// Buat tabel jika belum ada
database_1.default.exec(`
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
const readJSONFallback = () => {
    const filePath = path_1.default.join(__dirname, '../data', 'komunitas.json');
    try {
        const raw = fs_1.default.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    }
    catch (error) {
        console.error('Gagal membaca fallback komunitas.json:', error);
        return [];
    }
};
// GET semua komunitas
router.get('/', (req, res) => {
    try {
        let komunitas = database_1.default.prepare('SELECT * FROM komunitas ORDER BY name ASC').all();
        // Jika tabel kosong, ambil dari JSON
        if (komunitas.length === 0) {
            console.log('Tabel komunitas kosong, mengambil dari JSON...');
            komunitas = readJSONFallback();
        }
        res.json(komunitas);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data komunitas' });
    }
});
// POST tambah komunitas
router.post('/', (req, res) => {
    try {
        const { name, description, category, memberCount, location } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Nama komunitas wajib diisi' });
        }
        const stmt = database_1.default.prepare('INSERT INTO komunitas (name, description, category, memberCount, location) VALUES (?, ?, ?, ?, ?)');
        const result = stmt.run(name, description || '', category || 'lainnya', memberCount || 0, location || 'GH5');
        res.status(201).json({
            id: result.lastInsertRowid,
            name,
            description,
            category,
            memberCount,
            location,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambah komunitas' });
    }
});
// DELETE hapus komunitas
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        database_1.default.prepare('DELETE FROM komunitas WHERE id = ?').run(id);
        res.json({ message: 'Komunitas berhasil dihapus' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus komunitas' });
    }
});
exports.default = router;
