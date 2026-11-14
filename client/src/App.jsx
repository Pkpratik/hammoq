import { useCallback, useEffect, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from './api';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Debounce search so we don't hit the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTasks(await getTasks({ status, q: search }));
      setError('');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => { load(); }, [load]);

  // Wrap mutations so any failure is surfaced in the banner (and re-thrown for forms).
  const run = async (fn) => {
    try { setError(''); return await fn(); } catch (e) { setError(e.message); throw e; }
  };

  const add = (t) => run(async () => {
    const created = await createTask(t);
    if (!status || status === created.status) setTasks((p) => [created, ...p]);
  });

  const save = (id, t) => run(async () => {
    const u = await updateTask(id, t);
    setTasks((p) => p.map((x) => (x._id === id ? u : x)));
  });

  // Optimistic toggle: update UI immediately, roll back on failure.
  const toggle = async (task) => {
    const next = task.status === 'done' ? 'todo' : 'done';
    const prev = tasks;
    setTasks((p) => p.map((x) => (x._id === task._id ? { ...x, status: next } : x)));
    try { await updateTask(task._id, { status: next }); }
    catch (e) { setTasks(prev); setError(e.message); }
  };

  const remove = (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    run(async () => {
      await deleteTask(task._id);
      setTasks((p) => p.filter((x) => x._id !== task._id));
    }).catch(() => {});
  };

  const remaining = tasks.filter((t) => t.status === 'todo').length;
  const doneCount = tasks.length - remaining;
  const pct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const tabs = [['', 'All'], ['todo', 'To do'], ['done', 'Done']];

  return (
    <main>
      <header>
        <h1>Task Manager</h1>
        <p className="sub">
          {tasks.length === 0 ? 'Nothing here yet' : `${remaining} remaining · ${doneCount} done`}
        </p>
        <div className="progress" aria-label={`${pct}% complete`}><span style={{ width: `${pct}%` }} /></div>
      </header>

      <TaskForm onSubmit={add} />

      <div className="toolbar">
        <div className="search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
          <input type="search" placeholder="Search tasks…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="tabs" role="tablist" aria-label="Filter by status">
          {tabs.map(([v, label]) => (
            <button key={v} role="tab" aria-selected={status === v} className={status === v ? 'active' : ''} onClick={() => setStatus(v)}>{label}</button>
          ))}
        </div>
      </div>

      {error && <div className="error" role="alert">{error}</div>}

      {loading ? (
        <ul className="list"><li className="skeleton" /><li className="skeleton" /></ul>
      ) : tasks.length === 0 ? (
        <div className="empty"><div className="big">✨</div>No tasks found. Add one above.</div>
      ) : (
        <ul className="list">
          {tasks.map((t) => (
            <TaskItem key={t._id} task={t} onToggle={toggle} onSave={save} onDelete={remove} />
          ))}
        </ul>
      )}
    </main>
  );
}
