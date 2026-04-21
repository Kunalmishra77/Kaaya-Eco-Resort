// d:/kaaya eco resort/client/src/store/slices/roomSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api.js'

export const fetchRooms = createAsyncThunk(
  'rooms/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/rooms')
      return data.rooms
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load rooms')
    }
  }
)

export const fetchRoomById = createAsyncThunk(
  'rooms/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/rooms/${id}`)
      return data.room
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Room not found')
    }
  }
)

const roomSlice = createSlice({
  name: 'rooms',
  initialState: {
    rooms: [],
    selectedRoom: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedRoom(state) {
      state.selectedRoom = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.rooms = action.payload
        state.loading = false
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoomById.fulfilled, (state, action) => {
        state.selectedRoom = action.payload
        state.loading = false
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearSelectedRoom } = roomSlice.actions
export default roomSlice.reducer
