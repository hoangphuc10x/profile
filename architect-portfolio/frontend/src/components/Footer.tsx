import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-ink-900">
      <div className="container-page flex flex-col items-center justify-between gap-3 py-8 text-sm text-slate-600 dark:text-slate-400 sm:flex-row">
        <span>© {new Date().getFullYear()} Architect Portfolio. All rights reserved.</span>
        <Link href="/" className="text-slate-400 hover:text-brand-accent dark:text-slate-500">
          Trang quản lý dành cho kiến trúc sư
        </Link>
      </div>
    </footer>
  );
}
