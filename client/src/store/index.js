// d:/kaaya eco resort/client/src/store/index.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer    from './slices/authSlice.js'
import roomReducer    from './slices/roomSlice.js'
import bookingReducer from './slices/bookingSlice.js'

export const store = configureStore({
  reducer: {
    auth:    authReducer,
    rooms:   roomReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Dates in booking state are serialized as ISO strings, so this is safe
        ignoredActions: ['booking/setSearchParams'],
      },
    }),
})
