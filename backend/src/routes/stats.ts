import { Router, Request, Response } from 'express';
import db from '../database';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    // Statistik dasar
    const totalHouses = db.prepare('SELECT COUNT(*) AS count FROM houses').get() as any;
    const occupiedHouses = db.prepare("SELECT COUNT(*) AS count FROM houses WHERE status = 'ditempati' OR status = 'terisi'").get() as any;
    const totalResidents = db.prepare('SELECT COUNT(*) AS count FROM residents').get() as any;

    // Pendapatan IPL bulan ini (asumsi tabel payments dengan kolom amount, payment_date)
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = db.prepare(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM payments
      WHERE strftime('%m', payment_date) = ? AND strftime('%Y', payment_date) = ?
    `).get(String(currentMonth).padStart(2,'0'), String(currentYear)) as any;

    // Statistik tambahan (dashboard warga)
    let totalPosts = 0, totalActivities = 0, upcomingAgendas = 0, totalCommunities = 0,
        totalOrganizations = 0, totalEvents = 0, totalProducts = 0, totalUsers = 0;

    try { totalPosts = (db.prepare('SELECT COUNT(*) AS count FROM posts').get() as any).count; } catch {}
    try { totalActivities = (db.prepare('SELECT COUNT(*) AS count FROM activities').get() as any)?.count || 0; } catch {}
    try { upcomingAgendas = (db.prepare("SELECT COUNT(*) AS count FROM agendas WHERE event_date >= date('now')").get() as any).count; } catch {}
    try { totalCommunities = (db.prepare('SELECT COUNT(*) AS count FROM komunitas').get() as any)?.count || 0; } catch {}
    try { totalOrganizations = (db.prepare('SELECT COUNT(*) AS count FROM organisations').get() as any).count; } catch {}
    try { totalEvents = (db.prepare('SELECT COUNT(*) AS count FROM agendas').get() as any).count; } catch {}
    try { totalProducts = (db.prepare('SELECT COUNT(*) AS count FROM products').get() as any).count; } catch {}
    try { totalUsers = (db.prepare('SELECT COUNT(*) AS count FROM users').get() as any)?.count || totalResidents.count; } catch {}

    const recentUpdates: string[] = [];

    try {
      const latestPosts = db.prepare('SELECT title, date FROM posts ORDER BY date DESC LIMIT 3').all();
      latestPosts.forEach((p: any) => recentUpdates.push(`📢 ${p.title} (${p.date})`));
    } catch {}

    try {
      const latestPayments = db.prepare('SELECT resident_name, amount, payment_date FROM payments ORDER BY payment_date DESC LIMIT 2').all();
      latestPayments.forEach((p: any) => recentUpdates.push(`💰 Pembayaran Rp${p.amount} dari ${p.resident_name} (${p.payment_date})`));
    } catch {}

    try {
      const upcoming = db.prepare("SELECT title, event_date FROM agendas WHERE event_date >= date('now') ORDER BY event_date ASC LIMIT 2").all();
      upcoming.forEach((e: any) => recentUpdates.push(`📅 Agenda: ${e.title} (${e.event_date})`));
    } catch {}

    res.json({
      totalHouses: totalHouses.count,
      occupiedHouses: occupiedHouses.count,
      totalResidents: totalResidents.count,
      monthlyRevenue: monthlyRevenue.total || 0,
      totalPosts,
      totalActivities,
      upcomingAgendas,
      totalCommunities,
      totalOrganizations,
      totalEvents,
      totalProducts,
      totalUsers,
      recentUpdates,
    });
  } catch (error) {
    console.error('Error mengambil stats:', error);
    res.status(500).json({ message: 'Gagal mengambil statistik' });
  }
});

export default router;