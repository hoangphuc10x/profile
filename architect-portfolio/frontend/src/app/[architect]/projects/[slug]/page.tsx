import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProjectGallery } from '@/components/ProjectGallery';
import { api, imageUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function ArchitectProjectDetailPage({
  params,
}: {
  params: Promise<{ architect: string; slug: string }>;
}) {
  const { architect: architectSlug, slug } = await params;

  // Lấy danh sách KTS cho Navbar
  const architects = await api.listArchitects().catch(() => []);

  // Lấy chi tiết project
  let project;
  try {
    project = await api.getProject(slug);
  } catch {
    notFound();
  }

  // Verify project có thuộc về architect này không (tránh người ta access cross-namespace)
  const me = architects.find((a) => a.publicSlug === architectSlug);
  if (!me) notFound();

  const homeHref = `/${architectSlug}`;

  const facts = [
    project.location && { label: 'Vị trí', value: project.location },
    project.year && { label: 'Năm hoàn thành', value: project.year.toString() },
    project.area && { label: 'Diện tích', value: `${project.area} m²` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <>
      <Navbar architects={architects} architectSlug={architectSlug} />
      <main className="flex-1 bg-white dark:bg-ink-950">
        {/* HERO */}
        {project.coverImage ? (
          <div className="relative h-[45vh] min-h-[320px] w-full overflow-hidden bg-slate-900 sm:h-[55vh] sm:min-h-[420px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(project.coverImage)}
              alt={project.title}
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30" />
            <div className="absolute inset-0 flex items-end">
              <div className="container-page w-full pb-8 text-white sm:pb-12">
                <Link
                  href={homeHref}
                  className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white sm:text-sm"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Về trang {me.name}
                </Link>
                <h1 className="mt-3 text-2xl font-bold uppercase tracking-tight sm:text-5xl">
                  {project.title}
                </h1>
                {project.location && (
                  <p className="mt-2 text-base text-white/90 sm:text-lg">{project.location}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="container-page pt-12">
            <Link
              href={homeHref}
              className="text-sm text-sage-500 hover:underline dark:text-sage-300"
            >
              ← Về trang {me.name}
            </Link>
            <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight">{project.title}</h1>
          </div>
        )}

        {/* FACTS */}
        {facts.length > 0 && (
          <section className="border-b border-slate-200 dark:border-slate-800">
            <div className="container-page grid grid-cols-1 gap-6 py-8 sm:grid-cols-3">
              {facts.map((f) => (
                <div key={f.label}>
                  <p className="text-xs font-bold uppercase tracking-widest text-sage-500 dark:text-sage-300">
                    {f.label}
                  </p>
                  <p className="mt-1 text-xl font-semibold">{f.value}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* DESCRIPTION */}
        <section className="container-page py-10 sm:py-12">
          <div className="mx-auto max-w-3xl whitespace-pre-line text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg">
            {project.description}
          </div>
        </section>

        {/* GALLERY */}
        {project.images.length > 0 && (
          <section className="container-page pb-12 sm:pb-16">
            <h2 className="mb-6 text-xl font-bold uppercase tracking-tight sm:text-2xl">
              Hình ảnh dự án
            </h2>
            <ProjectGallery images={project.images} title={project.title} />
          </section>
        )}

        {/* CTA */}
        <section className="bg-sage-500 text-white">
          <div className="container-page py-12 text-center sm:py-16">
            <h2 className="text-2xl font-bold uppercase tracking-tight sm:text-3xl">
              Bạn quan tâm phong cách này?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/90 sm:text-base">
              Để lại thông tin, KTS {me.name} sẽ liên hệ tư vấn miễn phí.
            </p>
            <Link
              href={`/${architectSlug}/contact`}
              className="mt-6 inline-block rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-sage-600 hover:bg-cream-50 sm:text-sm"
            >
              Liên hệ ngay
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
