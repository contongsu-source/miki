
import React, { useState } from 'react';
import { Users, Plus, Trash2, X, UserPlus, Briefcase, Banknote, Clock, Edit3, QrCode as QrIcon } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeManagementProps {
  employees: Employee[];
  onAdd: (emp: Employee) => void;
  onUpdate: (emp: Employee) => void;
  onDelete: (id: string) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ employees, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState<Employee | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    position: '',
    dailyRate: 0,
    overtimeRate: 0
  });

  const handleOpenAdd = () => {
    setEditMode(false);
    setFormData({ name: '', position: '', dailyRate: 0, overtimeRate: 0 });
    setShowModal(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditMode(true);
    setFormData(emp);
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.position) return;
    
    if (editMode && formData.id) {
      onUpdate(formData as Employee);
    } else {
      const employee: Employee = {
        id: `EMP-${Date.now()}`,
        name: formData.name || '',
        position: formData.position || '',
        dailyRate: Number(formData.dailyRate) || 0,
        overtimeRate: Number(formData.overtimeRate) || 0
      };
      onAdd(employee);
    }
    setShowModal(false);
  };

  return (
    <div className="animate-in slide-in-from-right duration-300 pb-24">
      <div className="bg-[#005BAB] p-6 pb-20 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manajemen Karyawan</h2>
          <button 
            onClick={handleOpenAdd}
            className="bg-[#2AC3E2] p-2 rounded-xl shadow-lg active:scale-95 transition-transform"
          >
            <UserPlus className="w-6 h-6" />
          </button>
        </div>
        <p className="text-sm text-blue-100">Total: {employees.length} Karyawan Aktif</p>
      </div>

      <div className="-mt-12 px-4 space-y-4">
        {employees.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Belum ada karyawan</p>
            <button 
              onClick={handleOpenAdd}
              className="mt-4 text-[#005BAB] font-bold text-sm"
            >
              Tambah Sekarang
            </button>
          </div>
        ) : (
          employees.map(emp => (
            <div key={emp.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 border border-transparent hover:border-blue-100 transition-all group">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-bold">
                {emp.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{emp.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold">{emp.position}</p>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setShowQrModal(emp)}
                  className="p-2 text-cyan-500 hover:bg-cyan-50 rounded-lg transition-colors"
                >
                  <QrIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleOpenEdit(emp)}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDelete(emp.id)}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end justify-center animate-in slide-in-from-bottom duration-300">
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{editMode ? 'Edit Karyawan' : 'Tambah Karyawan'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-500"><X /></button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Nama Lengkap</label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500">
                  <Users className="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Contoh: John Doe" 
                    className="bg-transparent w-full text-sm outline-none"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Jabatan / Posisi</label>
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Contoh: Manager" 
                    className="bg-transparent w-full text-sm outline-none"
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Gaji / Hari</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500">
                    <Banknote className="w-5 h-5 text-gray-400" />
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="bg-transparent w-full text-sm outline-none"
                      value={formData.dailyRate}
                      onChange={e => setFormData({...formData, dailyRate: Number(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Lembur / Jam</label>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 focus-within:border-blue-500">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <input 
                      type="number" 
                      placeholder="0" 
                      className="bg-transparent w-full text-sm outline-none"
                      value={formData.overtimeRate}
                      onChange={e => setFormData({...formData, overtimeRate: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={handleSubmit}
                className="w-full bg-[#005BAB] text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-100 active:scale-95 transition-transform"
              >
                {editMode ? 'Simpan Perubahan' : 'Simpan Karyawan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center space-y-6 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-2">
              <div className="text-left">
                <h3 className="font-bold text-gray-800">QR Absensi</h3>
                <p className="text-[10px] text-gray-400">{showQrModal.name}</p>
              </div>
              <button onClick={() => setShowQrModal(null)} className="p-2 bg-gray-100 rounded-full text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-4 border-2 border-dashed border-gray-100 rounded-3xl mx-auto inline-block">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${showQrModal.id}`} 
                alt="Employee QR" 
                className="w-48 h-48" 
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-2xl text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              ID: {showQrModal.id}
            </div>

            <p className="text-xs text-gray-400 leading-relaxed px-4">
              Gunakan kode ini untuk melakukan absensi melalui mesin scan atau kamera admin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
