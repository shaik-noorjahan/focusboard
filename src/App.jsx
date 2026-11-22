import { useState } from "react";
import "./App.css";

const initialTasks = [
  { id: 1, title: "Design homepage mockup", priority: "High", due: "Today", status: "In Progress" },
  { id: 2, title: "Review project proposal", priority: "Medium", due: "Tomorrow", status: "Pending" },
  { id: 3, title: "Update portfolio website", priority: "Low", due: "This week", status: "Pending" },
  { id: 4, title: "Prepare presentation slides", priority: "High", due: "Today", status: "Completed" },
];

export default function App() {
  const [tasks, setTasks] = useState(initialTasks);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState("Medium");
  const [editingTask, setEditingTask] = useState(null);

  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;

  const filtered = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === "All" || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  function toggleStatus(id) {
    setTasks(tasks.map((t) =>
      t.id === id ? { ...t, status: t.status === "Completed" ? "Pending" : "Completed" } : t
    ));
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function openEdit(task) {
    setEditingTask(task);
    setNewTitle(task.title);
    setNewPriority(task.priority);
    setShowForm(true);
  }

  function handleSave() {
    if (!newTitle.trim()) return;
    if (editingTask) {
      setTasks(tasks.map((t) =>
        t.id === editingTask.id ? { ...t, title: newTitle, priority: newPriority } : t
      ));
    } else {
      setTasks([...tasks, { id: Date.now(), title: newTitle, priority: newPriority, due: "Today", status: "Pending" }]);
    }
    setNewTitle("");
    setEditingTask(null);
    setShowForm(false);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">FocusBoard</h2>
        <p className="sidebar-label">MENU</p>
        <nav>
          <a className="active" href="#">Dashboard</a>
          <a href="#">My Tasks</a>
          <a href="#">Calendar</a>
          <a href="#">Settings</a>
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>Your work, in focus.</h1>
            <p>Track tasks, priorities and progress — all in one place.</p>
          </div>
          <button className="add-btn" onClick={() => { setShowForm(true); setEditingTask(null); setNewTitle(""); }}>+ New Task</button>
        </header>

        <div className="banner">
          <div>
            <h2>Make today count.</h2>
            <p>Stay focused on what matters most. Small steps, big progress.</p>
          </div>
          <span className="banner-emoji">✦</span>
        </div>

        <div className="stats">
          <div className="stat"><span>Total tasks</span><h3>{total}</h3></div>
          <div className="stat"><span>In progress</span><h3>{inProgress}</h3></div>
          <div className="stat"><span>Completed</span><h3>{completed}</h3></div>
        </div>

        {showForm && (
          <div className="form-box">
            <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Task title" />
            <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
            <button onClick={handleSave}>{editingTask ? "Update" : "Add Task"}</button>
            <button onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        )}

        <div className="tasks-header">
          <h2>My tasks</h2>
          <div className="filters">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." />
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option>All</option><option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
        </div>

        <div className="task-list">
          {filtered.map((t) => (
            <div className="task-row" key={t.id}>
              <input type="checkbox" checked={t.status === "Completed"} onChange={() => toggleStatus(t.id)} />
              <div className="task-info">
                <b style={{ textDecoration: t.status === "Completed" ? "line-through" : "none" }}>{t.title}</b>
                <span className="pill">{t.priority}</span>
                <span className="due">📅 {t.due}</span>
              </div>
              <button onClick={() => openEdit(t)}>✏️</button>
              <button onClick={() => deleteTask(t.id)}>🗑️</button>
            </div>
          ))}
          {filtered.length === 0 && <p className="empty">No tasks found. Try changing search or filter.</p>}
        </div>
      </main>
    </div>
  );
}