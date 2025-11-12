const CommentSkeleton = () => {
  return (
    <div className="flex items-start gap-3 py-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-gray-700" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-700 rounded w-1/3 shimmer" />
        <div className="h-3 bg-gray-700 rounded w-2/3 shimmer" />
      </div>
    </div>
  );
};

export default CommentSkeleton;
