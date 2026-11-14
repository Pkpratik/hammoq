import { useState } from 'react';
import TaskForm from './TaskForm';

export default function TaskItem({ task, onToggle, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const done = task.status === 'done';
  const overdue = !done && task.dueDate && task.dueDate.slice(0, 10) < new Date().toISOString().slice(0, 10);

  if (editing) {
    return (
      <li className="task">
        <TaskForm
          initial={task}
          onSubmit={async (v) => { await onSave(task._id, v); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={`task p-${task.priority} ${done ? 'done' : ''}`}>
      <input type="checkbox" className="check" checked={done} onChange={() => onToggle(task)} aria-label={`Mark "${task.title}" ${done ? 'not done' : 'done'}`} />
      <div className="body">
        <div className="name">{task.title}</div>
        {task.description && <p>{task.description}</p>}
        <div className="meta">
          <span className={`pill ${task.priority}`}>{task.priority}</span>
          {task.dueDate && (
            <span className={overdue ? 'overdue' : ''}>
              📅 {new Date(task.dueDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}
              {overdue && ' · overdue'}
            </span>
          )}
        </div>
      </div>
      <div className="actions">
        <button className="ghost" onClick={() => setEditing(true)}>Edit</button>
        <button className="ghost danger" onClick={() => onDelete(task)}>Delete</button>
      </div>
    </li>
  );
}
