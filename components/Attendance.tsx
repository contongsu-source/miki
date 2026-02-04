
import React, { useState, useRef, useEffect } from 'react';
import { QrCode, ClipboardList, CheckCircle2, Camera, X, User, AlertCircle, Clock } from 'lucide-react';
import { Employee } from '../types';

interface AttendanceProps {
  employees: Employee[];
}

const Attendance: React.FC<AttendanceProps> = ({ employees }) => {
  const [tab, setTab] = useState<'qr' | 'manual' | 'scan'>('qr');
  const [statusMsg, setStatusMsg] = useState<{title: string, body: string, type: 'success' | 'error' | 'warning'} | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (tab === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [tab]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const validateAttendance = (type: 'masuk' | 'pulang') => {
    const now = new Date();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const timeValue = hours * 60 + mins;

    if (type === 'masuk') {
      // 07:30 = 450, 08:15 = 495
      if (timeValue < 450) {
        setStatusMsg({ title: "Terlalu Pagi", body: "Absen masuk baru dibuka pukul 07:30 WIB.", type: 'warning' });
        return false;
      }
      if (timeValue > 495) {
        setStatusMsg({ title: "Sesi Berakhir", body: "Batas absen masuk adalah pukul 08:15 WIB.", type: 'error' });
        return false;
      }
    } else {
      // 15:45 = 945, 16:15 = 975
      if (timeValue < 945) {
        setStatusMsg({ title: "Belum Waktunya", body: "Absen pulang baru dibuka pukul 15:45 WIB.", type: 'warning' });
        return false;
      }
      if (timeValue > 975) {
        setStatusMsg({ title: "Sesi Berakhir", body: "Batas absen pulang adalah pukul 16:15 WIB.", type: 'error' });
        return false;
      }
    }
    return true;
  };

  const handleAttendance = (actionType: 'masuk' | 'pulang', empId: string) => {
    if (!empId) {
      setStatusMsg({ title: "Error", body: "Silakan pilih karyawan terlebih dahulu.", type: 'error' });
      return;
    }

    if (!validateAttendance(actionType)) return;

    const emp = employees.find(e => e.id === empId);
    let overtimeText = "";
    
    if (actionType === 'pulang') {
      const now = new Date();
      // Overtime logic: Scans after 16:00
      if (now.getHours() >= 16) {
        const otHours = now.getHours() - 16;
        if (otHours > 0) {
          overtimeText = ` Lembur ${otHours} jam terhitung.`;
        }
      }
    }

    setStatusMsg({ 
      title: "Absensi Berhasil!", 
      body: `Absen ${actionType} untuk ${emp?.name} telah tersimpan.${overtimeText}`, 
      type: 'success' 
    });
    
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="bg-[#005BAB] text-white p-6 pb-20">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-xl font-bold">Kehadiran</h2>
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
            <Clock className="w-3 h-3" /> {formatTime(currentTime)}
          </div>
        </div>
        <p className="text-blue-100 text-sm">Patuhi jam operasional perusahaan</p>
      </div>

      <div className="-mt-12 px-4 space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-1 flex">
          <button 
            onClick={() => setTab('qr')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${tab === 'qr' ? 'bg-[#005BAB] text-white' : 'text-gray-500'}`}
          >
            <QrCode className="w-4 h-4" /> QR Saya
          </button>
          <button 
            onClick={() => setTab('scan')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${tab === 'scan' ? 'bg-[#005BAB] text-white' : 'text-gray-500'}`}
          >
            <Camera className="w-4 h-4" /> Scan QR
          </button>
          <button 
            onClick={() => setTab('manual')}
            className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all ${tab === 'manual' ? 'bg-[#005BAB] text-white' : 'text-gray-500'}`}
          >
            <ClipboardList className="w-4 h-4" /> Manual
          </button>
        </div>

        {/* Rule Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <div className="text-[10px] text-blue-700 space-y-1">
            <p><span className="font-bold">Masuk:</span> 07:30 - 08:15 WIB</p>
            <p><span className="font-bold">Pulang:</span> 15:45 - 16:15 WIB</p>
            <p className="opacity-80 italic">* Lewat pukul 16:00 dihitung lembur per jam.</p>
          </div>
        </div>

        {tab === 'qr' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
            <p className="font-bold text-gray-800 mb-2">Pilih Identitas Anda</p>
            <select 
              className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm mb-6 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedEmp(e.target.value)}
              value={selectedEmp}
            >
              <option value="">-- Pilih Karyawan --</option>
              {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            
            {selectedEmp ? (
              <>
                <div className="p-4 border-2 border-dashed border-gray-200 rounded-3xl mb-6">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedEmp}`} alt="QR" className="w-48 h-48" />
                </div>
                <div className="bg-blue-50 p-4 rounded-xl w-full flex items-center gap-4 border border-blue-100">
                  <div className="p-2 bg-blue-500 rounded-lg text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-blue-900">{employees.find(e => e.id === selectedEmp)?.name}</p>
                    <p className="text-[10px] text-blue-700">Tunjukkan QR ini ke admin</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-gray-400">
                 <QrCode className="w-12 h-12 mx-auto mb-2 opacity-20" />
                 <p className="text-xs">QR akan muncul setelah memilih nama</p>
              </div>
            )}
          </div>
        )}

        {tab === 'scan' && (
          <div className="bg-black rounded-2xl overflow-hidden shadow-sm relative aspect-square flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
              <div className="w-full h-full border-2 border-white/50 rounded-lg relative">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
              </div>
            </div>
            
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 px-6">
              <button 
                onClick={() => handleAttendance('masuk', '1')} 
                className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg active:scale-95"
              >
                Scan Masuk
              </button>
              <button 
                onClick={() => handleAttendance('pulang', '1')} 
                className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg active:scale-95"
              >
                Scan Pulang
              </button>
            </div>
          </div>
        )}

        {tab === 'manual' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4 animate-in slide-in-from-bottom duration-300">
            <h3 className="font-bold text-gray-800">Input Manual</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Pilih Karyawan</label>
                <select 
                  className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => setSelectedEmp(e.target.value)}
                  value={selectedEmp}
                >
                  <option value="">-- Cari Nama --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleAttendance('masuk', selectedEmp)}
                  className="py-4 bg-green-50 text-green-700 border border-green-100 rounded-xl text-xs font-bold active:bg-green-100 transition-colors"
                >
                  Absen Masuk
                </button>
                <button 
                  onClick={() => handleAttendance('pulang', selectedEmp)}
                  className="py-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-xs font-bold active:bg-red-100 transition-colors"
                >
                  Absen Pulang
                </button>
              </div>
            </div>
          </div>
        )}

        {statusMsg && (
          <div className={`fixed top-10 left-4 right-4 text-white px-6 py-4 rounded-2xl shadow-2xl z-[150] flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300 ${statusMsg.type === 'success' ? 'bg-green-500' : statusMsg.type === 'warning' ? 'bg-orange-500' : 'bg-red-500'}`}>
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <AlertCircle className="w-6 h-6 shrink-0" />}
            <div className="flex-1">
              <p className="font-bold text-sm">{statusMsg.title}</p>
              <p className="text-[10px] opacity-90">{statusMsg.body}</p>
            </div>
            <button onClick={() => setStatusMsg(null)} className="opacity-70"><X className="w-4 h-4" /></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
