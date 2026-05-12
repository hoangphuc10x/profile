import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { api, imageUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  let project;
  try {
    project = await api.getProject(params.slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="container-page py-12">
          <Link href="/projects" className="text-sm text-brand-accent hover:underline">
            ← Quay lại danh sách
          </Link>

          <h1 className="mt-4 text-3xl font-bold">{project.title}</h1>
          <p className="mt-2 text-slate-600">
            {[project.location, project.year, project.area && `${project.area} m²`]
              .filter(Boolean)
              .join(' · ')}
          </p>

          {project.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl(project.coverImage)}
              alt={project.title}
              className="mt-6 aspect-[16/9] w-full rounded-lg object-cover"
            />
          )}

          <div className="mt-8 max-w-3xl whitespace-pre-line text-slate-800">
            {project.description}
          </div>

          {project.images.length > 0 && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {project.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={img.id}
                  src={imageUrl(img.url)}
                  alt={project.title}
                  className="aspect-[4/3] w-full rounded object-cover"
                />
              ))}
            </div>
          )}

          <div className="mt-12 rounded-lg bg-slate-50 p-6">
            <h3 className="text-lg font-semibold">Bạn quan tâm phong cách này?</h3>
            <p className="mt-1 text-slate-600">Để lại số điện thoại, chúng tôi sẽ liên hệ tư vấn miễn phí.</p>
            <Link
              href="/contact"
              className="mt-4 inline-block rounded bg-brand px-5 py-2.5 font-medium text-white hover:bg-slate-800"
            >
              Liên hệ ngay
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
