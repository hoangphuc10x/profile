'use client';

import { useEffect, useState } from 'react';
import { imageUrl } from '@/lib/api';

type Props = {
  images: { id: string; url: string }[];
  title: string;
};

export function ProjectGallery({ images, title }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (activeIdx === null) return;
      if (e.key === 'Escape') setActiveIdx(null);
      if (e.key === 'ArrowRight')
        setActiveIdx((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === 'ArrowLeft')
        setActiveIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx, images.length]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, idx) => (
          <button
            type="button"
            key={img.id}
            onClick={() => setActiveIdx(idx)}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(img.url)}
              alt={`${title} - ảnh ${idx + 1}`}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
              <svg
                className="h-8 w-8 text-white opacity-0 transition group-hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>

      {activeIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setActiveIdx(null)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIdx(null);
            }}
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Đóng"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((i) => (i === null ? 0 : (i - 1 + images.length) % images.length));
                }}
                className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="Trước"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIdx((i) => (i === null ? 0 : (i + 1) % images.length));
                }}
                className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
                aria-label="Tiếp"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          <div className="max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(images[activeIdx].url)}
              alt={`${title} - ảnh ${activeIdx + 1}`}
              className="max-h-[85vh] w-auto rounded-lg"
            />
            <p className="mt-3 text-center text-sm text-white/70">
              {activeIdx + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
