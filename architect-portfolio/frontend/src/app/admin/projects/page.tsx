'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api, Project, imageUrl } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const data = await api.withToken(token).listAllProjects();
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
        <h1 className="text-xl font-bold">Dự án</h1>
        <Link
          href="/admin/projects/new"
          className="rounded bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Thêm dự án
        </Link>
      </div>

      {loading ? (
        <p className="mt-6 text-slate-500">Đang tải...</p>
      ) : projects.length === 0 ? (
        <p className="mt-6 text-slate-500">Chưa có dự án. Hãy tạo dự án đầu tiên.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded border">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left">
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
                <tr key={p.id} className="border-t">
                  <td className="p-3">
                    {p.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl(p.coverImage)} alt="" className="h-12 w-16 rounded object-cover" />
                    ) : (
                      <div className="h-12 w-16 rounded bg-slate-100" />
                    )}
                  </td>
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3 text-slate-600">{p.location || '—'}</td>
                  <td className="p-3 text-slate-600">{p.year || '—'}</td>
                  <td className="p-3">
                    <span className={`rounded px-2 py-0.5 text-xs ${p.published ? 'bg-green-100 text-green-800' : 'bg-slate-200'}`}>
                      {p.published ? 'Đã đăng' : 'Ẩn'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/projects/${p.id}/edit`} className="mr-3 text-brand-accent hover:underline">
                      Sửa
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
