
import React, { useState } from 'react';
import { Download, TrendingUp, TrendingDown, Plus, Filter, X, ReceiptText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const Finance: React.FC = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [transactions, setTransactions] = useState([
    { id: '1', date: '2024-05-20', desc: 'Pembayaran Project X', amount: 5000000, type: 'income', category: 'Project' },
    { id: '2', date: '2024-05-21', desc: 'Sewa Kantor Mei', amount: 2500000, type: 'expense', category: 'Operasional' },
    { id: '3', date: '2024-05-22', desc: 'Internet & Listrik', amount: 850000, type: 'expense', category: 'Utilitas' },
    { id: '4', date: '2024-05-23', desc: 'Invoice Client B', amount: 3200000, type: 'income', category: 'Service' },
  ]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(0, 91, 171);
    doc.text('LAPORAN KAS PERUSAHAAN', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Periode: Mei 2024 | Dicetak: ${new Date().toLocaleString()}`, 14, 30);

    const tableData = transactions.map(t => [
      t.date, 
      t.desc, 
      t.category,
      t.type === 'income' ? `+Rp ${t.amount.toLocaleString()}` : `-Rp ${t.amount.toLocaleString()}`,
      t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'
    ]);

    autoTable(doc, {
      head: [['Tanggal', 'Deskripsi', 'Kategori', 'Jumlah', 'Tipe']],
      body: tableData,
      startY: 40,
      headStyles: { fillColor: [0, 91, 171], fontSize: 10 },
      bodyStyles: { fontSize: 9 },
      foot: [['', '', 'TOTAL SALDO', 'Rp 4.850.000', '']],
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    doc.save('Laporan_Keuangan_Mei.pdf');
  };

  return (
    <div className="animate-in fade-in duration-300 pb-20">
      <div className="bg-[#005BAB] p-6 pb-20 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Keuangan</h2>
          <button onClick={generatePDF} className="p-2 bg-white/10 rounded-lg flex items-center gap-2 text-xs font-medium backdrop-blur-md border border-white/20">
            <Download className="w-4 h-4" /> PDF Laporan
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-green-500/20 rounded-md">
                <TrendingUp className="w-3 h-3 text-green-400" />
              </div>
              <span className="text-[10px] text-blue-100 uppercase font-bold">Pemasukan</span>
            </div>
            <p className="text-lg font-bold">Rp 8.200.000</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-red-500/20 rounded-md">
                <TrendingDown className="w-3 h-3 text-red-400" />
              </div>
              <span className="text-[10px] text-blue-100 uppercase font-bold">Pengeluaran</span>
            </div>
            <p className="text-lg font-bold">Rp 3.350.000</p>
          </div>
        </div>
      </div>

      <div className="-mt-10 px-4">
        <div className="bg-white rounded-3xl shadow-sm p-5 min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Aktivitas Terbaru</h3>
            <button className="text-blue-600 text-[11px] font-bold flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full">
              <Filter className="w-3 h-3" /> Semua Kategori
            </button>
          </div>

          <div className="space-y-6">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center gap-4 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${t.type === 'income' ? 'bg-green-50 text-green-600 group-hover:bg-green-100' : 'bg-red-50 text-red-600 group-hover:bg-red-100'}`}>
                  {t.type === 'income' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800 group-hover:text-[#005BAB] transition-colors">{t.desc}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <span className="capitalize">{t.category}</span> • {t.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-black ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.type === 'income' ? '+' : '-'} {t.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                     <span className="text-[9px] text-gray-400">Success</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowAdd(true)}
            className="w-full mt-10 py-4 bg-[#005BAB] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" /> Catat Transaksi Baru
          </button>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center animate-in slide-in-from-bottom duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 space-y-6 animate-in slide-in-from-bottom duration-500 delay-100">
             <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Catat Transaksi</h3>
                <button onClick={() => setShowAdd(false)} className="p-2 bg-gray-100 rounded-full text-gray-500"><X /></button>
             </div>
             
             <div className="space-y-4">
                <div className="flex gap-2 p-1 bg-gray-50 rounded-xl">
                  <button className="flex-1 py-3 bg-white shadow-sm rounded-lg text-xs font-bold text-[#005BAB]">Pemasukan</button>
                  <button className="flex-1 py-3 text-xs font-bold text-gray-400">Pengeluaran</button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Jumlah (Rp)</label>
                  <input type="number" placeholder="0" className="w-full text-3xl font-black text-[#005BAB] outline-none border-b-2 border-gray-100 pb-2 focus:border-[#005BAB] transition-colors" />
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-gray-400 uppercase">Keterangan</label>
                   <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                      <ReceiptText className="w-5 h-5 text-gray-400" />
                      <input type="text" placeholder="Contoh: Belanja ATK" className="bg-transparent w-full text-sm outline-none" />
                   </div>
                </div>

                <button 
                  onClick={() => setShowAdd(false)}
                  className="w-full bg-[#005BAB] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 active:scale-95 transition-transform"
                >
                  Simpan Transaksi
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance;
