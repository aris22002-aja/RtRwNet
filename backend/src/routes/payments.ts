import { Router } from 'express';
import db from '../database';
import * as XLSX from 'xlsx';



// const XLSX = require('xlsx');
const router = Router();

// Get all payments for a specific month and year
router.get('/', (req, res) => {
  const { month, year } = req.query as { month?: string; year?: string };
  let query = `SELECT p.*, h.block, h.number FROM payments p JOIN houses h ON p.house_id = h.id`;
  const params: any[] = [];
  if (month && year) {
    query += ' WHERE p.month = ? AND p.year = ?';
    params.push(parseInt(month), parseInt(year));
  }
  const stmt = db.prepare(query);
  const payments = stmt.all(...params);
  res.json(payments);
});

// Generate unpaid records for all occupied houses for a specific month/year
router.post('/generate', (req, res) => {
  const { month, year } = req.body as { month: number; year: number };
  if (!month || !year) {
    return res.status(400).json({ error: 'month and year required' });
  }
  // Find occupied houses
  const occupied = db.prepare('SELECT id, ipl_amount FROM houses WHERE status = "occupied"').all() as { id: number; ipl_amount: number }[];
  const insert = db.prepare('INSERT OR IGNORE INTO payments (house_id, month, year, amount, status) VALUES (?, ?, ?, ?, ?)');
  const insertMany = db.transaction((records: any[]) => {
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
  const { paid_date, notes } = req.body as { paid_date?: string; notes?: string };
  const now = new Date().toISOString().split('T')[0];
  const stmt = db.prepare('UPDATE payments SET status = "paid", paid_date = ?, notes = ? WHERE id = ?');
  stmt.run(paid_date || now, notes || '', id);
  res.sendStatus(200);
});
export default router;
