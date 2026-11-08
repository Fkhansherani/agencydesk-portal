import { configureStore } from '@reduxjs/toolkit'
import auth from './features/authSlice'
import tasks from './features/tasksSlice'

export const makeStore = () => configureStore({ reducer: { auth, tasks } })
export const store = makeStore()
