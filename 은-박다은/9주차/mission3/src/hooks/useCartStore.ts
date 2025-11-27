import { create } from "zustand";
import cartItems from "../constants/cartItems";
import type { CartItems } from "../types/cart";

// Zustand에서 관리할 상태 + 액션 타입 정의
interface CartStoreState {
  cartItems: CartItems;
  amount: number;
  total: number;

  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  calculateTotals: () => void;
}

// Zustand 스토어 생성
export const useCartStore = create<CartStoreState>((set, get) => ({
  cartItems,
  amount: 0,
  total: 0,

  // 증가
  increase: (id) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount + 1 } : item
      ),
    }));

    get().calculateTotals();
  },

  // 감소
  decrease: (id) => {
    const currentItem = get().cartItems.find((item) => item.id === id);

    if (currentItem && currentItem.amount === 1) {
      get().removeItem(id);
      return;
    }

    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.id === id ? { ...item, amount: item.amount - 1 } : item
      ),
    }));

    get().calculateTotals();
  },

  // 개별 삭제
  removeItem: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== id),
    }));

    get().calculateTotals();
  },

  // 전체 삭제
  clearCart: () => {
    set(() => ({
      cartItems: [],
      amount: 0,
      total: 0,
    }));
  },

  // 합계 계산
  calculateTotals: () => {
    const { cartItems } = get();

    let amount = 0;
    let total = 0;

    cartItems.forEach((item) => {
      amount += item.amount;
      total += item.amount * item.price;
    });

    set(() => ({
      amount,
      total,
    }));
  },
}));
