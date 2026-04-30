"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../database"));
const router = (0, express_1.Router)();
router.get('/', (req, res) => {
    const houses = database_1.default.prepare('SELECT * FROM houses').all();
    res.json(houses);
});
router.post('/', (req, res) => {
    const { block, number, address, status, ipl_amount } = req.body;
    const info = database_1.default.prepare('INSERT INTO houses (block, number, address, status, ipl_amount) VALUES (?, ?, ?, ?, ?)').run(block, number, address, status, ipl_amount);
    res.status(201).json({ id: info.lastInsertRowid });
});
router.put('/:id', (req, res) => {
    const { block, number, address, status, ipl_amount } = req.body;
    database_1.default.prepare('UPDATE houses SET block = ?, number = ?, address = ?, status = ?, ipl_amount = ? WHERE id = ?').run(block, number, address, status, ipl_amount, req.params.id);
    res.sendStatus(200);
});
router.delete('/:id', (req, res) => {
    database_1.default.prepare('DELETE FROM houses WHERE id = ?').run(req.params.id);
    res.sendStatus(200);
});
exports.default = router;
