import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../apis/lp";
import type { Lp } from "../types/lp";
import { useState } from "react";
import LoadingFallback from "../components/common/LoadingFallback";
import ErrorFallback from "../components/common/ErrorFallback";

export default function LpDetailPage() {
  const { lpid } = useParams<{ lpid: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const { data: lp, isLoading, isError } = useQuery<Lp>({
    queryKey: ["lp", lpid],
    queryFn: () => getLpDetail(Number(lpid)),
    enabled: !!lpid,
  });

  if (isLoading) return <LoadingFallback />;
  if (isError) return <ErrorFallback message="LP 정보를 불러오는 중 오류가 발생했습니다." />;
  if (!lp)
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        LP 정보를 불러올 수 없습니다.
      </div>
    );

  // 안전한 날짜 파싱
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
  
  // author 정보 안전하게 가져오기
  const authorName = lp.author?.name || "익명";
  const authorAvatar = lp.author?.avatar || "/fallback-avatar.png";

  return (
    <div className="min-h-screen bg-[#0f1115] flex justify-center items-start py-12 px-4 text-white">
      <div className="w-full max-w-2xl bg-[#111217] rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        {/* 본문 컨텐츠 영역 */}
        <div className="p-6 flex flex-col items-center">
          {/* 상단: 작성자 정보 + 수정/삭제 버튼 */}
          <div className="flex items-center justify-between mb-6 w-full">
            {/* 왼쪽: 작성자 정보 */}
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

            {/* 오른쪽: 수정/삭제 아이콘 버튼 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/lp/edit/${lp.id}`)}
                className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                aria-label="수정"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => alert("삭제 기능은 아직 연결되어 있지 않습니다.")}
                className="p-2 rounded-md hover:bg-gray-800 transition-colors"
                aria-label="삭제"
              >
                <svg className="w-5 h-5 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* 제목 */}
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">{lp.title}</h1>

          {/* 원형 CD 이미지 (중앙) */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-6">
            {/* outer circle (disc) */}
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

            {/* center hole */}
            <div className="absolute w-14 h-14 rounded-full bg-[#0f1115] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-gray-700 shadow-inner" />
          </div>

          {/* 본문 텍스트 - 중앙 정렬, 줄바꿈 유지 */}
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

          {/* 좋아요 (중앙) */}
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
            <div className="text-sm text-gray-400 mt-2">{likes.length + (liked ? 1 : 0)} 좋아요</div>
          </div>

          {/* 작성/수정 날짜(작게) */}
          <div className="text-xs text-gray-500 mb-4">
            작성일: {createdAt} &nbsp;|&nbsp; 수정일: {updatedAt}
          </div>
        </div>
      </div>
    </div>
  );
}