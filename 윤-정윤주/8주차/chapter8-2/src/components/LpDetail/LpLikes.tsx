import { Heart } from "lucide-react";

interface Like {
    userId: number;
}

interface LpLikesProps {
    likes: Like[];
    isLiked: boolean;
    onLike: () => void;
    onDislike: () => void;
}

export function LpLikes({ likes, isLiked, onLike, onDislike }: LpLikesProps) {
    return (
        <div className="flex flex-col items-center mb-6">
        <button onClick={isLiked ? onDislike : onLike}>
            <Heart
            color={isLiked ? "red" : "gray"}
            fill={isLiked ? "red" : "transparent"}
            />
        </button>
        <div className="text-sm text-gray-400 mt-2">{likes.length}</div>
        </div>
    );
}