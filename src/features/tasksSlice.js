import { createSlice, createAsyncThunk, createSelector, nanoid } from '@reduxjs/toolkit'

const seedTasks = [
  { id: '1', title: 'Design database schema', status: 'done', internal: false, clientId: 'zenith' },
  { id: '2', title: 'Review vendor pricing (agency only)', status: 'todo', internal: true, clientId: 'zenith' },
  { id: '3', title: 'Build client portal login', status: 'in_progress', internal: false, clientId: 'zenith' },
  { id: '4', title: 'Acme homepage copy', status: 'todo', internal: false, clientId: 'acme' },
]

// Async thunk: pretends to call an API, so the UI has loading and error states.
export const fetchTasks = createAsyncThunk('tasks/fetch', async () => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return seedTasks
})

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: { items: [], loading: 'idle', filter: 'all' },
  reducers: {
    addTask: {
      reducer(state, action) {
        state.items.push(action.payload)
      },
      prepare(title, internal, clientId) {
        return { payload: { id: nanoid(), title, status: 'todo', internal, clientId } }
      },
    },
    setStatus(state, { payload: { id, status } }) {
      const task = state.items.find((t) => t.id === id)
      if (task) task.status = status
    },
    toggleInternal(state, { payload: id }) {
      const task = state.items.find((t) => t.id === id)
      if (task) task.internal = !task.internal
    },
    setFilter(state, { payload }) {
      state.filter = payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => { state.loading = 'loading' })
      .addCase(fetchTasks.fulfilled, (state, { payload }) => {
        state.loading = 'done'
        state.items = payload
      })
      .addCase(fetchTasks.rejected, (state) => { state.loading = 'error' })
  },
})

export const { addTask, setStatus, toggleInternal, setFilter } = tasksSlice.actions
export default tasksSlice.reducer

// Selector: the visibility rule lives in ONE place, like visible_task_sql() in AgencyDesk.
const selectItems = (state) => state.tasks.items
const selectFilter = (state) => state.tasks.filter
const selectAuth = (state) => state.auth

export const selectVisibleTasks = createSelector(
  [selectItems, selectAuth, selectFilter],
  (items, auth, filter) =>
    items
      .filter((t) => auth.role !== 'client_user' || (!t.internal && t.clientId === auth.clientId))
      .filter((t) => filter === 'all' || t.status === filter)
)

export const selectCounts = createSelector([selectVisibleTasks], (tasks) =>
  tasks.reduce((acc, t) => ({ ...acc, [t.status]: (acc[t.status] || 0) + 1 }), {})
)
