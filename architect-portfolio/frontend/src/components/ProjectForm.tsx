'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, Project, imageUrl } from '@/lib/api';
import { getToken } from '@/lib/auth';

type Props = { project?: Project };

export function ProjectForm({ project }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: project?.title || '',
    description: project?.description || '',
    location: project?.location || '',
    year: project?.year?.toString() || '',
    area: project?.area?.toString() || '',
    coverImage: project?.coverImage || '',
    published: project?.published ?? true,
    images: project?.images.map((i) => i.url) || [],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const input = 'w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-brand-accent';

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'gallery') {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const token = getToken();
    if (!token) return;
    try {
      const { urls } = await api.withToken(token).uploadImages(files);
      if (target === 'cover') {
        setForm((f) => ({ ...f, coverImage: urls[0] }));
      } else {
        setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      }
    } catch (err: any) {
      setError(err.message);
    }
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const token = getToken();
    if (!token) return;

    const payload = {
      title: form.title,
      description: form.description,
      location: form.location || undefined,
      year: form.year ? Number(form.year) : undefined,
      area: form.area ? Number(form.area) : undefined,
      coverImage: form.coverImage || undefined,
      published: form.published,
      images: form.images,
    };

    try {
      if (project) {
        await api.withToken(token).updateProject(project.id, payload);
      } else {
        await api.withToken(token).createProject(payload);
      }
      router.push('/admin/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Tiêu đề *</span>
        <input required className={input} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Mô tả *</span>
        <textarea
          required
          rows={6}
          className={input}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Vị trí</span>
          <input className={input} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Năm</span>
          <input type="number" className={input} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Diện tích (m²)</span>
          <input type="number" className={input} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
        </label>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Ảnh bìa</span>
        {form.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl(form.coverImage)} alt="" className="mb-2 h-32 w-48 rounded object-cover" />
        )}
        <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'cover')} />
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">Ảnh dự án</span>
        <div className="mb-2 flex flex-wrap gap-2">
          {form.images.map((url, idx) => (
            <div key={idx} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(url)} alt="" className="h-24 w-32 rounded object-cover" />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-red-600 text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" multiple onChange={(e) => handleUpload(e, 'gallery')} />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
        />
        <span className="text-sm">Đăng công khai</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-brand px-5 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>
        <button type="button" onClick={() => router.back()} className="rounded border px-5 py-2.5 hover:bg-slate-50">
          Huỷ
        </button>
      </div>
    </form>
  );
}
