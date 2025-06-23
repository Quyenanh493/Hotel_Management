import { createSlice } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

const initialState = {
  dateIn: null,
  dateOut: null,
  guestCounts: {
    rooms: 1,
    adults: 2,
    children: 0
  },
  roomType: null,
  city: null,
  hotelId: null
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchDates: (state, action) => {
      const { dateIn, dateOut } = action.payload;
      // Kiểm tra ngày hợp lệ
      if (!dateIn || !dateOut) {
        throw new Error('Ngày nhận phòng và trả phòng không được để trống');
      }
      if (dayjs(dateIn).isAfter(dayjs(dateOut))) {
        throw new Error('Ngày nhận phòng phải trước ngày trả phòng');
      }
      state.dateIn = dateIn;
      state.dateOut = dateOut;
    },
    setGuestCounts: (state, action) => {
      const { rooms, adults, children } = action.payload;
      // Kiểm tra số lượng hợp lệ
      if (rooms < 1 || adults < 1 || children < 0) {
        throw new Error('Số phòng và khách không hợp lệ');
      }
      state.guestCounts = { rooms, adults, children };
    },
    setRoomType: (state, action) => {
      const roomType = action.payload;
      // Kiểm tra roomType là chuỗi hợp lệ hoặc null
      if (roomType !== null && typeof roomType !== 'string') {
        throw new Error('Loại phòng phải là chuỗi hoặc null');
      }
      state.roomType = roomType;
    },
    setCity: (state, action) => {
      const city = action.payload;
      // Kiểm tra city là chuỗi hợp lệ hoặc null
      if (city !== null && typeof city !== 'string') {
        throw new Error('Thành phố phải là chuỗi hoặc null');
      }
      state.city = city;
    },
    setHotelId: (state, action) => {
      const hotelId = action.payload;
      // Kiểm tra hotelId là số hoặc null
      if (hotelId !== null && typeof hotelId !== 'number') {
        throw new Error('Hotel ID phải là số hoặc null');
      }
      state.hotelId = hotelId;
    },
    resetSearch: () => initialState
  }
});

export const { setSearchDates, setGuestCounts, setRoomType, setCity, setHotelId, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;