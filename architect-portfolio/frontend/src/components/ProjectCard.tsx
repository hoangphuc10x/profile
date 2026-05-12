import Link from 'next/link';
import { Project, imageUrl } from '@/lib/api';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl(project.coverImage)}
            alt={project.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">No image</div>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-1 font-semibold">{project.title}</h3>
        <p className="mt-1 text-sm text-slate-500">
          {[project.location, project.year, project.area && `${project.area} m²`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
    </Link>
  );
}
