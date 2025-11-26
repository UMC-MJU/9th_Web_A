const CommentSkeleton = () => {
  return (
    <div className="flex items-start gap-3 animate-pulse">
      {/* 프로필 */}
      <div className="w-8 h-8 rounded-full bg-gray-600" />
      {/* 이름 + 내용 */}
      <div className="flex-1 space-y-2">
        <div className="w-24 h-3 bg-gray-600 rounded" />
        <div className="w-full h-3 bg-gray-700 rounded" />
        <div className="w-5/6 h-3 bg-gray-700 rounded" />
      </div>
    </div>
  );
};

export default CommentSkeleton;
