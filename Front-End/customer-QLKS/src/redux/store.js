import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './search/searchSlice';
import bookingReducer from './booking/bookingSlice';


const store = configureStore({
  reducer: {
    search: searchReducer,
    booking: bookingReducer
  },
});

export default store;