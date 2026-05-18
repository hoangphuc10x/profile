'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, Project, imageUrl } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function MyProjectsPage() {
  const params = useParams<{ architect: string }>();
  const base = `/${params.architect}/admin`;
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.withToken(token).listMyProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Xoá dự án này?')) return;
    const token = getToken();
    if (!token) return;
    await api.withToken(token).deleteProject(id);
    load();
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold uppercase tracking-tight sm:text-xl">Dự án của tôi</h1>
        <Link
          href={`${base}/projects/new`}
          className="rounded-full bg-sage-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-sage-600"
        >
          + Thêm
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-slate-500">Đang tải...</p>
      ) : projects.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700">
          <p>Bạn chưa có dự án nào.</p>
          <Link
            href={`${base}/projects/new`}
            className="mt-3 inline-block rounded-full bg-sage-500 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white"
          >
            Tạo dự án đầu tiên
          </Link>
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="mt-6 grid gap-3 sm:hidden">
            {projects.map((p) => (
              <div
                key={p.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-ink-950"
              >
                <div className="flex gap-3 p-3">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(p.coverImage)}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-bold">{p.title}</p>
                    <p className="line-clamp-1 text-xs text-slate-500">
                      {[p.location, p.year].filter(Boolean).join(' · ')}
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        p.published
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {p.published ? 'Đã đăng' : 'Ẩn'}
                    </span>
                  </div>
                </div>
                <div className="flex border-t border-slate-100 text-xs dark:border-slate-800">
                  <Link
                    href={`${base}/projects/${p.id}/edit`}
                    className="flex-1 py-2.5 text-center font-medium text-sage-500"
                  >
                    Sửa
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 border-l border-slate-100 py-2.5 font-medium text-red-600 dark:border-slate-800"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="mt-6 hidden overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 sm:block">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="p-3">Ảnh</th>
                  <th className="p-3">Tiêu đề</th>
                  <th className="p-3">Vị trí</th>
                  <th className="p-3">Năm</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="p-3">
                      {p.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl(p.coverImage)}
                          alt=""
                          className="h-12 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-16 rounded bg-slate-100 dark:bg-slate-800" />
                      )}
                    </td>
                    <td className="p-3 font-medium">{p.title}</td>
                    <td className="p-3 text-slate-500">{p.location || '—'}</td>
                    <td className="p-3 text-slate-500">{p.year || '—'}</td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.published
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {p.published ? 'Đã đăng' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap p-3 text-right">
                      <Link
                        href={`${base}/projects/${p.id}/edit`}
                        className="mr-3 text-sage-500 hover:underline"
                      >
                        Sửa
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:underline"
                      >
                        Xoá
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
