
export interface Employee {
  id: string;
  name: string;
  position: string;
  dailyRate: number;
  overtimeRate: number;
}

export interface CompanySettings {
  companyName: string;
  directorName: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  type: 'qr' | 'manual';
  status: 'present' | 'absent' | 'late' | 'overtime';
  time: string;
  overtimeHours?: number;
}

export interface CashTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Invoice {
  id: string;
  customerName: string;
  date: string;
  items: InvoiceItem[];
  total: number;
  status: 'paid' | 'unpaid' | 'overdue';
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}
