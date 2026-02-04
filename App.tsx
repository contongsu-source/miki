
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Clock, 
  Wallet, 
  FileText, 
  User, 
  QrCode, 
  Plus,
  ArrowRightLeft,
  Settings as SettingsIcon,
  Bell,
  Search,
  ChevronRight,
  Users
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';
import Finance from './components/Finance';
import Billing from './components/Billing';
import Payroll from './components/Payroll';
import Settings from './components/Settings';
import EmployeeManagement from './components/EmployeeManagement';
import { CompanySettings, Employee } from './types';

export enum AppScreen {
  DASHBOARD = 'dashboard',
  ATTENDANCE = 'attendance',
  FINANCE = 'finance',
  BILLING = 'billing',
  PAYROLL = 'payroll',
  ACCOUNT = 'account',
  SETTINGS = 'settings',
  EMPLOYEES = 'employees'
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.DASHBOARD);
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: 'PT. Solusi Digital',
    directorName: 'Budi Santoso'
  });

  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    // Load Settings
    const savedSettings = localStorage.getItem('app_settings');
    if (savedSettings) {
      setCompanySettings(JSON.parse(savedSettings));
    }

    // Load Employees
    const savedEmployees = localStorage.getItem('app_employees');
    if (savedEmployees) {
      setEmployees(JSON.parse(savedEmployees));
    } else {
      // Default initial data if empty
      const initialEmployees: Employee[] = [
        { id: '1', name: 'Budi Santoso', position: 'Fullstack Dev', dailyRate: 500000, overtimeRate: 50000 },
        { id: '2', name: 'Ani Wijaya', position: 'UI/UX Designer', dailyRate: 400000, overtimeRate: 40000 },
      ];
      setEmployees(initialEmployees);
      localStorage.setItem('app_employees', JSON.stringify(initialEmployees));
    }
  }, []);

  const handleUpdateSettings = (newSettings: CompanySettings) => {
    setCompanySettings(newSettings);
    localStorage.setItem('app_settings', JSON.stringify(newSettings));
  };

  const handleAddEmployee = (emp: Employee) => {
    const updated = [...employees, emp];
    setEmployees(updated);
    localStorage.setItem('app_employees', JSON.stringify(updated));
  };

  const handleUpdateEmployee = (emp: Employee) => {
    const updated = employees.map(e => e.id === emp.id ? emp : e);
    setEmployees(updated);
    localStorage.setItem('app_employees', JSON.stringify(updated));
  };

  const handleDeleteEmployee = (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    localStorage.setItem('app_employees', JSON.stringify(updated));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.DASHBOARD:
        return <Dashboard onNavigate={setCurrentScreen} companyName={companySettings.companyName} />;
      case AppScreen.ATTENDANCE:
        return <Attendance employees={employees} />;
      case AppScreen.FINANCE:
        return <Finance />;
      case AppScreen.BILLING:
        return <Billing />;
      case AppScreen.PAYROLL:
        return (
          <Payroll 
            directorName={companySettings.directorName} 
            companyName={companySettings.companyName} 
            employees={employees}
          />
        );
      case AppScreen.EMPLOYEES:
        return (
          <EmployeeManagement 
            employees={employees} 
            onAdd={handleAddEmployee} 
            onUpdate={handleUpdateEmployee}
            onDelete={handleDeleteEmployee} 
          />
        );
      case AppScreen.SETTINGS:
        return <Settings settings={companySettings} onUpdate={handleUpdateSettings} />;
      case AppScreen.ACCOUNT:
        return <Settings settings={companySettings} onUpdate={handleUpdateSettings} />;
      default:
        return <div className="p-8 text-center text-gray-500">Screen under construction</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F5F9] max-w-md mx-auto relative shadow-2xl overflow-hidden">
      {/* Dynamic Screen Content */}
      <main className="flex-1 pb-24 overflow-y-auto">
        {renderScreen()}
      </main>

      {/* Floating Action Button (Central Scan) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <button 
          onClick={() => setCurrentScreen(AppScreen.ATTENDANCE)}
          className="w-16 h-16 bg-[#2AC3E2] rounded-full flex items-center justify-center shadow-lg border-4 border-white active:scale-95 transition-transform"
        >
          <QrCode className="text-white w-8 h-8" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-4 py-2 flex justify-between items-center z-40">
        <button 
          onClick={() => setCurrentScreen(AppScreen.DASHBOARD)}
          className={`flex flex-col items-center gap-1 ${currentScreen === AppScreen.DASHBOARD ? 'text-[#005BAB]' : 'text-gray-400'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-medium">Beranda</span>
        </button>
        <button 
          onClick={() => setCurrentScreen(AppScreen.EMPLOYEES)}
          className={`flex flex-col items-center gap-1 ${currentScreen === AppScreen.EMPLOYEES ? 'text-[#005BAB]' : 'text-gray-400'}`}
        >
          <Users className="w-6 h-6" />
          <span className="text-[10px] font-medium">Karyawan</span>
        </button>
        <div className="w-16" /> {/* Spacer for FAB */}
        <button 
          onClick={() => setCurrentScreen(AppScreen.BILLING)}
          className={`flex flex-col items-center gap-1 ${currentScreen === AppScreen.BILLING ? 'text-[#005BAB]' : 'text-gray-400'}`}
        >
          <FileText className="w-6 h-6" />
          <span className="text-[10px] font-medium">Tagihan</span>
        </button>
        <button 
          onClick={() => setCurrentScreen(AppScreen.SETTINGS)}
          className={`flex flex-col items-center gap-1 ${currentScreen === AppScreen.SETTINGS ? 'text-[#005BAB]' : 'text-gray-400'}`}
        >
          <SettingsIcon className="w-6 h-6" />
          <span className="text-[10px] font-medium">Pengaturan</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
