import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProjectCard } from '@/components/ProjectCard';
import { api } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let projects = [];
  try {
    projects = await api.listProjects();
  } catch {
    projects = [];
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-12">
          <h1 className="text-3xl font-bold">Tất cả dự án</h1>
          <p className="mt-2 text-slate-600">Danh sách các công trình đã thi công.</p>

          {projects.length === 0 ? (
            <p className="mt-12 text-slate-500">Chưa có dự án nào.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
