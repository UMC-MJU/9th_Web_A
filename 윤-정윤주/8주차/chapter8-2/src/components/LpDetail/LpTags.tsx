import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Tag {
    id: number;
    name: string;
}

interface LpTagsProps {
    tags: Tag[];
    isEditMode: boolean;
    editTagsList: string[];
    tagInput: string;
    onTagInputChange: (value: string) => void;
    onAddTag: () => void;
    onRemoveTag: (tag: string) => void;
    onTagInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function LpTags({
    tags,
    isEditMode,
    editTagsList,
    tagInput,
    onTagInputChange,
    onAddTag,
    onRemoveTag,
    onTagInputKeyDown,
}: LpTagsProps) {
    const navigate = useNavigate();

    if (!isEditMode) {
        return tags.length > 0 ? (
        <div className="flex flex-wrap gap-2 justify-center mb-6">
            {tags.map((t) => (
            <button
                key={t.id}
                onClick={() => navigate(`/lps?search=${t.name}`)}
                className="text-xs px-3 py-1 rounded-full bg-gray-800 text-pink-400 hover:bg-gray-700 transition"
            >
                #{t.name}
            </button>
            ))}
        </div>
        ) : null;
    }

    return (
        <div className="w-full mb-6">
        {/* 태그 입력 */}
        <div className="flex gap-2 mb-3">
            <input
            type="text"
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={tagInput}
            onChange={(e) => onTagInputChange(e.target.value)}
            onKeyDown={onTagInputKeyDown}
            placeholder="태그를 입력하고 Enter 또는 추가 버튼을 누르세요"
            />
            <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
            onClick={onAddTag}
            >
            추가
            </button>
        </div>

        {/* 태그 칩 리스트 */}
        {editTagsList.length > 0 ? (
            <div className="flex flex-wrap gap-2">
            {editTagsList.map((tag, index) => (
                <div
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-pink-500 text-white rounded-full text-xs"
                >
                <span>#{tag}</span>
                <button
                    onClick={() => onRemoveTag(tag)}
                    className="hover:bg-pink-600 rounded-full p-0.5 transition-colors"
                >
                    <X size={14} />
                </button>
                </div>
            ))}
            </div>
        ) : (
            <p className="text-xs text-gray-500 text-center">태그를 추가해보세요</p>
        )}
        </div>
    );
}