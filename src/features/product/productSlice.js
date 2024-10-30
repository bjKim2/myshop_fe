import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";

// 비동기 액션 생성
export const getProductList = createAsyncThunk(
  "products/getProductList",
  async (query, { rejectWithValue }) => {
    try{
      const response = await api.get("/product",{params:{...query}})
      if(response.status !== 200) throw new Error(response.error);

      console.log("response",response);
      return response.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
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
      dispatch(getProductList({page:1}));
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
  async ({ id, ...formData }, { dispatch, rejectWithValue }) => {
    try{
      const response = await api.put(`/product/${id}`,formData);
      if(response.status !== 200) throw new Error(response.error);
      dispatch(getProductList({page:1}));
      dispatch(showToastMessage({message:"상품이 성공적으로 수정되었습니다.",status:"success"}));
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
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
      state.success = false;
    } )
    .addCase(createProduct.fulfilled, (state,action) => {
      state.loading = false;
      state.error = "";
      state.success = true; // 상품 생성을 성공했다? 다이얼로그를 닫고, 실패? 실패메세지를 다이어로그에 보여주고 닫지 않음.
    } )
    .addCase(createProduct.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false; // 팝업을 닫아줌
    } )
    .addCase(getProductList.pending, (state,action) => {
      state.loading = true;
      state.success = false;
    } ) 
    .addCase(getProductList.fulfilled, (state,action) => {
      state.loading = false;
      state.productList = action.payload.data;
      state.error = "";
      state.totalPageNum = action.payload.totalPageNum;
    } ) 
    .addCase(getProductList.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
    } )
    .addCase(editProduct.pending, (state,action) => {
      state.loading = true;
      state.success = false;
    })
    .addCase(editProduct.fulfilled, (state,action) => {
      state.loading = false;
      state.error = "";
      state.success = true; // 팝업을 닫아줌
      console.log("state.success",state.success);
    })
    .addCase(editProduct.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
    })
  },
});

export const { setSelectedProduct, setFilteredList, clearError } =
  productSlice.actions;
export default productSlice.reducer;
