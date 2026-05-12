import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProjectCard } from '@/components/ProjectCard';
import { api, Project } from '@/lib/api';

async function getProjects(): Promise<Project[]> {
  try {
    return await api.listProjects();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const projects = (await getProjects()).slice(0, 6);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="bg-slate-900 text-white">
          <div className="container-page py-20">
            <h1 className="text-4xl font-bold sm:text-5xl">Thiết kế &amp; thi công nhà ở</h1>
            <p className="mt-4 max-w-2xl text-lg text-slate-200">
              Hơn 10 năm kinh nghiệm thiết kế và thi công nhà phố, biệt thự, nhà vườn. Tư vấn miễn phí — báo giá nhanh trong 24h.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/projects" className="rounded bg-brand-accent px-5 py-2.5 font-medium hover:opacity-90">
                Xem dự án
              </Link>
              <Link href="/contact" className="rounded border border-white/40 px-5 py-2.5 font-medium hover:bg-white/10">
                Hỏi giá xây nhà
              </Link>
            </div>
          </div>
        </section>

        <section className="container-page py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-bold">Dự án nổi bật</h2>
            <Link href="/projects" className="text-sm font-medium text-brand-accent hover:underline">
              Xem tất cả →
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-slate-500">Chưa có dự án nào.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
