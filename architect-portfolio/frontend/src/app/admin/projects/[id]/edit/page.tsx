'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ProjectForm } from '@/components/ProjectForm';
import { api, Project } from '@/lib/api';
import { getToken } from '@/lib/auth';

export default function EditProjectPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.withToken(token).getProjectById(params.id).then((p) => {
      setProject(p);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <p className="text-slate-500">Đang tải...</p>;
  if (!project) return <p className="text-red-600">Không tìm thấy dự án</p>;

  return (
    <>
      <h1 className="mb-6 text-xl font-bold">Chỉnh sửa: {project.title}</h1>
      <ProjectForm project={project} />
    </>
  );
}
