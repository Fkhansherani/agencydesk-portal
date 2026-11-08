# AgencyDesk Portal (React + Redux Toolkit)

A small front end for the AgencyDesk idea: agency admins manage tasks, clients see only
client-visible tasks for their own client. Data is mocked in memory (no backend needed).

## Run
```
npm install
npm run dev      # http://localhost:5173
npm test
```

## Redux Toolkit concepts used (know these for interviews)
- **Store** (`src/store.js`): one object holding all state, built with `configureStore`.
- **Slices** (`authSlice.js`, `tasksSlice.js`): `createSlice` gives reducers and actions together.
  Reducers look like they mutate state, but Immer makes it immutable behind the scenes.
- **Actions**: `addTask`, `setStatus`, `toggleInternal`, `setFilter`. `prepare` builds the payload (id via `nanoid`).
- **Async thunk**: `fetchTasks` with `createAsyncThunk` handles pending, fulfilled and rejected states.
- **Selectors**: `selectVisibleTasks` (memoized with `createSelector`) holds the visibility rule in one place,
  like `visible_task_sql()` in the AgencyDesk backend.
- **React-Redux**: `Provider`, `useSelector`, `useDispatch`.

## Ideas to extend (do one yourself)
1. Replace `fetchTasks` with a real call to the AgencyDesk FastAPI backend.
2. Add a login screen that stores the JWT in the auth slice.
3. Add comments per task with the same visibility rule.
