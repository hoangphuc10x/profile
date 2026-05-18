'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

type Props = {
  architectSlug: string;
};

export function InlineInquiryForm({ architectSlug }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSending(true);
    try {
      await api.createInquiry({
        architectSlug,
        customerName: name,
        phone,
        email: email || undefined,
        message: message || undefined,
      });
      setDone(true);
    } catch {
      setError('Không gửi được. Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="dark:bg-sage-950/40 mt-4 rounded-lg border border-sage-200 bg-sage-50 px-4 py-6 text-center text-sm text-sage-700 dark:border-sage-900 dark:text-sage-300">
        Đã gửi yêu cầu — kiến trúc sư sẽ liên hệ bạn sớm.
      </div>
    );
  }

  const field =
    'w-full border-0 border-b border-slate-300 bg-transparent px-0 py-2 text-sm outline-none placeholder:text-slate-400 focus:border-sage-500 dark:border-slate-700 dark:text-slate-100 dark:focus:border-sage-300';

  return (
    <form onSubmit={submit} className="mt-5 space-y-4">
      <input
        className={field}
        placeholder="Tên của bạn"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
      />
      <input
        className={field}
        placeholder="Số điện thoại"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        pattern="[0-9+\-\s()]{8,20}"
      />
      <input
        type="email"
        className={field}
        placeholder="Email liên hệ"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className={field}
        placeholder="Dự án mong muốn"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={sending}
        className="group mt-2 inline-flex w-full items-center justify-between rounded-full bg-ink-950 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-ink-900 disabled:opacity-60 dark:bg-white dark:text-ink-950 dark:hover:bg-slate-100"
      >
        <span>{sending ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}</span>
        <span className="transition group-hover:translate-x-1">→</span>
      </button>
    </form>
  );
}
