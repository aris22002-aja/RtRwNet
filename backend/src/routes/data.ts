import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

const readJSON = (filename: string) => {
  const filePath = path.join(__dirname, '../data', filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Gagal membaca ${filename}:`, error);
    return [];
  }
};

// ========== ACTIVITIES ==========
router.get('/activities', (req, res) => res.json(readJSON('activities.json')));

// ========== ORGANIZATIONS ==========
router.get('/organizations', (req, res) => res.json(readJSON('organizations.json')));

// ========== PRODUCTS ==========
router.get('/products', (req, res) => res.json(readJSON('products.json')));

// ========== POSTS ==========
router.get('/posts', (req, res) => res.json(readJSON('posts.json')));

// ========== RESUME ==========
router.get('/resume', (req, res) => res.json(readJSON('resume.json')));

// ========== STATS ==========
router.get('/stats', (req, res) => res.json(readJSON('stats.json')));

// ========== AGENDAS ==========
router.get('/agendas', (req, res) => {
  const agendas = readJSON('agendas.json');
  const { month, year } = req.query;
  if (month && year) {
    const filtered = agendas.filter((a: any) => {
      const [y, m] = a.event_date.split('-');
      return +m === +month! && +y === +year!;
    });
    return res.json(filtered);
  }
  res.json(agendas);
});

// ========== KEGIATAN ==========
router.get('/kegiatan', (req, res) => res.json(readJSON('kegiatan.json')));
router.post('/kegiatan', (req, res) => res.status(201).json({ ...req.body, id: Date.now() }));
router.delete('/kegiatan/:id', (req, res) => res.json({ message: 'Kegiatan dihapus (dummy)' }));

// ========== KOMUNITAS ==========
router.get('/komunitas', (req, res) => res.json(readJSON('komunitas.json')));
router.post('/komunitas', (req, res) => res.status(201).json({ ...req.body, id: Date.now() }));
router.delete('/komunitas/:id', (req, res) => res.json({ message: 'Komunitas dihapus (dummy)' }));

// ========== HOUSES ==========
router.get('/houses', (req, res) => res.json(readJSON('houses.json')));
router.post('/houses', (req, res) => res.status(201).json({ ...req.body, id: Date.now() }));
router.put('/houses/:id', (req, res) => res.json({ ...req.body, id: +req.params.id }));
router.delete('/houses/:id', (req, res) => res.json({ message: 'Rumah dihapus (dummy)' }));

// ========== RESIDENTS ==========
router.get('/residents', (req, res) => res.json(readJSON('residents.json')));
router.post('/residents', (req, res) => res.status(201).json({ ...req.body, id: Date.now() }));
router.put('/residents/:id', (req, res) => res.json({ ...req.body, id: +req.params.id }));
router.delete('/residents/:id', (req, res) => res.json({ message: 'Penghuni dihapus (dummy)' }));

// ========== PAYMENTS ==========
router.get('/payments', (req, res) => {
  const payments = readJSON('payments.json');
  const { month, year } = req.query;
  if (month && year) {
    const filtered = payments.filter(
      (p: any) => p.month === +month! && p.year === +year!
    );
    return res.json(filtered);
  }
  res.json(payments);
});
router.post('/payments/generate', (req, res) => res.status(201).json({ message: 'Pembayaran bulanan dibuat (dummy)' }));
router.put('/payments/:id/pay', (req, res) => res.json({ message: 'Pembayaran berhasil (dummy)' }));

export default router;