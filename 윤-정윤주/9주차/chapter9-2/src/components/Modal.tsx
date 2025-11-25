import { useDispatch, useSelector } from "../hooks/useCustomRedux";
import { closeModal } from "../slices/modalSlice";
import { clearCart } from "../slices/cartSlice";

const Modal = () => {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state) => state.modal);

    const handleCloseModal = () => {
        dispatch(closeModal());
    };

    const handleConfirm = () => {
        dispatch(clearCart());
        dispatch(closeModal());
    };

    if (!isOpen) return null;

    return (
        <>
            {/* 오버레이 배경 */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={handleCloseModal}
            />

            
            {/* 모달 창 */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4">
                    <h2 className="text-xl font-bold mb-4 text-gray-800">
                        정말 삭제하시겠습니까?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        장바구니의 모든 상품이 삭제됩니다.
                    </p>
                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={handleCloseModal}
                            className="px-6 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                        >
                            아니요
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            네
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;