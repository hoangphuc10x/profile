'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearToken, getToken } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setReady(true);
      return;
    }
    if (!getToken()) {
      router.replace('/admin/login');
    } else {
      setReady(true);
    }
  }, [pathname, router]);

  if (!ready) return null;
  if (pathname === '/admin/login') return <>{children}</>;

  const navItem = (href: string, label: string) => (
    <Link
      href={href}
      className={`block rounded px-3 py-2 text-sm font-medium ${
        pathname.startsWith(href) ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container-page flex h-14 items-center justify-between">
          <Link href="/admin/projects" className="font-bold">Admin Panel</Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-slate-600 hover:text-brand-accent" target="_blank">
              Xem trang khách ↗
            </Link>
            <button
              onClick={() => {
                clearToken();
                router.replace('/admin/login');
              }}
              className="text-red-600 hover:underline"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[200px_1fr]">
        <aside className="space-y-1">
          {navItem('/admin/projects', 'Dự án')}
          {navItem('/admin/inquiries', 'Yêu cầu khách')}
          {navItem('/admin/profile', 'Hồ sơ')}
        </aside>
        <section className="rounded-lg bg-white p-6 shadow-sm">{children}</section>
      </div>
    </div>
  );
}
