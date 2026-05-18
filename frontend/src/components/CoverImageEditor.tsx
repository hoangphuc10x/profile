'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { imageUrl } from '@/lib/api';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

type Props = {
  coverImage: string | null;
  positionY: number; // 0-100
  onPositionChange: (y: number) => void;
  onUploaded: (file: File) => Promise<void>;
  onClear: () => void;
};

export function CoverImageEditor({
  coverImage,
  positionY,
  onPositionChange,
  onUploaded,
  onClear,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const dragStartY = useRef(0);
  const startPosY = useRef(positionY);
  const [uploading, setUploading] = useState(false);

  // Mouse/touch drag handlers
  useEffect(() => {
    if (!dragging) return;

    const move = (clientY: number) => {
      if (!containerRef.current) return;
      const h = containerRef.current.clientHeight;
      const deltaY = clientY - dragStartY.current;
      // Drag DOWN → show more TOP → positionY decreases
      // Drag UP → show more BOTTOM → positionY increases
      const deltaPct = (deltaY / h) * 100;
      const next = clamp(startPosY.current - deltaPct, 0, 100);
      onPositionChange(next);
    };

    const onMouseMove = (e: MouseEvent) => move(e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        move(e.touches[0].clientY);
      }
    };
    const stop = () => setDragging(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', stop);
    window.addEventListener('touchcancel', stop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', stop);
      window.removeEventListener('touchcancel', stop);
    };
  }, [dragging, onPositionChange]);

  const startDrag = useCallback(
    (clientY: number) => {
      dragStartY.current = clientY;
      startPosY.current = positionY;
      setDragging(true);
    },
    [positionY],
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setUploading(true);
    try {
      await onUploaded(files[0]);
    } finally {
      setUploading(false);
    }
  };

  if (!coverImage) {
    return (
      <label className="flex aspect-[3/1] w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-sage-400 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-wider">
            {uploading ? 'Đang tải lên...' : 'Thêm ảnh bìa'}
          </span>
        </div>
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      </label>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        onMouseDown={(e) => {
          e.preventDefault();
          startDrag(e.clientY);
        }}
        onTouchStart={(e) => {
          if (e.touches.length > 0) startDrag(e.touches[0].clientY);
        }}
        className={`group relative aspect-[3/1] w-full select-none overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800 ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl(coverImage)}
          alt="cover"
          draggable={false}
          className="pointer-events-none h-full w-full object-cover"
          style={{ objectPosition: `center ${positionY}%` }}
        />

        {/* Drag hint overlay */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition ${
            dragging ? 'bg-black/20' : 'group-hover:bg-black/30'
          }`}
        >
          <div
            className={`rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition ${
              dragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
          >
            {dragging ? `Y: ${Math.round(positionY)}%` : '↕ Kéo để điều chỉnh vị trí'}
          </div>
        </div>

        {/* Action buttons (top-right) */}
        <div
          className={`absolute right-2 top-2 flex gap-2 transition ${
            dragging ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'
          }`}
        >
          <label className="cursor-pointer rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 shadow-md hover:bg-white">
            Đổi ảnh
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="rounded-full bg-red-600/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-red-700"
          >
            Xoá
          </button>
        </div>
      </div>

      {/* Slider fallback (cho mobile / chính xác hơn drag) */}
      <div className="mt-3 flex items-center gap-3">
        <span className="text-xs text-slate-500 dark:text-slate-400">Top</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={Math.round(positionY)}
          onChange={(e) => onPositionChange(Number(e.target.value))}
          className="flex-1 accent-sage-500"
        />
        <span className="text-xs text-slate-500 dark:text-slate-400">Bot</span>
        <span className="w-10 text-right font-mono text-xs text-slate-500 dark:text-slate-400">
          {Math.round(positionY)}%
        </span>
      </div>
    </div>
  );
}
