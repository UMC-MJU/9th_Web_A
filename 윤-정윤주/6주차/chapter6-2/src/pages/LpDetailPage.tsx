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

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  // ✅ 댓글 정렬 상태 (최신순 / 오래된순)
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.DESC);

  // LP 상세 조회
  const { data: lp, isLoading, isError } = useQuery<Lp>({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(Number(lpid)),
    enabled: !!lpid,
  });

  // ✅ 댓글 무한스크롤 훅
  const {
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading: isCommentLoading,
  } = useGetInfiniteCommentList(Number(lpid), 5, order);

  // ✅ 스크롤 트리거
  const { ref, inView } = useInView();

  // ✅ inView가 true일 때 다음 페이지 가져오기
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (inView && hasNextPage) fetchNextPage();
  }, [inView, hasNextPage]);

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
  const authorName = lp.author?.name || "익명";
  const authorAvatar = lp.author?.avatar || "/fallback-avatar.png";

  // ✅ 댓글 목록 데이터 평탄화
  const comments =
    data?.pages.flatMap((page) => page.data) ?? [];

  

  return (
    <div className="min-h-screen bg-[#0f1115] flex justify-center items-start py-12 px-4 text-white">
      <div className="w-full max-w-2xl bg-[#111217] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        {/* LP 본문 */}
        <div className="p-6 flex flex-col items-center">
          {/* 작성자 영역 */}
          <div className="flex items-center justify-between mb-6 w-full">
            <div className="flex items-center gap-3">
              <img
                src={authorAvatar}
                alt={authorName}
                className="w-10 h-10 rounded-full object-cover border border-gray-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-avatar.png";
                }}
              />
              <div>
                <div className="text-sm font-semibold">{authorName}</div>
                <div className="text-xs text-gray-400">{createdAt}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/lp/edit/${lp.id}`)}
                className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                aria-label="수정"
              >
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => alert("삭제 기능은 아직 연결되어 있지 않습니다.")}
                className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                aria-label="삭제"
              >
                <svg
                  className="w-5 h-5 text-gray-400 hover:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
            {lp.title}
          </h1>

          {/* 이미지 */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-gray-800 to-black shadow-2xl flex items-center justify-center overflow-hidden">
              <img
                src={lp.thumbnail}
                alt={lp.title}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-image.png";
                }}
              />
            </div>
            <div className="absolute w-14 h-14 rounded-full bg-[#0f1115] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-700 shadow-inner" />
          </div>

          {/* 본문 */}
          <div className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line text-center px-6 mb-6">
            {lp.content}
          </div>

          {/* 태그 */}
          {tags.length > 0 && (
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
          )}

          {/* 좋아요 */}
          <div className="flex flex-col items-center mb-6">
            <button
              onClick={() => setLiked((s) => !s)}
              className="text-4xl active:scale-95 transform transition-transform hover:scale-110"
              aria-label="좋아요"
            >
              <span className={`${liked ? "text-pink-500" : "text-gray-400"}`}>
                {liked ? "❤️" : "🤍"}
              </span>
            </button>
            <div className="text-sm text-gray-400 mt-2">
              {likes.length + (liked ? 1 : 0)} 좋아요
            </div>
          </div>

          {/* 작성/수정일 */}
          <div className="text-xs text-gray-500 mb-8">
            작성일: {createdAt} &nbsp;|&nbsp; 수정일: {updatedAt}
          </div>

          {/* ✅ 댓글 영역 */}
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
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">최대 500자</span>
                <button
                  className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
                  onClick={() => alert('댓글 작성 API는 아직 연결되지 않았습니다.')}
                >
                  댓글 작성
                </button>
              </div>
            </div>

            {/* 로딩 중 */}
            {isCommentLoading && <LpCommentSkeletonList count={3} />}

            {/* 댓글 리스트 */}
            {comments.map((comment) => (
              <LpComment key={comment.id} comment={comment} />
            ))}

            {/* 무한스크롤 감시 영역 */}
            <div ref={ref} className="h-10"></div>

            {/* 추가 로딩 중 */}
            {isFetchingNextPage && <LpCommentSkeletonList count={2} />}

            {/* 더 이상 댓글이 없을 때 */}
            {!hasNextPage && !isCommentLoading && comments.length > 0 && (
              <p className="text-center text-gray-500 mt-4">
                모든 댓글을 불러왔습니다.
              </p>
            )}

            {/* 댓글이 아예 없을 때 */}
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
