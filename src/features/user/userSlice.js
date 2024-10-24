import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart } from "../cart/cartSlice";

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {}
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {}
);

export const logout = () => (dispatch) => {};

// Async Thunk 는 비동기 작업을 수행할 때 사용하는 Redux Toolkit의 기능입니다.
// api 상태에 따라 자동으로 3가지 상태를 반환해준다.
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    { email, name, password, navigate },
    { dispatch, rejectWithValue }
  ) => {
    try{
      const response = await api.post("/user", {email,name,password });
      // 성공
      // 1. 성공 토스트 메세지 보여주기
      dispatch(showToastMessage({
        message:"회원가입을 성공했습니다.",status:"success"
      }))
      // 2. 로그인 페이지로 리다이렉트
      navigate("/login")

      return response.data.data;
      
    }catch(error){
      // 실패
      // 1. 실패 토스트 메세지 보여주기
      dispatch(showToastMessage({
        message:"회원가입을 실패했습니다.",status:"error"
      }))
      // 2. 에러값을 저장한다..
      return rejectWithValue(error.re)
    }
  }
);

export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {}
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
  },
  // 직접적으로 아이템 호출할때 reducer를 사용한다.
  // 비동기 작업을 할 때 처럼 외부의 함수(creatAsyncThunk 처럼)를 통해서 호출할때 extraReducers를 사용한다.
  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state)=>{
      state.loading = true;
    })
    .addCase(registerUser.fulfilled, (state)=>{
      state.loading = false; // 로딩 스피너 끄기
      state.registrationError = null; // 혹시 에러가 남아있을 수 있으니 초기화

    })
    .addCase(registerUser.rejected, (state,action)=>{
      state.registrationError = action.payload; // 에러값을 저장
      
    })
  },
});
export const { clearErrors } = userSlice.actions;
export default userSlice.reducer;
