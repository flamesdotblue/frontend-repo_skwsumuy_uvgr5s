import React, { useMemo, useState } from 'react';
import { Search, Package, Trash2, Edit } from 'lucide-react';

export default function InventoryTable({ medicines, onDelete, onEdit }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return medicines;
    return medicines.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q) ||
      m.sku.toLowerCase().includes(q)
    );
  }, [query, medicines]);

  return (
    <section className="rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
            <Package className="text-emerald-700" size={18} />
          </div>
          <h2 className="text-sm font-semibold text-gray-900">Inventory</h2>
        </div>
        <div className="relative w-64">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name, category, SKU"
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none ring-emerald-500 focus:ring-2"
          />
        </div>
      </div>
      <div className="max-h-[340px] overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">SKU</th>
              <th className="px-4 py-2">Expiry</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Reorder</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => {
              const isLow = m.stock <= m.reorderLevel;
              const isExpired = new Date(m.expiryDate) < new Date();
              return (
                <tr key={m.id} className="border-t text-gray-700">
                  <td className="px-4 py-2 font-medium">{m.name}</td>
                  <td className="px-4 py-2">{m.category}</td>
                  <td className="px-4 py-2">{m.sku}</td>
                  <td className={`px-4 py-2 ${isExpired ? 'text-rose-600 font-medium' : ''}`}>{new Date(m.expiryDate).toLocaleDateString()}</td>
                  <td className={`px-4 py-2 ${isLow ? 'text-amber-600 font-medium' : ''}`}>{m.stock}</td>
                  <td className="px-4 py-2">{m.reorderLevel}</td>
                  <td className="px-4 py-2">${m.price.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => onEdit?.(m)} className="rounded-md border border-gray-200 p-1 hover:bg-gray-50" aria-label="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => onDelete?.(m.id)} className="rounded-md border border-gray-200 p-1 text-rose-600 hover:bg-rose-50" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
