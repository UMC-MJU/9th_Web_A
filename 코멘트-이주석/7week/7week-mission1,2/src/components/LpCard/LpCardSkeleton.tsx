import React from "react";

const LpCardSkeleton = () => {
  return (
    <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-800 animate-pulse">
      {/* Shimmer gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" />
    </div>
  );
};

export default LpCardSkeleton;
