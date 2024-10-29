import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {}
);

export const getProductDetail = createAsyncThunk(
  "products/getProductDetail",
  async (id, { rejectWithValue }) => {}
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.post("/product",formData);
      if(response.status !== 200) throw new Error(response.error);
      dispatch(showToastMessage({message:"상품이 성공적으로 등록되었습니다.",status:"success"}));
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { dispatch, rejectWithValue }) => {}
);

export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {}
);

// 슬라이스 생성
const productSlice = createSlice({
  name: "products",
  initialState: {
    productList: [],
    selectedProduct: null,
    loading: false,
    error: "",
    totalPageNum: 1,
    success: false,
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    setFilteredList: (state, action) => {
      state.filteredList = action.payload;
    },
    clearError: (state) => {
      state.error = "";
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createProduct.pending, (state,action) => {
      state.loading = true;
    } )
    builder.addCase(createProduct.fulfilled, (state,action) => {
      state.loading = false;
      state.error = "";
      state.success = true; // 상품 생성을 성공했다? 다이얼로그를 닫고, 실패? 실패메세지를 다이어로그에 보여주고 닫지 않음.
    } )
    builder.addCase(createProduct.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    } )
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
