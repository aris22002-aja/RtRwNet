"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const db = new better_sqlite3_1.default(path_1.default.join(__dirname, '../rtrwnet.db'));
// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS houses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    block TEXT NOT NULL,
    number TEXT NOT NULL,
    address TEXT,
    status TEXT DEFAULT 'vacant',
    ipl_amount INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS residents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    house_id INTEGER UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    ktp_number TEXT,
    is_owner BOOLEAN DEFAULT 1,
    move_in_date TEXT,
    FOREIGN KEY (house_id) REFERENCES houses (id)
  );

  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    house_id INTEGER NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'unpaid',
    paid_date TEXT,
    notes TEXT,
    UNIQUE(house_id, month, year),
    FOREIGN KEY (house_id) REFERENCES houses (id)
  );
`);
exports.default = db;
