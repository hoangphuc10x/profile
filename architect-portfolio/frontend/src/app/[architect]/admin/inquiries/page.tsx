'use client';

import { useEffect, useState } from 'react';
import { api, Inquiry } from '@/lib/api';
import { getToken } from '@/lib/auth';

const STATUS_LABEL: Record<Inquiry['status'], string> = {
  NEW: 'Mới',
  CONTACTED: 'Đã liên hệ',
  CLOSED: 'Đóng',
};

const STATUS_COLOR: Record<Inquiry['status'], string> = {
  NEW: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  CONTACTED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  CLOSED: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
};

export default function InquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.withToken(token).listInquiries();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id: string, status: Inquiry['status']) {
    const token = getToken();
    if (!token) return;
    await api.withToken(token).updateInquiryStatus(id, status);
    load();
  }

  async function remove(id: string) {
    if (!confirm('Xoá yêu cầu này?')) return;
    const token = getToken();
    if (!token) return;
    await api.withToken(token).deleteInquiry(id);
    load();
  }

  return (
    <>
      <h1 className="text-lg font-bold uppercase tracking-tight sm:text-xl">Yêu cầu khách hàng</h1>
      {loading ? (
        <p className="mt-6 text-slate-500">Đang tải...</p>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700">
          Chưa có yêu cầu nào.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-ink-950"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold">{it.customerName}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    <a href={`tel:${it.phone}`} className="hover:text-sage-500">
                      {it.phone}
                    </a>
                    {it.email && ` · ${it.email}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(it.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${STATUS_COLOR[it.status]}`}
                >
                  {STATUS_LABEL[it.status]}
                </span>
              </div>

              {(it.areaRequest || it.budgetRange) && (
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {it.areaRequest && (
                    <>
                      Diện tích: <strong>{it.areaRequest} m²</strong>{' '}
                    </>
                  )}
                  {it.budgetRange && (
                    <>
                      · Ngân sách: <strong>{it.budgetRange}</strong>
                    </>
                  )}
                </p>
              )}

              {it.message && (
                <p className="mt-2 whitespace-pre-line text-sm text-slate-800 dark:text-slate-300">
                  {it.message}
                </p>
              )}

              <div className="mt-3 flex gap-2 text-sm">
                <select
                  value={it.status}
                  onChange={(e) => updateStatus(it.id, e.target.value as Inquiry['status'])}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1 dark:border-slate-700 dark:bg-ink-900"
                >
                  <option value="NEW">Mới</option>
                  <option value="CONTACTED">Đã liên hệ</option>
                  <option value="CLOSED">Đóng</option>
                </select>
                <button
                  onClick={() => remove(it.id)}
                  className="text-red-600 hover:underline dark:text-red-400"
                >
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
