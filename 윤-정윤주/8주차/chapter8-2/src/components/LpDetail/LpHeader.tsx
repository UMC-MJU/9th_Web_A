interface LpHeaderProps {
    authorAvatar: string;
    authorName: string;
    createdAt: string;
    isAuthor: boolean;
    isEditMode: boolean;
    isUpdating: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
}

export function LpHeader({
    authorAvatar,
    authorName,
    createdAt,
    isAuthor,
    isEditMode,
    isUpdating,
    onEdit,
    onSave,
    onCancel,
    onDelete,
}: LpHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6 w-full">
        <div className="flex items-center gap-3">
            <img
            src={authorAvatar}
            alt={authorName}
            className="w-10 h-10 rounded-full object-cover border border-gray-700"
            onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.dataset.fallback) {
                target.src = "/fallback-avatar.png";
                target.dataset.fallback = "true";
                }
            }}
            />
            <div>
            <div className="text-sm font-semibold">{authorName}</div>
            <div className="text-xs text-gray-400">{createdAt}</div>
            </div>
        </div>

        {isAuthor && (
            <div className="flex gap-2">
            {!isEditMode ? (
                <>
                <button
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-white text-sm transition-colors"
                    onClick={onEdit}
                >
                    수정
                </button>
                <button
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-white text-sm transition-colors"
                    onClick={onDelete}
                >
                    삭제
                </button>
                </>
            ) : (
                <>
                <button
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-white text-sm transition-colors disabled:bg-gray-600"
                    onClick={onSave}
                    disabled={isUpdating}
                >
                    {isUpdating ? "저장 중..." : "저장"}
                </button>
                <button
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-white text-sm transition-colors"
                    onClick={onCancel}
                    disabled={isUpdating}
                >
                    취소
                </button>
                </>
            )}
            </div>
        )}
        </div>
    );
}