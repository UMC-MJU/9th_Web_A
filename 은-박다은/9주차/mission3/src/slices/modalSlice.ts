import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  isOpen: boolean; // 모달 열림/닫힘 상태
}

const initialState: ModalState = {
  isOpen: false, // 기본값: 닫힘
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

// 액션 export
export const { openModal, closeModal } = modalSlice.actions;

// 리듀서 export (cartSlice 방식 동일)
const modalReducer = modalSlice.reducer;
export default modalReducer;
