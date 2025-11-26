import CommentSkeleton from "./CommentSkeleton";

const CommentSkeletonList = ({
  count = 5,
  position = "top", // top or bottom 구분
}: {
  count?: number;
  position?: "top" | "bottom";
}) => {
  return (
    <div
      className={`space-y-4 ${
        position === "top" ? "mt-4 mb-2" : "mt-2 pt-4 border-t border-gray-700"
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
};

export default CommentSkeletonList;
