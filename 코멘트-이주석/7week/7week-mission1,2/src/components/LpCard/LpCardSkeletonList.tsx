import React from "react";
import LpCardSkeleton from "./LpCardSkeleton";

interface LpCardSkeletonListProps {
  count?: number;
}

const LpCardSkeletonList = ({ count = 8 }: LpCardSkeletonListProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <LpCardSkeleton key={idx} />
      ))}
    </>
  );
};

export default LpCardSkeletonList;
