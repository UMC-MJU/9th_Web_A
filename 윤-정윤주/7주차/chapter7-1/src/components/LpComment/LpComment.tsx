import type { Comment } from "../../types/lp";

interface CommentProps {
    comment: Comment;
}

export const LpComment = ({ comment }: CommentProps) => {
    return (
        <div className="border-b border-gray-700 py-4">
            <div className="flex items-center mb-2">
                <img
                    src={comment.author?.avatar || "/fallback-avatar.png"}
                    alt={comment.author?.name || "익명"}
                    className="w-8 h-8 rounded-full mr-3"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/fallback-avatar.png";
                    }}
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
            </div>
            <p className="text-gray-300">{comment.content}</p>
        </div>
    );
}