import type { Comment } from "../../types/lp";
import { useState } from "react";
import useUpdateComment from "../../hooks/mutations/useUpdateComment";
import useDeleteComment from "../../hooks/mutations/useDeleteComment";

interface CommentProps {
    comment: Comment;
    lpId: number;
    myId?: number;
}

export const LpComment = ({ comment, lpId, myId }: CommentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);

    const updateCommentMutation = useUpdateComment(lpId);
    const deleteCommentMutation = useDeleteComment(lpId);

    const handleUpdate = () => {
        updateCommentMutation.mutate({ 
            commentId: comment.id, 
            content: editContent 
        });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (confirm("댓글을 삭제하시겠습니까?")) {
        deleteCommentMutation.mutate({
            lpId: lpId,
            commentId: comment.id,
        });
        }
    };

    const authorAvatar =
        comment.author?.avatar && comment.author.avatar.trim() !== ""
            ? comment.author.avatar
            : "/fallback-avatar.png";

    return (
        <div className="border-b border-gray-700 py-4">
        <div className="flex items-center mb-2 gap-4">
            <img
                src={authorAvatar}
                alt={comment.author?.name || "익명"}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.fallback) {
                    target.src = "/fallback-avatar.png";
                    target.dataset.fallback = "true";
                    }
                }}
                className="w-8 h-8 rounded-full object-cover"
                />
            <div>
            <p className="font-semibold text-sm text-white">{comment.author?.name || "익명"}</p>
            <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                })}
            </p>
            </div>
            <div className="ml-auto flex gap-2">
                <div className="ml-auto flex gap-2">
                    {comment.author?.id === myId && (
                        <>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-xs text-gray-400 hover:text-white"
                        >
                            수정
                        </button>
                        <button
                            onClick={handleDelete}
                            className="text-xs text-gray-400 hover:text-red-400"
                        >
                            삭제
                        </button>
                        </>
                    )}
                </div>
            </div>
        </div>

        {isEditing ? (
            <div>
            <textarea
                className="w-full bg-gray-800 text-white rounded-md p-2 text-sm resize-none focus:outline-none border border-gray-700"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
            />
            <div className="flex justify-end mt-1 gap-2">
                <button
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm"
                onClick={() => setIsEditing(false)}
                >
                취소
                </button>
                <button
                className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm"
                onClick={handleUpdate}
                >
                저장
                </button>
            </div>
            </div>
        ) : (
            <p className="text-gray-300">{comment.content}</p>
        )}
        </div>
    );
};
