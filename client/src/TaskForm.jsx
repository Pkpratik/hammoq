import { useState } from 'react';

const empty = { title: '', description: '', priority: 'medium', dueDate: '' };

export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(
    initial ? { ...initial, dueDate: initial.dueDate ? initial.dueDate.slice(0, 10) : '' } : empty
  );
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({
        title: form.title,
        description: form.description,
        priority: form.priority,
        dueDate: form.dueDate || null,
      });
      if (!initial) setForm(empty);
    } catch {
      // error is shown by the parent; keep the form contents so nothing is lost
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      {!initial && <div className="title">New task</div>}
      <input placeholder="What needs to be done?" value={form.title} onChange={set('title')} maxLength={100} required />
      <textarea placeholder="Description (optional)" value={form.description} onChange={set('description')} maxLength={1000} rows={2} />
      <div className="row">
        <select value={form.priority} onChange={set('priority')} aria-label="Priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" value={form.dueDate} onChange={set('dueDate')} aria-label="Due date" />
        <button type="submit" disabled={busy}>{initial ? 'Save' : '+ Add task'}</button>
        {onCancel && <button type="button" className="ghost" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
