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
import { useDeleteLp } from "../hooks/mutations/useDeleteLp";
import { useUpdateLp } from "../hooks/mutations/useUpdateLp";
import { LpHeader } from "../components/LpDetail/LpHeader";
import { LpContent } from "../components/LpDetail/LpContent";
import { LpTags } from "../components/LpDetail/LpTags";
import { LpLikes } from "../components/LpDetail/LpLikes";
import { LpCommentSection } from "../components/LpDetail/LpCommentSection";

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
      setEditTagsList(lp.tags?.map((t) => t.name) || []);
    }
  }, [lp]);

  // 태그 관련 핸들러
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !editTagsList.includes(trimmedTag)) {
      setEditTagsList([...editTagsList, trimmedTag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditTagsList(editTagsList.filter((tag) => tag !== tagToRemove));
  };

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

  // 댓글 작성
  const createCommentMutation = useCreateComment(Number(lpId));
  const handleCreateComment = () => {
    if (!newComment.trim()) return;
    createCommentMutation.mutate(
      { lpId: Number(lpId), content: newComment },
      { onSuccess: () => setNewComment("") }
    );
  };

  // LP 수정
  const { mutate: updateMutate, isPending: isUpdating } = useUpdateLp(
    Number(lpId)
  );
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
    if (lp) {
      setEditTitle(lp.title);
      setEditContent(lp.content);
      setEditTagsList(lp.tags?.map((t) => t.name) || []);
      setTagInput("");
    }
    setIsEditMode(false);
  };

  // LP 삭제
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
    return (
      <ErrorFallback message="LP 정보를 불러오는 중 오류가 발생했습니다." />
    );
  if (!lp)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        LP 정보를 불러올 수 없습니다.
      </div>
    );

  // 데이터 가공
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
          {/* 헤더 (작성자 정보 + 수정/삭제 버튼) */}
          <LpHeader
            authorAvatar={authorAvatar}
            authorName={authorName}
            createdAt={createdAt}
            isAuthor={me?.data.id === lp.authorId}
            isEditMode={isEditMode}
            isUpdating={isUpdating}
            onEdit={() => setIsEditMode(true)}
            onSave={handleSaveEdit}
            onCancel={handleCancelEdit}
            onDelete={handleDelete}
          />

          {/* 제목, 이미지, 본문 */}
          <LpContent
            title={lp.title}
            content={lp.content}
            thumbnail={lp.thumbnail}
            isEditMode={isEditMode}
            editTitle={editTitle}
            editContent={editContent}
            onTitleChange={setEditTitle}
            onContentChange={setEditContent}
          />

          {/* 태그 */}
          <LpTags
            tags={tags}
            isEditMode={isEditMode}
            editTagsList={editTagsList}
            tagInput={tagInput}
            onTagInputChange={setTagInput}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            onTagInputKeyDown={handleTagInputKeyDown}
          />

          {/* 좋아요 */}
          <LpLikes
            likes={likes}
            isLiked={!!isLiked}
            onLike={handleLikeLp}
            onDislike={handleDislikeLp}
          />

          {/* 작성/수정일 */}
          <div className="text-xs text-gray-500 mb-8">
            작성일: {createdAt} &nbsp;|&nbsp; 수정일: {updatedAt}
          </div>

          {/* 댓글 영역 */}
          <LpCommentSection
            order={order}
            newComment={newComment}
            onOrderChange={setOrder}
            onCommentChange={setNewComment}
            onSubmitComment={handleCreateComment}
          >
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
          </LpCommentSection>
        </div>
      </div>
    </div>
  );
}