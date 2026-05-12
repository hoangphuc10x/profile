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
  NEW: 'bg-amber-100 text-amber-800',
  CONTACTED: 'bg-blue-100 text-blue-800',
  CLOSED: 'bg-slate-200 text-slate-700',
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
      <h1 className="text-xl font-bold">Yêu cầu khách hàng</h1>
      {loading ? (
        <p className="mt-6 text-slate-500">Đang tải...</p>
      ) : items.length === 0 ? (
        <p className="mt-6 text-slate-500">Chưa có yêu cầu nào.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((it) => (
            <div key={it.id} className="rounded border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{it.customerName}</p>
                  <p className="text-sm text-slate-600">
                    {it.phone} {it.email && `· ${it.email}`}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {new Date(it.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <span className={`rounded px-2 py-1 text-xs font-medium ${STATUS_COLOR[it.status]}`}>
                  {STATUS_LABEL[it.status]}
                </span>
              </div>

              {(it.areaRequest || it.budgetRange) && (
                <p className="mt-2 text-sm text-slate-700">
                  {it.areaRequest && <>Diện tích: <strong>{it.areaRequest} m²</strong> </>}
                  {it.budgetRange && <>· Ngân sách: <strong>{it.budgetRange}</strong></>}
                </p>
              )}

              {it.message && (
                <p className="mt-2 whitespace-pre-line text-sm text-slate-800">{it.message}</p>
              )}

              <div className="mt-3 flex gap-2 text-sm">
                <select
                  value={it.status}
                  onChange={(e) => updateStatus(it.id, e.target.value as Inquiry['status'])}
                  className="rounded border px-2 py-1"
                >
                  <option value="NEW">Mới</option>
                  <option value="CONTACTED">Đã liên hệ</option>
                  <option value="CLOSED">Đóng</option>
                </select>
                <button onClick={() => remove(it.id)} className="text-red-600 hover:underline">
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
