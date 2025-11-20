import { useRef, useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import CommentSkeleton from "./CommentSkeleton";
import { useGetInfiniteComments } from "../hooks/queries/useGetInfiniteComments";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EllipsisVertical, Trash, Pencil } from "lucide-react"; // 아이콘 사용
import { createComment, deleteComment, updateComment } from "../apis/comment";

interface LpCommentsProps {
  lpId: number;
  userId?: number; // 본인 댓글 판별하기 위해 필요하면 사용
}

const LpComments = ({ lpId, userId }: LpCommentsProps) => {
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);

  const qc = useQueryClient();

  // 작성 input 관리
  const [commentInput, setCommentInput] = useState("");

  // 수정 기능 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  // (…) 메뉴 오픈 상태
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // 무한스크롤 데이터
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useGetInfiniteComments(lpId, order);

  const comments = data?.pages.flatMap((page) => page.data.data) ?? [];

  const observerRef = useRef<HTMLDivElement | null>(null);

  // 무한스크롤 IntersectionObserver
  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  // ---------------------------
  // 댓글 생성 mutation
  // ---------------------------
  const createMutation = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
      setCommentInput("");
    },
  });

  const handleCreate = () => {
    if (!commentInput.trim()) return;
    createMutation.mutate({ lpId, content: commentInput });
  };

  // ---------------------------
  // 댓글 수정 mutation
  // ---------------------------
  const updateMutation = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
      setEditingId(null);
      setEditContent("");
    },
  });

  const handleUpdate = (commentId: number) => {
    if (!editContent.trim()) return;
    updateMutation.mutate({ lpId, commentId, content: editContent });
  };

  // ---------------------------
  // 댓글 삭제 mutation
  // ---------------------------
  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lpComments", lpId, order] });
    },
  });

  const handleDelete = (commentId: number) => {
    deleteMutation.mutate({ lpId, commentId });
  };

  return (
    <div className="w-full max-w-3xl bg-[#18181b] rounded-xl p-6 mt-8">
      {/* 상단 정렬 버튼 */}
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

      {/* 댓글 작성 UI */}
      <div className="mb-5">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="댓글을 입력해주세요"
            className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-md p-2 text-sm text-white"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-gray-700 text-sm rounded-md hover:bg-pink-600 transition"
          >
            작성
          </button>
        </div>
      </div>

      {/* 로딩 skeleton */}
      {isPending &&
        Array.from({ length: 5 }).map((_, i) => <CommentSkeleton key={i} />)}

      {/* 댓글 리스트 */}
      {comments.map((comment) => {
        // 여기서 본인 댓글인지 판별
        const isMine = !userId || comment.authorId === userId;

        return (
          <div
            key={comment.id}
            className="border-b border-gray-700 py-3 text-sm text-gray-200"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-300">
                {comment.author?.name ?? "익명"}
              </span>

              <div className="flex items-center gap-2 relative">
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>

                {/* (…) 버튼 (본인 댓글만) */}
                {isMine && (
                  <button
                    onClick={() =>
                      setOpenMenuId((prev) =>
                        prev === comment.id ? null : comment.id
                      )
                    }
                    className="p-1 hover:bg-gray-700 rounded-full"
                  >
                    <EllipsisVertical size={18} />
                  </button>
                )}

                {/* 수정/삭제 메뉴 */}
                {openMenuId === comment.id && (
                  <div className="absolute right-0 top-6 bg-[#1f1f1f] border border-gray-700 rounded-md shadow-md w-24 z-10">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-1 px-3 py-1 text-xs hover:bg-gray-700"
                    >
                      <Pencil size={14} /> 수정
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(comment.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full flex items-center gap-1 px-3 py-1 text-xs text-red-400 hover:bg-gray-700"
                    >
                      <Trash size={14} /> 삭제
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 수정 중 UI */}
            {editingId === comment.id ? (
              <div className="mt-2 flex items-center gap-2">
                <input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 bg-[#0f0f0f] border border-gray-700 rounded-md p-2 text-sm text-white"
                />
                <button
                  onClick={() => handleUpdate(comment.id)}
                  className="px-3 py-1 bg-pink-600 rounded-md text-sm hover:bg-pink-500"
                >
                  ✓
                </button>
              </div>
            ) : (
              <p className="mt-1 text-gray-400">{comment.content}</p>
            )}
          </div>
        );
      })}

      {/* 다음 페이지 로딩 skeleton */}
      {isFetchingNextPage &&
        Array.from({ length: 3 }).map((_, i) => (
          <CommentSkeleton key={`next-${i}`} />
        ))}

      <div ref={observerRef} className="h-10" />
    </div>
  );
};

export default LpComments;
