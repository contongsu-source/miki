
import React, { useState, useRef } from 'react';
import { Download, Eye, Calculator, User, X, CheckCircle2, Clock, Plus } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeWithStats extends Employee {
  daysWorked: number;
  overtimeHours: number;
}

interface PayrollProps {
  directorName: string;
  companyName: string;
  employees: Employee[];
}

const Payroll: React.FC<PayrollProps> = ({ directorName, companyName, employees }) => {
  const [selectedMonth, setSelectedMonth] = useState('Mei 2024');
  const [viewingSlip, setViewingSlip] = useState<EmployeeWithStats | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // For simulation, we add temporary stats to the dynamic employees
  const employeesWithStats: EmployeeWithStats[] = employees.map(emp => ({
    ...emp,
    daysWorked: 22, // Simulated
    overtimeHours: 5 // Simulated
  }));

  const calculateTotal = (emp: EmployeeWithStats) => {
    return (emp.dailyRate * emp.daysWorked) + (emp.overtimeRate * emp.overtimeHours);
  };

  const generateJPG = (emp: EmployeeWithStats) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 750);
    
    ctx.fillStyle = '#005BAB';
    ctx.fillRect(0, 0, 800, 120);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText(companyName.toUpperCase(), 40, 65);
    ctx.font = '20px Inter, sans-serif';
    ctx.fillText(`SLIP GAJI - ${selectedMonth.toUpperCase()}`, 40, 95);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.fillText(emp.name, 40, 170);
    ctx.fillStyle = '#6B7280';
    ctx.font = '18px Inter, sans-serif';
    ctx.fillText(emp.position, 40, 195);

    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 220); ctx.lineTo(760, 220); ctx.stroke();

    ctx.fillStyle = '#374151';
    ctx.font = '18px Inter, sans-serif';
    
    ctx.fillText('Gaji Pokok Harian', 40, 270);
    ctx.fillText(`${emp.daysWorked} Hari x Rp ${emp.dailyRate.toLocaleString()}`, 40, 300);
    ctx.textAlign = 'right';
    ctx.fillText(`Rp ${(emp.dailyRate * emp.daysWorked).toLocaleString()}`, 760, 300);

    ctx.textAlign = 'left';
    ctx.fillText('Lembur (Overtime)', 40, 360);
    ctx.fillText(`${emp.overtimeHours} Jam x Rp ${emp.overtimeRate.toLocaleString()}`, 40, 390);
    ctx.textAlign = 'right';
    ctx.fillText(`Rp ${(emp.overtimeRate * emp.overtimeHours).toLocaleString()}`, 760, 390);

    ctx.beginPath(); ctx.moveTo(40, 440); ctx.lineTo(760, 440); ctx.stroke();

    ctx.fillStyle = '#005BAB';
    ctx.font = 'bold 28px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('TOTAL GAJI BERSIH', 40, 500);
    ctx.textAlign = 'right';
    ctx.fillText(`Rp ${calculateTotal(emp).toLocaleString()}`, 760, 500);

    ctx.fillStyle = '#111827';
    ctx.textAlign = 'left';
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.fillText('Hormat Kami,', 40, 600);
    ctx.fillText(directorName, 40, 700);
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Direktur Utama', 40, 720);

    ctx.textAlign = 'right';
    ctx.fillText('Penerima,', 760, 600);
    ctx.fillText(emp.name, 760, 700);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.download = `Slip_${emp.name}_${selectedMonth}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  const totalBudget = employeesWithStats.reduce((sum, emp) => sum + calculateTotal(emp), 0);

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-20">
      <div className="bg-[#005BAB] p-6 pb-20 text-white">
        <h2 className="text-xl font-bold mb-1">Payroll System</h2>
        <p className="text-sm text-blue-100 mb-6">{companyName}</p>

        <select 
          value={selectedMonth} 
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full bg-white/10 border-none rounded-xl px-4 py-3 text-sm font-bold outline-none"
        >
          <option value="Mei 2024">Mei 2024</option>
          <option value="April 2024">April 2024</option>
          <option value="Maret 2024">Maret 2024</option>
        </select>
      </div>

      <div className="-mt-12 px-4 space-y-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between border border-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Total Budget Gaji</p>
              <p className="text-lg font-bold text-gray-800">Rp {totalBudget.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-green-50 px-3 py-1 rounded-full text-[10px] text-green-600 font-bold flex items-center gap-1">
             <CheckCircle2 className="w-3 h-3" /> Ready
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
          <h3 className="font-bold text-gray-800 text-sm">Rincian Per Karyawan</h3>
          {employeesWithStats.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">Belum ada karyawan untuk diproses.</p>
          ) : (
            employeesWithStats.map((emp, i) => (
              <div key={i} className="flex flex-col p-4 rounded-xl border border-gray-50 bg-gray-50/30">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                    <p className="text-[10px] text-gray-400">{emp.position}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewingSlip(emp)} className="p-2 bg-white rounded-lg text-gray-400 border border-gray-100"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => generateJPG(emp)} className="p-2 bg-[#2AC3E2] text-white rounded-lg shadow-sm"><Download className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-blue-500" />
                    <span className="text-[10px] font-bold text-gray-500">{emp.daysWorked} Hari Kerja</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Plus className="w-3 h-3 text-orange-500" />
                    <span className="text-[10px] font-bold text-gray-500">{emp.overtimeHours} Jam Lembur</span>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs font-black text-[#005BAB]">Estimasi: Rp {calculateTotal(emp).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <canvas ref={canvasRef} width="800" height="750" className="hidden" />

      {viewingSlip && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-[#005BAB] p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold">Preview Slip Gaji</h3>
                <p className="text-[10px] opacity-80">{companyName} - {selectedMonth}</p>
              </div>
              <button onClick={() => setViewingSlip(null)} className="p-2 bg-white/10 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Gaji Pokok ({viewingSlip.daysWorked} Hari)</span>
                  <span className="font-bold text-gray-800">Rp {(viewingSlip.dailyRate * viewingSlip.daysWorked).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Lembur ({viewingSlip.overtimeHours} Jam)</span>
                  <span className="font-bold text-gray-800">Rp {(viewingSlip.overtimeRate * viewingSlip.overtimeHours).toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total Gaji</span>
                  <span className="text-xl font-black text-[#005BAB]">Rp {calculateTotal(viewingSlip).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2 border-t border-dashed border-gray-200 pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Verifikasi Direktur</p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-gray-700">{directorName}</span>
                </div>
              </div>

              <button 
                onClick={() => { generateJPG(viewingSlip); setViewingSlip(null); }}
                className="w-full bg-[#2AC3E2] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
              >
                <Download className="w-5 h-5" /> Cetak JPG Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll;
