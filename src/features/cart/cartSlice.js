import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { showToastMessage } from "../common/uiSlice";


const initialState = {
  loading: false,
  error: "",
  cartList: [],
  selectedItem: {},
  cartItemCount: 0,
  totalPrice: 0,
};

// Async thunk actions
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ id, size }, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.post("/cart",{productId:id,size,qty:1});
      if(response.status !== 200) throw new Error(response.error);
      dispatch(showToastMessage({message:"상품이 성공적으로 추가되었습니다.",status:"success"}));
      return response.data.cartItemQty //TODO
    }catch(error){
      dispatch(showToastMessage({message:"카트에 상품 추가 실패 ",status:"error"}));
      return rejectWithValue(error.error);
    }
  }
);

export const getCartList = createAsyncThunk(
  "cart/getCartList",
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/cart");
      if(response.status !== 200) throw new Error(response.error);
      return response.data.data;
    }catch(error){
      return rejectWithValue(error.error);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async (id, { rejectWithValue, dispatch }) => {
    try{
      const response= await api.delete('/cart',{data :{cartItemId:id}});
      if(response.status !== 200) throw new Error(response.error);
      dispatch(showToastMessage({message:"상품이 성공적으로 삭제되었습니다.",status:"success"}));
      dispatch(getCartList());
      return response.data;
    }catch(error){
      console.log("error : ",error);
      return rejectWithValue(error.error);
    }
  }
);

export const updateQty = createAsyncThunk(
  "cart/updateQty",
  async ({ id, value }, { rejectWithValue , dispatch }) => {
    try{
      const response = await api.put("/cart",{cartItemId:id,qty:value});
      if(response.status !== 200) throw new Error(response.error);
      return response.data.data;
    }catch(error){
      if (error.data){
        dispatch(showToastMessage({message:error.error,status:"error"}));
        dispatch(getCartList());
      }
      return rejectWithValue(error);
    }
  }
);

export const getCartQty = createAsyncThunk(
  "cart/getCartQty",
  async (_, { rejectWithValue, dispatch }) => {
    try{
      const response = await api.get("/cart/qty");
      if(response.status !== 200) throw new Error(response.error);
      return response.data.data;
    }catch(error){  
      return rejectWithValue(error.error);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    initialCart: (state) => {
      state.cartItemCount = 0;
    },
    // You can still add reducers here for non-async actions if necessary
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state,action) => {
      state.loading = true;
    })
    .addCase(addToCart.fulfilled, (state,action) => {
      state.loading = false;
      state.error = "";
      state.cartItemCount =action.payload;
      
    })
    .addCase(addToCart.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;

    })
    .addCase(getCartList.pending, (state,action) => {
      state.loading = true;
    })
    .addCase(getCartList.fulfilled, (state,action) => {
      state.loading = false;
      state.error = "";
      state.cartList = action.payload;
      state.totalPrice = action.payload.reduce((total,item) => total + item.productId.price * item.qty,0);
    })
    .addCase(getCartList.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(updateQty.pending, (state,action) => {
      state.loading = true;
    })
    .addCase(updateQty.fulfilled, (state,action) => {
      state.loading = false;
      state.error = "";
      // state.cartList = action.payload;
      state.totalPrice = action.payload.reduce((total,item) => total + item.productId.price * item.qty,0);
    })
    .addCase(updateQty.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload.error;
    })
    .addCase(deleteCartItem.pending, (state,action) => {
      state.loading = true;
    })
    .addCase(deleteCartItem.fulfilled, (state,action) => { 
      state.loading = false;
      state.error = "";
      // state.cartList = action.payload.data;
      state.totalPrice = action.payload.reduce((total,item) => total + item.productId.price * item.qty,0);
    })
    .addCase(deleteCartItem.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload.error
    })
    .addCase(getCartQty.pending, (state,action) => {
      state.loading = true;
    })
    .addCase(getCartQty.fulfilled, (state,action) => {
      state.loading = false;
      state.error = "";
      state.cartItemCount = action.payload;
    })
    .addCase(getCartQty.rejected, (state,action) => {
      state.loading = false;
      state.error = action.payload.error;
    });
  },
});

export default cartSlice.reducer;
export const { initialCart } = cartSlice.actions;
