
import React, { useState } from 'react';
import { 
  Building2, 
  UserCircle, 
  Save, 
  Database, 
  Upload, 
  Download, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CompanySettings } from '../types';

interface SettingsProps {
  settings: CompanySettings;
  onUpdate: (newSettings: CompanySettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState(settings);
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = () => {
    onUpdate(formData);
    setStatus('Pengaturan berhasil disimpan!');
    setTimeout(() => setStatus(null), 3000);
  };

  const handleExport = () => {
    const data = {
      settings,
      transactions: localStorage.getItem('app_transactions'),
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_business_${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.settings) onUpdate(data.settings);
        if (data.transactions) localStorage.setItem('app_transactions', data.transactions);
        alert('Data berhasil diimport!');
        window.location.reload();
      } catch (err) {
        alert('Gagal mengimport data. File tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom duration-300 pb-24 px-6 pt-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Pengaturan</h2>
        <p className="text-sm text-gray-500">Kelola identitas perusahaan & data aplikasi</p>
      </div>

      <div className="space-y-6">
        {/* Company Identity */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-[#005BAB]">
            <Building2 className="w-5 h-5" />
            <h3 className="font-bold">Identitas Perusahaan</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nama Perusahaan</label>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500 transition-colors">
                <Building2 className="text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={e => setFormData({...formData, companyName: e.target.value})}
                  className="bg-transparent w-full text-sm outline-none font-medium" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nama Direktur</label>
              <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500 transition-colors">
                <UserCircle className="text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={formData.directorName}
                  onChange={e => setFormData({...formData, directorName: e.target.value})}
                  className="bg-transparent w-full text-sm outline-none font-medium" 
                />
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-[#005BAB] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Save className="w-5 h-5" /> Simpan Pengaturan
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 text-[#2AC3E2]">
            <Database className="w-5 h-5" />
            <h3 className="font-bold">Manajemen Data</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={handleExport}
              className="flex flex-col items-center justify-center gap-2 p-6 bg-blue-50 border border-blue-100 rounded-3xl text-blue-600 hover:bg-blue-100 transition-colors"
            >
              <Download className="w-8 h-8" />
              <span className="text-xs font-bold">Backup Data</span>
            </button>

            <label className="cursor-pointer flex flex-col items-center justify-center gap-2 p-6 bg-cyan-50 border border-cyan-100 rounded-3xl text-cyan-600 hover:bg-cyan-100 transition-colors text-center">
              <Upload className="w-8 h-8" />
              <span className="text-xs font-bold">Import Data</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-2xl flex gap-3 border border-yellow-100">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0" />
            <p className="text-[10px] text-yellow-700 leading-relaxed font-medium">
              Import data akan menimpa seluruh data saat ini termasuk riwayat transaksi dan pengaturan perusahaan. Pastikan file backup valid.
            </p>
          </div>
        </section>

        {/* Status Toast */}
        {status && (
          <div className="bg-green-500 text-white p-4 rounded-2xl flex items-center gap-3 shadow-xl animate-in fade-in slide-in-from-top duration-300">
            <ShieldCheck className="w-6 h-6" />
            <span className="font-bold text-sm">{status}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
