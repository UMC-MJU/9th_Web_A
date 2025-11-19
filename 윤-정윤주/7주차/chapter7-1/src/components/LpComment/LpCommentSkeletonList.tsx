import LpCommentSkeleton from "./LpCommentSkeleton";

interface LpCommentSkeletonListProps {
    count: number;
}

const LpCommentSkeletonList = ({ count }: LpCommentSkeletonListProps) => {
    return (
        <>
            {new Array(count).fill(0).map((_, index) => (
                <LpCommentSkeleton key={index} />
            ))}
        </>
    );
}

export default LpCommentSkeletonList;