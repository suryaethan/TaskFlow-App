/**
 * TaskFlow-App - React Frontend
 * Modern Task Management UI with Dark Mode
 * @author suryaethan
 */

import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [formData, setFormData] = useState({
    username: '', email: '', password: ''
  });
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'medium', status: 'todo'
  });

  // Fetch tasks on load
  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setTasks(await res.json());
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleAuth = async (e, isRegister) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.username);
      } else {
        alert(data.detail || 'Authentication failed');
      }
    } catch (err) {
      alert('Error connecting to server');
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(taskForm)
      });
      if (res.ok) {
        fetchTasks();
        setTaskForm({ title: '', description: '', priority: 'medium', status: 'todo' });
      }
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setTasks([]);
  };

  if (!token) {
    return (
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <div className="auth-container">
          <h1>📝 TaskFlow</h1>
          <form onSubmit={(e) => handleAuth(e, !showLoginForm)}>
            {!showLoginForm && (
              <input
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button type="submit">{showLoginForm ? 'Login' : 'Register'}</button>
          </form>
          <p onClick={() => setShowLoginForm(!showLoginForm)}>
            {showLoginForm ? 'Need an account? Register' : 'Have an account? Login'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header>
        <h1>📝 TaskFlow</h1>
        <div className="header-actions">
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <span>Hi, {user}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="task-form">
        <form onSubmit={createTask}>
          <input
            placeholder="Task title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />
          <select
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">➕ Add Task</button>
        </form>
      </div>

      <div className="task-lists">
        {['todo', 'in_progress', 'done'].map((status) => (
          <div key={status} className="task-column">
            <h2>{status.replace('_', ' ').toUpperCase()}</h2>
            {tasks
              .filter((t) => t.status === status)
              .map((task) => (
                <div key={task.id} className={`task-card priority-${task.priority}`}>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>
                  <div className="task-actions">
                    <select
                      value={task.status}
                      onChange={(e) => updateTask(task.id, { status: e.target.value })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button onClick={() => deleteTask(task.id)}>🗑️</button>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
