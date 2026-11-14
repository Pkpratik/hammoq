const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error([data.error, ...(data.details || [])].filter(Boolean).join(': ') || 'Request failed');
  return data;
}

export const getTasks = ({ status, q } = {}) => {
  const p = new URLSearchParams();
  if (status) p.set('status', status);
  if (q) p.set('q', q);
  return request(`/tasks?${p}`);
};
export const createTask = (t) => request('/tasks', { method: 'POST', body: JSON.stringify(t) });
export const updateTask = (id, t) => request(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(t) });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' });
