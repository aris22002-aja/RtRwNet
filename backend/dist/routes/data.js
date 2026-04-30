"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const readJSON = (filename) => {
    const filePath = path_1.default.join(__dirname, '../data', filename);
    try {
        const raw = fs_1.default.readFileSync(filePath, 'utf-8');
        return JSON.parse(raw);
    }
    catch (error) {
        console.error(`Gagal membaca ${filename}:`, error);
        return [];
    }
};
// === Daftar endpoint yang HARUS ada ===
// GET /api/activities
router.get('/activities', (req, res) => res.json(readJSON('activities.json')));
// GET /api/organizations
router.get('/organizations', (req, res) => res.json(readJSON('organizations.json')));
// GET /api/products
router.get('/products', (req, res) => res.json(readJSON('products.json')));
// GET /api/posts
router.get('/posts', (req, res) => res.json(readJSON('posts.json')));
// GET /api/resume
router.get('/resume', (req, res) => res.json(readJSON('resume.json')));
// GET /api/stats
router.get('/stats', (req, res) => res.json(readJSON('stats.json')));
// GET /api/agendas?month=&year=
router.get('/agendas', (req, res) => {
    const agendas = readJSON('agendas.json');
    const { month, year } = req.query;
    if (month && year) {
        const filtered = agendas.filter((a) => {
            const [y, m] = a.event_date.split('-');
            return +m === +month && +y === +year;
        });
        return res.json(filtered);
    }
    res.json(agendas);
});
// GET /api/kegiatan
router.get('/kegiatan', (req, res) => res.json(readJSON('kegiatan.json')));
// GET /api/komunitas
router.get('/komunitas', (req, res) => res.json(readJSON('komunitas.json')));
// GET /api/houses
router.get('/houses', (req, res) => res.json(readJSON('houses.json')));
// GET /api/residents
router.get('/residents', (req, res) => res.json(readJSON('residents.json')));
// GET /api/payments
router.get('/payments', (req, res) => {
    const payments = readJSON('payments.json');
    const { month, year } = req.query;
    if (month && year) {
        const filtered = payments.filter((p) => p.month === +month && p.year === +year);
        return res.json(filtered);
    }
    res.json(payments);
});
exports.default = router;
