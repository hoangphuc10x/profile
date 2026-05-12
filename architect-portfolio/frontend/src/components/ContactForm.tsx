'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export function ContactForm() {
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    areaRequest: '',
    budgetRange: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError(null);
    try {
      await api.createInquiry({
        customerName: form.customerName,
        phone: form.phone,
        email: form.email || undefined,
        areaRequest: form.areaRequest ? Number(form.areaRequest) : undefined,
        budgetRange: form.budgetRange || undefined,
        message: form.message || undefined,
      });
      setStatus('sent');
      setForm({ customerName: '', phone: '', email: '', areaRequest: '', budgetRange: '', message: '' });
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'Gửi thất bại');
    }
  }

  const input = 'w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-brand-accent';

  if (status === 'sent') {
    return (
      <div className="rounded border border-green-200 bg-green-50 p-6 text-green-800">
        <p className="font-medium">Đã gửi yêu cầu của bạn!</p>
        <p className="mt-1 text-sm">Kiến trúc sư sẽ liên hệ lại sớm. Cảm ơn bạn.</p>
        <button onClick={() => setStatus('idle')} className="mt-3 text-sm underline">
          Gửi thêm yêu cầu
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Họ và tên *</span>
          <input
            required
            className={input}
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Số điện thoại *</span>
          <input
            required
            className={input}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            type="email"
            className={input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Diện tích dự kiến (m²)</span>
          <input
            type="number"
            min="0"
            className={input}
            value={form.areaRequest}
            onChange={(e) => setForm({ ...form, areaRequest: e.target.value })}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Ngân sách dự kiến</span>
          <input
            className={input}
            placeholder="VD: 1.5 - 2 tỷ"
            value={form.budgetRange}
            onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Yêu cầu / Câu hỏi</span>
        <textarea
          rows={4}
          className={input}
          placeholder="Bạn muốn xây nhà như thế nào? Phong cách, công năng..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded bg-brand px-5 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {status === 'sending' ? 'Đang gửi...' : 'Gửi yêu cầu'}
      </button>
    </form>
  );
}
