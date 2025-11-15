import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getComments } from "../../apis/comment";
import { useComment } from "../../hooks/mutations/useComment";
import CommentSkeletonList from "./CommentSkeletonList";
import { MoreVertical, Edit2, Trash2, Check } from "lucide-react";

const Comment = () => {
  const { lpid } = useParams<{ lpid: string }>();
  const lpId = Number(lpid);
  const [commentInput, setCommentInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", lpId],
      queryFn: ({ pageParam = 1 }) => getComments(lpId, pageParam),
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : undefined,
      enabled: !!lpId,
    });

  const comments = data?.pages.flatMap((page) => page.data) ?? [];

  const { writeComment, editComment, deleteComment } = useComment(lpId);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!commentInput.trim()) return alert("댓글 내용을 입력해주세요!");
    writeComment.mutate(commentInput);
    setCommentInput("");
  };

  const handleEditSave = (commentId: number) => {
    if (!editValue.trim()) return;
    editComment.mutate({ commentId, content: editValue });
    setEditingId(null);
  };

  const handleDelete = (commentId: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteComment.mutate(commentId);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      },
      { threshold: 1 }
    );
    if (bottomRef.current) observer.observe(bottomRef.current);
    return () => {
      if (bottomRef.current) observer.unobserve(bottomRef.current);
    };
  }, [hasNextPage, fetchNextPage]);

  const currentUserId = 1;

  return (
    <div className="bg-[#1e1e1e] rounded-2xl p-6 text-white mt-10">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">댓글</h3>
      </div>

      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="댓글을 입력해주세요"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="flex-1 bg-[#2a2a2a] p-2 rounded-md outline-none text-sm"
        />
        <button
          onClick={handleSubmit}
          disabled={writeComment.isPending}
          className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md transition text-sm disabled:opacity-50"
        >
          {writeComment.isPending ? "작성 중..." : "작성"}
        </button>
      </div>

      {isLoading ? (
        <CommentSkeletonList count={5} position="top" />
      ) : comments.length === 0 ? (
        <p className="text-gray-400 text-center mt-3">아직 댓글이 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((c: any) => (
            <div
              key={c.id}
              className="flex items-start gap-3 border-b border-gray-700 pb-3 relative"
            >
              {c.author?.avatar ? (
                <img
                  src={c.author.avatar}
                  alt={c.author.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-600 text-white text-sm font-semibold">
                  {c.author?.name?.charAt(0) ?? "?"}
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-center text-sm text-gray-400 mb-1">
                  <span className="font-medium text-white">
                    {c.author?.name ?? "익명"}
                  </span>
                  <span>
                    {new Date(c.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>

                {editingId === c.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="bg-transparent border border-gray-600 rounded-md px-2 py-1 text-sm w-full outline-none"
                    />
                    <button
                      onClick={() => handleEditSave(c.id)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <Check size={18} />
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-200 text-sm">{c.content}</p>
                )}
              </div>

              {c.author?.id === currentUserId && editingId !== c.id && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setMenuOpenId(menuOpenId === c.id ? null : c.id)
                    }
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {menuOpenId === c.id && (
                    <div className="absolute right-0 top-5 bg-[#2f2f2f] border border-gray-700 rounded-md shadow-md w-20 z-20">
                      <button
                        onClick={() => {
                          setEditingId(c.id);
                          setEditValue(c.content);
                          setMenuOpenId(null);
                        }}
                        className="flex items-center gap-2 px-3 py-1 w-full hover:bg-gray-700 text-sm text-gray-200"
                      >
                        <Edit2 size={14} />
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="flex items-center gap-2 px-3 py-1 w-full hover:bg-gray-700 text-sm text-red-400"
                      >
                        <Trash2 size={14} />
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {isFetchingNextPage && (
            <CommentSkeletonList count={3} position="bottom" />
          )}
        </div>
      )}

      <div ref={bottomRef} className="h-6" />
    </div>
  );
};

export default Comment;
