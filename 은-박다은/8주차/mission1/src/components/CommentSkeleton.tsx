const CommentSkeleton = () => {
  return (
    <div className="animate-slow-pulse bg-[#1f1f1f] rounded-md p-3 mb-2 w-full">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-700" />
        <div className="flex-1">
          <div className="h-3 bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
};

export default CommentSkeleton;
