import { describe, it, expect } from 'vitest'
import reducer, { addTask, setStatus, selectVisibleTasks } from './features/tasksSlice'

const items = [
  { id: '1', title: 'A', status: 'todo', internal: false, clientId: 'zenith' },
  { id: '2', title: 'B internal', status: 'todo', internal: true, clientId: 'zenith' },
  { id: '3', title: 'C other client', status: 'todo', internal: false, clientId: 'acme' },
]
const stateFor = (auth) => ({ auth, tasks: { items, loading: 'done', filter: 'all' } })

describe('visibility rules', () => {
  it('client sees only own, non-internal tasks', () => {
    const out = selectVisibleTasks(stateFor({ role: 'client_user', clientId: 'zenith' }))
    expect(out.map((t) => t.id)).toEqual(['1'])
  })
  it('admin sees everything', () => {
    const out = selectVisibleTasks(stateFor({ role: 'agency_admin', clientId: null }))
    expect(out).toHaveLength(3)
  })
})

describe('reducers', () => {
  it('adds a task as todo', () => {
    const next = reducer(undefined, addTask('New', true, 'zenith'))
    expect(next.items[0]).toMatchObject({ title: 'New', status: 'todo', internal: true })
  })
  it('changes status', () => {
    const start = { items: [...items], loading: 'done', filter: 'all' }
    const next = reducer(start, setStatus({ id: '1', status: 'done' }))
    expect(next.items[0].status).toBe('done')
  })
})
