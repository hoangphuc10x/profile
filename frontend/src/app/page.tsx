'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api, ArchitectListItem } from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [architects, setArchitects] = useState<ArchitectListItem[]>([]);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .listArchitects()
      .then(setArchitects)
      .catch(() => undefined);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(identifier, password);
      setToken(res.token);
      if (res.user.publicSlug) {
        router.push(`/${res.user.publicSlug}/admin/projects`);
      } else {
        setError('Tài khoản này không có portfolio. Liên hệ admin để được cấp.');
      }
    } catch {
      setError('Sai tài khoản hoặc mật khẩu');
    } finally {
      setLoading(false);
    }
  }

  const input =
    'w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 outline-none focus:border-sage-400 dark:border-slate-700 dark:bg-ink-900 dark:text-slate-100';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-ink-950">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-8">
        <span className="text-lg font-bold tracking-tight">
          Architect<span className="text-sage-500">.</span>
        </span>
        <ThemeToggle />
      </header>

      <main className="container-page flex flex-1 items-center justify-center py-8">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT — login form */}
          <div className="order-2 lg:order-1">
            <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-ink-900 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-sage-500 dark:text-sage-300">
                Đăng nhập
              </p>
              <h1 className="mt-2 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                Trang quản lý
              </h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Dành riêng cho kiến trúc sư. Đăng nhập để quản lý dự án và yêu cầu khách hàng.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Username hoặc Email
                  </span>
                  <input
                    type="text"
                    required
                    autoComplete="username"
                    className={input}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="nguyenlamtung"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Mật khẩu
                  </span>
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    className={input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-sage-500 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white hover:bg-sage-600 disabled:opacity-60"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT — public portfolio links */}
          <div className="order-1 flex flex-col justify-center lg:order-2">
            <p className="text-xs font-bold uppercase tracking-widest text-sage-500 dark:text-sage-300">
              # Khách tham quan
            </p>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight sm:text-4xl">
              Xem portfolio
              <br />
              kiến trúc sư
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
              Bạn là khách hàng? Click vào tên kiến trúc sư bên dưới để xem dự án và liên hệ tư vấn.
            </p>

            <div className="mt-6 space-y-3">
              {architects.map((a) => (
                <Link
                  key={a.publicSlug}
                  href={`/${a.publicSlug}`}
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-sage-400 hover:shadow-md dark:border-slate-800 dark:bg-ink-900 sm:p-5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 font-bold text-sage-600 ring-2 ring-sage-50 dark:bg-slate-800 dark:text-sage-300 dark:ring-slate-900">
                      {a.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold sm:text-base">{a.name}</p>
                      {a.tagline && (
                        <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                          {a.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-sage-500 transition group-hover:translate-x-1 dark:text-sage-300">
                    →
                  </span>
                </Link>
              ))}
              {architects.length === 0 && <p className="text-sm text-slate-500">Đang tải...</p>}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500 dark:text-slate-600">
        © {new Date().getFullYear()} Architect Portfolio
      </footer>
    </div>
  );
}
