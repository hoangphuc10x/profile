'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

type Architect = { publicSlug: string; name: string };

export function Navbar({
  architects = [],
  architectSlug,
}: {
  architects?: Architect[];
  architectSlug?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, [pathname]);

  const current = architectSlug
    ? architects.find((a) => a.publicSlug === architectSlug)
    : undefined;
  const studio = (current?.name.split(' ').slice(-1)[0] || 'Arch').toUpperCase();

  const homeHref = architectSlug ? `/${architectSlug}` : '/';

  const isHome = pathname === homeHref;
  const isContact = isHome && hash === '#contact';
  const isPhilosophy = isHome && hash === '#philosophy';
  const isProjects = isHome && (hash === '' || hash === '#projects');

  const linkBase = 'relative text-xs font-bold uppercase tracking-[0.25em] transition pb-1';
  const linkInactive =
    'text-slate-500 hover:text-ink-950 dark:text-slate-400 dark:hover:text-white';
  const linkActive =
    'text-ink-950 dark:text-white before:absolute before:-bottom-0.5 before:left-0 before:h-[2px] before:w-full before:bg-current';

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/60 bg-stone-100/85 backdrop-blur dark:border-slate-800/60 dark:bg-ink-950/85">
      <div className="container-page flex h-16 items-center justify-between sm:h-20">
        <Link href={homeHref} className="text-sm font-bold uppercase tracking-[0.2em] sm:text-lg">
          Studio {studio}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href={`${homeHref}#philosophy`}
            onClick={() => setHash('#philosophy')}
            className={`${linkBase} ${isPhilosophy ? linkActive : linkInactive}`}
          >
            Philosophy
          </Link>
          <Link
            href={`${homeHref}#projects`}
            onClick={() => setHash('#projects')}
            className={`${linkBase} ${isProjects ? linkActive : linkInactive}`}
          >
            Projects
          </Link>
          <Link
            href={`${homeHref}#contact`}
            onClick={() => setHash('#contact')}
            className={`${linkBase} ${isContact ? linkActive : linkInactive}`}
          >
            Contact
          </Link>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            className="rounded-full border border-slate-300 p-2 text-slate-700 dark:border-slate-700 dark:text-slate-300"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-stone-200 bg-stone-100 dark:border-slate-800 dark:bg-ink-950 md:hidden">
          <div className="container-page flex flex-col gap-1 py-3 text-sm font-medium">
            <Link
              href={`${homeHref}#philosophy`}
              onClick={() => {
                setHash('#philosophy');
                setOpen(false);
              }}
              className="rounded px-3 py-2 uppercase tracking-widest"
            >
              Philosophy
            </Link>
            <Link
              href={`${homeHref}#projects`}
              onClick={() => {
                setHash('#projects');
                setOpen(false);
              }}
              className="rounded px-3 py-2 uppercase tracking-widest"
            >
              Projects
            </Link>
            <Link
              href={`${homeHref}#contact`}
              onClick={() => {
                setHash('#contact');
                setOpen(false);
              }}
              className="rounded px-3 py-2 uppercase tracking-widest"
            >
              Contact
            </Link>
            {architects.length > 1 && (
              <>
                <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Kiến trúc sư khác
                </p>
                {architects
                  .filter((a) => a.publicSlug !== architectSlug)
                  .map((a) => (
                    <Link
                      key={a.publicSlug}
                      href={`/${a.publicSlug}`}
                      onClick={() => setOpen(false)}
                      className="rounded px-3 py-2 text-slate-700 dark:text-slate-200"
                    >
                      {a.name}
                    </Link>
                  ))}
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
