import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookingInfo: {
    customerName: '',
    phoneNumber: '',
    checkInDate: '',
    checkOutDate: '',
    roomCount: 0,
    daysCount: 0,
    totalAmount: 0,
    roomId: '',
    roomName: '',
    roomImage: '',
    roomPrice: 0,
    adultCount: 0,
    childrenCount: 0,
  },
  selectedAmenities: []
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setBookingInfo: (state, action) => {
      state.bookingInfo = { ...state.bookingInfo, ...action.payload };
    },
    addAmenity: (state, action) => {
      state.selectedAmenities.push(action.payload);
    },
    removeAmenity: (state, action) => {
      state.selectedAmenities = state.selectedAmenities.filter(
        amenity => amenity.id !== action.payload
      );
    },
    clearAmenities: (state) => {
      state.selectedAmenities = [];
    },
    resetBooking: () => initialState
  }
});

export const { 
  setBookingInfo, 
  addAmenity, 
  removeAmenity, 
  clearAmenities, 
  resetBooking 
} = bookingSlice.actions;

export default bookingSlice.reducer;