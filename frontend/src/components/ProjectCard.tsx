import Link from 'next/link';
import { Project, imageUrl } from '@/lib/api';

export function ProjectCard({
  project,
  architectSlug,
}: {
  project: Project;
  architectSlug?: string;
}) {
  // Khi có architectSlug → link namespaced (về architect home khi back)
  // Khi không có → link global
  const href = architectSlug
    ? `/${architectSlug}/projects/${project.slug}`
    : `/projects/${project.slug}`;

  return (
    <Link
      href={href}
      className="group relative block overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-ink-900 dark:shadow-black/30"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[4/3]">
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl(project.coverImage)}
            alt={project.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-600">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7.5L12 3l9 4.5M3 7.5v9L12 21l9-4.5v-9M3 7.5l9 4.5m0 0l9-4.5m-9 4.5v9"
              />
            </svg>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

        {project.year && (
          <span className="absolute right-3 top-3 rounded-full bg-sage-400/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            {project.year}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
          <h3 className="line-clamp-2 text-sm font-bold uppercase tracking-wide sm:text-base">
            {project.title}
          </h3>
          {project.location && (
            <p className="mt-1 line-clamp-1 text-xs text-white/75">{project.location}</p>
          )}
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-sage-400/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur transition group-hover:bg-sage-500">
            View project
            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
