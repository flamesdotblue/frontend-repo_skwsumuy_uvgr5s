import React from 'react';
import { Package, FileText, Users } from 'lucide-react';

const Stat = ({ icon: Icon, label, value, color = 'text-emerald-600', bg = 'bg-emerald-50' }) => (
  <div className={`flex items-center gap-3 rounded-xl ${bg} p-3`}>
    <div className="rounded-lg bg-white/70 p-2">
      <Icon className={`${color}`} size={20} />
    </div>
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  </div>
);

export default function Header({ stats }) {
  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <Package className="text-emerald-700" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Pharmacy Stock & Prescription</h1>
              <p className="text-xs text-gray-500">Manage inventory, suppliers, and digital prescriptions</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Stat icon={Package} label="Medicines" value={stats.medicines} />
            <Stat icon={Users} label="Customers" value={stats.customers} color="text-blue-600" bg="bg-blue-50" />
            <Stat icon={FileText} label="Prescriptions" value={stats.prescriptions} color="text-violet-600" bg="bg-violet-50" />
          </div>
        </div>
      </div>
    </header>
  );
}
