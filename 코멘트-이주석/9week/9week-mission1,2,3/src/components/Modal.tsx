import { useCartActions } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore";

export const Modal = () => {
  const { isOpen, close } = useModalStore();
  const { clearCart } = useCartActions();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/30 backdrop-blur-md z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[350px] text-center">
        <h2 className="text-xl font-semibold mb-4">정말 삭제하시겠습니까?</h2>

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
            onClick={close}
          >
            아니요
          </button>

          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            onClick={() => {
              clearCart();
              close();
            }}
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
