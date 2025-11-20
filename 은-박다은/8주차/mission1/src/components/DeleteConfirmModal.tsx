import { X } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[999]">
      <div className="bg-[#1f1f1f] p-8 rounded-xl w-[350px] relative text-center">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          onClick={onClose}
        >
          <X size={22} />
        </button>

        <p className="text-lg mb-6">정말 탈퇴하시겠습니까?</p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-200"
          >
            예
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
          >
            아니오
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
