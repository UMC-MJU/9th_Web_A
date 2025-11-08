import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { axiosInstance } from "../../apis/axios";
import CommentSkeletonList from "./CommentSkeletonList";

interface Comment {
  id: number;
  author: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

const Comment = () => {
  const { lpId } = useParams<{ lpId: string }>();
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [input, setInput] = useState("");

  // ✅ 댓글 목록 패칭
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["lpComments", lpId, order],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await axiosInstance.get(
          `/v1/lps/${lpId}/comments?cursor=${pageParam}&limit=10&order=${order}`
        );
        return res.data;
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) =>
        lastPage?.data?.hasNext ? lastPage.data.nextCursor : undefined,
      enabled: !!lpId,
    });

  const { ref, inView } = useInView({ threshold: 0 });

  // ✅ 무한 스크롤 트리거
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const comments: Comment[] =
    data?.pages.flatMap((page) => page.data.data) ?? [];

  // ✅ 로딩 시 스켈레톤
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-[#1e1e1e] rounded-2xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">댓글</h2>
        <CommentSkeletonList count={10} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#1e1e1e] rounded-2xl p-6 text-white space-y-5">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">댓글</h2>
        <div className="space-x-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              order === "desc"
                ? "bg-pink-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setOrder("desc")}
          >
            최신순
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              order === "asc"
                ? "bg-pink-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
            onClick={() => setOrder("asc")}
          >
            오래된순
          </button>
        </div>
      </div>

      {/* 댓글 입력 */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="댓글을 입력해주세요"
          className="flex-1 bg-gray-800 text-white rounded-md px-3 py-2 text-sm focus:outline-none"
        />
        <button
          className="bg-gray-600 text-white text-sm px-3 py-2 rounded-md cursor-not-allowed"
          disabled
        >
          작성
        </button>
      </div>
      <p className="text-xs text-gray-400">※ 현재는 UI만 구현되어 있습니다.</p>

      {/* 댓글 목록 */}
      <div className="divide-y divide-gray-700 mt-4 space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="pt-4 flex gap-3 items-start">
            <img
              src={
                comment.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${comment.author}`
              }
              alt="avatar"
              className="w-8 h-8 rounded-full bg-gray-700"
            />
            <div>
              <p className="text-sm font-semibold">{comment.author}</p>
              <p className="text-gray-300 text-sm">{comment.content}</p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}

        {/* 추가 로딩 시 스켈레톤 */}
        {isFetchingNextPage && <CommentSkeletonList count={5} />}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-10 flex justify-center items-center mt-4">
        {isFetchingNextPage && (
          <span className="text-gray-400 text-sm">Loading more…</span>
        )}
      </div>
    </div>
  );
};

export default Comment;
