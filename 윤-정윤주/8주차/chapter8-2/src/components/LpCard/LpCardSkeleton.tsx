// LpCardSkeleton.tsx
const LpCardSkeleton = () => {
    return (
        <div className="relative overflow-hidden rounded-lg">
        {/* 썸네일 스켈레톤 */}
        <div className="w-full aspect-square bg-gray-700 animate-pulse"></div>

        {/* 오버레이 스켈레톤 */}
        <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-3">
            {/* 제목 스켈레톤 */}
            <div className="h-4 bg-gray-500 rounded mb-2 w-3/4 animate-pulse"></div>
            
            {/* 날짜와 좋아요 스켈레톤 */}
            <div className="flex justify-between items-center mt-1">
            <div className="h-3 bg-gray-500 rounded w-20 animate-pulse"></div>
            <div className="h-3 bg-gray-500 rounded w-12 animate-pulse"></div>
            </div>
        </div>
        </div>
    );
};

export default LpCardSkeleton;