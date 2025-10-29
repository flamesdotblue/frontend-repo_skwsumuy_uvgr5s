import React, { useMemo, useState } from 'react';
import Header from './components/Header';
import AlertsPanel from './components/AlertsPanel';
import InventoryTable from './components/InventoryTable';
import PrescriptionForm from './components/PrescriptionForm';

function seedData() {
  const medicines = [
    { id: 'm1', name: 'Paracetamol 500mg', category: 'Analgesic', sku: 'PARA-500', expiryDate: '2025-02-01', stock: 18, reorderLevel: 20, price: 1.2 },
    { id: 'm2', name: 'Amoxicillin 250mg', category: 'Antibiotic', sku: 'AMOX-250', expiryDate: '2024-08-10', stock: 8, reorderLevel: 10, price: 2.5 },
    { id: 'm3', name: 'Vitamin C 1000mg', category: 'Supplement', sku: 'VITC-1000', expiryDate: '2023-12-01', stock: 42, reorderLevel: 15, price: 0.9 },
    { id: 'm4', name: 'Omeprazole 20mg', category: 'Gastro', sku: 'OMEP-20', expiryDate: '2026-04-20', stock: 6, reorderLevel: 12, price: 3.0 },
  ];

  const suppliers = [
    { id: 's1', name: 'MediSupply Co.', contact: 'medisupply@example.com' },
    { id: 's2', name: 'HealthHub Distributors', contact: 'sales@healthhub.com' },
  ];

  const customers = [
    { id: 'c1', name: 'John Carter' },
    { id: 'c2', name: 'Sarah Lee' },
  ];

  return { medicines, suppliers, customers };
}

export default function App() {
  const initial = useMemo(seedData, []);
  const [medicines, setMedicines] = useState(initial.medicines);
  const [customers] = useState(initial.customers);
  const [prescriptions, setPrescriptions] = useState([]);

  const stats = {
    medicines: medicines.length,
    customers: customers.length,
    prescriptions: prescriptions.length,
  };

  const handleCreatePrescription = (rx) => {
    // Reduce stock accordingly
    const newMeds = medicines.map(m => {
      const line = rx.items.find(it => it.medicineId === m.id);
      if (!line) return m;
      const reduced = Math.max(0, m.stock - (Number(line.qty) || 0));
      return { ...m, stock: reduced };
    });
    setMedicines(newMeds);
    setPrescriptions(prev => [rx, ...prev]);
  };

  const handleDeleteMedicine = (id) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  const handleEditMedicine = (med) => {
    const nextStock = prompt(`Update stock for ${med.name}`, String(med.stock));
    if (nextStock === null) return;
    const parsed = Number(nextStock);
    if (Number.isNaN(parsed)) return alert('Please enter a valid number');
    setMedicines(prev => prev.map(m => (m.id === med.id ? { ...m, stock: parsed } : m)));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header stats={stats} />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <InventoryTable medicines={medicines} onDelete={handleDeleteMedicine} onEdit={handleEditMedicine} />
          </div>
          <div className="md:col-span-1">
            <AlertsPanel medicines={medicines} />
          </div>
        </div>

        <PrescriptionForm medicines={medicines} customers={customers} onCreate={handleCreatePrescription} />

        <section className="rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-4">
            <h2 className="text-sm font-semibold text-gray-900">Recent Prescriptions</h2>
          </div>
          {prescriptions.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No prescriptions yet. Create one above to see it here.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {prescriptions.map(rx => (
                <li key={rx.id} className="p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{customers.find(c => c.id === rx.customerId)?.name || 'Customer'}</div>
                      <div className="text-xs text-gray-500">{new Date(rx.date).toLocaleDateString()} • {rx.items.length} item(s)</div>
                    </div>
                    <div className="text-sm font-semibold">${rx.total.toFixed(2)}</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {rx.items.map((it, i) => {
                      const med = medicines.find(m => m.id === it.medicineId);
                      return (
                        <span key={i} className="mr-3">
                          {med?.name || 'Item'} × {it.qty}
                        </span>
                      );
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
