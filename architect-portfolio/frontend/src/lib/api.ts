export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  area: number | null;
  location: string | null;
  year: number | null;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  images: { id: string; url: string; order: number }[];
};

export type Inquiry = {
  id: string;
  customerName: string;
  phone: string;
  email: string | null;
  areaRequest: number | null;
  budgetRange: string | null;
  message: string | null;
  status: 'NEW' | 'CONTACTED' | 'CLOSED';
  createdAt: string;
};

export function imageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BACKEND_URL}${path}`;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  // Public
  listProjects: () => request<Project[]>('/projects'),
  getProject: (slug: string) => request<Project>(`/projects/slug/${slug}`),
  createInquiry: (data: Record<string, unknown>) =>
    request<{ ok: boolean; id: string }>('/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; name: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
    ),

  // Admin (token-required)
  withToken(token: string) {
    const auth = { Authorization: `Bearer ${token}` };
    return {
      me: () => request('/auth/me', { headers: auth }),
      updateMe: (data: Record<string, unknown>) =>
        request('/auth/me', { method: 'PATCH', headers: auth, body: JSON.stringify(data) }),

      listAllProjects: () => request<Project[]>('/projects/admin/all', { headers: auth }),
      getProjectById: (id: string) => request<Project>(`/projects/admin/${id}`, { headers: auth }),
      createProject: (data: Record<string, unknown>) =>
        request<Project>('/projects', {
          method: 'POST',
          headers: auth,
          body: JSON.stringify(data),
        }),
      updateProject: (id: string, data: Record<string, unknown>) =>
        request<Project>(`/projects/${id}`, {
          method: 'PATCH',
          headers: auth,
          body: JSON.stringify(data),
        }),
      deleteProject: (id: string) =>
        request<{ ok: boolean }>(`/projects/${id}`, { method: 'DELETE', headers: auth }),

      listInquiries: () => request<Inquiry[]>('/inquiries', { headers: auth }),
      updateInquiryStatus: (id: string, status: Inquiry['status']) =>
        request<Inquiry>(`/inquiries/${id}/status`, {
          method: 'PATCH',
          headers: auth,
          body: JSON.stringify({ status }),
        }),
      deleteInquiry: (id: string) =>
        request<{ ok: boolean }>(`/inquiries/${id}`, { method: 'DELETE', headers: auth }),

      uploadImages: async (files: File[]) => {
        const fd = new FormData();
        files.forEach((f) => fd.append('files', f));
        const res = await fetch(`${API_URL}/upload/images`, {
          method: 'POST',
          headers: auth,
          body: fd,
        });
        if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
        return res.json() as Promise<{ urls: string[] }>;
      },
    };
  },
};
