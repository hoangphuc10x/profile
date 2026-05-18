import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 35%, #8b5cf6 70%, #0ea5e9 100%)',
        color: '#fffbeb',
        fontSize: 42,
        fontWeight: 900,
        fontFamily: 'sans-serif',
        letterSpacing: '-0.08em',
      }}
    >
      {/* Accent dot top-right */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 10,
          height: 10,
          borderRadius: 999,
          background: '#fde047',
          boxShadow: '0 0 0 2px rgba(255,255,255,0.4)',
          display: 'flex',
        }}
      />
      {/* Accent bar bottom */}
      <div
        style={{
          position: 'absolute',
          left: 8,
          bottom: 7,
          width: 18,
          height: 3,
          background: '#bbf7d0',
          borderRadius: 999,
          display: 'flex',
        }}
      />
      <span style={{ marginTop: -2, textShadow: '0 2px 4px rgba(0,0,0,0.25)' }}>A</span>
    </div>,
    size,
  );
}
