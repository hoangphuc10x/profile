'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setToken(res.token);
      router.push('/admin/projects');
    } catch (err: any) {
      setError('Sai email hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  }

  const input = 'w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-brand-accent';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold">Đăng nhập quản trị</h1>
        <p className="mt-1 text-sm text-slate-500">Chỉ dành cho kiến trúc sư.</p>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input
              type="email"
              required
              className={input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Mật khẩu</span>
            <input
              type="password"
              required
              className={input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-brand px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </div>
      </form>
    </div>
  );
}
