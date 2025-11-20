const LpCommentSkeleton = () => {
  return (
    <div className="border-b border-gray-300 pb-4 mb-4 animate-pulse">
      <div className="flex items-center mb-2">
        {/* 아바타 스켈레톤 */}
        <div className="w-8 h-8 bg-gray-400 rounded-full mr-3"></div>
        <div>
          {/* 이름 스켈레톤 */}
          <div className="h-4 bg-gray-400 rounded w-20 mb-1"></div> 
          {/* 날짜 스켈레톤 */}
          <div className="h-3 bg-gray-400 rounded w-16"></div>
        </div>
      </div>
      {/* 내용 스켈레톤 */}
      <div className="h-5 bg-gray-400 rounded w-full"></div>
    </div>
  );
}

export default LpCommentSkeleton;