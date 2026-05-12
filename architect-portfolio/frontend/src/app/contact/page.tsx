import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container-page grid gap-12 py-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold">Liên hệ &amp; Hỏi giá</h1>
            <p className="mt-2 text-slate-600">
              Để lại thông tin, kiến trúc sư sẽ liên hệ lại trong vòng 24h và gửi báo giá tham khảo theo nhu cầu của bạn.
            </p>

            <div className="mt-8 space-y-3 text-sm">
              <p><strong>Hotline:</strong> 0900 000 000</p>
              <p><strong>Email:</strong> architect@example.com</p>
              <p><strong>Văn phòng:</strong> TP.HCM, Việt Nam</p>
            </div>
          </div>
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
