import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Architect Portfolio',
  description: 'Portfolio và dịch vụ tư vấn xây dựng nhà ở',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
