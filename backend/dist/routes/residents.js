"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    const residents = database_1.default.prepare(`
    SELECT residents.*, houses.block, houses.number 
    FROM residents 
    LEFT JOIN houses ON residents.house_id = houses.id
  `).all();
    res.json(residents);
});
router.post('/', (req, res) => {
    const { house_id, name, phone, ktp_number, is_owner, move_in_date } = req.body;
    try {
        const info = database_1.default.prepare('INSERT INTO residents (house_id, name, phone, ktp_number, is_owner, move_in_date) VALUES (?, ?, ?, ?, ?, ?)').run(house_id, name, phone, ktp_number, is_owner ? 1 : 0, move_in_date);
        // Update house status to occupied
        database_1.default.prepare('UPDATE houses SET status = "occupied" WHERE id = ?').run(house_id);
        res.status(201).json({ id: info.lastInsertRowid });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.put('/:id', (req, res) => {
    const { name, phone, ktp_number, is_owner, move_in_date } = req.body;
    database_1.default.prepare('UPDATE residents SET name = ?, phone = ?, ktp_number = ?, is_owner = ?, move_in_date = ? WHERE id = ?').run(name, phone, ktp_number, is_owner ? 1 : 0, move_in_date, req.params.id);
    res.sendStatus(200);
});
router.delete('/:id', (req, res) => {
    const resident = database_1.default.prepare('SELECT house_id FROM residents WHERE id = ?').get(req.params.id);
    if (resident) {
        database_1.default.prepare('UPDATE houses SET status = "vacant" WHERE id = ?').run(resident.house_id);
    }
    database_1.default.prepare('DELETE FROM residents WHERE id = ?').run(req.params.id);
    res.sendStatus(200);
});
exports.default = router;
