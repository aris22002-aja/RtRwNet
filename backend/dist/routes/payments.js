"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
// const XLSX = require('xlsx');
const router = (0, express_1.Router)();
// Get all payments for a specific month and year
router.get('/', (req, res) => {
    const { month, year } = req.query;
    let query = `SELECT p.*, h.block, h.number FROM payments p JOIN houses h ON p.house_id = h.id`;
    const params = [];
    if (month && year) {
        query += ' WHERE p.month = ? AND p.year = ?';
        params.push(parseInt(month), parseInt(year));
    }
    const stmt = database_1.default.prepare(query);
    const payments = stmt.all(...params);
    res.json(payments);
});
// Generate unpaid records for all occupied houses for a specific month/year
router.post('/generate', (req, res) => {
    const { month, year } = req.body;
    if (!month || !year) {
        return res.status(400).json({ error: 'month and year required' });
    }
    // Find occupied houses
    const occupied = database_1.default.prepare('SELECT id, ipl_amount FROM houses WHERE status = "occupied"').all();
    const insert = database_1.default.prepare('INSERT OR IGNORE INTO payments (house_id, month, year, amount, status) VALUES (?, ?, ?, ?, ?)');
    const insertMany = database_1.default.transaction((records) => {
        for (const r of records) {
            insert.run(r.house_id, month, year, r.ipl_amount, 'unpaid');
        }
    });
    const records = occupied.map((h) => ({ house_id: h.id, ipl_amount: h.ipl_amount }));
    insertMany(records);
    res.json({ message: `Payments generated for ${month}/${year}` });
});
// Mark as paid
router.put('/:id/pay', (req, res) => {
    const { id } = req.params;
    const { paid_date, notes } = req.body;
    const now = new Date().toISOString().split('T')[0];
    const stmt = database_1.default.prepare('UPDATE payments SET status = "paid", paid_date = ?, notes = ? WHERE id = ?');
    stmt.run(paid_date || now, notes || '', id);
    res.sendStatus(200);
});
exports.default = router;
