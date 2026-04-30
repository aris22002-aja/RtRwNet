"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database"));
const houses_json_1 = __importDefault(require("./data/houses.json"));
const residents_json_1 = __importDefault(require("./data/residents.json"));
// Insert houses
const insertHouse = database_1.default.prepare(`
  INSERT OR IGNORE INTO houses (id, block, number, address, status, ipl_amount)
  VALUES (?, ?, ?, ?, ?, ?)
`);
for (const h of houses_json_1.default) {
    insertHouse.run(h.id, h.block, h.number, h.address, h.status, h.ipl_amount);
}
// Insert residents
const insertResident = database_1.default.prepare(`
  INSERT OR IGNORE INTO residents (house_id, name, phone, ktp_number, is_owner, move_in_date)
  VALUES (?, ?, ?, ?, ?, ?)
`);
for (const r of residents_json_1.default) {
    insertResident.run(r.house_id, r.name, r.phone, r.ktp_number, r.is_owner, r.move_in_date);
}
console.log('✅ Dummy data inserted.');
