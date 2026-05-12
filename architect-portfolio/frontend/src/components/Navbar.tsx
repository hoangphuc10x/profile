import Link from 'next/link';

export function Navbar() {
  return (
    <header className="border-b bg-white">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Architect<span className="text-brand-accent">.</span>
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-brand-accent">Trang chủ</Link>
          <Link href="/projects" className="hover:text-brand-accent">Dự án</Link>
          <Link href="/contact" className="hover:text-brand-accent">Liên hệ / Hỏi giá</Link>
        </nav>
      </div>
    </header>
  );
}
