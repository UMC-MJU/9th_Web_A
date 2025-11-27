import { create } from "zustand";
import { useShallow } from "zustand/shallow";

interface ModalActions {
    openModal: () => void;
    closeModal: () => void;
}

interface ModalState {
    isOpen: boolean;
    actions: ModalActions;
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    actions: {
        openModal: () => set({ isOpen: true }),
        closeModal: () => set({ isOpen: false }),
    },
}));

export const useModalInfo = () => 
    useModalStore(
        useShallow((state) => ({
            isOpen: state.isOpen,
        }))
    );

export const useModalActions = () => useModalStore((state) => state.actions);