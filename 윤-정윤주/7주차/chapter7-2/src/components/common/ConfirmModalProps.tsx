interface ConfirmModalProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    }

    export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-gray-900 p-6 rounded-lg w-80 text-white text-center">
            <p className="mb-4">{message}</p>
            <div className="flex justify-between gap-4">
            <button
                onClick={onConfirm}
                className="flex-1 bg-white text-gray-900 py-2 rounded hover:bg-gray-200 transition"
            >
                예
            </button>
            <button
                onClick={onCancel}
                className="flex-1 bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
            >
                아니오
            </button>
            </div>
        </div>
        </div>
    );
}
