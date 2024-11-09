import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 초기 상태 정의
const initialState = {
  couponList: [],
  loading: false,
  error: "",
};

// 쿠폰 목록을 가져오는 비동기 작업 정의
export const getUserCoupons = createAsyncThunk(
  "coupon/getUserCoupons",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data.user.couponList;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

export const useCoupon = createAsyncThunk(
  "user/useCoupon",
  async (couponId, { rejectWithValue }) => {
    try {
      await api.put(`/user/useCoupon`, { couponId })
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
)

export const deactivateCoupon = createAsyncThunk(
  "coupon/deactivateCoupon",
  async (couponId, { rejectWithValue }) => {
    try {
      await api.put(`/coupon/deactivate`, { couponId })
    } catch (error) {
      return rejectWithValue(error.error);
    } 
  }
)

// 쿠폰 슬라이스 생성
const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.couponList = action.payload;
        state.error = "";
      })
      .addCase(getUserCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(useCoupon.pending, (state) => {
        state.loading = true;
      })
      .addCase(useCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.couponList = state.couponList.filter((coupon) => coupon.id !== action.payload);
        
      })
      .addCase(useCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export default couponSlice.reducer;
