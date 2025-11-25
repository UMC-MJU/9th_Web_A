import { immer } from "zustand/middleware/immer";
import type { CartItems } from "../types/cart";
import { create } from "zustand";
import cartItems from "../constants/cartItems";
import { useShallow } from "zustand/shallow";

interface CartActions  {
    increase: (id: string) => void;
    decrease: (id: string) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    calculateTotals: () => void;
}

interface CartState {
    cartItems: CartItems;
    amount: number;
    total: number;
}

// 초기 합계 계산
const calculateInitialTotals = () => {
    let amount = 0;
    let total = 0;
    cartItems.forEach((item) => {
        amount += item.amount;
        total += item.amount * item.price;
    });
    return { amount, total };
};

const initialTotals = calculateInitialTotals();

export const useCartStore = create<CartState & { actions: CartActions }>()(
    immer((set, get) => ({
        cartItems: cartItems,
        amount: initialTotals.amount,
        total: initialTotals.total,
        actions: {
            increase: (id: string) => {
                set((state) => {
                    const cartItem = state.cartItems.find((item) => item.id === id);
                    if (cartItem) {
                        cartItem.amount += 1;
                    }
                });
                get().actions.calculateTotals();
            },
            decrease: (id: string) => {
                set((state) => {
                    const cartItem = state.cartItems.find((item) => item.id === id);
                    if (cartItem && cartItem.amount > 0) {
                        cartItem.amount -= 1;
                    }
                });
                get().actions.calculateTotals();
            },
            removeItem: (id: string) => {
                set((state) => {
                    state.cartItems = state.cartItems.filter((item) => item.id !== id);
                });
                get().actions.calculateTotals();
            },
            clearCart: () => {
                set((state) => {
                    state.cartItems = [];
                });
                get().actions.calculateTotals();
            },
            calculateTotals: () => {
                set((state) => {
                    let amount = 0;
                    let total = 0;

                    state.cartItems.forEach((item) => {
                        amount += item.amount;
                        total += item.amount * item.price;
                    });

                    state.amount = amount;
                    state.total = total;
                });
            }, 
        },
    }))
);

export const useCartInfo = () =>
    useCartStore(
        useShallow((state) => ({
            cartItems: state.cartItems,
            amount: state.amount,
            total: state.total,
        }))
    );

export const useCartActions = () => useCartStore((state) => state.actions);