import { Router } from 'express';
import db from '../database';
import { Resident } from '../types';

const router = Router();

// GET /api/residents
router.get('/', (req, res) => {
  const residents = db.prepare(`
    SELECT 
      residents.*, 
      houses.block, 
      houses.number 
    FROM residents 
    LEFT JOIN houses ON residents.house_id = houses.id
  `).all();
  res.json(residents);
});

// POST /api/residents
router.post('/', (req, res) => {
  const { house_id, name, phone, ktp_number, is_owner, move_in_date }: Resident = req.body;
  try {
    const info = db.prepare(
      'INSERT INTO residents (house_id, name, phone, ktp_number, is_owner, move_in_date) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(house_id, name, phone, ktp_number, is_owner ? 1 : 0, move_in_date);

    // Ubah status rumah menjadi occupied
    db.prepare('UPDATE houses SET status = "occupied" WHERE id = ?').run(house_id);

    res.status(201).json({ id: info.lastInsertRowid });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// PUT /api/residents/:id
router.put('/:id', (req, res) => {
  const { name, phone, ktp_number, is_owner, move_in_date }: Resident = req.body;
  db.prepare(
    'UPDATE residents SET name = ?, phone = ?, ktp_number = ?, is_owner = ?, move_in_date = ? WHERE id = ?'
  ).run(name, phone, ktp_number, is_owner ? 1 : 0, move_in_date, req.params.id);
  res.sendStatus(200);
});

// DELETE /api/residents/:id
router.delete('/:id', (req, res) => {
  const resident = db.prepare('SELECT house_id FROM residents WHERE id = ?').get(req.params.id) as { house_id: number } | undefined;
  if (resident) {
    db.prepare('UPDATE houses SET status = "vacant" WHERE id = ?').run(resident.house_id);
  }
  db.prepare('DELETE FROM residents WHERE id = ?').run(req.params.id);
  res.sendStatus(200);
});

export default router;