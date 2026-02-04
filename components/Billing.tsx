
import React, { useState } from 'react';
import { Plus, Send, FileText, Download, User, Calendar, CreditCard, X, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';

const Billing: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [invoices, setInvoices] = useState([
    { id: 'INV-2024-001', customer: 'PT. Teknologi Maju', amount: 15000000, status: 'Lunas', date: '20/05/2024' },
    { id: 'INV-2024-002', customer: 'CV. Kreatif Selalu', amount: 2500000, status: 'Pending', date: '22/05/2024' },
    { id: 'INV-2024-003', customer: 'Bapak Junaedi', amount: 850000, status: 'Overdue', date: '18/05/2024' },
  ]);
  
  const generateInvoicePDF = (inv: any) => {
    const doc = new jsPDF();
    
    // Header Color Strip
    doc.setFillColor(0, 91, 171);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('INVOICE', 14, 25);
    
    doc.setFontSize(10);
    doc.text('Sistem Manajemen Bisnis Digital', 150, 20);
    doc.text('invoice@business.id', 150, 26);
    
    // Body Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('DITAGIHKAN KEPADA:', 14, 55);
    doc.setFontSize(11);
    doc.text(inv.customer, 14, 62);
    doc.text('Jakarta, Indonesia', 14, 68);
    
    doc.text('NOMOR INVOICE:', 140, 55);
    doc.text(inv.id, 140, 62);
    doc.text('TANGGAL:', 140, 68);
    doc.text(inv.date, 140, 74);
    
    // Table Header
    doc.setFillColor(245, 245, 245);
    doc.rect(14, 85, 182, 10, 'F');
    doc.setFontSize(10);
    doc.text('DESKRIPSI LAYANAN', 18, 92);
    doc.text('JUMLAH', 160, 92, { align: 'right' });
    
    // Item Row
    doc.text('Professional Service / Project Fee', 18, 105);
    doc.text(`Rp ${inv.amount.toLocaleString()}`, 160, 105, { align: 'right' });
    
    // Footer Total
    doc.line(14, 150, 196, 150);
    doc.setFontSize(16);
    doc.setTextColor(0, 91, 171);
    doc.text('TOTAL TAGIHAN:', 14, 165);
    doc.text(`Rp ${inv.amount.toLocaleString()}`, 160, 165, { align: 'right' });
    
    doc.setTextColor(100);
    doc.setFontSize(9);
    doc.text('Pembayaran dapat dilakukan melalui transfer Bank BCA: 12345678 a.n PT Bisnis Maju', 14, 180);
    
    doc.save(`Invoice_${inv.id}.pdf`);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-300 pb-24">
      <div className="bg-[#005BAB] p-6 pb-20 text-white">
        <h2 className="text-xl font-bold mb-4">Tagihan & Piutang</h2>
        <div className="bg-white/10 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md border border-white/20">
          <div>
            <p className="text-[10px] uppercase font-bold opacity-70 tracking-widest">Piutang Berjalan</p>
            <p className="text-3xl font-black">Rp 3.350.000</p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-[#2AC3E2] text-white p-4 rounded-2xl shadow-lg shadow-cyan-900/20 active:scale-95 transition-transform"
          >
            <Plus className="w-7 h-7" />
          </button>
        </div>
      </div>

      <div className="-mt-10 px-4 space-y-4">
        {showForm ? (
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-blue-100 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-gray-800">Buat Tagihan Manual</h3>
              <button onClick={() => setShowForm(false)} className="p-2 bg-gray-50 rounded-full text-gray-400"><X /></button>
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Pelanggan / Klien</label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500 transition-colors">
                  <User className="text-blue-500 w-5 h-5" />
                  <input type="text" placeholder="Contoh: PT. Maju Bersama" className="bg-transparent w-full text-sm outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Jatuh Tempo</label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <Calendar className="text-blue-500 w-5 h-5" />
                  <input type="date" className="bg-transparent w-full text-sm outline-none text-gray-500" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Jumlah Tagihan</label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <CreditCard className="text-blue-500 w-5 h-5" />
                  <input type="number" placeholder="0" className="bg-transparent w-full text-sm font-bold outline-none" />
                </div>
              </div>
              <button 
                onClick={() => setShowForm(false)}
                className="w-full bg-[#005BAB] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 mt-4 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" /> Kirim Tagihan Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
             <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 text-sm">Riwayat Invoice</h3>
                <span className="text-[10px] text-gray-400 font-medium">Show: 3 Terbaru</span>
             </div>
             <div className="divide-y divide-gray-50">
               {invoices.map(inv => (
                 <div key={inv.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors group">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${inv.status === 'Lunas' ? 'bg-green-50 text-green-600' : inv.status === 'Overdue' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                     <FileText className="w-6 h-6" />
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-800">{inv.id}</p>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${inv.status === 'Lunas' ? 'bg-green-100 text-green-700' : inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{inv.status}</span>
                     </div>
                     <p className="text-[10px] text-gray-400 font-medium mt-0.5">{inv.customer}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-black text-gray-900">Rp {inv.amount.toLocaleString()}</p>
                     <button 
                       onClick={() => generateInvoicePDF(inv)}
                       className="mt-1 flex items-center gap-1 text-[10px] text-[#2AC3E2] font-bold hover:underline"
                     >
                       <Download className="w-3 h-3" /> Cetak PDF
                     </button>
                   </div>
                 </div>
               ))}
             </div>
             <button className="w-full py-4 text-center text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors border-t border-gray-50 bg-gray-50/50">
               Lihat Seluruh Invoice <ChevronRight className="w-3 h-3 inline-block" />
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
