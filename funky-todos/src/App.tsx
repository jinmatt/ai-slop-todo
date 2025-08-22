import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'

export type TodoItem = {
  id: string
  text: string
  done: boolean
}

function App() {
  const [newTaskText, setNewTaskText] = useState('')
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const raw = localStorage.getItem('funky_todos')
      return raw ? (JSON.parse(raw) as TodoItem[]) : []
    } catch {
      return []
    }
  })
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    localStorage.setItem('funky_todos', JSON.stringify(todos))
  }, [todos])

  const remainingCount = useMemo(() => todos.filter(t => !t.done).length, [todos])

  function handleAdd() {
    const text = newTaskText.trim()
    if (!text) return
    const newItem: TodoItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text,
      done: false,
    }
    setTodos(prev => [newItem, ...prev])
    setNewTaskText('')
    inputRef.current?.focus()
  }

  function handleToggle(id: string) {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function handleDelete(id: string) {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">Funky Todos</h1>
        <p className="app-subtitle">Add, check, delete. Keep it groovy.</p>
      </header>

      <div className="composer">
        <input
          ref={inputRef}
          value={newTaskText}
          onChange={e => setNewTaskText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="composer-input"
          placeholder="What needs doing?"
          aria-label="New task"
        />
        <button className="btn btn-add" onClick={handleAdd} aria-label="Add task">
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map(item => (
          <li key={item.id} className={`todo-item${item.done ? ' done' : ''}`}>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => handleToggle(item.id)}
                aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
              />
              <span className="checkmark" aria-hidden="true" />
            </label>
            <span className="todo-text">{item.text}</span>
            <button className="btn btn-delete" onClick={() => handleDelete(item.id)} aria-label="Delete task">
              ×
            </button>
          </li>
        ))}
      </ul>

      <footer className="app-footer">
        <span className="count">
          {remainingCount} {remainingCount === 1 ? 'task' : 'tasks'} remaining
        </span>
      </footer>
    </div>
  )
}

export default App
