import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { InlineInquiryForm } from '@/components/InlineInquiryForm';
import { api, imageUrl } from '@/lib/api';

export const dynamic = 'force-dynamic';

export default async function ArchitectPage({
  params,
}: {
  params: Promise<{ architect: string }>;
}) {
  const { architect: slug } = await params;

  const allArchitects = await api.listArchitects().catch(() => []);

  let architect;
  try {
    architect = await api.getArchitect(slug);
  } catch {
    notFound();
  }

  const projects = architect.projects;
  const featured = projects.find((p) => p.coverImage) ?? projects[0] ?? null;
  const accent = projects.find((p) => p.id !== featured?.id && p.coverImage);
  const decor = projects.find((p) => p.id !== featured?.id && p.id !== accent?.id && p.coverImage);

  // Masonry: tall featured + wide + 2 small
  const restProjects = projects.filter((p) => p.id !== featured?.id);
  const wide = restProjects[0];
  const small1 = restProjects[1];
  const small2 = restProjects[2];
  const moreProjects = restProjects.slice(3);

  const lastName = architect.name.split(' ').slice(-1)[0];

  return (
    <>
      <Navbar architects={allArchitects} architectSlug={slug} />
      <main className="flex-1 bg-stone-100 dark:bg-ink-950">
        {/* HERO ============================================================ */}
        <section className="container-page pt-6 sm:pt-10">
          <div className="relative">
            <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
              {/* LEFT — featured with centered title overlay */}
              <div className="relative lg:col-span-7">
                {featured ? (
                  <Link href={`/${slug}/projects/${featured.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-slate-300 shadow-sm dark:bg-slate-800">
                      {featured.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={imageUrl(featured.coverImage)}
                          alt={featured.title}
                          className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                        />
                      )}
                      {/* Centered title overlay */}
                      <div className="absolute inset-0 flex items-center justify-center px-6">
                        <h2 className="pt-60 text-center text-xl font-light uppercase leading-tight tracking-[0.15em] text-stone-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-4xl lg:text-5xl">
                          {featured.title}
                          {featured.location && (
                            <>
                              <span className="text-stone-200/80">, </span>
                              {featured.location}
                            </>
                          )}
                        </h2>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center bg-slate-200 text-slate-400 dark:bg-slate-800">
                    Chưa có dự án nổi bật
                  </div>
                )}

                {/* Decorative floating thumbnails (lg+ only) */}
                {decor?.coverImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl(decor.coverImage)}
                    alt=""
                    aria-hidden
                    className="pointer-events-none absolute -left-6 top-1/3 hidden h-32 w-32 -rotate-6 object-cover shadow-2xl ring-4 ring-stone-100 dark:ring-ink-950 lg:block"
                    style={{ filter: 'hue-rotate(190deg) saturate(2) brightness(0.7)' }}
                  />
                )}
              </div>

              {/* RIGHT — philosophy + sketching/materials */}
              <div className="flex flex-col gap-4 lg:col-span-5 lg:gap-6">
                {/* Philosophy */}
                <div
                  id="philosophy"
                  className="relative flex-1 overflow-hidden bg-stone-200 dark:bg-slate-800"
                >
                  {accent?.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(accent.coverImage)}
                      alt=""
                      aria-hidden
                      className="pointer-events-none absolute right-0 top-0 h-full w-3/4 object-cover opacity-50 mix-blend-multiply dark:opacity-25 dark:mix-blend-normal"
                    />
                  )}
                  <div className="relative flex h-full flex-col justify-between p-6 sm:p-8">
                    <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                      Triết lý thiết kế
                    </p>
                    <h3 className="my-6 max-w-sm text-xl font-light uppercase leading-[1.2] tracking-tight sm:text-3xl">
                      {architect.tagline ||
                        'Tôn trọng bối cảnh. Tối giản. Tập trung vào trải nghiệm.'}
                    </h3>
                    <div className="h-px w-12 bg-slate-400 dark:bg-slate-600" />
                  </div>
                </div>

                {/* Sketching / materials accent image */}
                <Link
                  href={accent ? `/${slug}/projects/${accent.slug}` : '#projects'}
                  className="group relative block aspect-[3/2] flex-1 overflow-hidden bg-stone-300 dark:bg-slate-800"
                >
                  {accent?.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(accent.coverImage)}
                      alt={accent.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent dark:from-black/40" />
                </Link>
              </div>
            </div>

            {/* Caption + scroll indicator */}
            <div className="mt-6 flex flex-col items-center gap-2 sm:mt-10 sm:flex-row sm:justify-between">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                {featured?.title}
                {featured?.location && `, ${featured.location}`}
              </p>
              <a
                href="#projects"
                aria-label="Cuộn xuống"
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <svg
                  className="h-7 w-7 animate-bounce"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 7l5 5 5-5M7 13l5 5 5-5"
                  />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* PROJECTS — masonry =========================================== */}
        <section id="projects" className="container-page py-16 sm:py-24">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Portfolio
              </p>
              <h2 className="mt-2 text-2xl font-bold uppercase tracking-tight sm:text-3xl">
                Dự án của {lastName}
              </h2>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 bg-stone-50 p-12 text-center text-slate-500 dark:border-slate-700 dark:bg-ink-900">
              Kĩ sư chưa đăng dự án nào.
            </div>
          ) : (
            <>
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
                {/* Tall featured (left, full height) */}
                {featured && (
                  <ProjectTile
                    project={featured}
                    slug={slug}
                    aspect="aspect-[9/10]"
                    titleSize="text-2xl sm:text-4xl"
                  />
                )}

                {/* Right column: wide top + 2 small - Đã thêm justify-between */}
                <div className="flex flex-col justify-between gap-4 lg:gap-6">
                  {wide && (
                    <ProjectTile
                      project={wide}
                      slug={slug}
                      aspect="aspect-[16/9] flex-shrink-0"
                      titleSize="text-xl sm:text-3xl"
                    />
                  )}
                  {(small1 || small2) && (
                    // Đã sửa thành grid grid-cols-2 chuẩn để chia đều diện tích đáy
                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      {small1 && (
                        <ProjectTile
                          project={small1}
                          slug={slug}
                          aspect="aspect-square"
                          titleSize="text-base sm:text-xl"
                        />
                      )}
                      {small2 && (
                        <ProjectTile
                          project={small2}
                          slug={slug}
                          aspect="aspect-square"
                          titleSize="text-base sm:text-xl"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Remaining */}
              {moreProjects.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 lg:mt-6 lg:grid-cols-4 lg:gap-6">
                  {moreProjects.map((p) => (
                    <ProjectTile
                      key={p.id}
                      project={p}
                      slug={slug}
                      aspect="aspect-square"
                      titleSize="text-base sm:text-lg"
                    />
                  ))}
                </div>
              )}

              {/* Caption + arrow */}
              <div className="mt-10 flex flex-col items-center gap-3 text-center">
                <p className="max-w-2xl text-sm font-medium uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                  Đây là nơi chứa các dự án của chúng tôi.
                </p>
                <a
                  href="#about"
                  aria-label="Cuộn xuống"
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  <svg
                    className="h-7 w-7 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 7l5 5 5-5M7 13l5 5 5-5"
                    />
                  </svg>
                </a>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                  Trải nghiệm chi tiết từ ý tưởng sơ phác đến thực tế.
                </p>
              </div>
            </>
          )}
        </section>

        {/* CONTACT — full section ========================================== */}
        <section id="contact" className="bg-white dark:bg-ink-900">
          <div className="container-page py-16 sm:py-24">
            {/* Title with side lines */}
            <div className="mb-8 flex items-center gap-4 sm:mb-12">
              <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
              <h2 className="text-center text-lg font-light uppercase tracking-[0.3em] sm:text-2xl">
                Kết nối với chúng tôi
              </h2>
              <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700" />
            </div>

            <div className="grid gap-4 lg:grid-cols-12 lg:gap-6">
              {/* LEFT — project image with overlay form */}
              <div className="lg:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-300 dark:bg-slate-800">
                  {featured?.coverImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrl(featured.coverImage)}
                      alt={featured.title}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h3 className="text-lg font-light uppercase tracking-[0.15em] text-stone-100 sm:text-2xl">
                      {featured?.title}
                    </h3>
                  </div>

                  {/* Form overlay */}
                  <div className="absolute left-1/2 top-1/2 w-[88%] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white/95 p-6 shadow-2xl backdrop-blur-sm dark:bg-ink-900/95 sm:p-7">
                    <p className="text-center text-[0.7rem] font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                      Gửi yêu cầu dự án
                    </p>
                    <InlineInquiryForm architectSlug={slug} />
                  </div>
                </div>

                {featured?.description && (
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    {featured.description.length > 110
                      ? `${featured.description.slice(0, 110)}...`
                      : featured.description}
                  </p>
                )}
              </div>

              {/* RIGHT — info cards stacked */}
              <div className="flex flex-col gap-4 lg:col-span-7 lg:gap-6">
                {/* Direct contact */}
                <div className="bg-stone-100/70 p-6 ring-1 ring-stone-200 dark:bg-slate-900/70 dark:ring-slate-800 sm:p-8">
                  <h3 className="text-center text-lg font-light uppercase tracking-[0.2em] sm:text-2xl">
                    Liên hệ trực tiếp
                  </h3>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2 sm:gap-x-8">
                    {architect.phone && (
                      <p className="flex items-baseline gap-2 text-sm">
                        <span className="text-slate-500">Điện thoại:</span>
                        <a
                          href={`tel:${architect.phone}`}
                          className="font-medium hover:text-sage-600 dark:hover:text-sage-300"
                        >
                          {architect.phone}
                        </a>
                      </p>
                    )}
                    <p className="flex items-baseline gap-2 text-sm">
                      <span className="text-slate-500">Email:</span>
                      <a
                        href={`mailto:${architect.email}`}
                        className="break-all font-medium hover:text-sage-600 dark:hover:text-sage-300"
                      >
                        {architect.email}
                      </a>
                    </p>
                    <p className="flex items-baseline gap-2 text-sm">
                      <span className="text-slate-500">Phụ trách:</span>
                      <span className="font-medium">{architect.name}</span>
                    </p>
                    <p className="flex items-baseline gap-2 text-sm">
                      <span className="text-slate-500">Phản hồi:</span>
                      <span className="font-medium">Trong vòng 24h</span>
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-around border-t border-stone-300 pt-5 text-slate-500 dark:border-slate-700">
                    {architect.phone && (
                      <a
                        href={`tel:${architect.phone}`}
                        aria-label="Gọi điện"
                        className="hover:text-sage-600 dark:hover:text-sage-300"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      </a>
                    )}
                    <a
                      href={`mailto:${architect.email}`}
                      aria-label="Email"
                      className="hover:text-sage-600 dark:hover:text-sage-300"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                    <span aria-label="Địa chỉ" className="text-slate-400">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z"
                        />
                        <circle cx="12" cy="9" r="2.5" strokeWidth={1.5} />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Office map + Process */}
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                  {/* Office map — Đà Nẵng */}
                  <div className="bg-stone-50 p-5 ring-1 ring-stone-200 dark:bg-ink-950 dark:ring-slate-800 sm:p-6">
                    <h3 className="text-center text-base font-light uppercase tracking-[0.2em] sm:text-xl">
                      Văn phòng chính
                    </h3>
                    <div className="mt-4 aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-slate-800">
                      <iframe
                        title="Bản đồ văn phòng Đà Nẵng"
                        src="https://www.google.com/maps?q=Da+Nang,Vietnam&output=embed"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="h-full w-full border-0"
                      />
                    </div>
                    <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
                      Đà Nẵng, Việt Nam
                    </p>
                  </div>

                  {/* Process */}
                  <div className="bg-stone-50 p-5 ring-1 ring-stone-200 dark:bg-ink-950 dark:ring-slate-800 sm:p-6">
                    <h3 className="text-center text-base font-light uppercase tracking-[0.2em] sm:text-xl">
                      Quy trình kết nối
                    </h3>
                    <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                      Hành trình &quot;Blueprint to Reality&quot; cho mỗi dự án.
                    </p>
                    <ol className="mt-5 space-y-3 text-sm">
                      <ProcessStep
                        n={1}
                        title="Tiếp nhận yêu cầu"
                        desc="Bạn gửi form, Kĩ sư liên hệ trong 24h."
                      />
                      <ProcessStep
                        n={2}
                        title="Phác thảo ý tưởng"
                        desc="Khảo sát, lên phương án sơ bộ."
                      />
                      <ProcessStep
                        n={3}
                        title="Triển khai & bàn giao"
                        desc="Thiết kế chi tiết, thi công, hoàn thiện."
                      />
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT — đẩy xuống cuối ======================================= */}
        <section
          id="about"
          className="border-t border-stone-200 bg-stone-100 dark:border-slate-800 dark:bg-ink-950"
        >
          <div className="container-page py-12 sm:py-16">
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
              Kĩ sư phụ trách
            </p>

            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
              {architect.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl(architect.avatarUrl)}
                  alt={architect.name}
                  className="h-24 w-24 flex-shrink-0 rounded-full object-cover shadow-md ring-2 ring-white dark:ring-ink-900 sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-sage-100 text-3xl font-bold text-sage-600 shadow-md ring-2 ring-white dark:bg-slate-800 dark:text-sage-300 dark:ring-ink-900 sm:h-28 sm:w-28">
                  {architect.name.charAt(0)}
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">{architect.name}</h3>
                {architect.tagline && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 sm:text-base">
                    {architect.tagline}
                  </p>
                )}
                {architect.bio && (
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
                    {architect.bio}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href="#contact"
                    className="bg-ink-950 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-ink-900 dark:bg-white dark:text-ink-950"
                  >
                    Liên hệ tư vấn
                  </a>
                  {architect.phone && (
                    <a
                      href={`tel:${architect.phone}`}
                      className="inline-flex items-center gap-1.5 border border-slate-400 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.2em] hover:border-ink-950 dark:border-slate-600 dark:hover:border-white"
                    >
                      {architect.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ProcessStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ink-950 text-xs font-bold text-white dark:bg-white dark:text-ink-950">
        {n}
      </span>
      <div>
        <p className="text-sm font-bold uppercase tracking-wider">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
    </li>
  );
}

function ProjectTile({
  project,
  slug,
  aspect,
  titleSize,
}: {
  project: { slug: string; title: string; coverImage: string | null };
  slug: string;
  aspect: string;
  titleSize: string;
}) {
  return (
    <Link
      href={`/${slug}/projects/${project.slug}`}
      className={`group relative block overflow-hidden bg-slate-200 dark:bg-slate-800 ${aspect}`}
    >
      {project.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl(project.coverImage)}
          alt={project.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <h3
          className={`text-center font-light uppercase leading-tight tracking-[0.12em] text-stone-100 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] ${titleSize}`}
        >
          {project.title}
        </h3>
      </div>
    </Link>
  );
}
