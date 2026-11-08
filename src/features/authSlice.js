import { createSlice } from '@reduxjs/toolkit'

// Who is viewing? Same idea as the memberships table in AgencyDesk:
// one person can act as an agency admin or as a client user.
const initialState = { role: 'agency_admin', clientId: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    viewAsAdmin: () => ({ role: 'agency_admin', clientId: null }),
    viewAsClient: () => ({ role: 'client_user', clientId: 'zenith' }),
  },
})

export const { viewAsAdmin, viewAsClient } = authSlice.actions
export default authSlice.reducer
