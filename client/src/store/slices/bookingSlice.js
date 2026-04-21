// d:/kaaya eco resort/client/src/store/slices/bookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api.js'

export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/bookings', bookingData)
      return data.booking
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Booking failed')
    }
  }
)

export const fetchMyBookings = createAsyncThunk(
  'booking/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/bookings/my')
      return data.bookings
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load bookings')
    }
  }
)

export const createPaymentIntent = createAsyncThunk(
  'booking/createPaymentIntent',
  async ({ bookingId, amount }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/payments/create-intent', { bookingId, amount })
      return data
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Payment setup failed')
    }
  }
)

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    // Booking search state
    checkIn: null,
    checkOut: null,
    adults: 2,
    children: 0,
    selectedRoomId: null,

    // Created booking
    currentBooking: null,
    myBookings: [],

    // Payment
    clientSecret: null,

    loading: false,
    error: null,
  },
  reducers: {
    setSearchParams(state, action) {
      const { checkIn, checkOut, adults, children } = action.payload
      if (checkIn  !== undefined) state.checkIn  = checkIn
      if (checkOut !== undefined) state.checkOut = checkOut
      if (adults   !== undefined) state.adults   = adults
      if (children !== undefined) state.children = children
    },
    setSelectedRoom(state, action) {
      state.selectedRoomId = action.payload
    },
    clearBooking(state) {
      state.currentBooking = null
      state.clientSecret = null
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.currentBooking = action.payload
        state.loading = false
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.myBookings = action.payload
        state.loading = false
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.clientSecret = action.payload.clientSecret
        state.loading = false
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSearchParams, setSelectedRoom, clearBooking, clearError } = bookingSlice.actions
export default bookingSlice.reducer
