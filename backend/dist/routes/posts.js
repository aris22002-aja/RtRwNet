"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const router = (0, express_1.Router)();
// Buat tabel posts jika belum ada
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
  )
`);
// GET /api/posts
router.get('/', (req, res) => {
    try {
        const posts = database_1.default.prepare(`SELECT * FROM posts ORDER BY date DESC`).all();
        res.json(posts);
    }
    catch (error) {
        console.error('Error mengambil postingan:', error);
        res.status(500).json({ message: 'Gagal mengambil postingan' });
    }
});
// POST /api/posts (opsional, untuk menambah data)
router.post('/', (req, res) => {
    try {
        const { title, content, author, role, image } = req.body;
        if (!title || !content) {
            return res.status(400).json({ message: 'Judul dan konten wajib diisi' });
        }
        const stmt = database_1.default.prepare(`
      INSERT INTO posts (title, content, author, role, image)
      VALUES (?, ?, ?, ?, ?)
    `);
        const result = stmt.run(title, content, author || 'Anonim', role || 'Warga', image);
        res.status(201).json({ id: result.lastInsertRowid, ...req.body });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambah postingan' });
    }
});
exports.default = router;
