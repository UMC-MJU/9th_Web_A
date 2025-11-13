// src/pages/LpDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp";
import type { Lp } from "../types/lp";
import { useEffect, useState } from "react";
import LoadingFallback from "../components/common/LoadingFallback";
import ErrorFallback from "../components/common/ErrorFallback";
import { useInView } from "react-intersection-observer";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteCommentList from "../hooks/queries/useGetInfiniteComments";
import LpCommentSkeletonList from "../components/LpComment/LpCommentSkeletonList";
import { LpComment } from "../components/LpComment/LpComment";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import { useAuth } from "../context/AuthContext";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import useCreateComment from "../hooks/mutations/useCreateComment";
import { Heart, X } from "lucide-react";
import { useDeleteLp } from "../hooks/mutations/useDeleteLp";
import { useUpdateLp } from "../hooks/mutations/useUpdateLp";

export default function LpDetailPage() {
  const { lpId } = useParams<{ lpId: string }>();
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { data: me } = useGetMyInfo(accessToken);

  // LP 상세 조회
  const { data: lp, isLoading, isError } = useQuery<Lp>({
    queryKey: ["lp", lpId],
    queryFn: () => getLpDetail({ lpId: Number(lpId) }),
    enabled: !!lpId,
  });

  // 편집 모드 상태
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTagsList, setEditTagsList] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // LP 데이터가 로드되면 편집 폼 초기화
  useEffect(() => {
    if (lp) {
      setEditTitle(lp.title);
      setEditContent(lp.content);
      setEditTagsList(lp.tags?.map(t => t.name) || []);
    }
  }, [lp]);

  // 태그 추가
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !editTagsList.includes(trimmedTag)) {
      setEditTagsList([...editTagsList, trimmedTag]);
      setTagInput("");
    }
  };

  // 태그 삭제
  const handleRemoveTag = (tagToRemove: string) => {
    setEditTagsList(editTagsList.filter(tag => tag !== tagToRemove));
  };

  // Enter 키로 태그 추가
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // 좋아요 관련
  const { mutate: likeMutate } = usePostLike();
  const { mutate: disLikeMutate } = useDeleteLike();
  const handleLikeLp = () => likeMutate({ lpId: Number(lpId) });
  const handleDislikeLp = () => disLikeMutate({ lpId: Number(lpId) });
  const isLiked = lp?.likes?.some((like) => like.userId === me?.data.id);

  // 댓글 관련 상태
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);
  const [newComment, setNewComment] = useState("");

  // 댓글 무한스크롤
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading: isCommentLoading,
  } = useGetInfiniteCommentList(Number(lpId), 5, order);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 댓글 작성 mutation
  const createCommentMutation = useCreateComment(Number(lpId));
  const handleCreateComment = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate(
      { lpId: Number(lpId), content: newComment },
      { onSuccess: () => setNewComment("") }
    );
  };

  // LP 수정 mutation
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateLp(Number(lpId));
  const handleSaveEdit = () => {
    if (!editTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!editContent.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    updateMutate(
      {
        lpId: Number(lpId),
        title: editTitle,
        content: editContent,
        thumbnail: lp!.thumbnail,
        tags: editTagsList,
      },
      {
        onSuccess: () => {
          alert("LP가 수정되었습니다.");
          setIsEditMode(false);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    // 원래 값으로 복원
    if (lp) {
      setEditTitle(lp.title);
      setEditContent(lp.content);
      setEditTagsList(lp.tags?.map(t => t.name) || []);
      setTagInput("");
    }
    setIsEditMode(false);
  };

  // LP 삭제 mutation
  const { mutate: deleteMutate } = useDeleteLp();
  const handleDelete = () => {
    if (!confirm("정말 이 LP를 삭제하시겠습니까?")) return;
    deleteMutate(
      { lpId: Number(lpId) },
      {
        onSuccess: () => {
          alert("LP가 삭제되었습니다.");
          navigate("/lps");
        },
      }
    );
  };

  if (isLoading) return <LoadingFallback />;
  if (isError)
    return <ErrorFallback message="LP 정보를 불러오는 중 오류가 발생했습니다." />;
  if (!lp)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        LP 정보를 불러올 수 없습니다.
      </div>
    );

  // LP 존재 이후 선언
  const authorName = lp.author?.name || "익명";
  const authorAvatar =
    lp.author?.avatar && lp.author.avatar.trim() !== ""
      ? lp.author.avatar
      : "/fallback-avatar.png";
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "날짜 정보 없음";
      return date.toLocaleDateString("ko-KR");
    } catch {
      return "날짜 정보 없음";
    }
  };

  const tags = lp.tags ?? [];
  const likes = lp.likes ?? [];
  const createdAt = formatDate(lp.createdAt);
  const updatedAt = formatDate(lp.updatedAt);
  const comments = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="min-h-screen bg-[#0f1115] flex justify-center items-start py-12 px-4 text-white">
      <div className="w-full max-w-2xl bg-[#111217] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        <div className="p-6 flex flex-col items-center">
          {/* 작성자 영역 */}
          <div className="flex items-center justify-between mb-6 w-full">
            <div className="flex items-center gap-3">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover border border-gray-700"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.dataset.fallback) {
                    target.src = "/fallback-avatar.png";
                    target.dataset.fallback = "true";
                  }
                }}
              />
              <div>
                <div className="text-sm font-semibold">{authorName}</div>
                <div className="text-xs text-gray-400">{createdAt}</div>
              </div>
            </div>

            {/* 수정/삭제 버튼 */}
            {me?.data.id === lp.authorId && (
              <div className="flex gap-2">
                {!isEditMode ? (
                  <>
                    <button
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm transition-colors"
                      onClick={() => setIsEditMode(true)}
                    >
                      수정
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white text-sm transition-colors"
                      onClick={handleDelete}
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-white text-sm transition-colors disabled:bg-gray-600"
                      onClick={handleSaveEdit}
                      disabled={isUpdating}
                    >
                      {isUpdating ? "저장 중..." : "저장"}
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-500 hover:bg-gray-600 rounded text-white text-sm transition-colors"
                      onClick={handleCancelEdit}
                      disabled={isUpdating}
                    >
                      취소
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 제목 (편집 모드에 따라 다른 UI) */}
          {!isEditMode ? (
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
              {lp.title}
            </h1>
          ) : (
            <input
              type="text"
              className="text-2xl md:text-3xl font-bold text-center mb-6 w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          )}

          {/* 이미지 */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-800 to-black shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.dataset.fallback) {
                    target.src = "/fallback-image.png";
                    target.dataset.fallback = "true";
                  }
                }}
              />
            </div>
          </div>

          {/* 본문 (편집 모드에 따라 다른 UI) */}
          {!isEditMode ? (
            <div className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line text-center px-6 mb-6">
              {lp.content}
            </div>
          ) : (
            <textarea
              className="w-full text-gray-300 text-sm md:text-base leading-relaxed px-6 mb-6 bg-gray-800 border border-gray-600 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="내용을 입력하세요"
              rows={8}
            />
          )}

          {/* 태그 (편집 모드에 따라 다른 UI) */}
          {!isEditMode ? (
            tags.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {tags.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => navigate(`/lps?search=${t.name}`)}
                    className="text-xs px-3 py-1 rounded-full bg-gray-800 text-pink-400 hover:bg-gray-700 transition"
                  >
                    #{t.name}
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="w-full mb-6">
              {/* 태그 입력 */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="태그를 입력하고 Enter 또는 추가 버튼을 누르세요"
                />
                <button
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition-colors"
                  onClick={handleAddTag}
                >
                  추가
                </button>
              </div>

              {/* 태그 칩 리스트 */}
              {editTagsList.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {editTagsList.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-pink-500 text-white rounded-full text-xs"
                    >
                      <span>#{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:bg-pink-600 rounded-full p-0.5 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* 태그가 없을 때 안내 */}
              {editTagsList.length === 0 && (
                <p className="text-xs text-gray-500 text-center">
                  태그를 추가해보세요
                </p>
              )}
            </div>
          )}

          {/* 좋아요 */}
          <div className="flex flex-col items-center mb-6">
            <button onClick={isLiked ? handleDislikeLp : handleLikeLp}>
              <Heart
                color={isLiked ? "red" : "gray"}
                fill={isLiked ? "red" : "transparent"}
              />
            </button>
            <div className="text-sm text-gray-400 mt-2">{likes.length}</div>
          </div>

          {/* 작성/수정일 */}
          <div className="text-xs text-gray-500 mb-8">
            작성일: {createdAt} &nbsp;|&nbsp; 수정일: {updatedAt}
          </div>

          {/* 댓글 영역 */}
          <div className="w-full border-t border-gray-700 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">💬 댓글</h2>
              <select
                className="bg-gray-800 text-sm rounded-md px-2 py-1"
                value={order}
                onChange={(e) =>
                  setOrder(e.target.value as PAGINATION_ORDER)
                }
              >
                <option value={PAGINATION_ORDER.DESC}>최신순</option>
                <option value={PAGINATION_ORDER.ASC}>오래된순</option>
              </select>
            </div>

            {/* 댓글 작성란 */}
            <div className="mb-6">
              <textarea
                className="w-full bg-gray-800 text-white rounded-md p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 border border-gray-700"
                placeholder="댓글을 입력하세요..."
                rows={3}
                maxLength={500}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">최대 500자</span>
                <button
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  onClick={handleCreateComment}
                >
                  댓글 작성
                </button>
              </div>
            </div>

            {/* 댓글 로딩 */}
            {isCommentLoading && <LpCommentSkeletonList count={3} />}

            {/* 댓글 리스트 */}
            {comments.map((comment) => (
              <LpComment
                key={comment.id}
                comment={comment}
                lpId={Number(lpId)}
                myId={me?.data.id}
              />
            ))}

            {/* 무한스크롤 감시 영역 */}
            <div ref={ref} className="h-10" />
            {isFetchingNextPage && <LpCommentSkeletonList count={2} />}

            {/* 댓글 없을 때 */}
            {!hasNextPage && !isCommentLoading && comments.length > 0 && (
              <p className="text-center text-gray-500 mt-4">
                모든 댓글을 불러왔습니다.
              </p>
            )}
            {!isCommentLoading && comments.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                아직 댓글이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}