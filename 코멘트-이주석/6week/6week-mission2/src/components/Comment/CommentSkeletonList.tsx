import CommentSkeleton from "./CommentSkeleton";

interface CommentSkeletonListProps {
  count?: number;
}

const CommentSkeletonList = ({ count = 10 }: CommentSkeletonListProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </>
  );
};

export default CommentSkeletonList;
