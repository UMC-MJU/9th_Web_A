import { useCartStore } from "../hooks/useCartStore";
import { useModalStore } from "../hooks/useModalStore";

const Modal = () => {
  const { isOpen, close } = useModalStore();
  const { clearCart } = useCartStore();

  if (!isOpen) return null;

  const handleCancel = () => {
    close();
  };

  const handleConfirm = () => {
    clearCart();
    close();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
        <h2 className="text-lg font-semibold mb-4">정말 삭제하시겠습니까?</h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            아니요
          </button>

          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
