'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { api } from '@/lib/api';
import { clearToken, getToken } from '@/lib/auth';

type Me = {
  id: string;
  email: string;
  name: string;
  username: string | null;
  publicSlug: string | null;
  avatarUrl: string | null;
};

export default function ArchitectAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ architect: string }>();
  const [me, setMe] = useState<Me | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace('/');
      return;
    }
    api
      .withToken(token)
      .me()
      .then((data: any) => {
        if (!data?.publicSlug) {
          // Account không có publicSlug — không cho vào admin
          clearToken();
          router.replace('/');
          return;
        }
        if (data.publicSlug !== params.architect) {
          // Đăng nhập là user khác, redirect về dashboard của mình
          router.replace(`/${data.publicSlug}/admin/projects`);
          return;
        }
        setMe(data);
        setReady(true);
      })
      .catch(() => {
        clearToken();
        router.replace('/');
      });
  }, [params.architect, router]);

  if (!ready || !me) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500 dark:bg-ink-950">
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  const base = `/${params.architect}/admin`;
  const publicHome = `/${params.architect}`;
  const navItem = (href: string, label: string, icon: React.ReactNode) => {
    const active = pathname === href || pathname?.startsWith(`${href}/`);
    return (
      <Link
        href={href}
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
          active
            ? 'bg-sage-500 text-white'
            : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-ink-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-ink-950/95">
        <div className="container-page flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={publicHome} className="text-base font-bold tracking-tight">
              Architect<span className="text-sage-500">.</span>
            </Link>
            <span className="hidden text-xs font-bold uppercase tracking-wider text-slate-400 sm:inline">
              / {me.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href={publicHome}
              target="_blank"
              className="text-slate-600 hover:text-sage-500 dark:text-slate-400"
            >
              Xem trang khách ↗
            </Link>
            <ThemeToggle />
            <button
              onClick={() => {
                clearToken();
                router.replace('/');
              }}
              className="text-red-600 hover:underline dark:text-red-400"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-4 py-4 sm:gap-6 sm:py-6 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-1 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-ink-900">
          {navItem(
            `${base}/projects`,
            'Dự án',
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14-4H5m14 8H5m14 4H5"
              />
            </svg>,
          )}
          {navItem(
            `${base}/inquiries`,
            'Yêu cầu khách',
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3v3m0 0v3m0-3h3m-3 0H9"
              />
            </svg>,
          )}
          {navItem(
            `${base}/profile`,
            'Hồ sơ',
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>,
          )}
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-ink-900 sm:p-6">
          {children}
        </section>
      </div>
    </div>
  );
}
