'use client';

import { useEffect, useState } from 'react';
import { api, imageUrl } from '@/lib/api';
import { getToken } from '@/lib/auth';

type Profile = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  bio: string | null;
  avatarUrl: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.withToken(token).me().then((data: any) => setProfile(data));
  }, []);

  if (!profile) return <p className="text-slate-500">Đang tải...</p>;

  const input = 'w-full rounded border border-slate-300 px-3 py-2 outline-none focus:border-brand-accent';

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const token = getToken();
    if (!token) return;
    const { urls } = await api.withToken(token).uploadImages(files);
    setProfile((p) => (p ? { ...p, avatarUrl: urls[0] } : p));
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
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
      });
      setMessage('Đã lưu hồ sơ');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <h1 className="mb-6 text-xl font-bold">Hồ sơ kiến trúc sư</h1>
      <form onSubmit={handleSave} className="max-w-xl space-y-4">
        <div>
          <span className="mb-1 block text-sm font-medium">Ảnh đại diện</span>
          {profile.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl(profile.avatarUrl)} alt="" className="mb-2 h-24 w-24 rounded-full object-cover" />
          )}
          <input type="file" accept="image/*" onChange={handleAvatar} />
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Họ tên</span>
          <input
            className={input}
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input className={input} value={profile.email} disabled />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Số điện thoại</span>
          <input
            className={input}
            value={profile.phone || ''}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Giới thiệu</span>
          <textarea
            rows={5}
            className={input}
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          />
        </label>

        {message && <p className="text-sm text-green-700">{message}</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-brand px-5 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}
        </button>
      </form>
    </>
  );
}
