"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    try {
        // Statistik dasar
        const totalHouses = database_1.default.prepare('SELECT COUNT(*) AS count FROM houses').get();
        const occupiedHouses = database_1.default.prepare("SELECT COUNT(*) AS count FROM houses WHERE status = 'ditempati' OR status = 'terisi'").get();
        const totalResidents = database_1.default.prepare('SELECT COUNT(*) AS count FROM residents').get();
        // Pendapatan IPL bulan ini (asumsi tabel payments dengan kolom amount, payment_date)
        const currentMonth = new Date().getMonth() + 1; // 1-12
        const currentYear = new Date().getFullYear();
        const monthlyRevenue = database_1.default.prepare(`
      SELECT COALESCE(SUM(amount), 0) AS total
      FROM payments
      WHERE strftime('%m', payment_date) = ? AND strftime('%Y', payment_date) = ?
    `).get(String(currentMonth).padStart(2, '0'), String(currentYear));
        // Statistik tambahan (dashboard warga)
        let totalPosts = 0, totalActivities = 0, upcomingAgendas = 0, totalCommunities = 0, totalOrganizations = 0, totalEvents = 0, totalProducts = 0, totalUsers = 0;
        try {
            totalPosts = database_1.default.prepare('SELECT COUNT(*) AS count FROM posts').get().count;
        }
        catch { }
        try {
            totalActivities = database_1.default.prepare('SELECT COUNT(*) AS count FROM activities').get()?.count || 0;
        }
        catch { }
        try {
            upcomingAgendas = database_1.default.prepare("SELECT COUNT(*) AS count FROM agendas WHERE event_date >= date('now')").get().count;
        }
        catch { }
        try {
            totalCommunities = database_1.default.prepare('SELECT COUNT(*) AS count FROM komunitas').get()?.count || 0;
        }
        catch { }
        try {
            totalOrganizations = database_1.default.prepare('SELECT COUNT(*) AS count FROM organisations').get().count;
        }
        catch { }
        try {
            totalEvents = database_1.default.prepare('SELECT COUNT(*) AS count FROM agendas').get().count;
        }
        catch { }
        try {
            totalProducts = database_1.default.prepare('SELECT COUNT(*) AS count FROM products').get().count;
        }
        catch { }
        try {
            totalUsers = database_1.default.prepare('SELECT COUNT(*) AS count FROM users').get()?.count || totalResidents.count;
        }
        catch { }
        const recentUpdates = [];
        try {
            const latestPosts = database_1.default.prepare('SELECT title, date FROM posts ORDER BY date DESC LIMIT 3').all();
            latestPosts.forEach((p) => recentUpdates.push(`📢 ${p.title} (${p.date})`));
        }
        catch { }
        try {
            const latestPayments = database_1.default.prepare('SELECT resident_name, amount, payment_date FROM payments ORDER BY payment_date DESC LIMIT 2').all();
            latestPayments.forEach((p) => recentUpdates.push(`💰 Pembayaran Rp${p.amount} dari ${p.resident_name} (${p.payment_date})`));
        }
        catch { }
        try {
            const upcoming = database_1.default.prepare("SELECT title, event_date FROM agendas WHERE event_date >= date('now') ORDER BY event_date ASC LIMIT 2").all();
            upcoming.forEach((e) => recentUpdates.push(`📅 Agenda: ${e.title} (${e.event_date})`));
        }
        catch { }
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
    }
    catch (error) {
        console.error('Error mengambil stats:', error);
        res.status(500).json({ message: 'Gagal mengambil statistik' });
    }
});
exports.default = router;
