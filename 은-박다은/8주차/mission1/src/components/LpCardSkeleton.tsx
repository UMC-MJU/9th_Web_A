// src/components/LpCardSkeleton.tsx
const LpCardSkeleton = () => {
  return (
    <div className="bg-[#141414] rounded-lg overflow-hidden shadow-md relative animate-pulse">
      <div className="relative w-full h-56 bg-gray-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.8s_infinite]" />
      </div>

      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default LpCardSkeleton;
