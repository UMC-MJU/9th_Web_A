import { createSlice } from "@reduxjs/toolkit";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

export interface CartState {
  cartItems: CartItems;
  amount: number;
  total: number;
}
const initialState: CartState = {
  cartItems: cartItems,
  amount: 0,
  total: 0,
};

// cartSlice 생성
// // createSlice -> reduxToolkit에서 제공
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
});

// duck pattern reducer는 export default로 내보내야함
const cartReducer = cartSlice.reducer;
export default cartReducer;
