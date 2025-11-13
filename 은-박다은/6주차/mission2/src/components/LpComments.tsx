import { useRef, useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import CommentSkeleton from "./CommentSkeleton";
import { useGetInfiniteComments } from "../hooks/queries/useGetInfiniteComments";

interface LpCommentsProps {
  lpId: number;
}

const LpComments = ({ lpId }: LpCommentsProps) => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useGetInfiniteComments(lpId, order);

  const comments = data?.pages.flatMap((page) => page.data.data) ?? [];

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  return (
    <div className="w-full max-w-3xl bg-[#18181b] rounded-xl p-6 mt-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">댓글</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.ASC)}
            className={`px-3 py-1 rounded ${
              order === PAGINATION_ORDER.ASC
                ? "bg-pink-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.DESC)}
            className={`px-3 py-1 rounded ${
              order === PAGINATION_ORDER.DESC
                ? "bg-pink-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            placeholder="댓글을 입력해주세요"
            className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-md p-2 text-sm text-white"
          />
          <button className="px-4 py-2 bg-gray-700 text-sm rounded-md hover:bg-pink-600 transition">
            작성
          </button>
        </div>

        <p className="mt-1 text-xs text-pink-400">
          현재는 디자인만 구현된 상태입니다.
        </p>
      </div>

      {isPending &&
        Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)}

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="border-b border-gray-700 py-3 text-sm text-gray-200"
        >
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-300">
              {comment.author?.name ?? "익명"}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mt-1 text-gray-400">{comment.content}</p>
        </div>
      ))}

      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, i) => (
          <CommentSkeleton key={`next-${i}`} />
        ))}

      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default LpComments;
