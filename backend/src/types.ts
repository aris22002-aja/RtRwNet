export interface House {
  id?: number;
  block: string;
  number: string;
  address: string;
  status: 'occupied' | 'vacant';
  ipl_amount: number;
}

export interface Resident {
  id?: number;
  house_id: number;
  name: string;
  phone: string;
  ktp_number: string;
  is_owner: boolean;
  move_in_date: string;
}

export interface Payment {
  id?: number;
  house_id: number;
  month: number;
  year: number;
  amount: number;
  status: 'paid' | 'unpaid';
  paid_date?: string;
  notes?: string;
}
