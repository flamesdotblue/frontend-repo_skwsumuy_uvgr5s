import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

export default function AlertsPanel({ medicines }) {
  const today = new Date();
  const lowStock = medicines.filter(m => m.stock <= m.reorderLevel);
  const expired = medicines.filter(m => new Date(m.expiryDate) < today);

  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-amber-800">
        <AlertTriangle size={18} />
        <h2 className="text-sm font-semibold">Auto Alerts</h2>
      </div>
      {lowStock.length === 0 && expired.length === 0 ? (
        <p className="text-xs text-amber-700">All good! No low-stock or expired medicines.</p>
      ) : (
        <div className="space-y-3">
          {lowStock.length > 0 && (
            <div>
              <div className="mb-1 text-xs font-medium text-amber-800">Low stock</div>
              <ul className="space-y-1">
                {lowStock.map(m => (
                  <li key={m.id} className="flex items-center justify-between rounded-lg bg-white p-2 text-xs">
                    <span className="font-medium text-gray-800">{m.name}</span>
                    <span className="text-amber-700">{m.stock} in stock (reorder ≤ {m.reorderLevel})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {expired.length > 0 && (
            <div>
              <div className="mb-1 text-xs font-medium text-rose-800">Expired</div>
              <ul className="space-y-1">
                {expired.map(m => (
                  <li key={m.id} className="flex items-center justify-between rounded-lg bg-white p-2 text-xs">
                    <span className="font-medium text-gray-800">{m.name}</span>
                    <span className="flex items-center gap-1 text-rose-700"><Clock size={14} /> expired {new Date(m.expiryDate).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
