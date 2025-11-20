import { PAGINATION_ORDER } from "../../enums/common";

interface LpCommentSectionProps {
    order: PAGINATION_ORDER;
    newComment: string;
    onOrderChange: (order: PAGINATION_ORDER) => void;
    onCommentChange: (value: string) => void;
    onSubmitComment: () => void;
    children: React.ReactNode;
}

export function LpCommentSection({
    order,
    newComment,
    onOrderChange,
    onCommentChange,
    onSubmitComment,
    children,
}: LpCommentSectionProps) {
    return (
        <div className="w-full border-t border-gray-700 pt-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">댓글</h2>
            <select
            className="bg-gray-800 text-sm rounded-md px-2 py-1"
            value={order}
            onChange={(e) => onOrderChange(e.target.value as PAGINATION_ORDER)}
            >
            <option value={PAGINATION_ORDER.DESC}>최신순</option>
            <option value={PAGINATION_ORDER.ASC}>오래된순</option>
            </select>
        </div>

        {/* 댓글 작성란 */}
        <div className="mb-6">
            <textarea
            className="w-full bg-gray-800 text-white rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
            placeholder="댓글을 입력하세요..."
            rows={3}
            maxLength={500}
            value={newComment}
            onChange={(e) => onCommentChange(e.target.value)}
            />
            <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">최대 500자</span>
            <button
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                onClick={onSubmitComment}
            >
                댓글 작성
            </button>
            </div>
        </div>

        {/* 댓글 리스트 */}
        {children}
        </div>
    );
}