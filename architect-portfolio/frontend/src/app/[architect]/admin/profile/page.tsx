'use client';

import { useEffect, useState } from 'react';
import { api, imageUrl } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { CoverImageEditor } from '@/components/CoverImageEditor';

type Profile = {
  id: string;
  email: string;
  username: string | null;
  publicSlug: string | null;
  inquiryEmail: string | null;
  name: string;
  phone: string | null;
  bio: string | null;
  tagline: string | null;
  avatarUrl: string | null;
  coverImage: string | null;
  coverPositionY: number | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api
      .withToken(token)
      .me()
      .then((data: any) => setProfile(data));
  }, []);

  if (!profile) return <p className="text-slate-500">Đang tải...</p>;

  const input =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-sage-400 dark:border-slate-700 dark:bg-ink-950 dark:text-slate-100 disabled:opacity-50';

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const token = getToken();
    if (!token) return;
    const { urls } = await api.withToken(token).uploadImages(files);
    setProfile((p) => (p ? { ...p, avatarUrl: urls[0] } : p));
  }

  async function handleCoverUploadFile(file: File) {
    const token = getToken();
    if (!token) return;
    const { urls } = await api.withToken(token).uploadImages([file]);
    setProfile((p) => (p ? { ...p, coverImage: urls[0], coverPositionY: 50 } : p));
  }

  function clearCover() {
    setProfile((p) => (p ? { ...p, coverImage: null, coverPositionY: 50 } : p));
  }

  function setCoverPositionY(y: number) {
    setProfile((p) => (p ? { ...p, coverPositionY: y } : p));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    const token = getToken();
    if (!token) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.withToken(token).updateMe({
        name: profile.name,
        phone: profile.phone,
        tagline: profile.tagline,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        coverImage: profile.coverImage,
        coverPositionY: profile.coverPositionY ?? 50,
        inquiryEmail: profile.inquiryEmail,
      });
      setMessage('Đã lưu hồ sơ');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="mb-6 text-lg font-bold uppercase tracking-tight sm:text-xl">
        Hồ sơ kiến trúc sư
      </h1>
      <form onSubmit={handleSave} className="max-w-2xl space-y-5">
        {/* Cover image với drag-to-reposition */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ảnh bìa
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Kéo ảnh hoặc dùng thanh trượt để chỉnh vị trí
            </span>
          </div>
          <CoverImageEditor
            coverImage={profile.coverImage}
            positionY={profile.coverPositionY ?? 50}
            onPositionChange={setCoverPositionY}
            onUploaded={handleCoverUploadFile}
            onClear={clearCover}
          />
        </div>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl(profile.avatarUrl)}
              alt=""
              className="h-24 w-24 rounded-full object-cover ring-4 ring-sage-100 dark:ring-slate-800"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-sage-100 text-3xl font-bold text-sage-600 ring-4 ring-sage-50 dark:bg-slate-800 dark:text-sage-300 dark:ring-slate-900">
              {profile.name.charAt(0)}
            </div>
          )}
          <label className="cursor-pointer rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-sage-400 dark:border-slate-700 dark:bg-ink-950">
            Đổi ảnh đại diện
            <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Họ tên
            </span>
            <input
              className={input}
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Username
            </span>
            <input className={input} value={profile.username || ''} disabled />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Email đăng nhập
            </span>
            <input className={input} value={profile.email} disabled />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Số điện thoại
            </span>
            <input
              className={input}
              value={profile.phone || ''}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Email nhận inquiry
          </span>
          <input
            type="email"
            className={input}
            value={profile.inquiryEmail || ''}
            onChange={(e) => setProfile({ ...profile, inquiryEmail: e.target.value })}
            placeholder={profile.email}
          />
          <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
            Nơi nhận mail khi khách gửi form. Bỏ trống = dùng email đăng nhập.
          </span>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Slogan
          </span>
          <input
            className={input}
            value={profile.tagline || ''}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            placeholder="VD: Nhà phố hiện đại - Tối ưu công năng"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Giới thiệu
          </span>
          <textarea
            rows={5}
            className={input}
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </label>

        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
            {message}
          </div>
        )}

        <div className="flex gap-3 border-t border-slate-200 pt-5 dark:border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-sage-500 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-sage-600 disabled:opacity-60"
          >
            {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}
          </button>
        </div>
      </form>
    </>
  );
}
