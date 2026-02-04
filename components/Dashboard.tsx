
import React from 'react';
import { 
  Bell, 
  Wallet, 
  Star, 
  ArrowRight,
  Zap,
  Globe,
  Search,
  FileSpreadsheet,
  Receipt,
  UserCheck,
  CreditCard,
  PlusCircle,
  MoreHorizontal,
  Calculator,
  Users
} from 'lucide-react';
import { AppScreen } from '../App';

interface DashboardProps {
  onNavigate: (screen: AppScreen) => void;
  companyName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, companyName }) => {
  return (
    <div className="flex flex-col animate-in fade-in duration-500">
      {/* Top Background & Header */}
      <div className="h-48 bg-[#005BAB] rounded-b-[40px] relative px-6 pt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-white text-xs font-bold">HR</span>
            </div>
            <div>
              <span className="text-white font-semibold block leading-none">Halo, Admin</span>
              <span className="text-blue-200 text-[10px]">{companyName}</span>
            </div>
          </div>
          <button className="text-white p-2">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        {/* Floating Balance Card */}
        <div className="absolute left-6 right-6 top-24 bg-white rounded-2xl p-4 shadow-xl flex items-center divide-x divide-gray-100">
          <div className="flex-1 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wallet className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Saldo Perusahaan</p>
              <p className="text-sm font-bold">Rp 45.200.000</p>
            </div>
          </div>
          <div className="px-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Loyalty</p>
              <p className="text-sm font-bold">1.250</p>
            </div>
          </div>
          <div className="pl-4 flex flex-col items-center">
             <button className="p-2 bg-gray-50 rounded-full">
               <ArrowRight className="w-4 h-4 text-gray-400" />
             </button>
             <span className="text-[10px] text-gray-400 mt-1">Explore</span>
          </div>
        </div>
      </div>

      {/* Main Grid Navigation */}
      <div className="mt-20 px-6 grid grid-cols-4 gap-y-6">
        <FeatureItem 
          icon={<Zap className="text-blue-500" />} 
          label="Absensi QR" 
          onClick={() => onNavigate(AppScreen.ATTENDANCE)} 
        />
        <FeatureItem 
          icon={<Globe className="text-indigo-500" />} 
          label="Keuangan" 
          onClick={() => onNavigate(AppScreen.FINANCE)} 
        />
        <FeatureItem 
          icon={<Users className="text-cyan-500" />} 
          label="Karyawan" 
          onClick={() => onNavigate(AppScreen.EMPLOYEES)} 
        />
        <FeatureItem 
          icon={<Calculator className="text-red-500" />} 
          label="Slip Gaji" 
          onClick={() => onNavigate(AppScreen.PAYROLL)} 
        />
        
        <FeatureItem 
          icon={<Receipt className="text-blue-500" />} 
          label="Invoice" 
          onClick={() => onNavigate(AppScreen.BILLING)} 
        />
        <FeatureItem 
          icon={<CreditCard className="text-emerald-500" />} 
          label="Pengeluaran" 
          onClick={() => onNavigate(AppScreen.FINANCE)} 
        />
        <FeatureItem 
          icon={<UserCheck className="text-orange-500" />} 
          label="Absen Manual" 
          onClick={() => onNavigate(AppScreen.ATTENDANCE)} 
        />
        <FeatureItem 
          icon={<PlusCircle className="text-purple-500" />} 
          label="Lainnya" 
          onClick={() => onNavigate(AppScreen.SETTINGS)} 
        />
      </div>

      {/* Promotions Section */}
      <div className="mt-8 px-6 mb-4">
        <h3 className="font-bold text-gray-800 mb-4">Update Terbaru</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="min-w-[280px] h-32 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 text-white relative overflow-hidden flex flex-col justify-end">
            <div className="absolute top-2 right-2 opacity-10">
              <FileSpreadsheet className="w-24 h-24" />
            </div>
            <p className="text-xs opacity-80 uppercase font-bold mb-1">Fitur Baru</p>
            <h4 className="font-bold text-lg leading-tight">Export Laporan Kas ke PDF</h4>
          </div>
          <div className="min-w-[280px] h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white relative overflow-hidden flex flex-col justify-end">
            <p className="text-xs opacity-80 uppercase font-bold mb-1">Pengingat</p>
            <h4 className="font-bold text-lg leading-tight">Batas Akhir Payroll 25/08</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-2 active:scale-95 transition-transform group">
    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
      {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
    </div>
    <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight px-1">{label}</span>
  </button>
);

export default Dashboard;
