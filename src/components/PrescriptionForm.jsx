import React, { useMemo, useState } from 'react';
import { Plus, FileText, Calendar } from 'lucide-react';

export default function PrescriptionForm({ medicines, customers, onCreate }) {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([{ medicineId: medicines[0]?.id || '', qty: 1 }]);
  const [note, setNote] = useState('');

  const total = useMemo(() => {
    return items.reduce((sum, it) => {
      const med = medicines.find(m => m.id === it.medicineId);
      return sum + (med ? med.price * (Number(it.qty) || 0) : 0);
    }, 0);
  }, [items, medicines]);

  const addItem = () => {
    setItems(prev => [...prev, { medicineId: medicines[0]?.id || '', qty: 1 }]);
  };

  const updateItem = (index, patch) => {
    setItems(prev => prev.map((it, i) => (i === index ? { ...it, ...patch } : it)));
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      id: crypto.randomUUID(),
      customerId,
      date,
      items: items.map(it => ({ ...it, qty: Number(it.qty) || 0 })),
      note,
      total,
    };
    onCreate?.(payload);
    // reset
    setItems([{ medicineId: medicines[0]?.id || '', qty: 1 }]);
    setNote('');
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-2 border-b border-gray-100 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100">
          <FileText className="text-violet-700" size={18} />
        </div>
        <h2 className="text-sm font-semibold text-gray-900">New Prescription</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-gray-500">Customer</label>
            <select
              value={customerId}
              onChange={e => setCustomerId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-2 text-sm outline-none ring-violet-500 focus:ring-2"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Date</label>
            <div className="relative">
              <Calendar size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none ring-violet-500 focus:ring-2"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">Note</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Optional instruction"
              className="w-full rounded-lg border border-gray-200 p-2 text-sm outline-none ring-violet-500 focus:ring-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-gray-600">Items</div>
            <button type="button" onClick={addItem} className="inline-flex items-center gap-1 rounded-lg bg-violet-600 px-2 py-1 text-xs font-medium text-white hover:bg-violet-700">
              <Plus size={14} /> Add Item
            </button>
          </div>
          <div className="space-y-2">
            {items.map((it, idx) => {
              const med = medicines.find(m => m.id === it.medicineId);
              const maxQty = med ? med.stock : 0;
              return (
                <div key={idx} className="grid grid-cols-1 gap-2 rounded-lg border border-gray-200 p-3 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Medicine</label>
                    <select
                      value={it.medicineId}
                      onChange={e => updateItem(idx, { medicineId: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                    >
                      {medicines.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} — ${m.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      max={maxQty}
                      value={it.qty}
                      onChange={e => updateItem(idx, { qty: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm"
                    />
                    {med && (
                      <p className="mt-1 text-[10px] text-gray-500">In stock: {med.stock}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-500">Line Total</label>
                    <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-2 text-sm">
                      <span>${med ? (med.price * (Number(it.qty) || 0)).toFixed(2) : '0.00'}</span>
                      <button type="button" onClick={() => removeItem(idx)} className="text-xs text-rose-600 hover:underline">Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="text-xs text-gray-500">Total</div>
          <div className="text-base font-semibold text-gray-900">${total.toFixed(2)}</div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700">
            Save Prescription
          </button>
        </div>
      </form>
    </section>
  );
}
