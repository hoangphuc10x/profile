import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  const architects = await api.listArchitects().catch(() => []);

  return (
    <>
      <Navbar architects={architects} />
      <main className="flex-1 bg-slate-50 dark:bg-ink-900">
        <div className="container-page grid gap-8 py-10 lg:grid-cols-2 lg:gap-12 lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
              Liên hệ
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Hỏi giá &amp; Tư vấn</h1>
            <p className="mt-3 text-slate-600">
              Để lại thông tin, kiến trúc sư sẽ liên hệ lại trong vòng 24h và gửi báo giá tham khảo
              theo nhu cầu của bạn.
            </p>

            <div className="mt-6 space-y-3 text-sm sm:mt-8">
              <p>
                <strong>Hotline:</strong> 0900 000 000
              </p>
              <p>
                <strong>Email:</strong> architect@example.com
              </p>
              <p>
                <strong>Văn phòng:</strong> TP.HCM, Việt Nam
              </p>
            </div>

            {architects.length > 0 && (
              <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
                <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Hoặc liên hệ trực tiếp KTS:
                </p>
                <div className="space-y-2">
                  {architects.map((a) => (
                    <a
                      key={a.publicSlug}
                      href={`/${a.publicSlug}`}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-sage-400 dark:border-slate-800 dark:bg-ink-950"
                    >
                      <div>
                        <p className="text-sm font-medium">{a.name}</p>
                        {a.tagline && (
                          <p className="text-xs text-slate-500 dark:text-slate-400">{a.tagline}</p>
                        )}
                      </div>
                      <span className="text-sage-500 dark:text-sage-300">→</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-ink-950 sm:p-8">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
