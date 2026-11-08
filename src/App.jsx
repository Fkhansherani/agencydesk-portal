import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { viewAsAdmin, viewAsClient } from './features/authSlice'
import {
  fetchTasks, addTask, setStatus, toggleInternal, setFilter,
  selectVisibleTasks, selectCounts,
} from './features/tasksSlice'

const STATUSES = ['todo', 'in_progress', 'done']
const label = (s) => s.replace('_', ' ')

export default function App() {
  const dispatch = useDispatch()
  const auth = useSelector((s) => s.auth)
  const tasks = useSelector(selectVisibleTasks)
  const counts = useSelector(selectCounts)
  const { loading, filter } = useSelector((s) => s.tasks)
  const [title, setTitle] = useState('')
  const [internal, setInternal] = useState(true)
  const isClient = auth.role === 'client_user'

  useEffect(() => { dispatch(fetchTasks()) }, [dispatch])

  const submit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    dispatch(addTask(title.trim(), internal, 'zenith'))
    setTitle('')
  }

  return (
    <main className="page">
      <header className="top">
        <h1>Zenith App</h1>
        <div className="switch" role="group" aria-label="View as">
          <button className={!isClient ? 'on' : ''} onClick={() => dispatch(viewAsAdmin())}>Agency admin</button>
          <button className={isClient ? 'on' : ''} onClick={() => dispatch(viewAsClient())}>Client</button>
        </div>
      </header>

      <p className="counts">
        {STATUSES.map((s) => `${label(s)}: ${counts[s] || 0}`).join('   ')}
      </p>

      <div className="filters">
        {['all', ...STATUSES].map((f) => (
          <button key={f} className={filter === f ? 'on' : ''} onClick={() => dispatch(setFilter(f))}>
            {label(f)}
          </button>
        ))}
      </div>

      {!isClient && (
        <form className="add" onSubmit={submit}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task title" />
          <label>
            <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} />
            Agency only
          </label>
          <button type="submit">Add task</button>
        </form>
      )}

      {loading === 'loading' && <p>Loading tasks…</p>}
      {loading === 'error' && <p role="alert">Could not load tasks. Refresh to try again.</p>}
      {loading === 'done' && tasks.length === 0 && <p>No tasks match this view.</p>}

      <ul className="list">
        {tasks.map((t) => (
          <li key={t.id}>
            <span className="title">{t.title}</span>
            {t.internal && <span className="tag">Agency only</span>}
            {isClient ? (
              <span className="status">{label(t.status)}</span>
            ) : (
              <>
                <select value={t.status} onChange={(e) => dispatch(setStatus({ id: t.id, status: e.target.value }))}>
                  {STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}
                </select>
                <button onClick={() => dispatch(toggleInternal(t.id))}>
                  {t.internal ? 'Show to client' : 'Hide from client'}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </main>
  )
}
