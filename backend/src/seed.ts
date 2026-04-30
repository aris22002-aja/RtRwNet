import db from './database';
import houses from './data/houses.json';
import residents from './data/residents.json';

// Insert houses
const insertHouse = db.prepare(`
  INSERT OR IGNORE INTO houses (id, block, number, address, status, ipl_amount)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const h of houses) {
    insertHouse.run(h.id, h.block, h.number, h.address, h.status, h.ipl_amount);
}

// Insert residents
const insertResident = db.prepare(`
  INSERT OR IGNORE INTO residents (house_id, name, phone, ktp_number, is_owner, move_in_date)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const r of residents) {
    insertResident.run(r.house_id, r.name, r.phone, r.ktp_number, r.is_owner, r.move_in_date);
}

console.log('✅ Dummy data inserted.');