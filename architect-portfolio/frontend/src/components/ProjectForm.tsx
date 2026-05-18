'use client';

import { useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api, Project, imageUrl } from '@/lib/api';
import { getToken } from '@/lib/auth';

const MAX_GALLERY_IMAGES = 10;

type Props = { project?: Project };

export function ProjectForm({ project }: Props) {
  const router = useRouter();
  const params = useParams<{ architect: string }>();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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
  const [uploading, setUploading] = useState<'cover' | 'gallery' | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputCls =
    'w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-brand-accent';

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'gallery') {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // reset để có thể chọn lại cùng file
    if (!files.length) return;
    const token = getToken();
    if (!token) return;

    setError(null);
    setUploading(target);
    try {
      if (target === 'gallery') {
        const remaining = MAX_GALLERY_IMAGES - form.images.length;
        if (remaining <= 0) return;
        const filesToUpload = files.slice(0, remaining);
        if (files.length > remaining) {
          setError(`Chỉ thêm được ${remaining} ảnh (tối đa ${MAX_GALLERY_IMAGES} ảnh).`);
        }
        const { urls } = await api.withToken(token).uploadImages(filesToUpload);
        setForm((f) => ({ ...f, images: [...f.images, ...urls] }));
      } else {
        const { urls } = await api.withToken(token).uploadImages([files[0]]);
        setForm((f) => ({ ...f, coverImage: urls[0] }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(null);
    }
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  }

  function clearCover() {
    setForm((f) => ({ ...f, coverImage: '' }));
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
      router.push(`/${params.architect}/admin/projects`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const canAddMore = form.images.length < MAX_GALLERY_IMAGES;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Tiêu đề *</span>
        <input
          required
          className={inputCls}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Mô tả *</span>
        <textarea
          required
          rows={6}
          className={inputCls}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Vị trí</span>
          <input
            className={inputCls}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Năm</span>
          <input
            type="number"
            className={inputCls}
            value={form.year}
            onChange={(e) => setForm({ ...form, year: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Diện tích (m²)</span>
          <input
            type="number"
            className={inputCls}
            value={form.area}
            onChange={(e) => setForm({ ...form, area: e.target.value })}
          />
        </label>
      </div>

      {/* COVER IMAGE */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium">Ảnh bìa</span>
          <span className="text-xs text-slate-400">
            Hiển thị ở trang danh sách + đầu trang chi tiết
          </span>
        </div>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e, 'cover')}
        />

        {form.coverImage ? (
          <div className="group relative h-44 w-44 overflow-hidden rounded-lg border border-slate-200 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(form.coverImage)}
              alt="cover"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="rounded bg-white px-3 py-1 text-xs font-medium hover:bg-slate-100"
              >
                Đổi
              </button>
              <button
                type="button"
                onClick={clearCover}
                className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
              >
                Xoá
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={uploading === 'cover'}
            className="group flex h-44 w-44 flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-brand-accent hover:bg-amber-50 disabled:opacity-60"
          >
            {uploading === 'cover' ? (
              <span className="text-sm text-slate-500">Đang tải...</span>
            ) : (
              <>
                <PlusIcon className="h-10 w-10 text-slate-400 transition group-hover:text-brand-accent" />
                <span className="mt-2 text-sm font-medium text-slate-500">Thêm ảnh bìa</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* GALLERY */}
      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-medium">
            Ảnh dự án{' '}
            <span className="font-normal text-slate-400">
              ({form.images.length}/{MAX_GALLERY_IMAGES})
            </span>
          </span>
          <span className="text-xs text-slate-400">Có thể chọn nhiều ảnh cùng lúc</span>
        </div>

        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e, 'gallery')}
        />

        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {form.images.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(url)}
                alt={`image-${idx}`}
                className="h-full w-full object-cover transition group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow transition hover:bg-red-600 hover:text-white group-hover:opacity-100"
                aria-label="Xoá ảnh"
              >
                <CrossIcon className="h-3.5 w-3.5" />
              </button>
              <span className="absolute bottom-1.5 left-1.5 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white">
                #{idx + 1}
              </span>
            </div>
          ))}

          {canAddMore && (
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading === 'gallery'}
              className="group flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-brand-accent hover:bg-amber-50 disabled:opacity-60"
            >
              {uploading === 'gallery' ? (
                <span className="text-xs text-slate-500">Đang tải...</span>
              ) : (
                <>
                  <PlusIcon className="h-8 w-8 text-slate-400 transition group-hover:text-brand-accent" />
                  <span className="mt-1 text-xs font-medium text-slate-500">Thêm ảnh</span>
                </>
              )}
            </button>
          )}
        </div>

        {!canAddMore && (
          <p className="mt-2 text-xs text-amber-600">
            Đã đạt giới hạn {MAX_GALLERY_IMAGES} ảnh. Xoá bớt để thêm ảnh mới.
          </p>
        )}
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm({ ...form, published: e.target.checked })}
        />
        <span className="text-sm">Đăng công khai</span>
      </label>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex gap-3 border-t pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-brand px-5 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu dự án'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded border px-5 py-2.5 hover:bg-slate-50"
        >
          Huỷ
        </button>
      </div>
    </form>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
