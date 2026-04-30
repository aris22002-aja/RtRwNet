import { Router } from 'express';
import db from '../database';
import { House } from '../types';

const router = Router();

router.get('/', (req, res) => {
  const houses = db.prepare('SELECT * FROM houses').all();
  res.json(houses);
});

router.post('/', (req, res) => {
  const { block, number, address, status, ipl_amount }: House = req.body;
  const info = db.prepare(
    'INSERT INTO houses (block, number, address, status, ipl_amount) VALUES (?, ?, ?, ?, ?)'
  ).run(block, number, address, status, ipl_amount);
  res.status(201).json({ id: info.lastInsertRowid });
});

router.put('/:id', (req, res) => {
  const { block, number, address, status, ipl_amount }: House = req.body;
  db.prepare(
    'UPDATE houses SET block = ?, number = ?, address = ?, status = ?, ipl_amount = ? WHERE id = ?'
  ).run(block, number, address, status, ipl_amount, req.params.id);
  res.sendStatus(200);
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM houses WHERE id = ?').run(req.params.id);
  res.sendStatus(200);
});

export default router;
